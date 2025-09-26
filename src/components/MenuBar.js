import React from 'react';

const MenuBar = ({ currentScreen, onScreenChange, userProfile = null }) => {
  return (
    <>
      {/* Top Logo */}
      <div className="top-logo">
        <button 
          className="logo-button"
          onClick={() => onScreenChange('welcome')}
        >
          <span className="logo-icon">🥪</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button 
          className={`nav-item ${currentScreen === 'welcome' ? 'active' : ''}`}
          onClick={() => onScreenChange('welcome')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </button>
        <button 
          className={`nav-item ${currentScreen === 'recipe-database' ? 'active' : ''}`}
          onClick={() => onScreenChange('recipe-database')}
        >
          <span className="nav-icon">📚</span>
          <span className="nav-label">Recipes</span>
        </button>
        <button 
          className={`nav-item ${currentScreen === 'meal-plan' ? 'active' : ''}`}
          onClick={() => onScreenChange('meal-plan')}
        >
          <span className="nav-icon">📅</span>
          <span className="nav-label">Meal Plan</span>
        </button>
        <button 
          className={`nav-item ${currentScreen === 'shopping-list' ? 'active' : ''}`}
          onClick={() => onScreenChange('shopping-list')}
        >
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Shopping</span>
        </button>
        <button 
          className={`nav-item ${currentScreen === 'settings' ? 'active' : ''}`}
          onClick={() => onScreenChange('settings')}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </button>
      </div>
    </>
  );
};

export default MenuBar; 