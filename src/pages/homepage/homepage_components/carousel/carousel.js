import  { useCallback, useEffect, useRef, useState } from 'react'
import './carousel.css'

const Carousel = ({ autoplay = false, interval = 3500 }) => {
  const SLIDES = [
    { id: 0, title: 'Step 1', body: 'Create a focused goal and commit to it.' },
    { id: 1, title: 'Step 2', body: 'Join or create an accountability group.' },
    { id: 2, title: 'Step 3', body: 'Track daily progress and iterate.' },
  ]

  const [index, setIndex] = useState(0)

  const timerRef = useRef(null)
  const pausedRef = useRef(false)
  const touchStartX = useRef(0)

  const changeIndex = useCallback((next) => {
    const clamped = (next + SLIDES.length) % SLIDES.length
    setIndex(clamped)
  }, [SLIDES.length])

  useEffect(() => {
    if (!autoplay) return
    clearTimeout(timerRef.current)
    if (!pausedRef.current) timerRef.current = setTimeout(() => changeIndex(index + 1), interval)
    return () => clearTimeout(timerRef.current)
  }, [index, autoplay, interval, changeIndex])

  const handleMouseEnter = () => {
    pausedRef.current = true
    clearTimeout(timerRef.current)
  }
  const handleMouseLeave = () => {
    pausedRef.current = false
    if (autoplay) timerRef.current = setTimeout(() => changeIndex(index + 1), interval)
  }

  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX)
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) changeIndex(index + (dx > 0 ? -1 : 1))
  }

  return (
    <section className="team how-it-works" aria-label="How it works">
      <div className="team-inner">
        {/* <h2 className="team-title">how to works</h2> */}

        <div className="team-viewport" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="team-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {SLIDES.map(s => (
              <article key={s.id} className="team-card" aria-hidden={s.id !== index}>
                <div className="slide-inner">
                  <h3 className="slide-title">{s.title}</h3>
                  <p className="slide-body">{s.body}</p>
                </div>
              </article>
            ))}
          </div>

          <button className="team-btn prev" onClick={() => changeIndex(index - 1)} aria-label="Previous">‹</button>
          <button className="team-btn next" onClick={() => changeIndex(index + 1)} aria-label="Next">›</button>
        </div>

        <div className="team-indicators">
          {SLIDES.map((s, i) => (
            <button key={s.id} className={`dot ${i === index ? 'active' : ''}`} onClick={() => changeIndex(i)} aria-label={`Go to ${s.title}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Carousel
