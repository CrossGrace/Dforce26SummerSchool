import { ArrowLeft, Crown, RefreshCw, Sparkles, Star, Trophy } from 'lucide-react'
import { useState } from 'react'
import './final-awards.css'

const order = [3, 2, 1, 'mvp']

function Effects({ count, rings }) {
  return <div className="award-effects" aria-hidden="true">
    {Array.from({ length: rings }, (_, i) => <span key={i} style={{ '--ring': i }} />)}
    {Array.from({ length: count }, (_, i) => <i key={i} style={{ '--i': i, '--count': count }} />)}
  </div>
}

function TeamRocket() {
  return <div className="award-rocket" aria-hidden="true"><i className="rocket-body"/><i className="rocket-window"/><i className="rocket-fin left"/><i className="rocket-fin right"/><i className="rocket-flame"/></div>
}

function MvpPerson({ entry, team, index }) {
  return <div className="award-person" style={{ '--person': team.color, '--person-index': index }}>
    <i className="person-head"/><i className="person-body"/><i className="person-leg left"/><i className="person-leg right"/>
    <span><b>{team.name}</b><strong>{entry.name}</strong></span>
  </div>
}

export default function FinalAwards({ live, setRoute, booths, teams, overall, rankForGame }) {
  const [revealed, setRevealed] = useState([])
  const [game, setGame] = useState(null)
  const finalMvps = (live.finalMvps || []).filter(entry => entry.name && teams[entry.teamId]).slice(0, 4)
  const isOpen = id => revealed.includes(id)
  const enabled = id => {
    const index = order.indexOf(id)
    return index === 0 || isOpen(order[index - 1])
  }
  const reveal = id => {
    if (!enabled(id) || isOpen(id) || (id === 'mvp' && !finalMvps.length)) return
    setRevealed(value => [...value, id])
  }
  const reset = () => setRevealed([])

  return <section className="final-page final-awards-page shell">
    <nav className="topnav"><button className="icon-btn" onClick={() => setRoute({ page: 'home' })}><ArrowLeft/></button><div><span>FINAL RANKING</span><b>최종 점수</b></div><span className="admin-crown"><Trophy/></span></nav>
    <div className="final-hero"><Crown/><p className="eyebrow">D:FORCE HONOR CEREMONY</p><h1>비전 탐험대 최종 시상식</h1><span>시상대를 3등부터 차례로 눌러 주세요.</span></div>
    <div className="award-stage-scroll"><div className="award-stage">
      {[3, 2, 1].map(place => {
        const team = overall[place - 1]
        const open = isOpen(place)
        const particles = place === 1 ? 48 : place === 2 ? 32 : 20
        const rings = place === 1 ? 4 : place === 2 ? 3 : 2
        return <button key={place} className={`award-slot place-${place} ${open ? 'revealed' : ''}`} disabled={!enabled(place)} onClick={() => reveal(place)} style={{ '--team': team?.color || '#72809a' }}>
          <span className="award-slot-label">{place}{place === 1 ? 'ST' : place === 2 ? 'ND' : 'RD'} PLACE</span><strong className="award-rank">{place}</strong>
          {open && <><Effects count={particles} rings={rings}/><TeamRocket/></>}
          <div className="award-podium"><span className="award-wait">{enabled(place) ? '눌러서 공개' : '공개 대기'}</span>{open && <div className="award-result"><small>{place}등</small><b>{team?.name}</b><strong>{team?.score}점</strong></div>}</div>
        </button>
      })}
      <button className={`award-slot mvp-slot ${isOpen('mvp') ? 'revealed' : ''}`} disabled={!enabled('mvp') || !finalMvps.length} onClick={() => reveal('mvp')} style={{ '--team': '#f8c85c' }}>
        <span className="award-slot-label">FINAL MVP</span><strong className="award-rank"><Star/></strong>
        {isOpen('mvp') && <><Effects count={54} rings={4}/><div className="award-people">{finalMvps.map((entry, index) => <MvpPerson key={`${entry.teamId}-${entry.name}-${index}`} entry={entry} team={teams[entry.teamId]} index={index}/>)}</div></>}
        <div className="award-podium"><span className="award-wait">{!finalMvps.length ? 'MVP 미설정' : enabled('mvp') ? '눌러서 공개' : '공개 대기'}</span>{isOpen('mvp') && <div className="award-result"><small>FINAL MVP</small><b>MVP 학생</b><strong>{finalMvps.length}명</strong></div>}</div>
      </button>
    </div></div>
    {revealed.length > 0 && <button className="reveal-reset" onClick={reset}><RefreshCw/> 결과 공개 이펙트 리셋</button>}
    <section className="game-rankings"><h2>게임별 점수 확인</h2><div className="game-ranking-buttons">{booths.map(booth => <button key={booth.id} className={game === booth.id ? 'active' : ''} style={{ '--accent': booth.accent }} onClick={() => setGame(booth.id)}>{booth.title}</button>)}</div>{game && <div className="game-top-three"><h3>{booths.find(booth => booth.id === game).title}</h3>{rankForGame(game).slice(0, 3).map((team, index) => <div key={team.id} style={{ '--team': team.color }}><strong>{index + 1}</strong><i/><b>{team.name}</b><span>{team.score}점</span></div>)}</div>}</section>
  </section>
}
