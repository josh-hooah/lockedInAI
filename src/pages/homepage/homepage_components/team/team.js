import React, { useEffect, useRef, useState } from 'react'
import './team.css'
import atovs from '../../../../general_component/images/atovs.jpg'
import eug from '../../../../general_component/images/eug.jpg'
import nosa from '../../../../general_component/images/nosa.jpg'
import josh from '../../../../general_component/images/josh.JPG'

const TEAM = [
  { id: 't1', name: 'Atova Ogaga', role: 'Founder & CEO',pics: atovs },
  { id: 't2', name: 'Eugene Johnson', role: 'Chief Media Officer', pics: eug },
  { id: 't3', name: 'Nosakhare Jesuorobo', role: 'Backend Dev', pics: nosa },
  { id: 't4', name: 'Emakpor Joshua', role: 'Tech Lead', pics: josh },
]

const Team = ({ autoplay = false, interval = 3500 }) => {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)
  const pausedRef = useRef(false)
  const touchStartX = useRef(0)

  const changeIndex = (next) => {
    const clamped = (next + TEAM.length) % TEAM.length
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
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) changeIndex(index + (dx > 0 ? -1 : 1))
  }

  return (
    <section className="team" aria-label="Team">
      <div className="team-inner">
        <h2 className="team-title">Meet the Team</h2>
        <p className="team-sub">A small, passionate group building LockedIn.</p>

        <div className="team-viewport team-viewport--half" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="team-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {TEAM.map(member => (
              <article key={member.id} className={`team-card ${member.id === 't1' ? 'team-card--featured' : ''}`}>
                <img src={member.pics} alt={member.name} className={`teampics ${member.id === 't1' ? 'teampics--large' : ''}`} />
                <div className="team-info">
                  <div className="team-name">{member.name}</div>
                  <div className="team-role">{member.role}</div>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>

          {/* <button className="team-btn prev" onClick={() => changeIndex(index - 1)} aria-label="Previous">‹</button>
          <button className="team-btn next" onClick={() => changeIndex(index + 1)} aria-label="Next">›</button> */}
        </div>

        <div className="team-indicators">
          {TEAM.map((m, i) => (
            <button key={m.id} className={`dot ${i === index ? 'active' : ''}`} onClick={() => changeIndex(i)} aria-label={`Go to ${m.name}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team

