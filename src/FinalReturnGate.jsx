import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Rocket } from 'lucide-react'
import './final-return.css'
import './cinematic-skip.css'

export default function FinalReturnGate({ children, setRoute }) {
  const [phase, setPhase] = useState('ready')
  const [fading, setFading] = useState(false)
  const videoRef = useRef(null)
  const musicRef = useRef(null)
  const musicStarted = useRef(false)

  const stop = () => {
    for (const media of [videoRef.current, musicRef.current]) {
      if (!media) continue
      media.pause()
      media.currentTime = 0
    }
  }

  useEffect(() => () => stop(), [])

  const startMusic = () => {
    if (musicStarted.current) return
    musicStarted.current = true
    const music = musicRef.current
    if (!music) return
    music.currentTime = 0
    music.volume = 1
    music.play().catch(() => {})
  }

  const finish = () => {
    startMusic()
    setFading(false)
    setPhase('results')
  }

  const start = () => {
    const video = videoRef.current
    const music = musicRef.current
    musicStarted.current = false
    setFading(false)
    setPhase('video')

    // 클릭 순간 음악 재생 권한을 확보한 뒤 영상 종료 2초 전까지 대기한다.
    if (music) {
      music.currentTime = 0
      music.volume = 0
      music.play().then(() => {
        if (!musicStarted.current) {
          music.pause()
          music.currentTime = 0
          music.volume = 1
        }
      }).catch(() => {})
    }

    if (!video) return finish()
    video.currentTime = 0
    video.playbackRate = 0.8
    video.volume = 1
    video.muted = false
    video.play().catch(finish)
  }

  const track = () => {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration)) return
    const remaining = video.duration - video.currentTime
    if (remaining <= 2) startMusic()
    if (remaining <= 1.1) setFading(true)
  }

  const home = () => {
    stop()
    setRoute({ page: 'home' })
  }

  return <>
    <audio ref={musicRef} src="/audio/return-bgm.m4a" preload="auto" />
    <div className={`final-return-video ${phase === 'video' ? 'active' : ''} ${fading ? 'fading' : ''}`}>
      <video ref={videoRef} src="/finale/return-cinematic.mp4" preload="auto" playsInline onTimeUpdate={track} onEnded={finish} onError={finish} />
      {phase === 'video' && <button className="cinematic-skip" onClick={finish}>SKIP</button>}
    </div>
    {phase === 'ready' && <section className="final-return-ready shell">
      <button className="final-return-home" onClick={home} aria-label="홈으로"><ArrowLeft /></button>
      <div className="final-return-star"><Rocket /><span /><span /></div>
      <p className="eyebrow">D:FORCE RETURN CEREMONY</p>
      <h1>비전 탐험대<br />귀환 준비 완료</h1>
      <button className="final-return-start" onClick={start}><Rocket /> 귀환 시작</button>
    </section>}
    {phase === 'results' && children}
  </>
}
