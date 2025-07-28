const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

class BBCGoodFoodScraper {
  constructor() {
    this.recipes = [];
    this.errors = [];
    this.baseUrl = 'https://www.bbcgoodfood.com';
  }

  async scrapeRecipes(maxRecipes = 100) {
    console.log('🍳 Starting BBC Good Food recipe scraping...');
    
    const categories = [
      { name: 'breakfast', url: '/recipes/collection/breakfast-recipes' },
      { name: 'lunch', url: '/recipes/collection/lunch-recipes' },
      { name: 'dinner', url: '/recipes/collection/dinner-recipes' },
      { name: 'dessert', url: '/recipes/collection/dessert-recipes' },
      { name: 'snack', url: '/recipes/collection/snack-recipes' },
      { name: 'vegetarian', url: '/recipes/collection/vegetarian-recipes' },
      { name: 'vegan', url: '/recipes/collection/vegan-recipes' },
      { name: 'gluten-free', url: '/recipes/collection/gluten-free-recipes' },
      { name: 'quick-easy', url: '/recipes/collection/quick-easy-recipes' },
      { name: 'healthy', url: '/recipes/collection/healthy-recipes' }
    ];

    for (const category of categories) {
      if (this.recipes.length >= maxRecipes) break;
      
      console.log(`📂 Scraping ${category.name} recipes...`);
      
      try {
        await this.scrapeCategory(category);
        // Be respectful to the server
        await this.delay(2000);
      } catch (error) {
        console.error(`❌ Error scraping ${category.name}:`, error.message);
        this.errors.push({ category: category.name, error: error.message });
      }
    }

    console.log(`✅ Scraping complete! Found ${this.recipes.length} recipes`);
    return this.recipes;
  }

