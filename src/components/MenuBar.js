import React from 'react';

const MenuBar = ({ currentScreen, onScreenChange, userProfile }) => {
  const menuItems = [
    { id: 'welcome', label: 'Home' },
    { id: 'questionnaire', label: 'New Plan' },
    { id: 'meal-plan', label: 'Meal Plan' },
    { id: 'shopping-list', label: 'Shopping' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'account', label: 'Account' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <nav className="menu-bar">
      <div className="menu-container">
        <div className="menu-logo">
          <span className="logo-icon">🥪</span>
          <span className="logo-text">Make Me A Sandwich</span>
        </div>
        
        <div className="menu-items">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${currentScreen === item.id ? 'active' : ''}`}
              onClick={() => onScreenChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        {userProfile && (
          <div className="user-menu">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name}
              className="user-avatar-small"
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default MenuBar; 