import React, { useState, useEffect } from 'react';
// import { useMealPlanner } from '../context/MealPlannerContext';
import recipeService from '../utils/recipeService';

const RecipeDatabase = () => {
  // Temporary: Use localStorage instead of context
  const setMealPlan = (plan) => {
    localStorage.setItem('tempMealPlan', JSON.stringify(plan));
  };
  
  // const { setMealPlan } = useMealPlanner();
  const [recipes, setRecipes] = useState([]);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [advancedFilters, setAdvancedFilters] = useState({
    dietary: '',
    maxCookingTime: '',
    difficulty: '',
    maxCalories: '',
    maxIngredients: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      // Load all recipes from BBC Good Food datasets
      await recipeService.loadAllRecipes();
      const allRecipes = recipeService.getAllRecipes();
      setRecipes(allRecipes);
      setFeaturedRecipes(pickRandomUnique(allRecipes, 10));
      console.log(`Loaded ${allRecipes.length} recipes from BBC Good Food database`);
    } catch (error) {
      console.error('Error loading recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const pickRandomUnique = (arr, count) => {
    if (!arr || arr.length === 0) return [];
    const max = Math.min(count, arr.length);
    const chosen = new Set();
    while (chosen.size < max) {
      const idx = Math.floor(Math.random() * arr.length);
      chosen.add(idx);
    }
    return Array.from(chosen).map(i => arr[i]);
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesFilter = recipe.name.toLowerCase().includes(filter.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = category === 'all' || getRecipeCategory(recipe) === category;
    
    // Apply advanced filters
    const matchesAdvancedFilters = applyAdvancedFilters(recipe, advancedFilters);
    
    return matchesFilter && matchesCategory && matchesAdvancedFilters;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, category, advancedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / pageSize));
  const paginatedRecipes = filteredRecipes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function applyAdvancedFilters(recipe, filters) {
    // Dietary restrictions
    if (filters.dietary) {
      const text = `${recipe.name} ${recipe.description} ${recipe.ingredients.join(' ')}`.toLowerCase();
      
      switch (filters.dietary) {
        case 'vegetarian':
          if (text.includes('chicken') || text.includes('beef') || text.includes('pork') || 
              text.includes('lamb') || text.includes('fish') || text.includes('meat')) {
            return false;
          }
          break;
        case 'vegan':
          if (text.includes('chicken') || text.includes('beef') || text.includes('pork') || 
              text.includes('lamb') || text.includes('fish') || text.includes('meat') ||
              text.includes('milk') || text.includes('cheese') || text.includes('yogurt') ||
              text.includes('eggs') || text.includes('butter') || text.includes('cream')) {
            return false;
          }
          break;
        case 'gluten-free':
          if (text.includes('bread') || text.includes('pasta') || text.includes('flour') ||
              text.includes('wheat') || text.includes('barley') || text.includes('rye')) {
            return false;
          }
          break;
        case 'dairy-free':
          if (text.includes('milk') || text.includes('cheese') || text.includes('yogurt') ||
              text.includes('butter') || text.includes('cream')) {
            return false;
          }
          break;
      }
    }

    // Cooking time filter
    if (filters.maxCookingTime) {
      const totalTime = getTotalCookingTime(recipe);
      if (totalTime > filters.maxCookingTime) {
        return false;
      }
    }

    // Difficulty filter
    if (filters.difficulty) {
      const difficulty = recipe.difficult?.toLowerCase() || 'medium';
      switch (filters.difficulty) {
        case 'easy':
          if (difficulty !== 'easy') return false;
          break;
        case 'medium':
          if (difficulty !== 'easy' && difficulty !== 'medium') return false;
          break;
      }
    }

    // Calorie filter
    if (filters.maxCalories) {
      const calories = parseInt(recipe.nutrients?.kcal) || 500;
      if (calories > filters.maxCalories) {
        return false;
      }
    }

    // Ingredient count filter
    if (filters.maxIngredients) {
      if (recipe.ingredients?.length > filters.maxIngredients) {
        return false;
      }
    }

    return true;
  };

  const getTotalCookingTime = (recipe) => {
    const prepTime = parseTime(recipe.times?.Preparation || '0 mins');
    const cookTime = parseTime(recipe.times?.Cooking || '0 mins');
    return prepTime + cookTime;
  };

  const parseTime = (timeString) => {
    if (!timeString) return 0;
    
    const timeMatch = timeString.match(/(\d+)\s*(mins?|hours?|hrs?)/i);
    if (timeMatch) {
      const value = parseInt(timeMatch[1]);
      const unit = timeMatch[2].toLowerCase();
      
      if (unit.includes('hour') || unit.includes('hr')) {
        return value * 60; // Convert to minutes
      }
      return value;
    }
    return 0;
  };

  // Get categories from recipe datasets
  const categories = ['all', 'general', 'baking', 'budget', 'health', 'inspiration'];

  // Helper function to determine recipe category
  const getRecipeCategory = (recipe) => {
    // Check which dataset the recipe belongs to
    if (recipeService.getRecipesByCategory('baking').find(r => r.id === recipe.id)) return 'baking';
    if (recipeService.getRecipesByCategory('budget').find(r => r.id === recipe.id)) return 'budget';
    if (recipeService.getRecipesByCategory('health').find(r => r.id === recipe.id)) return 'health';
    if (recipeService.getRecipesByCategory('inspiration').find(r => r.id === recipe.id)) return 'inspiration';
    return 'general';
  };

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
          <p><strong>Over 60,000 recipes available.</strong></p>
        </div>

        {/* Search and Filters at the Top */}
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
                  {cat.charAt(0).toUpperCase() + cat.slice(1)} ({recipes.filter(r => cat === 'all' || getRecipeCategory(r) === cat).length})
                </option>
              ))}
            </select>
          </div>

          <div className="advanced-filters-toggle">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
            </button>
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="advanced-filters">
            <div className="filter-row">
              <div className="filter-group">
                <label>Dietary Restrictions:</label>
                <select
                  value={advancedFilters.dietary}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, dietary: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="dairy-free">Dairy-Free</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Max Cooking Time:</label>
                <select
                  value={advancedFilters.maxCookingTime}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, maxCookingTime: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Difficulty:</label>
                <select
                  value={advancedFilters.difficulty}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, difficulty: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Max Calories:</label>
                <select
                  value={advancedFilters.maxCalories}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, maxCalories: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="300">300 kcal</option>
                  <option value="400">400 kcal</option>
                  <option value="500">500 kcal</option>
                  <option value="600">600 kcal</option>
                  <option value="800">800 kcal</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Max Ingredients:</label>
                <select
                  value={advancedFilters.maxIngredients}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, maxIngredients: e.target.value})}
                >
                  <option value="">Any</option>
                  <option value="5">5 ingredients</option>
                  <option value="8">8 ingredients</option>
                  <option value="10">10 ingredients</option>
                  <option value="12">12 ingredients</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {featuredRecipes.length > 0 && (
          <div className="featured-section">
            <h3>Featured Recipes</h3>
            <div className="recipes-featured-grid">
              {featuredRecipes.map((recipe, index) => (
                <div 
                  key={`featured-${index}`}
                  className="recipe-card"
                >
                  <div className="recipe-image">
                    {recipe.image ? (
                      <img src={recipe.image} alt={recipe.name} />
                    ) : (
                      <div className="placeholder-image">🍽️</div>
                    )}
                  </div>
                  <div className="recipe-content">
                    <h3>{recipe.name}</h3>
                    <p className="recipe-description">{recipe.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



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
          <>
          <div className="recipes-grid">
            {paginatedRecipes.map((recipe, index) => (
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

          {filteredRecipes.length > pageSize && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="page-info">Page {currentPage} of {totalPages}</span>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
          </>
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