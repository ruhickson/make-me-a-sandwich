import React, { useState, useEffect, useRef } from 'react';
import { useMealPlanner } from '../../context/MealPlannerContext';
import notificationService from '../../utils/notificationService';
import recipeService from '../../utils/recipeService';

const MealPlanScreen = ({ onViewShopping }) => {
  const { userData, mealPlan, setMealPlan, setShoppingList } = useMealPlanner();
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedMealType, setSelectedMealType] = useState('breakfasts');
  const [mealOptions, setMealOptions] = useState({
    breakfasts: [],
    lunches: [],
    dinners: [],
    snacks: []
  });
  const [currentMealIndex, setCurrentMealIndex] = useState({
    breakfasts: 0,
    lunches: 0,
    dinners: 0,
    snacks: 0
  });
  const [swipeStart, setSwipeStart] = useState({ x: 0, y: 0 });
  const [swipeEnd, setSwipeEnd] = useState({ x: 0, y: 0 });
  const [cardTransform, setCardTransform] = useState({ x: 0, y: 0, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs for swipe handling
  const dayScrollRef = useRef(null);
  const mealScrollRefs = useRef({});

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      generateMealPlan();
      generateMealOptions();
    }
  }, [userData]);

  const generateMealOptions = async () => {
    try {
      await recipeService.loadAllRecipes();
      const allRecipes = recipeService.getAllRecipes();
      
      // Use the same recipe source as the Recipes section
      const options = {
        breakfasts: recipeService.getRandomRecipesFromArray(allRecipes, 21),
        lunches: recipeService.getRandomRecipesFromArray(allRecipes, 21),
        dinners: recipeService.getRandomRecipesFromArray(allRecipes, 21),
        snacks: recipeService.getRandomRecipesFromArray(allRecipes, 21)
      };
      
      setMealOptions(options);
    } catch (error) {
      console.error('Error generating meal options:', error);
    }
  };

  const generateMealPlan = async () => {
    setLoading(true);
    
    try {
      // Load recipes first
      await recipeService.loadAllRecipes();
      
      // Simulate API call delay
      setTimeout(() => {
        const plan = createPersonalizedMealPlan(userData);
        console.log('Setting meal plan:', plan);
        setMealPlan(plan);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      setLoading(false);
    }
  };

  const createPersonalizedMealPlan = (userData) => {
    console.log('Creating personalized meal plan for user:', userData);
    console.log('User dietary preferences:', userData?.dietaryPreferences);
    console.log('User allergies:', userData?.allergies);
    console.log('User cooking experience:', userData?.cookingExperience);
    console.log('User cooking time preference:', userData?.cookingTime);
    console.log('User health goals:', userData?.healthGoals);
    console.log('User cooking days:', userData?.cookingDays);
    
    const plan = {
      week: getCurrentWeek(),
      userData: userData,
      meals: {
        breakfasts: generateBreakfasts(userData),
        lunches: generateLunches(userData),
        dinners: generateDinners(userData),
        snacks: generateSnacks(userData)
      },
      cookingSchedule: generateCookingSchedule(userData)
    };

    console.log('Generated meal plan:', plan);

    // Generate shopping list based on the actual recipes
    plan.shoppingList = generateShoppingList(userData, plan);
    setShoppingList(plan.shoppingList);

    return plan;
  };

  const getCurrentWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    // Set to Saturday (6) as the first day of the week
    const daysSinceSaturday = (today.getDay() + 1) % 7;
    startOfWeek.setDate(today.getDate() - daysSinceSaturday);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push({
        name: day.toLocaleDateString('en-GB', { weekday: 'long' }),
        date: day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        fullDate: day
      });
    }
    
    return days;
  };

  // BBC Good Food recipes are now loaded via recipeService

  const generateBreakfasts = (userData) => {
    // Get 3 different breakfast recipes from BBC Good Food with user preferences
    const filters = getUserPreferences(userData);
    const breakfastRecipes = recipeService.getRecipesByMealType('breakfast', 3, filters);
    console.log('Breakfast recipes found:', breakfastRecipes.length, breakfastRecipes);
    
    const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    // Fallback recipes if none are found
    const fallbackRecipes = [
      { name: 'Oatmeal with Berries', description: 'Healthy breakfast with oats and fresh berries', ingredients: ['oats', 'berries', 'honey'], method: ['Cook oats', 'Add berries', 'Drizzle with honey'] },
      { name: 'Scrambled Eggs', description: 'Protein-rich scrambled eggs', ingredients: ['eggs', 'butter', 'salt'], method: ['Crack eggs', 'Scramble in pan', 'Season to taste'] },
      { name: 'Greek Yogurt Bowl', description: 'Creamy yogurt with granola', ingredients: ['greek yogurt', 'granola', 'honey'], method: ['Scoop yogurt', 'Top with granola', 'Drizzle honey'] }
    ];
    
    const recipesToUse = breakfastRecipes.length > 0 ? breakfastRecipes : fallbackRecipes;
    
    return days.map((day, index) => {
      const recipe = recipesToUse[index % recipesToUse.length];
      return {
        ...recipe,
        day: day,
        color: getRecipeColor(recipe, 'breakfast')
      };
    });
  };

  const generateLunches = (userData) => {
    // Get 3 different lunch recipes from BBC Good Food with user preferences
    const filters = getUserPreferences(userData);
    const lunchRecipes = recipeService.getRecipesByMealType('lunch', 3, filters);
    console.log('Lunch recipes found:', lunchRecipes.length, lunchRecipes);
    
    const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    // Fallback recipes if none are found
    const fallbackRecipes = [
      { name: 'Chicken Salad', description: 'Fresh salad with grilled chicken', ingredients: ['chicken', 'lettuce', 'tomatoes'], method: ['Grill chicken', 'Chop vegetables', 'Mix together'] },
      { name: 'Quinoa Bowl', description: 'Nutritious quinoa with vegetables', ingredients: ['quinoa', 'vegetables', 'olive oil'], method: ['Cook quinoa', 'Steam vegetables', 'Combine with oil'] },
      { name: 'Soup and Sandwich', description: 'Classic soup with bread', ingredients: ['soup', 'bread', 'butter'], method: ['Heat soup', 'Toast bread', 'Serve together'] }
    ];
    
    const recipesToUse = lunchRecipes.length > 0 ? lunchRecipes : fallbackRecipes;
    
    return days.map((day, index) => {
      const recipe = recipesToUse[index % recipesToUse.length];
      return {
        ...recipe,
        day: day,
        color: getRecipeColor(recipe, 'lunch')
      };
    });
  };

  const generateDinners = (userData) => {
    // Get 3 different dinner recipes from BBC Good Food with user preferences
    const filters = getUserPreferences(userData);
    const dinnerRecipes = recipeService.getRecipesByMealType('dinner', 3, filters);
    console.log('Dinner recipes found:', dinnerRecipes.length, dinnerRecipes);
    
    const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    // Fallback recipes if none are found
    const fallbackRecipes = [
      { name: 'Grilled Salmon', description: 'Healthy salmon with vegetables', ingredients: ['salmon', 'vegetables', 'lemon'], method: ['Grill salmon', 'Steam vegetables', 'Serve with lemon'] },
      { name: 'Pasta Primavera', description: 'Fresh pasta with spring vegetables', ingredients: ['pasta', 'vegetables', 'olive oil'], method: ['Cook pasta', 'Sauté vegetables', 'Combine with oil'] },
      { name: 'Beef Stir Fry', description: 'Quick beef and vegetable stir fry', ingredients: ['beef', 'vegetables', 'soy sauce'], method: ['Slice beef', 'Stir fry vegetables', 'Add sauce'] }
    ];
    
    const recipesToUse = dinnerRecipes.length > 0 ? dinnerRecipes : fallbackRecipes;
    
    return days.map((day, index) => {
      const recipe = recipesToUse[index % recipesToUse.length];
      return {
        ...recipe,
        day: day,
        color: getRecipeColor(recipe, 'dinner')
      };
    });
  };

  const generateSnacks = (userData) => {
    // Get 3 different snack recipes from BBC Good Food with user preferences
    const filters = getUserPreferences(userData);
    const snackRecipes = recipeService.getRecipesByMealType('snack', 3, filters);
    console.log('Snack recipes found:', snackRecipes.length, snackRecipes);
    
    const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    // Fallback recipes if none are found
    const fallbackRecipes = [
      { name: 'Apple with Peanut Butter', description: 'Healthy snack with protein', ingredients: ['apple', 'peanut butter'], method: ['Slice apple', 'Spread peanut butter'] },
      { name: 'Greek Yogurt with Nuts', description: 'Protein-rich yogurt snack', ingredients: ['greek yogurt', 'nuts', 'honey'], method: ['Scoop yogurt', 'Add nuts', 'Drizzle honey'] },
      { name: 'Hummus with Carrots', description: 'Nutritious dip with vegetables', ingredients: ['hummus', 'carrots'], method: ['Scoop hummus', 'Serve with carrots'] }
    ];
    
    const recipesToUse = snackRecipes.length > 0 ? snackRecipes : fallbackRecipes;
    
    return days.map((day, index) => {
      const recipe = recipesToUse[index % recipesToUse.length];
      return {
        ...recipe,
        day: day,
        color: getRecipeColor(recipe, 'snack')
      };
    });
  };

  // Helper function to get user preferences for recipe filtering
  const getUserPreferences = (userData) => {
    const filters = {};
    
    // Dietary restrictions based on user preferences
    if (userData?.dietaryPreferences && userData.dietaryPreferences.length > 0) {
      // Take the first dietary preference (most restrictive)
      const dietaryPref = userData.dietaryPreferences[0];
      switch (dietaryPref) {
        case 'vegetarian':
          filters.dietary = 'vegetarian';
          break;
        case 'vegan':
          filters.dietary = 'vegan';
          break;
        case 'gluten_free':
          filters.dietary = 'gluten-free';
          break;
        case 'dairy_free':
          filters.dietary = 'dairy-free';
          break;
      }
    }
    
    // Allergies filter - exclude recipes with allergenic ingredients
    if (userData?.allergies && userData.allergies.length > 0) {
      filters.allergies = userData.allergies;
    }
    
    // Cooking equipment filter
    if (userData?.cookingEquipment && userData.cookingEquipment.length > 0) {
      filters.cookingEquipment = userData.cookingEquipment;
    }
    
    // Cooking days - use to determine meal complexity
    if (userData?.cookingDays && userData.cookingDays.length > 0) {
      filters.cookingDays = userData.cookingDays;
      // If only 2 cooking days, prefer simpler recipes
      if (userData.cookingDays.length === 2) {
        filters.maxIngredients = 10;
        filters.maxCookingTime = 45; // 45 minutes max for batch cooking
      }
    }
    
    // Cooking experience filter
    if (userData?.cookingExperience) {
      switch (userData.cookingExperience) {
        case 'beginner':
          filters.difficulty = 'easy';
          filters.maxIngredients = filters.maxIngredients || 8;
          break;
        case 'intermediate':
          filters.difficulty = 'medium';
          filters.maxIngredients = filters.maxIngredients || 12;
          break;
        case 'advanced':
          filters.difficulty = 'hard';
          filters.maxIngredients = filters.maxIngredients || 15;
          break;
      }
    }
    
    // Cooking time preference
    if (userData?.cookingTime) {
      switch (userData.cookingTime) {
        case 'quick':
          filters.maxCookingTime = 30;
          break;
        case 'medium':
          filters.maxCookingTime = 60;
          break;
        case 'relaxed':
          filters.maxCookingTime = 120;
          break;
      }
    }
    
    // Health goals filter
    if (userData?.healthGoals) {
      switch (userData.healthGoals) {
        case 'weight_loss':
          filters.maxCalories = 400;
          break;
        case 'maintenance':
          filters.maxCalories = 600;
          break;
        case 'muscle_gain':
          filters.maxCalories = 800;
          break;
      }
    }
    
    // Age-based preferences
    if (userData?.age) {
      const age = parseInt(userData.age);
      if (age < 25) {
        // Younger users might prefer quick, simple recipes
        filters.maxCookingTime = filters.maxCookingTime || 30;
        filters.maxIngredients = filters.maxIngredients || 8;
      } else if (age > 50) {
        // Older users might prefer healthier options
        filters.maxCalories = filters.maxCalories || 500;
      }
    }
    
    // Default filters if none set
    if (!filters.maxCookingTime) filters.maxCookingTime = 60;
    if (!filters.maxCalories) filters.maxCalories = 600;
    if (!filters.maxIngredients) filters.maxIngredients = 12;
    
    console.log('Applied filters based on user data:', filters);
    return filters;
  };

  // Helper function to assign colors to recipes based on meal type
  const getRecipeColor = (recipe, mealType) => {
    const colors = {
      breakfast: ['#FFE4E1', '#E6F3FF', '#F0FFF0'], // Light pink, blue, green
      lunch: ['#E8F5E8', '#FFF8DC', '#F5F5DC'], // Light green, yellow, beige
      dinner: ['#F0E6FF', '#FFE6E6', '#E0F7FA'], // Light purple, red, cyan
      snack: ['#F5F5DC', '#E0F7FA', '#FFF3E0'] // Light beige, cyan, orange
    };
    
    const colorSet = colors[mealType] || colors.breakfast;
    const index = recipe ? recipe.name.length % colorSet.length : 0;
    return colorSet[index];
  };

  const generateCookingSchedule = (userData) => {
    // Default to Saturday and Wednesday as cooking days, but allow user preference
    const cookingDays = userData.cookingDays || ['saturday', 'wednesday'];
    
    return cookingDays.map(day => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      tasks: getCookingTasksForDay(day)
    }));
  };

  const getCookingTasksForDay = (day) => {
    const dayTasks = {
      saturday: [
        "Prep overnight oats for Sunday and Monday",
        "Cook chicken for Saturday and Sunday lunches",
        "Prepare quinoa for Saturday and Sunday lunches",
        "Cook Saturday dinner (Grilled Chicken)",
        "Prep vegetables for the week"
      ],
      sunday: [
        "Cook pasta for Sunday and Monday dinners",
        "Prep vegetables for Sunday and Monday",
        "Make tomato sauce for pasta dishes"
      ],
      monday: [
        "Cook chicken for Monday and Tuesday lunches",
        "Prepare quinoa for Monday and Tuesday lunches",
        "Cook Monday dinner (Pasta with Tomato Sauce)"
      ],
      tuesday: [
        "Prep vegetables for Tuesday and Wednesday",
        "Cook Tuesday dinner (Salmon with Rice)"
      ],
      wednesday: [
        "Cook chicken for Wednesday and Thursday lunches",
        "Prepare quinoa for Wednesday and Thursday",
        "Cook Wednesday dinner (Grilled Chicken)",
        "Prep vegetables for Thursday and Friday"
      ],
      thursday: [
        "Cook pasta for Thursday and Friday dinners",
        "Prep vegetables for Thursday and Friday",
        "Cook Thursday dinner (Pasta with Tomato Sauce)"
      ],
      friday: [
        "Cook chicken for Friday and weekend lunches",
        "Prep vegetables for weekend",
        "Cook Friday dinner (Salmon with Rice)"
      ]
    };

    return dayTasks[day] || ["Prepare meals for the week"];
  };

  const generateShoppingList = (userData, mealPlan) => {
    // Get all recipes from the meal plan
    const allRecipes = [
      ...mealPlan.meals.breakfasts,
      ...mealPlan.meals.lunches,
      ...mealPlan.meals.dinners,
      ...mealPlan.meals.snacks
    ];

    // Extract, normalize, and parse ingredients
    const parsedIngredients = allRecipes.flatMap(recipe => 
      recipe.ingredients ? recipe.ingredients.map(ingredient => parseIngredient(ingredient)) : []
    );

    // Aggregate duplicate ingredients by name + unit
    const aggregateMap = new Map();
    parsedIngredients.forEach(({ name, quantityValue, unit }) => {
      const key = `${name}|${unit || ''}`;
      const existing = aggregateMap.get(key);
      if (existing) {
        if (typeof quantityValue === 'number') {
          existing.quantityValue += quantityValue;
        } else {
          existing.count += 1;
        }
      } else {
        aggregateMap.set(key, {
          name,
          unit,
          quantityValue: typeof quantityValue === 'number' ? quantityValue : 0,
          count: typeof quantityValue === 'number' ? 1 : 1
        });
      }
    });

    // Convert aggregates back to list items
    const aggregatedList = Array.from(aggregateMap.values()).map(entry => ({
      item: entry.name,
      quantity: formatQuantity(entry.quantityValue, entry.count, entry.unit),
      checked: false
    }));

    // Group ingredients by category
    const categorizedIngredients = categorizeIngredients(aggregatedList);

    return {
      categories: categorizedIngredients
    };
  };

  // Parse ingredient into normalized name and numeric quantity if present
  const parseIngredient = (ingredient) => {
    const raw = String(ingredient).trim();
    const quantityRegex = /(\d+(?:\.\d+)?)\s*(g|kg|ml|l|tbsp|tsp|pieces?|slices?|bunches?|cans?)/i;
    const match = raw.match(quantityRegex);
    let quantityValue = null;
    let unit = '';
    let name = raw;
    if (match) {
      quantityValue = parseFloat(match[1]);
      unit = match[2].toLowerCase();
      name = raw.replace(quantityRegex, '').trim();
    }
    name = normalizeIngredientName(name);
    return { name, quantityValue: quantityValue ?? 1, unit };
  };

  const normalizeIngredientName = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[,.;:()-]/g, '')
      .trim();
  };

  const formatQuantity = (quantityValue, count, unit) => {
    if (quantityValue && unit) {
      return `${quantityValue}${unit}`;
    }
    // Fallback to count of occurrences as portions
    return `${count} portion${count > 1 ? 's' : ''}`;
  };

  // Helper function to categorize ingredients
  const categorizeIngredients = (ingredients) => {
    const categories = {
      "Proteins": [],
      "Grains": [],
      "Fruits & Vegetables": [],
      "Dairy": [],
      "Pantry": []
    };

    const categoryKeywords = {
      "Proteins": ['chicken', 'beef', 'pork', 'lamb', 'fish', 'salmon', 'tuna', 'eggs', 'tofu', 'beans', 'lentils', 'meat'],
      "Grains": ['bread', 'pasta', 'rice', 'quinoa', 'oats', 'flour', 'cereal', 'granola', 'wheat', 'barley'],
      "Fruits & Vegetables": ['apple', 'banana', 'berry', 'orange', 'tomato', 'lettuce', 'carrot', 'onion', 'garlic', 'pepper', 'cucumber', 'spinach', 'kale', 'broccoli', 'cauliflower', 'potato', 'sweet potato', 'avocado', 'lemon', 'lime', 'herb', 'basil', 'parsley', 'cilantro'],
      "Dairy": ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'sour cream', 'cream cheese'],
      "Pantry": ['oil', 'salt', 'pepper', 'sugar', 'honey', 'vinegar', 'sauce', 'spice', 'seasoning', 'stock', 'broth', 'nut', 'seed', 'peanut butter', 'jam', 'preserve']
    };

    ingredients.forEach(ingredient => {
      const itemName = ingredient.item.toLowerCase();
      let categorized = false;

      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => itemName.includes(keyword))) {
          categories[category].push(ingredient);
          categorized = true;
          break;
        }
      }

      // If not categorized, put in Pantry
      if (!categorized) {
        categories["Pantry"].push(ingredient);
      }
    });

    return categories;
  };

  const createShoppingList = (mealPlan) => {
    // This is already handled in generateShoppingList
    return mealPlan.shoppingList;
  };

  const getMealForDay = (dayName, mealType) => {
    if (!mealPlan || !mealPlan.meals) return null;
    const meals = mealPlan.meals[mealType];
    if (!meals) return null;
    return meals.find(meal => meal.day === dayName);
  };

  const handlePrintPlan = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Meal Plan - ${userData?.name || 'Your'} Weekly Plan</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .print-header { text-align: center; margin-bottom: 30px; }
            .print-header h1 { color: #333; margin: 0 0 10px 0; }
            .print-header p { color: #666; margin: 0; }
            .meal-grid { display: grid; grid-template-columns: 200px repeat(7, 1fr); gap: 10px; margin-bottom: 30px; }
            .day-header { background: #f5f5f5; padding: 10px; text-align: center; border-radius: 5px; }
            .day-header h3 { margin: 0; font-size: 14px; }
            .day-header p { margin: 5px 0 0 0; font-size: 12px; color: #666; }
            .meal-slot { padding: 10px; border-radius: 5px; margin: 5px; }
            .meal-slot h4 { margin: 0 0 5px 0; font-size: 12px; }
            .meal-slot p { margin: 0; font-size: 10px; color: #666; }
            .meal-type-label { background: #f0f0f0; padding: 10px; text-align: center; font-weight: bold; }
            .cooking-schedule { margin-top: 30px; }
            .cooking-schedule h3 { color: #333; margin-bottom: 15px; }
            .schedule-day { margin-bottom: 15px; }
            .schedule-day h4 { color: #333; margin: 0 0 5px 0; }
            .schedule-day ul { margin: 0; padding-left: 20px; }
            .schedule-day li { margin-bottom: 3px; }
            @media print { body { transform: rotate(90deg); transform-origin: left top; width: 100vh; height: 100vw; } }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>${userData?.name || 'Your'} Weekly Meal Plan</h1>
            <p>Simple, nutritious meals with minimal cooking time</p>
          </div>
          
          <div class="meal-grid">
            <div class="meal-type-label">Day</div>
            ${mealPlan.week.map(day => `
              <div class="day-header">
                <h3>${day.name}</h3>
                <p>${day.date}</p>
              </div>
            `).join('')}
            
            ${['breakfasts', 'lunches', 'dinners', 'snacks'].map(mealType => {
              const mealTypeLabels = {
                'breakfasts': 'Breakfast',
                'lunches': 'Lunch', 
                'dinners': 'Dinner',
                'snacks': 'Snack'
              };
              
              return `
                <div class="meal-type-label">${mealTypeLabels[mealType]}</div>
                ${mealPlan.week.map(day => {
                  const meal = getMealForDay(day.name, mealType);
                  return `
                    <div class="meal-slot" style="background-color: ${meal?.color || '#f9f9f9'}">
                      <h4>${meal?.name || 'No meal planned'}</h4>
                      <p>${meal?.description || ''}</p>
                    </div>
                  `;
                }).join('')}
              `;
            }).join('')}
          </div>
          
          <div class="cooking-schedule">
            <h3>Cooking Schedule</h3>
            ${mealPlan.cookingSchedule.map(day => `
              <div class="schedule-day">
                <h4>${day.day}</h4>
                <ul>
                  ${day.tasks.map(task => `<li>${task}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleEmailPlan = () => {
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
    }, 3000);
  };

  const handleMealClick = (meal) => {
    if (meal) {
      setSelectedRecipe(meal);
      setShowRecipeModal(true);
    }
  };

  const closeRecipeModal = () => {
    setShowRecipeModal(false);
    setSelectedRecipe(null);
  };

  const handleEnableNotifications = async () => {
    const hasPermission = await notificationService.requestPermission();
    if (hasPermission) {
      setNotificationEnabled(true);
      // Schedule meal reminders
      notificationService.scheduleMealReminder('08:00', 'Time for breakfast! 🍳');
      notificationService.scheduleMealReminder('12:00', 'Lunch time! 🥗');
      notificationService.scheduleMealReminder('18:00', 'Dinner time! 🍽️');
    }
  };

  const handleTestNotification = () => {
    notificationService.sendNotification('Meal Planner', {
      body: 'This is a test notification from your meal planner!',
      tag: 'test-notification'
    });
  };

  // Swipe handling functions
  const handleDaySwipe = (direction) => {
    if (!dayScrollRef.current) return;
    const container = dayScrollRef.current;
    const scrollAmount = 120; // Width of each day card
    const currentScroll = container.scrollLeft;
    const newScroll = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, currentScroll + scrollAmount);
    
    container.scrollTo({ left: newScroll, behavior: 'smooth' });
  };


  const scrollToDay = (dayIndex) => {
    if (!dayScrollRef.current) return;
    const container = dayScrollRef.current;
    const scrollAmount = 120;
    container.scrollTo({ left: dayIndex * scrollAmount, behavior: 'smooth' });
    setSelectedDay(dayIndex);
  };

  const handleMealSwipe = (mealType, direction) => {
    const currentIndex = currentMealIndex[mealType];
    const maxIndex = mealOptions[mealType].length - 1;
    
    if (direction === 'left') {
      // Swipe left - dislike, move to next
      const nextIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
      setCurrentMealIndex(prev => ({
        ...prev,
        [mealType]: nextIndex
      }));
    } else if (direction === 'right') {
      // Swipe right - like, move to next
      const nextIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
      setCurrentMealIndex(prev => ({
        ...prev,
        [mealType]: nextIndex
      }));
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setSwipeStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
    setCardTransform({ x: 0, y: 0, rotation: 0 });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeStart.x;
    const deltaY = touch.clientY - swipeStart.y;
    
    // Calculate rotation based on horizontal movement
    const rotation = deltaX * 0.1;
    
    setCardTransform({ x: deltaX, y: deltaY, rotation });
    setSwipeEnd({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (mealType) => {
    if (!isDragging) return;
    
    const deltaX = swipeEnd.x - swipeStart.x;
    const threshold = 100; // Minimum swipe distance
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // Swipe right - like
        handleMealSwipe(mealType, 'right');
      } else {
        // Swipe left - dislike
        handleMealSwipe(mealType, 'left');
      }
    }
    
    // Reset states
    setIsDragging(false);
    setCardTransform({ x: 0, y: 0, rotation: 0 });
    setSwipeStart({ x: 0, y: 0 });
    setSwipeEnd({ x: 0, y: 0 });
  };

  const getMealBackgroundImage = (meal, mealType) => {
    // Try different image property names
    const imageUrl = meal?.image || meal?.img || meal?.photo || meal?.picture;
    
    if (imageUrl) {
      return `url(${imageUrl})`;
    }
    
    // Fallback images based on meal type
    const fallbackImages = {
      breakfasts: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=600&fit=crop&crop=center',
      lunches: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop&crop=center',
      dinners: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=600&fit=crop&crop=center',
      snacks: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=600&fit=crop&crop=center'
    };
    
    return `url(${fallbackImages[mealType]})`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Generating your personalized meal plan...</p>
        </div>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="container">
        <div className="no-meal-plan">
          <h2>No Meal Plan Available</h2>
          <p>Please complete the questionnaire to generate your meal plan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="meal-plan-mobile">

        {/* Swipeable Days Header */}
        <div className="days-swiper">
          <div className="days-scroll-container" ref={dayScrollRef}>
            {mealPlan.week.map((day, index) => (
              <div 
                key={index} 
                className={`day-card ${selectedDay === index ? 'active' : ''}`}
                onClick={() => scrollToDay(index)}
              >
                <h3>{day.name}</h3>
                <p>{day.date}</p>
              </div>
            ))}
          </div>
          <button className="swipe-btn left" onClick={() => handleDaySwipe('left')}>‹</button>
          <button className="swipe-btn right" onClick={() => handleDaySwipe('right')}>›</button>
        </div>

        {/* Individual Meal Swipers */}
        <div className="meal-swipers-container">
          {['breakfasts', 'lunches', 'dinners', 'snacks'].map((mealType) => {
            const mealTypeLabels = {
              'breakfasts': 'Breakfast',
              'lunches': 'Lunch', 
              'dinners': 'Dinner',
              'snacks': 'Snack'
            };
            
            const currentIndex = currentMealIndex[mealType];
            const currentMeal = mealOptions[mealType][currentIndex];
            const totalMeals = mealOptions[mealType].length;
            const progress = totalMeals > 0 ? ((currentIndex + 1) / totalMeals) * 100 : 0;
            
            // Debug: Log the current meal to see what properties it has
            console.log('Current meal:', currentMeal);
            console.log('Meal options length:', totalMeals);
            
            return (
              <div key={mealType} className="meal-swiper-section">
                <div className="meal-type-header">
                  <h3>{mealTypeLabels[mealType]}</h3>
                  <div className="meal-progress">
                    <span>{currentIndex + 1} / {totalMeals}</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="meal-card-swiper">
                  <div 
                    className={`meal-card-tinder meal-card-${mealType}`}
                    style={{ 
                      backgroundImage: getMealBackgroundImage(currentMeal, mealType),
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      transform: `translate(${cardTransform.x}px, ${cardTransform.y}px) rotate(${cardTransform.rotation}deg)`,
                      transition: isDragging ? 'none' : 'transform 0.3s ease'
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={() => handleTouchEnd(mealType)}
                    onClick={() => !isDragging && handleMealClick(currentMeal)}
                  >
                    <div className="swipe-hint">
                      <div className="swipe-left-hint">👈 Dislike</div>
                      <div className="swipe-right-hint">Like 👉</div>
                    </div>
                    <h4 title={currentMeal?.name}>{currentMeal?.name}</h4>
                    <p className="meal-description">{currentMeal?.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add to Shopping List Button */}
        <div className="add-to-shopping-container">
          <button 
            className="add-to-shopping-btn"
            onClick={() => onScreenChange('shopping-list')}
          >
            🛒 Add to Shopping List
          </button>
        </div>

      {/* Recipe Modal */}
      {showRecipeModal && selectedRecipe && (
        <div className="modal-overlay" onClick={closeRecipeModal}>
          <div className="modal-content recipe-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedRecipe.name}</h2>
              <button className="modal-close" onClick={closeRecipeModal}>×</button>
            </div>
            <div className="recipe-description">
              <p>{selectedRecipe.description}</p>
            </div>
            <div className="recipe-details">
              <div className="recipe-section">
                <h3>Ingredients</h3>
                <ul className="ingredients-list">
                  {selectedRecipe.ingredients?.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  )) || (
                    <li>No ingredients listed</li>
                  )}
                </ul>
              </div>
              <div className="recipe-section">
                <h3>Method</h3>
                <ol className="method-list">
                  {selectedRecipe.method?.map((step, index) => (
                    <li key={index}>{step}</li>
                  )) || (
                    <li>No method listed</li>
                  )}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanScreen; 