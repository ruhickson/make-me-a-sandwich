import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import MainApp from './components/MainApp';
import { MealPlannerProvider } from './context/MealPlannerContext';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Check for existing user data on app load
    const savedProfile = localStorage.getItem('mealPlannerUserProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (profile) => {
    setUserProfile(profile);
    setIsLoggedIn(true);
    localStorage.setItem('mealPlannerUserProfile', JSON.stringify(profile));
  };

  const handleLogout = () => {
    setUserProfile(null);
    setIsLoggedIn(false);
    localStorage.removeItem('mealPlannerUserProfile');
  };

  return (
    <MealPlannerProvider>
      <div className="App">
        {!isLoggedIn ? (
          <LoginScreen onLogin={handleLogin} userProfile={userProfile} />
        ) : (
          <MainApp userProfile={userProfile} onLogout={handleLogout} />
        )}
      </div>
    </MealPlannerProvider>
  );
}

export default App; 