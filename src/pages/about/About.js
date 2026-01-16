import React, { useEffect } from 'react';
import './about.css';

export default function About() {
  useEffect(() => {
    const apply = () => {
      const t = localStorage.getItem('theme') || localStorage.getItem('lockedin_theme') || localStorage.getItem('sozo_theme') || localStorage.theme || null;
      if (t) document.documentElement.style.setProperty('--lockedin-page-bg', t);
    };
    apply();
    const id = setInterval(apply, 300);
    window.addEventListener('storage', apply);
    return () => {
      clearInterval(id);
      window.removeEventListener('storage', apply);
    };
  }, []);

  return (
    <div className="about-container">
      <section className="about-hero">
        <div className="about-hero-left">
          <h1 className="about-heading">LockedIn — accountability that works</h1>
          <p className="about-sub">
            LockedIn is an accountability platform that helps anyone achieve
            their goals. Combine simple task lists with accountability features
            so you stay focused, measure progress, and build productive habits.
          </p>

          <div className="about-cta-row">
            <button className="about-cta primary" onClick={() => (window.location.href = '/signup')}>Get started — it's free</button>
            <button className="about-cta secondary" onClick={() => (window.location.href = '/pricing')}>See pricing</button>
          </div>
        </div>

        <div className="about-card">
          <h3>How LockedIn helps</h3>
          <ul className="about-list">
            <li>Set clear, dated commitments (a due date is required)</li>
            <li>Track successes and review failures to improve</li>
            <li>See your productivity score and trends over time</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>How it works</h2>
        <div className="about-steps">
          <div className="about-card">
            <strong>1. Commit</strong>
            <div className="muted">Create tasks with due dates—commitments you can measure.</div>
          </div>
          <div className="about-card">
            <strong>2. Execute</strong>
            <div className="muted">Work on tasks and mark successes. Failed tasks are preserved for learning.</div>
          </div>
          <div className="about-card">
            <strong>3. Improve</strong>
            <div className="muted">Use productivity metrics and trends to iterate and get better.</div>
          </div>
        </div>
      </section>

      <section>
        <h2>What people gain</h2>
        <div className="about-grid">
          <div className="about-card">
            <strong>Clarity</strong>
            <div className="muted">Know exactly what matters today.</div>
          </div>
          <div className="about-card">
            <strong>Momentum</strong>
            <div className="muted">Ship small wins consistently.</div>
          </div>
          <div className="about-card">
            <strong>Growth</strong>
            <div className="muted">Learn from failed tasks and improve habits.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
