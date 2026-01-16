import React, { useEffect, useRef, useState } from 'react'
import './testimonials.css'

const TESTIMONIALS = [
  {
    id: 0,
    quote: "LockedIn helped me find weekly events that boosted my career — I landed a role in 2 months.",
    name: 'Amina Yusuf',
    role: 'Frontend Engineer',
  },
  {
    id: 1,
    quote: "The community and mentors made learning enjoyable and fast. Highly recommend!",
    name: 'Carlos Mendez',
    role: 'Product Designer',
  },
  {
    id: 2,
    quote: "I met my co-founder at a LockedIn event — we launched our startup together.",
    name: 'Priya Singh',
    role: 'Co-founder',
  },
  {
    id: 3,
    quote: "Practical workshops and friendly people — LockedIn accelerated my skills.",
    name: 'James O.',
    role: 'Data Analyst',
  },
]

const Testimonials = ({ autoplay = true, interval = 3000 }) => {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)
  const pausedRef = useRef(false)
  const touchStartX = useRef(0)

  const changeIndex = (next) => {
    const clamped = (next + TESTIMONIALS.length) % TESTIMONIALS.length
    setIndex(clamped)
  }

  useEffect(() => {
    if (!autoplay) return
    clearTimeout(timerRef.current)
    if (!pausedRef.current) timerRef.current = setTimeout(() => changeIndex(index + 1), interval)
    return () => clearTimeout(timerRef.current)
  }, [index, autoplay, interval])

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
    const dx = e.changedTouches[0].clientX - touchStartX.current// Calculate horizontal swipe distance
    if (Math.abs(dx) > 40) changeIndex(index + (dx > 0 ? -1 : 1))
  }

  return (
    <section className="testimonials" aria-label="Testimonials">
      <div
        className="testimonials-inner"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <h2 className="testi-title">What People Say</h2>

        <div className="testi-viewport">
          <div className="testi-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {TESTIMONIALS.map((t) => (
              <blockquote className="testi-card" key={t.id}>
                <p className="testi-quote">“{t.quote}”</p>
                <footer className="testi-meta">
                  <div className="testi-avatar" aria-hidden>
                    {t.name.split(' ').map((n) => n[0]).slice(0,2).join('')}
                  </div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>

        <button className="testi-btn prev" onClick={() => changeIndex(index - 1)} aria-label="Previous">‹</button>
        <button className="testi-btn next" onClick={() => changeIndex(index + 1)} aria-label="Next">›</button>

        <div className="testi-indicators">
          {TESTIMONIALS.map((t) => (
            <button
              key={t.id}
              className={`dot ${t.id === index ? 'active' : ''}`}
              onClick={() => changeIndex(t.id)}
              aria-label={`Go to testimonial ${t.id + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
