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
    // Comprehensive ingredient prices for Irish supermarkets
    'chicken breast': { price: 8.50, unit: 'per kg' },
    'beef': { price: 12.00, unit: 'per kg' },
    'salmon': { price: 15.00, unit: 'per kg' },
    'eggs': { price: 2.50, unit: 'per dozen' },
    'milk': { price: 1.20, unit: 'per litre' },
    'bread': { price: 1.50, unit: 'per loaf' },
    'butter': { price: 2.80, unit: 'per 250g' },
    'cheese': { price: 3.50, unit: 'per 200g' },
    'onions': { price: 1.20, unit: 'per kg' },
    'garlic': { price: 0.80, unit: 'per bulb' },
    'garlic cloves': { price: 0.80, unit: 'per bulb' },
    'tomatoes': { price: 2.50, unit: 'per kg' },
    'potatoes': { price: 1.50, unit: 'per kg' },
    'carrots': { price: 1.00, unit: 'per kg' },
    'peppers': { price: 2.00, unit: 'per kg' },
    'mushrooms': { price: 2.50, unit: 'per 250g' },
    'spinach': { price: 1.80, unit: 'per bag' },
    'lettuce': { price: 1.20, unit: 'per head' },
    'cucumber': { price: 1.00, unit: 'each' },
    'bananas': { price: 1.50, unit: 'per kg' },
    'apples': { price: 2.00, unit: 'per kg' },
    'oranges': { price: 2.50, unit: 'per kg' },
    'lemons': { price: 0.50, unit: 'each' },
    'lemon': { price: 0.50, unit: 'each' },
    'lemon zest': { price: 0.50, unit: 'each' },
    'olive oil': { price: 4.50, unit: 'per 500ml' },
    'olives': { price: 2.50, unit: 'per 200g jar' },
    'pitted olives': { price: 2.50, unit: 'per 200g jar' },
    'rapeseed oil': { price: 3.50, unit: 'per 500ml' },
    'salt': { price: 0.80, unit: 'per 500g' },
    'pepper': { price: 2.50, unit: 'per 50g' },
    'pasta': { price: 1.20, unit: 'per 500g' },
    'rice': { price: 2.00, unit: 'per kg' },
    'flour': { price: 1.50, unit: 'per kg' },
    'sugar': { price: 1.80, unit: 'per kg' },
    'honey': { price: 4.50, unit: 'per 340g' },
    'clear honey': { price: 4.50, unit: 'per 340g' },
    'yogurt': { price: 2.50, unit: 'per 500g' },
    'cereal': { price: 3.50, unit: 'per 500g' },
    'coffee': { price: 6.50, unit: 'per 250g' },
    'tea': { price: 3.00, unit: 'per 80 bags' },
    'chicken': { price: 6.50, unit: 'per kg' },
    'pork': { price: 7.50, unit: 'per kg' },
    'lamb': { price: 14.00, unit: 'per kg' },
    'fish': { price: 12.00, unit: 'per kg' },
    'bacon': { price: 4.50, unit: 'per 200g' },
    'sausages': { price: 3.50, unit: 'per 400g' },
    'ham': { price: 4.00, unit: 'per 200g' },
    'turkey': { price: 8.00, unit: 'per kg' },
    'beans': { price: 0.80, unit: 'per 400g can' },
    'lentils': { price: 2.50, unit: 'per 500g' },
    'red lentil': { price: 2.50, unit: 'per 500g' },
    'red lentils': { price: 2.50, unit: 'per 500g' },
    'chickpeas': { price: 1.50, unit: 'per 400g can' },
    'nuts': { price: 5.50, unit: 'per 200g' },
    'seeds': { price: 3.50, unit: 'per 200g' },
    'herbs': { price: 1.50, unit: 'per bunch' },
    'spices': { price: 2.50, unit: 'per 50g' },
    'curry powder': { price: 2.50, unit: 'per 50g' },
    'turmeric': { price: 2.50, unit: 'per 50g' },
    'vinegar': { price: 2.00, unit: 'per 500ml' },
    'soy sauce': { price: 3.50, unit: 'per 150ml' },
    'ketchup': { price: 2.00, unit: 'per 500ml' },
    'mayonnaise': { price: 2.50, unit: 'per 500ml' },
    'mustard': { price: 2.00, unit: 'per 200ml' },
    'wholegrain mustard': { price: 2.00, unit: 'per 200ml' },
    'wine': { price: 8.50, unit: 'per bottle' },
    'beer': { price: 2.50, unit: 'per 500ml' },
    'juice': { price: 2.50, unit: 'per litre' },
    'water': { price: 1.00, unit: 'per 2 litres' },
    'cookies': { price: 2.50, unit: 'per 200g' },
    'chocolate': { price: 3.50, unit: 'per 200g' },
    'ice cream': { price: 4.50, unit: 'per 500ml' },
    'frozen vegetables': { price: 2.00, unit: 'per 500g' },
    'frozen fruit': { price: 3.50, unit: 'per 500g' },
    'pizza': { price: 3.50, unit: 'each' },
    'sandwich': { price: 4.50, unit: 'each' },
    'soup': { price: 2.50, unit: 'per 400ml can' },
    'crackers': { price: 2.00, unit: 'per 200g' },
    'crisps': { price: 2.50, unit: 'per 150g' },
    'dried fruit': { price: 3.50, unit: 'per 200g' },
    // Additional ingredients from the shopping list
    'beetroot': { price: 2.00, unit: 'per 500g' },
    'cooked beetroot': { price: 2.00, unit: 'per 500g' },
    'mango': { price: 1.50, unit: 'each' },
    'ripe mango': { price: 1.50, unit: 'each' },
    'large mango': { price: 2.00, unit: 'each' },
    'passion fruit': { price: 0.80, unit: 'each' },
    'passion fruits': { price: 0.80, unit: 'each' },
    'vegetable stock': { price: 1.50, unit: 'per 1 litre' },
    'low sodium vegetable stock': { price: 1.50, unit: 'per 1 litre' },
    'stock cube': { price: 0.50, unit: 'each' },
    'vegetable stock cube': { price: 0.50, unit: 'each' },
    // More missing ingredients
    'ginger': { price: 2.00, unit: 'per 100g' },
    'chopped ginger': { price: 2.00, unit: 'per 100g' },
    'finely chopped ginger': { price: 2.00, unit: 'per 100g' },
    'prunes': { price: 3.00, unit: 'per 200g' },
    'pomegranate': { price: 2.50, unit: 'each' },
    'pomegranate seeds': { price: 3.50, unit: 'per 200g' },
    'mint': { price: 1.50, unit: 'per bunch' },
    'mint leaves': { price: 1.50, unit: 'per bunch' },
    'duck': { price: 18.00, unit: 'per kg' },
    'duck breast': { price: 20.00, unit: 'per kg' },
    'duck breasts': { price: 20.00, unit: 'per kg' },
    'five spice': { price: 3.50, unit: 'per 50g' },
    'five spice powder': { price: 3.50, unit: 'per 50g' },
    'ras el hanout': { price: 4.00, unit: 'per 50g' },
    'middle eastern spice mix': { price: 4.00, unit: 'per 50g' },
    'spice mix': { price: 4.00, unit: 'per 50g' },
    'vegetable oil': { price: 2.50, unit: 'per 500ml' },
    'lemon juice': { price: 2.50, unit: 'per litre' }
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