import React, { useState, useEffect } from 'react';
import './StreakTracker.css';

export default function StreakTracker({ productivity }) {
  const [streakPoints, setStreakPoints] = useState(0);
  const [isRewardActive, setIsRewardActive] = useState(false);

  useEffect(() => {
    // Load streak from localStorage
    const storedStreak = parseInt(localStorage.getItem('loginStreak') || '0', 10);
    setStreakPoints(storedStreak);
    setIsRewardActive(storedStreak >= 30);
  }, []);

  const claimReward = () => {
    // Define reward action here (e.g., alert or update user data)
    alert('Reward claimed!'); // Placeholder
    // Reset or handle post-claim logic
  };

  return (
    <div className="streak-tracker">
      <h3>Login Streak </h3><br></br>
      <div className="streak-progress">
        <label>Login Points: {streakPoints}/30</label>
        <progress value={streakPoints} max={30}></progress>
      </div>
      <div className="productivity-display">
        <label>Productivity Level: {productivity.toFixed(2)}%</label>
      </div>
      <button 
        className="claim-reward-btn" 
        disabled={!isRewardActive} 
        onClick={claimReward}
      >
        Claim Reward
      </button>
    </div>
  );
}