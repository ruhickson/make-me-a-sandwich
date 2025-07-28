import React, { useState, useEffect } from 'react';
import { useMealPlanner } from '../context/MealPlannerContext';

const RecipeDatabase = () => {
  const { setMealPlan } = useMealPlanner();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      // Try to load from local data file
      const response = await fetch('/data/bbc-good-food-recipes.json');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes || []);
        console.log(`Loaded ${data.recipes?.length || 0} recipes from database`);
      } else {
        console.log('No recipe database found. Run the scraper first.');
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesFilter = recipe.name.toLowerCase().includes(filter.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = category === 'all' || recipe.category === category;
    return matchesFilter && matchesCategory;
  });

  const categories = ['all', ...new Set(recipes.map(r => r.category))];

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipes(prev => {
      const isSelected = prev.find(r => r.name === recipe.name);
      if (isSelected) {
        return prev.filter(r => r.name !== recipe.name);
      } else {
        return [...prev, recipe];
      }
    });
  };

  const generateMealPlan = () => {
    if (selectedRecipes.length === 0) {
      alert('Please select some recipes first!');
      return;
    }

    // Group recipes by category
    const breakfasts = selectedRecipes.filter(r => r.category === 'breakfast').slice(0, 7);
    const lunches = selectedRecipes.filter(r => r.category === 'lunch').slice(0, 7);
    const dinners = selectedRecipes.filter(r => r.category === 'dinner').slice(0, 7);
    const snacks = selectedRecipes.filter(r => r.category === 'snack').slice(0, 14);

    // Fill remaining slots with any category
    const remainingRecipes = selectedRecipes.filter(r => 
      !breakfasts.includes(r) && !lunches.includes(r) && !dinners.includes(r) && !snacks.includes(r)
    );

    const mealPlan = {
      week: getCurrentWeek(),
      meals: {
        breakfasts: [...breakfasts, ...remainingRecipes.slice(0, 7 - breakfasts.length)],
        lunches: [...lunches, ...remainingRecipes.slice(7 - breakfasts.length, 14 - breakfasts.length - lunches.length)],
        dinners: [...dinners, ...remainingRecipes.slice(14 - breakfasts.length - lunches.length, 21 - breakfasts.length - lunches.length - dinners.length)],
        snacks: [...snacks, ...remainingRecipes.slice(21 - breakfasts.length - lunches.length - dinners.length, 35 - breakfasts.length - lunches.length - dinners.length)]
      },
      cookingSchedule: generateCookingSchedule(),
      shoppingList: generateShoppingList()
    };

    setMealPlan(mealPlan);
    alert('Meal plan generated! Check the Meal Plan tab.');
  };

  const getCurrentWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }));
    }
    
    return days;
  };

  const generateCookingSchedule = () => {
    return {
      monday: {
        meals: ['breakfast_1', 'breakfast_2', 'lunch_1', 'lunch_2', 'dinner_1', 'dinner_2', 'dinner_3'],
        prepTime: '2 hours',
        notes: 'Prepare breakfasts and lunches for the week, plus first few dinners'
      },
      thursday: {
        meals: ['breakfast_3', 'breakfast_4', 'lunch_3', 'lunch_4', 'dinner_4', 'dinner_5', 'dinner_6', 'dinner_7'],
        prepTime: '2.5 hours',
        notes: 'Complete remaining meals for the week'
      }
    };
  };

  const generateShoppingList = () => {
    const allIngredients = selectedRecipes.flatMap(recipe => recipe.ingredients);
    const uniqueIngredients = [...new Set(allIngredients)];
    
    return {
      categories: {
        'Proteins': uniqueIngredients.filter(i => i.toLowerCase().includes('chicken') || i.toLowerCase().includes('beef') || i.toLowerCase().includes('fish')),
        'Vegetables': uniqueIngredients.filter(i => i.toLowerCase().includes('lettuce') || i.toLowerCase().includes('tomato') || i.toLowerCase().includes('carrot')),
        'Fruits': uniqueIngredients.filter(i => i.toLowerCase().includes('apple') || i.toLowerCase().includes('banana') || i.toLowerCase().includes('berry')),
        'Grains': uniqueIngredients.filter(i => i.toLowerCase().includes('bread') || i.toLowerCase().includes('pasta') || i.toLowerCase().includes('rice')),
        'Dairy': uniqueIngredients.filter(i => i.toLowerCase().includes('cheese') || i.toLowerCase().includes('milk') || i.toLowerCase().includes('yogurt')),
        'Pantry': uniqueIngredients.filter(i => i.toLowerCase().includes('oil') || i.toLowerCase().includes('salt') || i.toLowerCase().includes('herb'))
      },
      totalItems: uniqueIngredients.length,
      estimatedCost: '£45-65'
    };
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Recipe Database</h2>
          <p>Loading recipes from BBC Good Food...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="recipe-database-container">
        <div className="database-header">
          <h1>📚 Recipe Database</h1>
          <p>Browse and select recipes from BBC Good Food</p>
        </div>

        <div className="database-controls">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search recipes..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filter">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)} ({recipes.filter(r => cat === 'all' || r.category === cat).length})
                </option>
              ))}
            </select>
          </div>

          <div className="selection-info">
            <span>{selectedRecipes.length} recipes selected</span>
            <button 
              className="btn btn-primary"
              onClick={generateMealPlan}
              disabled={selectedRecipes.length === 0}
            >
              Generate Meal Plan
            </button>
          </div>
        </div>

        {recipes.length === 0 ? (
          <div className="no-recipes">
            <h3>No Recipes Found</h3>
            <p>No recipe database found. To get started:</p>
            <ol>
              <li>Run the recipe scraper: <code>npm run scrape-recipes</code></li>
              <li>Wait for the scraping to complete</li>
              <li>Refresh this page</li>
            </ol>
            <button className="btn btn-secondary" onClick={loadRecipes}>
              Reload Recipes
            </button>
          </div>
        ) : (
          <div className="recipes-grid">
            {filteredRecipes.map((recipe, index) => (
              <div 
                key={index} 
                className={`recipe-card ${selectedRecipes.find(r => r.name === recipe.name) ? 'selected' : ''}`}
                onClick={() => handleRecipeSelect(recipe)}
              >
                <div className="recipe-image">
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.name} />
                  ) : (
                    <div className="placeholder-image">
                      🍽️
                    </div>
                  )}
                </div>
                
                <div className="recipe-content">
                  <h3>{recipe.name}</h3>
                  <p className="recipe-description">{recipe.description}</p>
                  
                  <div className="recipe-meta">
                    <span className="category">{recipe.category}</span>
                    <span className="prep-time">{recipe.prepTime}</span>
                    <span className="cook-time">{recipe.cookTime}</span>
                    <span className="difficulty">{recipe.difficulty}</span>
                  </div>
                  
                  <div className="recipe-ingredients">
                    <strong>Ingredients:</strong>
                    <ul>
                      {recipe.ingredients.slice(0, 3).map((ingredient, i) => (
                        <li key={i}>{ingredient}</li>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <li>...and {recipe.ingredients.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                </div>
                
                <div className="recipe-actions">
                  <button className="btn-icon">👁️</button>
                  <button className="btn-icon">⭐</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredRecipes.length === 0 && recipes.length > 0 && (
          <div className="no-results">
            <h3>No Recipes Match Your Search</h3>
            <p>Try adjusting your search terms or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDatabase; 