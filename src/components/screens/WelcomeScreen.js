import React from 'react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ marginBottom: 16 }}>
          <span className="logo-icon" style={{ fontSize: '3rem' }}>🥪</span>
        </div>
        <p className="subtitle" style={{ fontSize: '1.05rem', marginBottom: '24px', color: '#5b6b60' }}>
          Your personalized meal planning assistant
        </p>
        <button className="btn btn-primary" onClick={onStart}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen; 