  async scrapeCategory(category) {
    try {
      const response = await axios.get(this.baseUrl + category.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const recipeLinks = [];

      // Extract recipe links from the category page
      $('a[href*="/recipes/"]').each((i, element) => {
        const href = $(element).attr('href');
        if (href && href.includes('/recipes/') && !href.includes('/collection/')) {
          const fullUrl = href.startsWith('http') ? href : this.baseUrl + href;
          if (!recipeLinks.includes(fullUrl)) {
            recipeLinks.push(fullUrl);
          }
        }
      });

      console.log(`  Found ${recipeLinks.length} recipe links in ${category.name}`);

      // Scrape individual recipes (limit to 10 per category)
      for (const link of recipeLinks.slice(0, 10)) {
        try {
          const recipe = await this.scrapeIndividualRecipe(link, category.name);
          if (recipe) {
            this.recipes.push(recipe);
            console.log(`    ✅ Scraped: ${recipe.name}`);
          }
          await this.delay(1000); // Be respectful
        } catch (error) {
          console.error(`    ❌ Error scraping ${link}:`, error.message);
        }
      }
    } catch (error) {
      throw new Error(`Failed to scrape category ${category.name}: ${error.message}`);
    }
  }

  async scrapeIndividualRecipe(url, category) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      
      // Extract recipe data
      const recipe = {
        name: this.extractText($, 'h1'),
        description: this.extractText($, '.recipe__description, .recipe-description'),
        prepTime: this.extractText($, '.recipe__prep-time, .prep-time'),
        cookTime: this.extractText($, '.recipe__cook-time, .cook-time'),
        servings: this.extractText($, '.recipe__servings, .servings'),
        difficulty: this.extractText($, '.recipe__difficulty, .difficulty'),
        ingredients: this.extractIngredients($),
        instructions: this.extractInstructions($),
        nutrition: this.extractNutrition($),
        image: this.extractImage($),
        url: url,
        category: category,
        source: 'BBC Good Food',
        scrapedAt: new Date().toISOString()
      };

      return this.validateRecipe(recipe);
    } catch (error) {
      console.error(`Error fetching recipe ${url}:`, error.message);
      return null;
    }
  }

  extractText($, selector) {
    const element = $(selector).first();
    return element.length ? element.text().trim() : '';
  }

  extractIngredients($) {
    const ingredients = [];
    
    // Try different selectors for ingredients
    const selectors = [
      '.recipe__ingredients li',
      '.ingredients-list li',
      '.ingredients li',
      '.recipe-ingredients li'
    ];

    for (const selector of selectors) {
      $(selector).each((i, element) => {
        const text = $(element).text().trim();
        if (text && !ingredients.includes(text)) {
          ingredients.push(text);
        }
      });
      
      if (ingredients.length > 0) break;
    }

    return ingredients;
  }

  extractInstructions($) {
    const instructions = [];
    
    // Try different selectors for instructions
    const selectors = [
      '.recipe__method li',
      '.method-list li',
      '.instructions li',
      '.recipe-method li'
    ];

    for (const selector of selectors) {
      $(selector).each((i, element) => {
        const text = $(element).text().trim();
        if (text) {
          instructions.push({
            step: instructions.length + 1,
            instruction: text
          });
        }
      });
      
      if (instructions.length > 0) break;
    }

    return instructions;
  }

  extractNutrition($) {
    const nutrition = {};
    
    // Try to extract nutrition information
    $('.nutrition-table tr, .nutrition tr').each((i, element) => {
      const cells = $(element).find('td');
      if (cells.length >= 2) {
        const label = $(cells[0]).text().trim().toLowerCase();
        const value = $(cells[1]).text().trim();
        if (label && value) {
          nutrition[label] = value;
        }
      }
    });

    return nutrition;
  }

  extractImage($) {
    // Try different selectors for recipe images
    const selectors = [
      '.recipe__image img',
      '.hero-image img',
      '.recipe-image img',
      '.main-image img'
    ];

    for (const selector of selectors) {
      const img = $(selector).first();
      if (img.length) {
        const src = img.attr('src');
        if (src) {
          return src.startsWith('http') ? src : this.baseUrl + src;
        }
      }
    }

    return '';
  }

  validateRecipe(recipe) {
    // Basic validation
    if (!recipe.name || recipe.name.length < 3) {
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

  // Convert to app format
  convertToAppFormat() {
    return this.recipes.map(recipe => ({
      name: recipe.name,
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

  // Save recipes to JSON file
  saveToFile(filename = 'bbc-good-food-recipes.json') {
    const data = {
      recipes: this.recipes,
      metadata: {
        total: this.recipes.length,
        scrapedAt: new Date().toISOString(),
        source: 'BBC Good Food',
        errors: this.errors
      }
    };

    const outputPath = path.join(__dirname, '..', 'data', filename);
    
    // Ensure data directory exists
    const dataDir = path.dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`💾 Recipes saved to: ${outputPath}`);
    
    return outputPath;
  }
}

// Main execution
async function main() {
  const scraper = new BBCGoodFoodScraper();
  
  try {
    console.log('🚀 Starting BBC Good Food recipe scraper...');
    
    // Scrape recipes
    await scraper.scrapeRecipes(50); // Limit to 50 recipes
    
    // Convert to app format
    const appRecipes = scraper.convertToAppFormat();
    
    // Save to file
    const outputPath = scraper.saveToFile();
    
    console.log(`✅ Successfully scraped ${scraper.recipes.length} recipes`);
    console.log(`❌ Errors: ${scraper.errors.length}`);
    
    if (scraper.errors.length > 0) {
      console.log('Errors:', scraper.errors);
    }
    
    return appRecipes;
  } catch (error) {
    console.error('❌ Recipe scraping failed:', error);
    return [];
  }
}

// Run if called directly
if (require.main === module) {
  main().then(recipes => {
    console.log(`🎉 Scraping complete! Processed ${recipes.length} recipes`);
  }).catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { BBCGoodFoodScraper, main }; 