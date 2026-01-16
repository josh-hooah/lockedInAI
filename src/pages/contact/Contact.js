import React, { useState } from 'react';
import Team from '../homepage/homepage_components/team/team';

const wrap = { padding: 24, maxWidth: 900, margin: '0 auto' };
const form = { display: 'grid', gap: 12 };
const input = { padding: 10, borderRadius: 8, border: '1px solid #dadce0' };
const button = { padding: '10px 14px', borderRadius: 8, background: '#1a73e8', color: '#fff', border: 'none' };

export default function Contact() {
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    // store to localStorage as placeholder
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
      at: new Date().toISOString(),
    };
    const prev = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    prev.push(data);
    localStorage.setItem('contact_messages', JSON.stringify(prev));
    setSent(true);
  };

  return (
    <div style={wrap}>
        <Team />
      <h1>Contact</h1>
      <p style={{ color: '#5f6368' }}>Send us a message and we'll get back to you.</p>
      {sent ? (
        <div style={{ padding: 12, border: '1px solid #e0e0e0', borderRadius: 8 }}>Thanks — your message has been received.</div>
      ) : (
        <form style={form} onSubmit={submit}>
          <input style={input} name="name" placeholder="Full name" required />
          <input style={input} name="email" placeholder="Email" type="email" required />
          <textarea style={{ ...input, minHeight: 120, resize: 'vertical' }} name="message" placeholder="Message" required />
          <div>
            <button style={button} type="submit">Send</button>
          </div>
        </form>
      )}
      <style>{`@media (max-width:800px){ div[style*='maxWidth']{padding:16px} `}</style>
    </div>
  );
}
