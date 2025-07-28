import React, { useState, useEffect } from 'react';
import { useMealPlanner } from '../../context/MealPlannerContext';

const MealPlanScreen = ({ onViewShopping }) => {
  const { userData, setMealPlan, setShoppingList } = useMealPlanner();
  const [mealPlan, setLocalMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      generateMealPlan();
    }
  }, [userData]);

  const generateMealPlan = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const plan = createPersonalizedMealPlan(userData);
      setLocalMealPlan(plan);
      setMealPlan(plan);
      setLoading(false);
    }, 2000);
  };

  const createPersonalizedMealPlan = (userData) => {
    const plan = {
      week: getCurrentWeek(),
      userData: userData,
      meals: {
        breakfasts: generateBreakfasts(userData),
        lunches: generateLunches(userData),
        dinners: generateDinners(userData),
        snacks: generateSnacks(userData)
      },
      cookingSchedule: generateCookingSchedule(userData),
      shoppingList: generateShoppingList(userData)
    };

    // Generate shopping list
    const shoppingList = createShoppingList(plan);
    setShoppingList(shoppingList);

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

  // Core recipe database - expanded set with 3 options each
  const coreRecipes = {
    breakfasts: [
      {
        name: "Overnight Oats",
        description: "Simple overnight oats with berries",
        color: "#FFE4E1" // Light pink
      },
      {
        name: "Greek Yogurt Bowl",
        description: "Protein-rich yogurt with granola",
        color: "#E6F3FF" // Light blue
      },
      {
        name: "Avocado Toast",
        description: "Whole grain toast with avocado and eggs",
        color: "#F0FFF0" // Light green
      }
    ],
    lunches: [
      {
        name: "Chicken Salad",
        description: "Simple chicken salad with vegetables",
        color: "#E8F5E8" // Light green
      },
      {
        name: "Quinoa Bowl",
        description: "Nutritious quinoa with vegetables",
        color: "#FFF8DC" // Light yellow
      },
      {
        name: "Tuna Sandwich",
        description: "Whole grain bread with tuna and vegetables",
        color: "#F5F5DC" // Light beige
      }
    ],
    dinners: [
      {
        name: "Grilled Chicken with Vegetables",
        description: "Simple grilled chicken with roasted vegetables",
        color: "#F0E6FF" // Light purple
      },
      {
        name: "Pasta with Tomato Sauce",
        description: "Classic pasta with simple tomato sauce",
        color: "#FFE6E6" // Light red
      },
      {
        name: "Salmon with Rice",
        description: "Baked salmon with brown rice and vegetables",
        color: "#E0F7FA" // Light cyan
      }
    ],
    snacks: [
      {
        name: "Apple with Peanut Butter",
        description: "Simple apple slices with peanut butter",
        color: "#F5F5DC" // Light beige
      },
      {
        name: "Greek Yogurt with Berries",
        description: "Protein-rich yogurt with fresh berries",
        color: "#E0F7FA" // Light cyan
      },
      {
        name: "Mixed Nuts",
        description: "Healthy mix of almonds, walnuts, and cashews",
        color: "#FFF3E0" // Light orange
      }
    ]
  };

  const generateBreakfasts = (userData) => {
    // Use 3 different breakfast recipes, rotating throughout the week
    const { breakfasts } = coreRecipes;
    return [
      { ...breakfasts[0], day: "Saturday" },
      { ...breakfasts[1], day: "Sunday" },
      { ...breakfasts[2], day: "Monday" },
      { ...breakfasts[0], day: "Tuesday" },
      { ...breakfasts[1], day: "Wednesday" },
      { ...breakfasts[2], day: "Thursday" },
      { ...breakfasts[0], day: "Friday" }
    ];
  };

  const generateLunches = (userData) => {
    // Use 3 different lunch recipes, rotating throughout the week
    const { lunches } = coreRecipes;
    return [
      { ...lunches[0], day: "Saturday" },
      { ...lunches[1], day: "Sunday" },
      { ...lunches[2], day: "Monday" },
      { ...lunches[0], day: "Tuesday" },
      { ...lunches[1], day: "Wednesday" },
      { ...lunches[2], day: "Thursday" },
      { ...lunches[0], day: "Friday" }
    ];
  };

  const generateDinners = (userData) => {
    // Use 3 different dinner recipes, rotating throughout the week
    const { dinners } = coreRecipes;
    return [
      { ...dinners[0], day: "Saturday" },
      { ...dinners[1], day: "Sunday" },
      { ...dinners[2], day: "Monday" },
      { ...dinners[0], day: "Tuesday" },
      { ...dinners[1], day: "Wednesday" },
      { ...dinners[2], day: "Thursday" },
      { ...dinners[0], day: "Friday" }
    ];
  };

  const generateSnacks = (userData) => {
    // Use 3 different snack recipes, rotating throughout the week
    const { snacks } = coreRecipes;
    return [
      { ...snacks[0], day: "Saturday" },
      { ...snacks[1], day: "Sunday" },
      { ...snacks[2], day: "Monday" },
      { ...snacks[0], day: "Tuesday" },
      { ...snacks[1], day: "Wednesday" },
      { ...snacks[2], day: "Thursday" },
      { ...snacks[0], day: "Friday" }
    ];
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

  const generateShoppingList = (userData) => {
    return {
      categories: {
        "Proteins": [
          { item: "chicken breast", quantity: "1.5kg", checked: false },
          { item: "greek yogurt", quantity: "1kg", checked: false }
        ],
        "Grains": [
          { item: "oats", quantity: "500g", checked: false },
          { item: "quinoa", quantity: "500g", checked: false },
          { item: "pasta", quantity: "500g", checked: false },
          { item: "granola", quantity: "300g", checked: false }
        ],
        "Fruits & Vegetables": [
          { item: "berries", quantity: "500g", checked: false },
          { item: "apples", quantity: "7 pieces", checked: false },
          { item: "tomatoes", quantity: "1kg", checked: false },
          { item: "vegetables", quantity: "2kg", checked: false }
        ],
        "Pantry": [
          { item: "milk", quantity: "2 liters", checked: false },
          { item: "olive oil", quantity: "250ml", checked: false },
          { item: "honey", quantity: "200ml", checked: false },
          { item: "peanut butter", quantity: "300g", checked: false },
          { item: "herbs", quantity: "2 bunches", checked: false }
        ]
      }
    };
  };

  const createShoppingList = (mealPlan) => {
    // This is already handled in generateShoppingList
    return mealPlan.shoppingList;
  };

  const getMealForDay = (dayName, mealType) => {
    const meals = mealPlan.meals[mealType];
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
    <div className="container">
      <div className="meal-plan-container">
        <div className="meal-plan-header">
          <h2>Your Weekly Meal Plan</h2>
          <p>Simple, nutritious meals with minimal cooking time</p>
        </div>

        <div className="weekly-calendar">
          <div className="calendar-header">
            <div className="calendar-header-content">
              <div className="days-header">
                <div className="meal-plan-title-card">
                  <h3>{userData?.name || 'Your'} Meal Plan</h3>
                </div>
                {mealPlan.week.map((day, index) => (
                  <div key={index} className="day-header-cell">
                    <h3>{day.name}</h3>
                    <p>{day.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="calendar-content">
            {['breakfasts', 'lunches', 'dinners', 'snacks'].map((mealType, mealIndex) => {
              // Proper mapping for meal type labels
              const mealTypeLabels = {
                'breakfasts': 'Breakfast',
                'lunches': 'Lunch', 
                'dinners': 'Dinner',
                'snacks': 'Snack'
              };
              
              return (
                <div key={mealType} className="meal-row">
                  <div className="meal-type-label">
                    <div className={`meal-type ${mealType.slice(0, -1)}`}>
                      {mealTypeLabels[mealType]}
                    </div>
                  </div>
                  <div className="meal-slots">
                    {mealPlan.week.map((day, dayIndex) => {
                      const meal = getMealForDay(day.name, mealType);
                      return (
                        <div 
                          key={dayIndex}
                          className="meal-slot"
                          style={{ backgroundColor: meal?.color }}
                          onClick={() => handleMealClick(meal)}
                        >
                          <h4>{meal?.name}</h4>
                          <p>{meal?.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="meal-plan-actions">
          <button className="btn btn-primary" onClick={onViewShopping}>
            View Shopping List
          </button>
          <button className="btn btn-secondary" onClick={handlePrintPlan}>
            📄 Print Plan
          </button>
          <button 
            className={`btn btn-secondary ${emailSent ? 'btn-success' : ''}`}
            onClick={handleEmailPlan}
            disabled={emailSent}
          >
            {emailSent ? '✅ Email Sent' : '📧 Email Plan'}
          </button>
        </div>

        <div className="meal-plan-separator"></div>

        <div className="cooking-schedule">
          <h3>Cooking Schedule</h3>
          <p>Cook in batches on your selected days to save time and effort</p>
          <div className="schedule-grid">
            {mealPlan.cookingSchedule.map((day, index) => (
              <div key={index} className="schedule-day">
                <h4>{day.day}</h4>
                <ul>
                  {day.tasks.map((task, taskIndex) => (
                    <li key={taskIndex}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
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