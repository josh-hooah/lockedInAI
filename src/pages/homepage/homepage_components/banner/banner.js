import React, { useState, useEffect } from 'react'
import '../banner/banner.css'
import vid from '../../../../general_component/videos/banner.webm'
import {Link}  from 'react-router-dom'
import Button from '@mui/material/Button'

const Banner = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const user = localStorage.getItem('lockedin_user') || localStorage.getItem('sozo_user');
		setIsLoggedIn(!!user);
	}, []);

	return (
		<section className="hero" >
			<div className="hero-inner">
				<div className="hero-left">
						<h1 className="company-name">LockedIn</h1><br></br><br></br>
						<p className="motto">Be Accountable</p><br></br>
						<p className="lead">Small daily goals. Big consistent progress. Join a focused community and track what matters.</p><br></br><br></br>

						<div className="cta-group">
							<Button variant="contained" size="large" className="get-started-btn" component={Link} to={isLoggedIn ? "/dashboard" : "/signin"}>
								{isLoggedIn ? "View Dashboard" : "Get Started"}
							</Button>

							<Link to="/about" className="secondary-btn" aria-label="Learn more about LockedIn">Learn more</Link>
						</div>
				</div>

				<div className="hero-right">
					<video
						className="hero-video"
						src={vid}
						autoPlay
						loop
						muted
						playsInline
						aria-label="Decorative animation"
					/>
				</div>
			</div>
		</section>
	)
}

export default Banner

