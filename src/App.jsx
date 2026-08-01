import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BookOpen, Check, ChevronRight, CircleAlert, Clock3, Gift, Info, Medal, NotebookPen, Orbit, RefreshCw, Rocket, ShieldCheck, Sparkles, Star, Users, X } from 'lucide-react'
import { booths, teamById, loadStaticConfig } from './data'

const emptyState = { version:1, booths:{} }
const defaultRound = {status:'waiting',scores:{},mvp:'',notes:'',sessions:{}}
const clone = v => JSON.parse(JSON.stringify(v))

function Starfield(){return <div className="starfield" aria-hidden="true"><i/><i/><i/></div>}
function Brand(){return <div className="brand"><span className="brand-mark"><Star size={17} fill="currentColor"/></span><span><b>D:FORCE</b><small>2026 SUMMER CAMP</small></span></div>}

function App(){
  const [route,setRoute]=useState({page:'home'})
  const [live,setLive]=useState(emptyState)
  const [online,setOnline]=useState(true)
  const [toast,setToast]=useState('')
  const [config,setConfig]=useState({ready:false,error:''})

  const load=async()=>{try{const r=await fetch('/.netlify/functions/state',{cache:'no-store'});if(!r.ok)throw Error();setLive(await r.json());setOnline(true)}catch{setOnline(false);const saved=localStorage.getItem('dforce-state');if(saved)setLive(JSON.parse(saved))}}
  useEffect(()=>{loadStaticConfig().then(()=>setConfig({ready:true,error:''})).catch(e=>setConfig({ready:false,error:e.message}));load();const id=setInterval(load,2000);return()=>clearInterval(id)},[])
  const save=async(next)=>{setLive(next);localStorage.setItem('dforce-state',JSON.stringify(next));try{const r=await fetch('/.netlify/functions/state',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(next)});if(r.ok){setLive(await r.json());setOnline(true)}else throw Error()}catch{setOnline(false)}}
  const updateRound=(boothId,roundId,fn)=>{const next=clone(live);next.booths??={};next.booths[boothId]??={};const current={...defaultRound,...next.booths[boothId][roundId]};next.booths[boothId][roundId]=fn(current);save(next)}
  const notify=t=>{setToast(t);setTimeout(()=>setToast(''),2200)}
  const booth=booths.find(b=>b.id===route.booth)
  if(config.error)return <main><Starfield/><div className="config-error"><CircleAlert/><h1>설정 파일을 확인해 주세요</h1><p>{config.error}</p><button onClick={()=>location.reload()}><RefreshCw/> 다시 불러오기</button></div></main>
  if(!config.ready)return <main><Starfield/><div className="loading"><Orbit/><b>우주 탐험대 준비 중…</b></div></main>
  return <main><Starfield/><header><Brand/><span className={`sync ${online?'ok':''}`}><i/>{online?'LIVE':'OFFLINE'}</span></header>
    {route.page==='home'?<Home enter={(b,role)=>setRoute({page:'booth',booth:b.id,role,round:'r1'})}/>:
      <Booth booth={booth} route={route} setRoute={setRoute} live={live} updateRound={updateRound} notify={notify}/>} 
    {toast&&<div className="toast"><Check size={18}/>{toast}</div>}
  </main>
}

function Home({enter}){return <section className="home shell">
  <div className="hero"><div className="orbit-hero"><div className="planet"><Rocket/></div><span/><span/><span/></div><p className="eyebrow">ORBITAL MISSION CONTROL</p><h1>하나님의 꿈을 향한<br/><em>우주 탐험대</em></h1><p>선생님의 땀방울이 아이들의 별빛이 됩니다.<br/>운영할 게임 부스를 선택해 주세요.</p></div>
  <div className="booth-grid">{booths.map((b,i)=><article className="booth-card" key={b.id} style={{'--accent':b.accent,'--delay':`${i*.08}s`}}><div className="card-space"><span className="booth-code">MISSION {b.id}</span><div className="game-orb">{b.icon}</div><h2>{b.title}</h2><p>{b.short}</p><small>{b.verse}</small></div><div className="role-row"><button onClick={()=>enter(b,'teacher')}><ShieldCheck/>교사용</button><button className="ghost" onClick={()=>enter(b,'student')}><Rocket/>학생용</button></div></article>)}</div>
  <footer>동탄동산교회 디포스 초등부 여름캠프 · 나는 하나님의 꿈이야!</footer>
  </section>}

