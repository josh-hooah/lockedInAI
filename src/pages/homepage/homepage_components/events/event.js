import React, { useEffect, useState } from 'react'
import './event.css'

const pastEvents = [
  { id: 'p1', title: '30 days accountability bootcamp', date: '2025-11-02', location: 'Online' },
  { id: 'p2', title: '2-days Training on accountability', date: '2025-10-18', location: 'Community Hall' },
]

const futureEvents = [
  { id: 'f1', title: 'Hiring Workshop', date: '2026-02-12', location: 'Tech Hub' },
  { id: 'f2', title: 'Hackathon 2026', date: '2026-03-05', location: 'Innovation Park' },
]

const PresentEvent = () => {
  // target is 5 days from now
  const target = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  const [remaining, setRemaining] = useState(getRemaining())

  function getRemaining() {
    const diff = Math.max(0, target - Date.now())
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    const hours = Math.floor((diff / (60 * 60 * 1000)) % 24)
    const minutes = Math.floor((diff / (60 * 1000)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)
    return { days, hours, minutes, seconds }
  }

  useEffect(() => {
    const t = setInterval(() => setRemaining(getRemaining()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <article className="event-card present">
      <h3 className="event-title">LockedIn Summit</h3>
      <div className="event-date">{target.toLocaleString()}</div>
      <div className="event-location">The Grand Hall, 12 Market St, Cityville</div>

      <div className="countdown">
        <div className="count-item">
          <div className="num">{remaining.days}</div>
          <div className="label">Days</div>
        </div>
        <div className="count-sep">:</div>
        <div className="count-item">
          <div className="num">{pad(remaining.hours)}</div>
          <div className="label">Hours</div>
        </div>
        <div className="count-sep">:</div>
        <div className="count-item">
          <div className="num">{pad(remaining.minutes)}</div>
          <div className="label">Minutes</div>
        </div>
        <div className="count-sep">:</div>
        <div className="count-item">
          <div className="num">{pad(remaining.seconds)}</div>
          <div className="label">Seconds</div>
        </div>
      </div>

      <div className="event-actions">
        <button className="btn primary">RSVP</button>
      </div>
    </article>
  )
}

function pad(n) { return String(n).padStart(2, '0') }

const EventsSection = () => {
  return (
    <section className="events" aria-label="Events">
      <div className="events-inner">
        <h2 className="events-title">Events</h2>
        <div className="events-grid">
          <div className="events-column">
            <h4>Past</h4>
            {pastEvents.map(e => (
              <div key={e.id} className="event-card small">
                <div className="small-title">{e.title}</div>
                <div className="small-meta">{e.date} · {e.location}</div>
              </div>
            ))}
          </div>

          <div className="events-column">
            <h4>Present</h4>
            <PresentEvent />
          </div>

          <div className="events-column">
            <h4>Future</h4>
            {futureEvents.map(e => (
              <div key={e.id} className="event-card small">
                <div className="small-title">{e.title}</div>
                <div className="small-meta">{e.date} · {e.location}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventsSection
