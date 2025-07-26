import React from 'react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1>🥪 Make Me A Sandwich</h1>
        <p className="subtitle" style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
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