function Booth({booth,route,setRoute,live,updateRound,notify}){
  const [info,setInfo]=useState(false); const [roundId,setRoundId]=useState(route.round||'r1')
  const round=booth.rounds.find(r=>r.id===roundId); const data={...defaultRound,...live.booths?.[booth.id]?.[roundId]}
  return <section className="booth-page shell" style={{'--accent':booth.accent}}>
    <nav className="topnav"><button className="icon-btn" onClick={()=>setRoute({page:'home'})}><ArrowLeft/></button><div><span>MISSION {booth.id}</span><b>{booth.title}</b></div><button className="icon-btn" onClick={()=>setInfo(true)}><Info/></button></nav>
    <div className="mission-head"><div className="mission-orb">{booth.icon}</div><div><p>{booth.short}</p><h1>{booth.title}</h1><span><BookOpen/> {booth.verse}</span></div></div>
    <div className="round-tabs">{booth.rounds.map(r=><button key={r.id} className={roundId===r.id?'active':''} onClick={()=>setRoundId(r.id)}><small>{r.time}</small><b>{r.label}</b><i className={live.booths?.[booth.id]?.[r.id]?.status||'waiting'}/></button>)}</div>
    <Matchup round={round} status={data.status}/>
    {route.role==='teacher'?<Teacher booth={booth} round={round} data={data} update={fn=>updateRound(booth.id,roundId,fn)} notify={notify}/>:<Student booth={booth} round={round} data={data} update={fn=>updateRound(booth.id,roundId,fn)} notify={notify}/>} 
    <button className="mode-switch" onClick={()=>setRoute({...route,role:route.role==='teacher'?'student':'teacher'})}>{route.role==='teacher'?<Rocket/>:<ShieldCheck/>}{route.role==='teacher'?'학생용 화면 보기':'교사용 화면 보기'}</button>
    {info&&<Modal close={()=>setInfo(false)}><div className="info-modal"><span className="modal-icon"><BookOpen/></span><p className="eyebrow">GAME BRIEFING</p><h2>{booth.title}</h2><blockquote>{booth.theme}</blockquote><h3>게임 진행</h3><p>{booth.guide}</p><h3><CircleAlert/> 안전 주의사항</h3><p>{booth.caution}</p></div></Modal>}
  </section>
}

function Matchup({round,status}){const a=teamById[round.teams[0]],b=teamById[round.teams[1]];return <div className="matchup"><div className="team-badge" style={{'--team':a.color}}><i/><b>{a.name}</b></div><div className="versus"><span className={`status-dot ${status}`}>{status==='active'?'진행 중':status==='done'?'완료':'대기'}</span><strong>VS</strong><small>{round.time}</small></div><div className="team-badge right" style={{'--team':b.color}}><i/><b>{b.name}</b></div></div>}

function Teacher({booth,round,data,update,notify}){
  const teamA=teamById[round.teams[0]],teamB=teamById[round.teams[1]]
  const [local,setLocal]=useState({scores:data.scores||{},mvp:data.mvp||'',notes:data.notes||''})
  useEffect(()=>setLocal({scores:data.scores||{},mvp:data.mvp||'',notes:data.notes||''}),[round.id,data.mvp,data.notes,JSON.stringify(data.scores)])
  const persist=()=>{update(d=>({...d,...local}));notify('기록을 저장했어요')}
  const sessions=Object.entries(data.sessions||{}).filter(([,s])=>s.missionId)
  return <div className="control-panel"><div className="panel-title"><span><ShieldCheck/> TEACHER CONTROL</span><b>라운드 컨트롤</b></div>
    <div className="status-controls">{[['waiting','대기'],['active','진행'],['done','완료']].map(([id,label])=><button key={id} className={data.status===id?'active':''} onClick={()=>update(d=>({...d,status:id}))}>{label}</button>)}</div>
    <div className="score-grid">{[teamA,teamB].map(t=><label className="score-box" key={t.id} style={{'--team':t.color}}><span>{t.name} SCORE</span><input type="number" inputMode="numeric" value={local.scores[t.id]??''} placeholder="0" onChange={e=>setLocal({...local,scores:{...local.scores,[t.id]:e.target.value}})}/><div><button onClick={()=>setLocal({...local,scores:{...local.scores,[t.id]:Number(local.scores[t.id]||0)-10}})}>-10</button><button onClick={()=>setLocal({...local,scores:{...local.scores,[t.id]:Number(local.scores[t.id]||0)+10}})}>+10</button></div></label>)}</div>
    <div className="field"><label><Medal/> MVP 학생</label><input value={local.mvp} onChange={e=>setLocal({...local,mvp:e.target.value})} placeholder="이름을 입력하세요"/></div>
    <div className="field"><label><NotebookPen/> 기타 기록</label><textarea value={local.notes} onChange={e=>setLocal({...local,notes:e.target.value})} placeholder="특이사항, 점수 근거 등을 기록하세요"/></div>
    <button className="primary wide" onClick={persist}><Check/> 기록 저장</button>
    <div className="approval"><div className="panel-title"><span><Sparkles/> MISSION REQUEST</span><b>미션 승인</b></div>{sessions.length===0?<div className="empty"><Orbit/><p>학생용 화면에서 미션을 뽑으면<br/>여기에 승인 요청이 나타납니다.</p></div>:sessions.map(([teamId,s])=><Request key={teamId} team={teamById[teamId]} session={s} booth={booth} update={update}/>)}</div>
  </div>
}

