import React, { createContext, useContext, useReducer, useEffect } from 'react';

const MealPlannerContext = createContext();

const initialState = {
  userData: {},
  mealPlan: {},
  shoppingList: {},
  currentQuestionnairePage: 1,
  totalQuestionnairePages: 4,
  settings: {
    darkMode: false,
    notifications: true,
    autosave: true,
    weightUnit: 'kg',
    heightUnit: 'cm'
  },
  ingredientPrices: {
    // Proteins
    'chicken breast': { price: 8.50, unit: 'per kg' },
    'beef': { price: 12.00, unit: 'per kg' },
    'salmon': { price: 15.00, unit: 'per kg' },
    'tuna': { price: 3.50, unit: 'per can' },
    'white fish': { price: 10.00, unit: 'per kg' },
    'eggs': { price: 3.50, unit: 'per dozen' },
    'protein powder': { price: 25.00, unit: 'per kg' },
    
    // Dairy & Alternatives
    'milk': { price: 1.20, unit: 'per liter' },
    'yogurt': { price: 2.50, unit: 'per 500g' },
    'greek yogurt': { price: 3.50, unit: 'per 500g' },
    'cheese': { price: 8.00, unit: 'per kg' },
    'feta': { price: 6.00, unit: 'per 200g' },
    'mozzarella': { price: 7.50, unit: 'per kg' },
    'parmesan': { price: 12.00, unit: 'per kg' },
    'cream cheese': { price: 2.50, unit: 'per 200g' },
    'cottage cheese': { price: 3.00, unit: 'per 500g' },
    
    // Grains & Breads
    'bread': { price: 2.50, unit: 'per loaf' },
    'pasta': { price: 1.50, unit: 'per 500g' },
    'tortilla': { price: 2.00, unit: 'per pack' },
    'oats': { price: 3.00, unit: 'per kg' },
    'quinoa': { price: 6.00, unit: 'per kg' },
    'rice': { price: 2.50, unit: 'per kg' },
    'rice cakes': { price: 2.00, unit: 'per pack' },
    'granola': { price: 4.50, unit: 'per 500g' },
    
    // Fruits & Vegetables
    'apple': { price: 0.50, unit: 'each' },
    'banana': { price: 0.30, unit: 'each' },
    'berries': { price: 4.00, unit: 'per 300g' },
    'orange': { price: 0.60, unit: 'each' },
    'grapes': { price: 3.50, unit: 'per kg' },
    'tomatoes': { price: 2.50, unit: 'per kg' },
    'cucumber': { price: 1.00, unit: 'each' },
    'lettuce': { price: 1.50, unit: 'each' },
    'carrots': { price: 1.50, unit: 'per kg' },
    'celery': { price: 2.00, unit: 'per bunch' },
    'avocado': { price: 1.50, unit: 'each' },
    'vegetables': { price: 3.00, unit: 'per kg' },
    
    // Nuts & Seeds
    'almonds': { price: 8.00, unit: 'per kg' },
    'cashews': { price: 10.00, unit: 'per kg' },
    'walnuts': { price: 9.00, unit: 'per kg' },
    'peanut butter': { price: 3.50, unit: 'per 500g' },
    'chia seeds': { price: 6.00, unit: 'per 500g' },
    'seeds': { price: 4.00, unit: 'per 500g' },
    'nuts': { price: 8.50, unit: 'per kg' },
    'dried fruit': { price: 5.00, unit: 'per 500g' },
    
    // Pantry Items
    'honey': { price: 4.00, unit: 'per 500g' },
    'olive oil': { price: 6.00, unit: 'per liter' },
    'soy sauce': { price: 2.50, unit: 'per 500ml' },
    'balsamic': { price: 3.50, unit: 'per 250ml' },
    'salt': { price: 1.00, unit: 'per kg' },
    'herbs': { price: 2.00, unit: 'per bunch' },
    'lemon': { price: 0.40, unit: 'each' },
    'ginger': { price: 3.00, unit: 'per kg' },
    'curry powder': { price: 2.50, unit: 'per 100g' },
    'coconut milk': { price: 2.00, unit: 'per 400ml' },
    'vanilla': { price: 4.00, unit: 'per 100ml' },
    'popcorn kernels': { price: 2.50, unit: 'per kg' },
    'mayo': { price: 2.00, unit: 'per 500ml' },
    'onion': { price: 1.50, unit: 'per kg' },
    'sprouts': { price: 2.00, unit: 'per 200g' },
    'chicken': { price: 8.50, unit: 'per kg' },
    'dressing': { price: 3.00, unit: 'per 250ml' },
    'protein': { price: 12.00, unit: 'per kg' },
    'basil': { price: 2.50, unit: 'per bunch' },
    'dark chocolate': { price: 4.00, unit: 'per 200g' },
    'hummus': { price: 3.50, unit: 'per 300g' },
    'cream cheese': { price: 2.50, unit: 'per 200g' },
    'fruit': { price: 4.00, unit: 'per kg' },
    'protein bar': { price: 2.50, unit: 'each' }
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

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('mealPlannerUserData');
    const savedMealPlan = localStorage.getItem('mealPlannerMealPlan');
    const savedShoppingList = localStorage.getItem('mealPlannerShoppingList');
    const savedSettings = localStorage.getItem('mealPlannerSettings');

    if (savedUserData || savedMealPlan || savedShoppingList || savedSettings) {
      dispatch({
        type: 'LOAD_FROM_STORAGE',
        payload: {
          userData: savedUserData ? JSON.parse(savedUserData) : {},
          mealPlan: savedMealPlan ? JSON.parse(savedMealPlan) : {},
          shoppingList: savedShoppingList ? JSON.parse(savedShoppingList) : {},
          settings: savedSettings ? JSON.parse(savedSettings) : initialState.settings
        }
      });
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (state.userData && Object.keys(state.userData).length > 0) {
      localStorage.setItem('mealPlannerUserData', JSON.stringify(state.userData));
    }
  }, [state.userData]);

  useEffect(() => {
    if (state.mealPlan && Object.keys(state.mealPlan).length > 0) {
      localStorage.setItem('mealPlannerMealPlan', JSON.stringify(state.mealPlan));
    }
  }, [state.mealPlan]);

  useEffect(() => {
    if (state.shoppingList && Object.keys(state.shoppingList).length > 0) {
      localStorage.setItem('mealPlannerShoppingList', JSON.stringify(state.shoppingList));
    }
  }, [state.shoppingList]);

  useEffect(() => {
    localStorage.setItem('mealPlannerSettings', JSON.stringify(state.settings));
  }, [state.settings]);

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