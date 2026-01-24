import React, { useEffect, useState } from 'react'
import './header.css'
import logo from '../../../general_component/images/Lockedin_Icon only.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

const styles = {
  buttonGhost: {
    background: "transparent",
    color: "#1a73e8",
    border: "1px solid #1a73e8",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 600,
  }
}


const Header = () => {
	const [theme, setTheme] = useState(() => {
		try {
			const stored = localStorage.getItem('site-theme')
			if (stored) return stored
			// fallback to any existing data-mui-color-scheme or data-theme attribute
			const mui = document.documentElement.getAttribute('data-mui-color-scheme')
			const dt = document.documentElement.getAttribute('data-theme')
			if (mui) return mui
			if (dt) return dt
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
			return 'light'
		} catch (e) {
			return 'light'
		}
	})

	const [mobileOpen, setMobileOpen] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 640 && mobileOpen) setMobileOpen(false)
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [mobileOpen])

	useEffect(() => {
		// Sync legacy CSS attribute and MUI css-vars attribute so both systems respond
		document.documentElement.setAttribute('data-theme', theme)
		document.documentElement.setAttribute('data-mui-color-scheme', theme)
		try {
			localStorage.setItem('site-theme', theme)
		} catch (e) {}
	}, [theme])

	const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

const navigate = useNavigate();
	return (
		
		<header className="site-header">
			<div className="header-inner">
				<div className="logo">
					<Link to="/">
						<img src={logo} alt="Logo" />
					</Link>
				</div>

				<nav
					className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}
					aria-label="Main navigation"
					id="mobile-menu"
					aria-hidden={!mobileOpen && window.innerWidth <= 640}
				>
					<a href="/events" onClick={() => setMobileOpen(false)}>Events</a>
					<a href="/about" onClick={() => setMobileOpen(false)}>About</a>
					<a href="/contact" onClick={() => setMobileOpen(false)}>Contact</a>
					<a href="/pricing" onClick={() => setMobileOpen(false)}>Pricing</a>
					{
						localStorage.getItem('lockedin_user')  ? (
						<button style={styles.buttonGhost} onClick={() => { localStorage.removeItem('lockedin_user'); localStorage.removeItem('sozo_user'); navigate('/signin'); }}>
						Sign out
						</button>
						) : (
							null
						)
					}
				</nav>

				<button
					className="mobile-nav-toggle"
					onClick={() => setMobileOpen((s) => !s)}
					aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
					aria-controls="mobile-menu"
					aria-expanded={mobileOpen}
				>
					<span className="hamburger" aria-hidden="true"></span>
				</button>

				<div className="controls">
					<button
						className="theme-toggle"
						onClick={toggleTheme}
						aria-label="Toggle theme"
						title="Toggle theme"
					>
						{theme === 'light' ? '🌙 Dark' : '🌞 Light'}
					</button>
				</div>
			</div>
		</header>
	)
}

export default Header

