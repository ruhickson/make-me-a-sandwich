class RecipeService {
  constructor() {
    this.recipes = {
      general: [],
      baking: [],
      budget: [],
      health: [],
      inspiration: []
    };
    this.loaded = false;
  }

  async loadAllRecipes() {
    if (this.loaded) return this.recipes;

    try {
      const [general, baking, budget, health, inspiration] = await Promise.all([
        fetch('/recipes.json').then(res => res.json()),
        fetch('/baking.json').then(res => res.json()),
        fetch('/budget.json').then(res => res.json()),
        fetch('/health.json').then(res => res.json()),
        fetch('/inspiration.json').then(res => res.json())
      ]);

      this.recipes = {
        general: general || [],
        baking: baking || [],
        budget: budget || [],
        health: health || [],
        inspiration: inspiration || []
      };

      this.loaded = true;
      console.log('Loaded recipes:', {
        general: this.recipes.general.length,
        baking: this.recipes.baking.length,
        budget: this.recipes.budget.length,
        health: this.recipes.health.length,
        inspiration: this.recipes.inspiration.length
      });

      return this.recipes;
    } catch (error) {
      console.error('Error loading recipes:', error);
      return this.recipes;
    }
  }

  getAllRecipes() {
    return [
      ...this.recipes.general,
      ...this.recipes.baking,
      ...this.recipes.budget,
      ...this.recipes.health,
      ...this.recipes.inspiration
    ];
  }

  getRecipesByCategory(category) {
    return this.recipes[category] || [];
  }

  getRandomRecipes(count = 1, category = null) {
    let recipes = category ? this.getRecipesByCategory(category) : this.getAllRecipes();
    
    if (recipes.length === 0) return [];
    
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  getRecipesByMealType(mealType, count = 3, filters = {}) {
    const allRecipes = this.getAllRecipes();
    console.log(`Getting ${mealType} recipes. Total recipes available:`, allRecipes.length);
    
    // Keywords to match recipes to meal types
    const mealKeywords = {
      breakfast: ['breakfast', 'morning', 'porridge', 'toast', 'eggs', 'pancake', 'waffle', 'cereal', 'yogurt'],
      lunch: ['lunch', 'sandwich', 'salad', 'soup', 'wrap', 'pasta', 'quinoa', 'bowl'],
      dinner: ['dinner', 'main', 'chicken', 'beef', 'fish', 'salmon', 'pasta', 'rice', 'curry', 'stew'],
      snack: ['snack', 'biscuit', 'cake', 'cookie', 'muffin', 'smoothie', 'trail mix', 'nuts']
    };

    const keywords = mealKeywords[mealType] || [];
    console.log(`Keywords for ${mealType}:`, keywords);
    
    // Filter recipes by keywords in name or description
    let matchingRecipes = allRecipes.filter(recipe => {
      const text = `${recipe.name} ${recipe.description}`.toLowerCase();
      return keywords.some(keyword => text.includes(keyword));
    });

    console.log(`Recipes matching keywords for ${mealType}:`, matchingRecipes.length);

    // Apply additional filters
    matchingRecipes = this.applyFilters(matchingRecipes, filters);
    console.log(`Recipes after applying filters for ${mealType}:`, matchingRecipes.length);

    // If not enough matching recipes, add some random ones
    if (matchingRecipes.length < count) {
      const randomRecipes = this.getRandomRecipes(count - matchingRecipes.length);
      console.log(`Adding ${randomRecipes.length} random recipes for ${mealType}`);
      return [...matchingRecipes, ...randomRecipes];
    }

    const result = this.getRandomRecipesFromArray(matchingRecipes, count);
    console.log(`Final ${mealType} recipes:`, result.length);
    return result;
  }

  applyFilters(recipes, filters) {
    let filteredRecipes = [...recipes];

    // Dietary restrictions
    if (filters.dietary) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const text = `${recipe.name} ${recipe.description} ${recipe.ingredients.join(' ')}`.toLowerCase();
        
        switch (filters.dietary) {
          case 'vegetarian':
            return !text.includes('chicken') && !text.includes('beef') && !text.includes('pork') && 
                   !text.includes('lamb') && !text.includes('fish') && !text.includes('meat');
          case 'vegan':
            return !text.includes('chicken') && !text.includes('beef') && !text.includes('pork') && 
                   !text.includes('lamb') && !text.includes('fish') && !text.includes('meat') &&
                   !text.includes('milk') && !text.includes('cheese') && !text.includes('yogurt') &&
                   !text.includes('eggs') && !text.includes('butter') && !text.includes('cream');
          case 'gluten-free':
            return !text.includes('bread') && !text.includes('pasta') && !text.includes('flour') &&
                   !text.includes('wheat') && !text.includes('barley') && !text.includes('rye');
          case 'dairy-free':
            return !text.includes('milk') && !text.includes('cheese') && !text.includes('yogurt') &&
                   !text.includes('butter') && !text.includes('cream');
          default:
            return true;
        }
      });
    }

    // Allergies filter
    if (filters.allergies && filters.allergies.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const text = `${recipe.name} ${recipe.description} ${recipe.ingredients.join(' ')}`.toLowerCase();
        return !filters.allergies.some(allergy => 
          text.includes(allergy.toLowerCase())
        );
      });
    }

    // Cooking equipment filter
    if (filters.cookingEquipment && filters.cookingEquipment.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        // For now, we'll keep all recipes but could filter based on equipment requirements
        // This could be enhanced with recipe metadata about required equipment
        return true;
      });
    }

    // Cooking time filter
    if (filters.maxCookingTime) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const totalTime = this.getTotalCookingTime(recipe);
        return totalTime <= filters.maxCookingTime;
      });
    }

    // Difficulty filter
    if (filters.difficulty) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const difficulty = recipe.difficult?.toLowerCase() || 'medium';
        switch (filters.difficulty) {
          case 'easy':
            return difficulty === 'easy';
          case 'medium':
            return difficulty === 'easy' || difficulty === 'medium';
          case 'hard':
            return true; // Include all difficulties
          default:
            return true;
        }
      });
    }

    // Calorie filter
    if (filters.maxCalories) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const calories = parseInt(recipe.nutrients?.kcal) || 500;
        return calories <= filters.maxCalories;
      });
    }

    // Ingredient count filter
    if (filters.maxIngredients) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        return recipe.ingredients?.length <= filters.maxIngredients;
      });
    }

    return filteredRecipes;
  }

  getTotalCookingTime(recipe) {
    const prepTime = this.parseTime(recipe.times?.Preparation || '0 mins');
    const cookTime = this.parseTime(recipe.times?.Cooking || '0 mins');
    return prepTime + cookTime;
  }

  parseTime(timeString) {
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
  }

  searchRecipes(query, category = null) {
    const recipes = category ? this.getRecipesByCategory(category) : this.getAllRecipes();
    
    if (!query) return recipes;
    
    const searchTerm = query.toLowerCase();
    return recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm) ||
      recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm)
      )
    );
  }

  getRecipeById(id) {
    const allRecipes = this.getAllRecipes();
    return allRecipes.find(recipe => recipe.id === id);
  }

  // Helper function to get random recipes from a specific array
  getRandomRecipesFromArray(recipes, count = 1) {
    if (recipes.length === 0) return [];
    
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

export default new RecipeService(); 