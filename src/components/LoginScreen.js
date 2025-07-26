import React, { useState } from 'react';

const LoginScreen = ({ onLogin, userProfile }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showWelcomeBack, setShowWelcomeBack] = useState(!!userProfile);

  const handleGoogleSignIn = () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SkQ8L3RleHQ+Cjwvc3ZnPgo='
    };
    onLogin(mockUser);
  };

  const handleEmailSignIn = () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    const mockUser = {
      name: email.split('@')[0],
      email: email,
      avatar: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+${email.charAt(0).toUpperCase()}PC90ZXh0Pgo8L3N2Zz4K`
    };
    onLogin(mockUser);
  };

  const handleGuestLogin = () => {
    const mockUser = {
      name: 'Guest User',
      email: 'guest@makemeasandwich.app',
      avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RzwvdGV4dD4KPC9zdmc+Cg=='
    };
    onLogin(mockUser);
  };

  const continueWithExistingPlan = () => {
    onLogin(userProfile);
  };

  const startFresh = () => {
    // Clear existing data and start fresh
    localStorage.removeItem('mealPlannerUserData');
    localStorage.removeItem('mealPlannerMealPlan');
    localStorage.removeItem('mealPlannerShoppingList');
    onLogin(userProfile);
  };

  const handleLogout = () => {
    localStorage.removeItem('mealPlannerUserProfile');
    setShowWelcomeBack(false);
  };

  if (showWelcomeBack && userProfile) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <div className="login-header">
            <span className="logo-icon">🥪</span>
            <h1>Make Me A Sandwich</h1>
            <p className="subtitle">Your personalized meal planning assistant</p>
          </div>
          
          <div className="login-section">
            <h2>Welcome Back!</h2>
            <p>We found your previous meal plan data. Would you like to continue where you left off?</p>
            
            <div className="user-info">
              <div className="user-avatar">
                <img src={userProfile.avatar} alt="Profile Picture" />
              </div>
              <div className="user-details">
                <h3>{userProfile.name}</h3>
                <p>{userProfile.email}</p>
              </div>
            </div>
            
            <div className="login-actions">
              <button className="btn btn-primary" onClick={continueWithExistingPlan}>
                Continue with Existing Plan
              </button>
              <button className="btn btn-secondary" onClick={startFresh}>
                Start Fresh
              </button>
              <button className="btn btn-text" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-header">
          <span className="logo-icon">🥪</span>
          <h1>Make Me A Sandwich</h1>
          <p className="subtitle">Your personalized meal planning assistant</p>
        </div>
        
        <div className="login-section">
          <h2>Get Started</h2>
          <p>Create your personalized meal plan in just a few minutes</p>
          
          <div className="login-options">
            <button className="btn btn-google" onClick={handleGoogleSignIn}>
              <span className="google-icon">🔍</span>
              Sign in with Google
            </button>
            
            <div className="divider">
              <span>or</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            
            <button className="btn btn-primary" onClick={handleEmailSignIn}>
              Sign In
            </button>
            
            <div className="guest-option">
              <p>Or continue as a guest</p>
              <button className="btn btn-secondary" onClick={handleGuestLogin}>
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen; 