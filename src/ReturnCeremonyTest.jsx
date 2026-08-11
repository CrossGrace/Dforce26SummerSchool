import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, Crown, Film, Medal, RefreshCw, Rocket, Sparkles, Star, Trophy } from 'lucide-react'
import { teamById } from './data'
import './return-ceremony.css'
import './return-ceremony-fixes.css'

const places = [3, 2, 1]

export default function ReturnCeremonyTest({ rankings, live, setRoute }) {
  const [revealed, setRevealed] = useState([])
  const [mvpRevealed, setMvpRevealed] = useState(false)
  const [stage, setStage] = useState('awards')
  const [videoReady, setVideoReady] = useState(false)
  const [videoFading, setVideoFading] = useState(false)
  const videoRef = useRef(null)
  const winners = useMemo(() => rankings.slice(0, 3), [rankings])
  const mvps = useMemo(() => (live.finalMvps || []).filter(entry => entry.name && teamById[entry.teamId]), [live.finalMvps])

  useEffect(() => () => {
    if (videoRef.current) videoRef.current.pause()
  }, [])

  const reveal = place => {
    const index = places.indexOf(place)
    if (index > 0 && !revealed.includes(places[index - 1])) return
    setRevealed(value => value.includes(place) ? value : [...value, place])
  }

  const reset = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setRevealed([])
    setMvpRevealed(false)
    setVideoFading(false)
    setStage('awards')
  }

  const startReturn = () => {
    const video = videoRef.current
    if (!videoReady || !video) return
    video.currentTime = 0
    video.volume = 1
    video.muted = false
    video.playbackRate = 1
    setVideoFading(false)
    setStage('video')
    video.play().catch(() => setStage('awards'))
  }

  const trackVideo = () => {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration)) return
    if (video.duration - video.currentTime <= 1.2) setVideoFading(true)
  }

  const finishReturn = () => {
    setVideoFading(false)
    setStage('finale')
  }

  const readyForReturn = revealed.includes(1) && (mvps.length === 0 || mvpRevealed)

  return <section className={`return-test-page ${stage}`}>
    <button className="return-home" onClick={() => setRoute({ page: 'home' })}><ArrowLeft /> HOME</button>

    <header className="return-test-head">
      <span><Film /> PRODUCTION CEREMONY TEST</span>
      <h1>비전 탐험대 귀환식</h1>
      <p>실제 점수와 최종 MVP 데이터를 사용하는 읽기 전용 프로덕션 테스트입니다.</p>
    </header>

    <div className="return-test-stage">
      <div className="return-orbit" aria-hidden="true">{[0, 1, 2, 3].map(i => <i key={i} style={{ '--tilt': `${i * 38}deg` }} />)}<Star fill="currentColor" /></div>
      <section className="return-controls">
        {places.map((place, index) => {
          const enabled = index === 0 || revealed.includes(places[index - 1])
          return <button key={place} disabled={!enabled} className={revealed.includes(place) ? 'done' : ''} onClick={() => reveal(place)}><Medal />{place}등 {revealed.includes(place) ? '공개 완료' : '공개'}</button>
        })}
        <button disabled={!revealed.includes(1) || !mvps.length} className={mvpRevealed ? 'done' : ''} onClick={() => setMvpRevealed(true)}><Star />MVP {mvpRevealed ? '공개 완료' : mvps.length ? '공개' : '미설정'}</button>
      </section>

      <section className="return-podium">
        {places.map(place => {
          const team = winners[place - 1]
          if (!team || !revealed.includes(place)) return null
          return <article key={place} className={`return-place place-${place}`} style={{ '--team': team.color }}><div className="return-burst">{Array.from({ length: place === 1 ? 30 : place === 2 ? 20 : 14 }, (_, i) => <i key={i} style={{ '--x': `${(i * 37) % 100}%`, '--y': `${(i * 53) % 100}%` }} />)}</div><strong>{place}</strong><div><small>{place}등</small><h2>{team.name}</h2><b>{team.score}점</b></div>{place === 1 ? <Crown /> : <Sparkles />}</article>
        })}
        {mvpRevealed && <article className="return-mvp"><Trophy /><small>FINAL MVP</small><h2>최종 MVP</h2><div>{mvps.map((entry, index) => { const team = teamById[entry.teamId]; return <span key={`${entry.teamId}-${entry.name}-${index}`} style={{ '--team': team.color }}><i /><b>{team.name}</b><strong>{entry.name}</strong></span> })}</div></article>}
      </section>

      <section className="return-launch-panel">
        <div className={`return-video-state ${videoReady ? 'ready' : 'waiting'}`}><i /> <span><b>{videoReady ? '귀환 영상 준비 완료' : '귀환 영상 대기 중'}</b><small>{videoReady ? 'public/finale/return-cinematic.mp4' : '영상 파일을 지정 경로에 추가하면 자동 활성화됩니다.'}</small></span></div>
        <button className="return-launch" disabled={!readyForReturn || !videoReady} onClick={startReturn}><Rocket /> 비전 탐험 귀환 시작</button>
        {!videoReady && readyForReturn && <button className="return-skip" onClick={finishReturn}>영상 없이 최종 엔딩 확인</button>}
        <button className="return-reset" onClick={reset}><RefreshCw /> 전체 연출 다시 테스트</button>
      </section>
    </div>

    <div className={`return-video ${stage === 'video' ? 'active' : ''} ${videoFading ? 'fading' : ''}`}>
      <video ref={videoRef} src="/finale/return-cinematic.mp4" playsInline preload="metadata" onLoadedMetadata={() => setVideoReady(true)} onError={() => setVideoReady(false)} onTimeUpdate={trackVideo} onEnded={finishReturn} />
    </div>

    {stage === 'finale' && <div className="return-finale">
      <div className="return-final-stars">{Array.from({ length: 48 }, (_, i) => <i key={i} style={{ '--x': `${(i * 47) % 100}%`, '--y': `${(i * 71) % 100}%`, '--twinkle': `${1.2 + i * .03}s` }} />)}</div>
      <div className="return-ships" aria-hidden="true">{['#ff526b', '#ffd95a', '#56e39f', '#5bbcff'].map((color, index) => <span key={color} style={{ '--ship': color, '--duration': `${11 + index * 2}s`, '--delay': `${index * -2.4}s` }}><Rocket /></span>)}</div>
      <Star className="return-cross-star" fill="currentColor" />
      <small>VISION EXPLORATION COMPLETE</small>
      <h1>비전 탐험 임무 완료</h1>
      <p>우리는 하나님의 꿈입니다</p>
      <b>D:FORCE 2026 SUMMER CAMP</b>
      <div><button onClick={reset}><RefreshCw /> 처음부터 다시 보기</button><button onClick={() => setRoute({ page: 'home' })}><Check /> 메인화면으로</button></div>
    </div>}
  </section>
}
