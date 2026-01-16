import React, { useEffect, useRef } from 'react'
import './achievement.css'

const STATS = [
	{ id: 'events', label: 'Events Hosted', value: 120 },
	{ id: 'members', label: 'Members', value: 5200 },
	{ id: 'Businesses', label: 'Businesses Helped', value: 45 },
	{ id: 'workshops', label: 'Workshops', value: 10 },
]

function useCountUp(target, duration = 1200) {
	const ref = useRef(null)
	useEffect(() => {
		let start = null
		const from = 0
		const to = target
		function step(timestamp) {
			if (!start) start = timestamp
			const progress = Math.min((timestamp - start) / duration, 1)
			const current = Math.floor(progress * (to - from) + from)
			if (ref.current) ref.current.textContent = current.toLocaleString()
			if (progress < 1) requestAnimationFrame(step)
		}
		requestAnimationFrame(step)
	}, [target, duration])
	return ref
}

function StatCard({ label, value }) {
	const numRef = useCountUp(value, 1300)
	return (
		<div className="stat-card">
			<div className="stat-num" ref={numRef}>0</div>
			<div className="stat-label">{label}</div>
		</div>
	)
}

const Achievement = () => {
	return (
		<section className="achievement" aria-label="Achievements">
			<div className="achievement-inner">
				{STATS.map((s) => (
					<StatCard key={s.id} label={s.label} value={s.value} />
				))}
			</div>
		</section>
	)
}

export default Achievement