function Request({team,session,booth,update}){const mission=booth.missions.find(m=>m.id===session.missionId);const item=booth.items.find(i=>i.id===session.itemId);return <div className="request" style={{'--team':team.color}}><div><span>{team.name}</span><b>{mission?.title}</b><p>{mission?.description}</p></div>{session.itemId?<div className="awarded"><Gift/><span><small>획득 아이템</small><b>{item?.title}</b></span>{session.used?<em>사용 완료</em>:<button onClick={()=>update(d=>({...d,sessions:{...d.sessions,[team.id]:{...session,used:true,usedAt:Date.now()}}}))}>사용 완료</button>}</div>:session.approved?<span className="waiting-box">학생이 상자를 여는 중…</span>:<div className="request-actions"><button className="reject" onClick={()=>update(d=>({...d,sessions:{...d.sessions,[team.id]:{}}}))}><RefreshCw/> 다시</button><button className="approve" onClick={()=>update(d=>({...d,sessions:{...d.sessions,[team.id]:{...session,approved:true}}}))}><Check/> 승인</button></div>}</div>}

function Student({booth,round,data,update,notify}){
  const [teamId,setTeamId]=useState(round.teams[0]); const [rolling,setRolling]=useState(false); const [opening,setOpening]=useState(false)
  useEffect(()=>setTeamId(round.teams[0]),[round.id]); const team=teamById[teamId]; const session=data.sessions?.[teamId]||{}; const mission=booth.missions.find(m=>m.id===session.missionId); const item=booth.items.find(i=>i.id===session.itemId)
  const drawMission=()=>{setRolling(true);setTimeout(()=>{const m=booth.missions[Math.floor(Math.random()*booth.missions.length)];update(d=>({...d,sessions:{...d.sessions,[teamId]:{missionId:m.id,approved:false}}}));setRolling(false)},1400)}
  const openBox=()=>{setOpening(true);setTimeout(()=>{const item=weighted(booth.items);update(d=>({...d,sessions:{...d.sessions,[teamId]:{...session,itemId:item.id,awardedAt:Date.now()}}}));setOpening(false);notify('새 아이템을 획득했어요!')},1700)}
  return <div className="student-panel" style={{'--team':team.color}}><div className="team-switch">{round.teams.map(id=><button className={teamId===id?'active':''} key={id} style={{'--team':teamById[id].color}} onClick={()=>setTeamId(id)}><i/>{teamById[id].name}</button>)}</div>
    <div className="student-stage"><p className="eyebrow">PLAYER MISSION BOARD</p><h2>{team.name} 탐험대</h2>{!session.missionId?<div className={`holo-card ${rolling?'rolling':''}`}><div><Sparkles/><b>{rolling?'미션 탐색 중…':'랜덤 미션 카드'}</b><small>우주의 카드를 터치해 보세요</small></div></div>:<MissionCard mission={mission} approved={session.approved}/>} 
      {!session.missionId&&<button className="primary launch" disabled={rolling||data.status!=='active'} onClick={drawMission}><Orbit/>{data.status==='active'?'랜덤 보드 돌리기':'교사가 라운드를 시작하면 열려요'}</button>}
      {session.missionId&&!session.approved&&!session.itemId&&<div className="approval-wait"><Clock3/><b>선생님 승인을 기다리고 있어요</b><span>미션을 멋지게 수행해 주세요!</span></div>}
      {session.approved&&!session.itemId&&<button className={`loot-box ${opening?'opening':''}`} onClick={openBox} disabled={opening}><span className="box-lid"/><Gift/><b>{opening?'별빛 에너지 충전 중…':'아이템 상자 열기'}</b><small>터치해서 보상을 확인하세요</small></button>}
      {item&&<ItemReveal item={item} used={session.used}/>} 
      {session.itemId&&<button className="secondary" onClick={()=>update(d=>({...d,sessions:{...d.sessions,[teamId]:{}}}))}><RefreshCw/> 다음 미션 준비</button>}
    </div></div>
}

function MissionCard({mission,approved}){return <div className={`mission-card ${approved?'approved':''}`}><div className="card-top"><span>MISSION {mission.id.padStart(2,'0')}</span>{approved&&<em><Check/> 승인 완료</em>}</div><div className="mission-symbol"><Star/></div><h3>{mission.title}</h3><p>{mission.description}</p></div>}
function ItemReveal({item,used}){return <div className={`item-reveal ${used?'used':''}`}><div className="rays"/><span className="rarity">STAR ITEM</span><div className="item-gem"><Gift/></div><p>ITEM {item.id.padStart(2,'0')}</p><h3>{item.title}</h3><div>{item.description}</div>{used&&<em><Check/> 사용 완료</em>}</div>}
function Modal({children,close}){return <div className="modal" onClick={close}><div className="modal-body" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={close}><X/></button>{children}</div></div>}
function weighted(items){const total=items.reduce((n,i)=>n+i.weight,0);let r=Math.random()*total;return items.find(i=>(r-=i.weight)<=0)||items[0]}

export default App
