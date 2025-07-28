import React, { useState } from 'react';
import MenuBar from './MenuBar';
import WelcomeScreen from './screens/WelcomeScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';
import MealPlanScreen from './screens/MealPlanScreen';
import ShoppingListScreen from './screens/ShoppingListScreen';
import CalendarScreen from './screens/CalendarScreen';
import AccountScreen from './screens/AccountScreen';
import SettingsScreen from './screens/SettingsScreen';
import RecipeDatabase from './RecipeDatabase';

const MainApp = ({ userProfile, onLogout }) => {
  const [currentScreen, setCurrentScreen] = useState('welcome');

  const screens = {
    welcome: <WelcomeScreen onStart={() => setCurrentScreen('questionnaire')} />,
    questionnaire: <QuestionnaireScreen onComplete={() => setCurrentScreen('meal-plan')} />,
    'meal-plan': <MealPlanScreen onViewShopping={() => setCurrentScreen('shopping-list')} />,
    'shopping-list': <ShoppingListScreen onBack={() => setCurrentScreen('meal-plan')} />,
    'recipe-database': <RecipeDatabase />,
    calendar: <CalendarScreen />,
    account: <AccountScreen userProfile={userProfile} onLogout={onLogout} />,
    settings: <SettingsScreen />
  };

  return (
    <div className="main-app">
      <MenuBar 
        currentScreen={currentScreen} 
        onScreenChange={setCurrentScreen}
        userProfile={userProfile}
      />
      <div className="screen-content">
        {screens[currentScreen]}
      </div>
    </div>
  );
};

export default MainApp; 