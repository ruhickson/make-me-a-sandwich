// Recipe Scraper Utility
// This utility can scrape recipes from various food websites

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export class RecipeScraper {
  constructor() {
    this.recipes = [];
    this.errors = [];
  }

  async scrapeBBCGoodFood(maxRecipes = 100) {
    console.log('Starting BBC Good Food recipe scraping...');
    
    const categories = [
      'breakfast',
      'lunch',
      'dinner',
      'dessert',
      'snack',
      'vegetarian',
      'vegan',
      'gluten-free',
      'quick-easy',
      'healthy'
    ];

    for (const category of categories) {
      if (this.recipes.length >= maxRecipes) break;
      
      try {
        await this.scrapeCategory(category);
        // Add delay to be respectful to the server
        await this.delay(1000);
      } catch (error) {
        console.error(`Error scraping category ${category}:`, error);
        this.errors.push({ category, error: error.message });
      }
    }

    return {
      recipes: this.recipes,
      errors: this.errors,
      total: this.recipes.length
    };
  }

  async scrapeCategory(category) {
    const baseUrl = 'https://www.bbcgoodfood.com';
    const categoryUrls = {
      breakfast: `${baseUrl}/recipes/collection/breakfast-recipes`,
      lunch: `${baseUrl}/recipes/collection/lunch-recipes`,
      dinner: `${baseUrl}/recipes/collection/dinner-recipes`,
      dessert: `${baseUrl}/recipes/collection/dessert-recipes`,
      snack: `${baseUrl}/recipes/collection/snack-recipes`,
      vegetarian: `${baseUrl}/recipes/collection/vegetarian-recipes`,
      vegan: `${baseUrl}/recipes/collection/vegan-recipes`,
      'gluten-free': `${baseUrl}/recipes/collection/gluten-free-recipes`,
      'quick-easy': `${baseUrl}/recipes/collection/quick-easy-recipes`,
      healthy: `${baseUrl}/recipes/collection/healthy-recipes`
    };

    const url = categoryUrls[category];
    if (!url) {
      throw new Error(`Unknown category: ${category}`);
    }

    try {
      const response = await fetch(CORS_PROXY + url);
      const html = await response.text();
      
      // Parse recipe links from the category page
      const recipeLinks = this.extractRecipeLinks(html);
      
      // Scrape individual recipes
      for (const link of recipeLinks.slice(0, 10)) { // Limit to 10 per category
        try {
          const recipe = await this.scrapeIndividualRecipe(link);
          if (recipe) {
            recipe.category = category;
            this.recipes.push(recipe);
          }
          await this.delay(500); // Be respectful
        } catch (error) {
          console.error(`Error scraping recipe ${link}:`, error);
        }
      }
    } catch (error) {
      throw new Error(`Failed to scrape category ${category}: ${error.message}`);
    }
  }

  extractRecipeLinks(html) {
    const links = [];
    const regex = /href="(\/recipes\/[^"]+)"/g;
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      const link = 'https://www.bbcgoodfood.com' + match[1];
      if (!links.includes(link)) {
        links.push(link);
      }
    }
    
    return links;
  }

  async scrapeIndividualRecipe(url) {
    try {
      const response = await fetch(CORS_PROXY + url);
      const html = await response.text();
      
      return this.parseRecipeHTML(html, url);
    } catch (error) {
      console.error(`Error fetching recipe ${url}:`, error);
      return null;
    }
  }

  parseRecipeHTML(html, url) {
    try {
      // Create a DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract recipe data
      const recipe = {
        title: this.extractText(doc, 'h1'),
        description: this.extractText(doc, '.recipe__description'),
        prepTime: this.extractText(doc, '.recipe__prep-time'),
        cookTime: this.extractText(doc, '.recipe__cook-time'),
        servings: this.extractText(doc, '.recipe__servings'),
        difficulty: this.extractText(doc, '.recipe__difficulty'),
        ingredients: this.extractIngredients(doc),
        instructions: this.extractInstructions(doc),
        nutrition: this.extractNutrition(doc),
        image: this.extractImage(doc),
        url: url,
        source: 'BBC Good Food',
        scrapedAt: new Date().toISOString()
      };

      // Clean and validate the recipe
      return this.validateRecipe(recipe);
    } catch (error) {
      console.error('Error parsing recipe HTML:', error);
      return null;
    }
  }

  extractText(doc, selector) {
    const element = doc.querySelector(selector);
    return element ? element.textContent.trim() : '';
  }

  extractIngredients(doc) {
    const ingredients = [];
    const ingredientElements = doc.querySelectorAll('.recipe__ingredients li, .ingredients-list li');
    
    ingredientElements.forEach(element => {
      const text = element.textContent.trim();
      if (text) {
        ingredients.push(text);
      }
    });
    
    return ingredients;
  }

  extractInstructions(doc) {
    const instructions = [];
    const instructionElements = doc.querySelectorAll('.recipe__method li, .method-list li');
    
    instructionElements.forEach((element, index) => {
      const text = element.textContent.trim();
      if (text) {
        instructions.push({
          step: index + 1,
          instruction: text
        });
      }
    });
    
    return instructions;
  }

  extractNutrition(doc) {
    const nutrition = {};
    const nutritionElements = doc.querySelectorAll('.nutrition-table tr');
    
    nutritionElements.forEach(element => {
      const cells = element.querySelectorAll('td');
      if (cells.length >= 2) {
        const label = cells[0].textContent.trim().toLowerCase();
        const value = cells[1].textContent.trim();
        nutrition[label] = value;
      }
    });
    
    return nutrition;
  }

  extractImage(doc) {
    const imgElement = doc.querySelector('.recipe__image img, .hero-image img');
    return imgElement ? imgElement.src : '';
  }

  validateRecipe(recipe) {
    // Basic validation
    if (!recipe.title || recipe.title.length < 3) {
      return null;
    }
    
    if (recipe.ingredients.length === 0) {
      return null;
    }
    
    if (recipe.instructions.length === 0) {
      return null;
    }
    
    return recipe;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Export recipes to JSON
  exportToJSON(filename = 'recipes.json') {
    const data = {
      recipes: this.recipes,
      metadata: {
        total: this.recipes.length,
        scrapedAt: new Date().toISOString(),
        source: 'BBC Good Food',
        errors: this.errors
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Convert recipes to our app's format
  convertToAppFormat() {
    return this.recipes.map(recipe => ({
      name: recipe.title,
      description: recipe.description,
      prepTime: this.parseTime(recipe.prepTime),
      cookTime: this.parseTime(recipe.cookTime),
      difficulty: this.parseDifficulty(recipe.difficulty),
      ingredients: recipe.ingredients,
      instructions: recipe.instructions.map(step => step.instruction).join('\n'),
      nutrition: {
        calories: this.parseNutritionValue(recipe.nutrition.calories),
        protein: this.parseNutritionValue(recipe.nutrition.protein),
        carbs: this.parseNutritionValue(recipe.nutrition.carbohydrates),
        fat: this.parseNutritionValue(recipe.nutrition.fat)
      },
      category: recipe.category,
      image: recipe.image,
      source: recipe.source,
      url: recipe.url
    }));
  }

  parseTime(timeString) {
    if (!timeString) return '0 minutes';
    
    const match = timeString.match(/(\d+)/);
    return match ? `${match[1]} minutes` : '0 minutes';
  }

  parseDifficulty(difficulty) {
    if (!difficulty) return 'Medium';
    
    const lower = difficulty.toLowerCase();
    if (lower.includes('easy')) return 'Easy';
    if (lower.includes('medium')) return 'Medium';
    if (lower.includes('hard') || lower.includes('difficult')) return 'Hard';
    
    return 'Medium';
  }

  parseNutritionValue(value) {
    if (!value) return 0;
    
    const match = value.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
}

// Alternative: Use a recipe API instead of scraping
export class RecipeAPI {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
  }

  async searchRecipes(query, maxResults = 20) {
    // This would use a real recipe API like Spoonacular, Edamam, etc.
    // For now, we'll return mock data
    return this.getMockRecipes(query, maxResults);
  }

  getMockRecipes(query, maxResults) {
    const mockRecipes = [
      {
        name: "Classic Caesar Salad",
        description: "A fresh and crispy Caesar salad with homemade dressing",
        prepTime: "15 minutes",
        cookTime: "0 minutes",
        difficulty: "Easy",
        ingredients: ["romaine lettuce", "parmesan cheese", "croutons", "caesar dressing", "anchovies"],
        instructions: "Wash and chop lettuce. Mix with dressing. Top with cheese and croutons.",
        nutrition: { calories: 250, protein: 8, carbs: 12, fat: 18 },
        category: "lunch",
        image: "https://via.placeholder.com/300x200?text=Caesar+Salad"
      },
      {
        name: "Grilled Chicken Breast",
        description: "Perfectly grilled chicken breast with herbs",
        prepTime: "10 minutes",
        cookTime: "20 minutes",
        difficulty: "Medium",
        ingredients: ["chicken breast", "olive oil", "herbs", "salt", "pepper"],
        instructions: "Season chicken. Grill for 10 minutes each side until cooked through.",
        nutrition: { calories: 280, protein: 35, carbs: 0, fat: 12 },
        category: "dinner",
        image: "https://via.placeholder.com/300x200?text=Grilled+Chicken"
      }
    ];

    return mockRecipes.slice(0, maxResults);
  }
}

// Usage example:
export const scrapeRecipes = async () => {
  const scraper = new RecipeScraper();
  
  try {
    console.log('Starting recipe scraping...');
    const result = await scraper.scrapeBBCGoodFood(50);
    
    console.log(`Scraped ${result.total} recipes`);
    console.log(`Errors: ${result.errors.length}`);
    
    // Convert to app format
    const appRecipes = scraper.convertToAppFormat();
    
    // Export to JSON
    scraper.exportToJSON('bbc-good-food-recipes.json');
    
    return appRecipes;
  } catch (error) {
    console.error('Recipe scraping failed:', error);
    return [];
  }
}; 