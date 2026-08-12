import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, RefreshCw, Rocket, Sparkles, Star } from 'lucide-react'
import { booths } from './data'
import './opening-cinematic.css'
import './cinematic-skip.css'
import './opening-game-visibility.css'

const rocketTeams = [
  ['red', '#ff526b', '#8e1738', '-22vw'],
  ['yellow', '#ffd95a', '#b77908', '-7vw'],
  ['green', '#56e39f', '#087852', '8vw'],
  ['blue', '#5bbcff', '#174fb0', '23vw'],
]

export default function OpeningCinematic({ setRoute, live }) {
  const [phase, setPhase] = useState('idle')
  const [run, setRun] = useState(0)
  const [videoFading, setVideoFading] = useState(false)
  const videoRef = useRef(null)
  const musicRef = useRef(null)
  const musicStartedRef = useRef(false)

  useEffect(() => {
    if (phase !== 'cinematic') return
    const timer = setTimeout(() => setPhase('ambient'), 14000)
    return () => clearTimeout(timer)
  }, [phase, run])

  useEffect(() => () => stopMedia(), [])

  const stopMedia = () => {
    for (const media of [videoRef.current, musicRef.current]) {
      if (!media) continue
      media.pause()
      media.currentTime = 0
    }
  }

  const startMusic = () => {
    if (musicStartedRef.current) return
    musicStartedRef.current = true
    const music = musicRef.current
    if (!music) return
    music.currentTime = 0
    music.volume = 1
    music.play().catch(() => {})
  }

  const startAnimation = () => {
    if (!musicStartedRef.current) startMusic()
    const video = videoRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
    }
    setVideoFading(false)
    setRun(value => value + 1)
    setPhase('cinematic')
  }

  const play = () => {
    stopMedia()
    musicStartedRef.current = false
    setVideoFading(false)
    setPhase('video')
    const video = videoRef.current
    const music = musicRef.current
    if (!video) return startAnimation()

    video.currentTime = 0
    video.volume = 1
    video.muted = false
    video.playbackRate = 0.8

    // 사용자 클릭 순간에 찬양 요소도 재생 권한을 확보한 뒤 9초까지 대기한다.
    if (music) {
      music.currentTime = 0
      music.volume = 0
      music.play().then(() => {
        if (!musicStartedRef.current) {
          music.pause()
          music.currentTime = 0
          music.volume = 1
        }
      }).catch(() => {})
    }

    video.play().catch(startAnimation)
  }

  const trackVideo = () => {
    const video = videoRef.current
    if (!video) return
    if (video.currentTime >= 9) startMusic()
    if (Number.isFinite(video.duration) && video.duration - video.currentTime <= 1.2) {
      setVideoFading(true)
    }
  }

  const goHome = () => {
    stopMedia()
    setRoute({ page: 'home' })
  }

  return <section className={`opening-page ${phase}`}>
    <div className="opening-backdrop" />
    <img className="opening-stage" src="/opening/space-stage.webp" alt="별빛 우주 발사대" />
    <div className="opening-shade" />
    <button className="opening-home" onClick={goHome} aria-label="메인화면으로 돌아가기"><ArrowLeft /><span>HOME</span></button>
    <div className="opening-stars" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>

    <div className={`opening-video-layer ${phase === 'video' ? 'active' : ''} ${videoFading ? 'fading' : ''}`}>
      <video
        ref={videoRef}
        src="/opening/intro-cinematic.mp4"
        preload="auto"
        playsInline
        onTimeUpdate={trackVideo}
        onEnded={startAnimation}
        onError={phase === 'video' ? startAnimation : undefined}
      />
      {phase === 'video' && <button className="cinematic-skip" onClick={startAnimation}>SKIP</button>}
    </div>
    <audio ref={musicRef} src="/audio/opening-worship.mp4" preload="auto" />

    <div className="opening-animation" key={run}>
      <div className="opening-trails" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="rocket-fleet" aria-label="레드, 옐로, 그린, 블루 팀 우주선">
        {rocketTeams.map(([name, color, dark, launchX], index) => <div className={`css-rocket team-rocket rocket-${name}`} key={name} style={{ '--team-order': index, '--rocket-color': color, '--rocket-dark': dark, '--launch-x': launchX }}><i className="rocket-window" /><i className="rocket-wing left" /><i className="rocket-wing right" /><i className="rocket-flame" /><Rocket /></div>)}
      </div>
      <div className="opening-games">
        {booths.map((booth, index) => <figure className={`opening-game game-${booth.id.toLowerCase()}`} key={booth.id} style={{ '--order': index }}><span /><img src={`/opening/game-${booth.id.toLowerCase()}.webp`} alt={`GAME ${booth.id} ${booth.title}`} /><figcaption><b>GAME {booth.id}</b><em>{booth.title}</em><small>{live.gameLocations?.[booth.id] || '장소 미정'}</small></figcaption></figure>)}
      </div>
      <div className="opening-finale"><div className="final-halo" /><img src="/opening/final-star.webp" alt="십자가가 빛나는 황금 별" /><div className="opening-title"><small>D:FORCE 2026 SUMMER CAMP</small><h1>나는 하나님의 꿈이야!</h1><p>하나님의 꿈을 향한 비전 탐험대</p></div></div>
    </div>

    {phase === 'idle' && <div className="opening-start"><span><Star fill="currentColor" /></span><small>D:FORCE OPENING CEREMONY</small><h1>비전 탐험대<br />출발 준비 완료!</h1><button onClick={play}><Rocket /> 탐험 시작</button></div>}
    {phase === 'ambient' && <button className="opening-replay" onClick={play}><RefreshCw /> 다시 재생</button>}
    <div className="opening-status" aria-live="polite">{phase === 'video' ? 'VISION CINEMATIC IN PROGRESS' : phase === 'cinematic' ? 'OPENING MISSION IN PROGRESS' : phase === 'ambient' ? 'MISSION UNIVERSE ONLINE' : 'READY FOR LAUNCH'}</div>
  </section>
}
