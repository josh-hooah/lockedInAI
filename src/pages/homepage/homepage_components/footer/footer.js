import React from 'react'
import './footer.css'
import { Link } from 'react-router-dom';
import logo from '../../../../general_component/images/Lockedin_Icon only.png'

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="LockedIn" />
          </Link>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="/events">Events</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/pricing">Pricing</a>
        </nav>

        <div className="footer-right">
          <div className="copyright">© {new Date().getFullYear()} LockedIn</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
