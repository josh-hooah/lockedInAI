import React from 'react'
import './pricing.css'

const plans = [
	{
		id: 'basic',
		name: 'Basic',
		price: '$0',
		period: '/mo',
		features: ['Community access', 'Basic events', 'Limited support'],
	},
	{
		id: 'pro',
		name: 'Pro',
		price: '$9',
		period: '/mo',
		features: ['Everything in Basic', 'Premium events', 'Priority support'],
		featured: true,
	},
	{
		id: 'enterprise',
		name: 'Enterprise',
		price: 'Contact',
		period: '',
		features: ['Custom integrations', 'Dedicated manager', 'SLA'],
	},
]

const Pricing = () => {
	return (
		<section className="pricing" aria-labelledby="pricing-heading">
			<div className="pricing-inner">
				<h2 id="pricing-heading" className="pricing-title">Pricing</h2><br></br><br></br>

				<div className="pricing-grid">
					{plans.map((p) => (
						<article key={p.id} className={`pricing-card ${p.featured ? 'featured' : ''}`}>
							<div className="card-top">
								<h3 className="plan-name">{p.name}</h3>
								<div className="plan-price">
									<span className="amount">{p.price}</span>
									<span className="period">{p.period}</span>
								</div>
							</div>

							<ul className="plan-features">
								{p.features.map((f, i) => (
									<li key={i}>{f}</li>
								))}
							</ul>

							<div className="card-actions">
								<button className="btn primary">Choose {p.name}</button>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}

export default Pricing

