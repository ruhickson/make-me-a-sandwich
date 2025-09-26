import React, { createContext, useContext, useReducer, useEffect } from 'react';

const MealPlannerContext = createContext();

const initialState = {
  userData: {},
  mealPlan: {},
  shoppingList: {},
  currentQuestionnairePage: 1,
  totalQuestionnairePages: 5,
  settings: {
    darkMode: false,
    notifications: true,
    autosave: true,
    weightUnit: 'kg',
    heightUnit: 'cm'
  },
  ingredientPrices: {
    // Simplified ingredient prices for testing
    'chicken breast': { price: 8.50, unit: 'per kg' },
    'beef': { price: 12.00, unit: 'per kg' },
    'salmon': { price: 15.00, unit: 'per kg' }
  }
};

function mealPlannerReducer(state, action) {
  switch (action.type) {
    case 'SET_USER_DATA':
      return { ...state, userData: action.payload };
    case 'SET_MEAL_PLAN':
      return { ...state, mealPlan: action.payload };
    case 'SET_SHOPPING_LIST':
      return { ...state, shoppingList: action.payload };
    case 'SET_QUESTIONNAIRE_PAGE':
      return { ...state, currentQuestionnairePage: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    case 'CLEAR_DATA':
      return { ...initialState };
    default:
      return state;
  }
}

export function MealPlannerProvider({ children }) {
  const [state, dispatch] = useReducer(mealPlannerReducer, initialState);

  // Simplified: Remove localStorage loading for now
  // useEffect(() => {
  //   const savedUserData = localStorage.getItem('mealPlannerUserData');
  //   const savedMealPlan = localStorage.getItem('mealPlannerMealPlan');
  //   const savedShoppingList = localStorage.getItem('mealPlannerShoppingList');
  //   const savedSettings = localStorage.getItem('mealPlannerSettings');

  //   if (savedUserData || savedMealPlan || savedShoppingList || savedSettings) {
  //     dispatch({
  //       type: 'LOAD_FROM_STORAGE',
  //       payload: {
  //         userData: savedUserData ? JSON.parse(savedUserData) : {},
  //         mealPlan: savedMealPlan ? JSON.parse(savedMealPlan) : {},
  //         shoppingList: savedShoppingList ? JSON.parse(savedShoppingList) : {},
  //         settings: savedSettings ? JSON.parse(savedSettings) : initialState.settings
  //       }
  //     });
  //   }
  // }, []);

  const value = {
    ...state,
    dispatch,
    setUserData: (data) => dispatch({ type: 'SET_USER_DATA', payload: data }),
    setMealPlan: (plan) => dispatch({ type: 'SET_MEAL_PLAN', payload: plan }),
    setShoppingList: (list) => dispatch({ type: 'SET_SHOPPING_LIST', payload: list }),
    setQuestionnairePage: (page) => dispatch({ type: 'SET_QUESTIONNAIRE_PAGE', payload: page }),
    updateSettings: (settings) => dispatch({ type: 'SET_SETTINGS', payload: settings }),
    clearData: () => dispatch({ type: 'CLEAR_DATA' })
  };

  return (
    <MealPlannerContext.Provider value={value}>
      {children}
    </MealPlannerContext.Provider>
  );
}

export function useMealPlanner() {
  const context = useContext(MealPlannerContext);
  if (!context) {
    throw new Error('useMealPlanner must be used within a MealPlannerProvider');
  }
  return context;
} 