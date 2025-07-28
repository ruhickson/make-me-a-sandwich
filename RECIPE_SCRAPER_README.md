# Recipe Scraper for Make Me A Sandwich

This project includes a powerful recipe scraper that can download recipes from BBC Good Food and other recipe websites to populate your meal planning app.

## 🍳 Features

- **BBC Good Food Scraper**: Downloads recipes from BBC Good Food website
- **Multiple Categories**: Breakfast, lunch, dinner, dessert, snack, vegetarian, vegan, gluten-free, quick-easy, healthy
- **Recipe Data**: Extracts title, description, ingredients, instructions, nutrition info, cooking times, difficulty
- **JSON Export**: Saves recipes in structured JSON format
- **App Integration**: Recipes can be loaded into the meal planning app
- **Respectful Scraping**: Includes delays to be respectful to servers

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install axios cheerio
```

### 2. Run the Scraper

```bash
npm run scrape-recipes
```

This will:
- Scrape recipes from BBC Good Food
- Save them to `data/bbc-good-food-recipes.json`
- Show progress in the console
- Handle errors gracefully

### 3. Use in the App

1. Start the React app: `npm start`
2. Navigate to the "Recipes" tab
3. Browse and select recipes
4. Generate meal plans from selected recipes

## 📁 File Structure

```
make-me-a-sandwich/
├── scripts/
│   └── scrapeRecipes.js          # Main scraper script
├── src/
│   ├── utils/
│   │   └── recipeScraper.js      # Client-side scraper utilities
│   └── components/
│       └── RecipeDatabase.js     # Recipe database UI component
├── data/                         # Generated recipe data
│   └── bbc-good-food-recipes.json
└── RECIPE_SCRAPER_README.md     # This file
```

## 🔧 Configuration

### Scraper Settings

Edit `scripts/scrapeRecipes.js` to customize:

```javascript
// Number of recipes to scrape per category
const maxRecipes = 50;

// Delay between requests (in milliseconds)
await this.delay(1000); // 1 second

// Categories to scrape
const categories = [
  'breakfast', 'lunch', 'dinner', 'dessert', 'snack',
  'vegetarian', 'vegan', 'gluten-free', 'quick-easy', 'healthy'
];
```

### Output Format

Recipes are saved in this format:

```json
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Recipe description",
      "prepTime": "15 minutes",
      "cookTime": "30 minutes",
      "difficulty": "Medium",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": "Step by step instructions",
      "nutrition": {
        "calories": 350,
        "protein": 25,
        "carbs": 30,
        "fat": 15
      },
      "category": "dinner",
      "image": "https://example.com/image.jpg",
      "source": "BBC Good Food",
      "url": "https://www.bbcgoodfood.com/recipe/...",
      "scrapedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "metadata": {
    "total": 50,
    "scrapedAt": "2024-01-15T10:30:00.000Z",
    "source": "BBC Good Food",
    "errors": []
  }
}
```

## 🌐 Supported Websites

### BBC Good Food
- **URL**: https://www.bbcgoodfood.com
- **Categories**: All major recipe categories
- **Data Extracted**: Full recipe information including images

### Adding More Sources

To add support for other recipe websites:

1. Create a new scraper class in `scripts/scrapeRecipes.js`
2. Implement the required methods:
   - `scrapeRecipes()`
   - `scrapeCategory()`
   - `scrapeIndividualRecipe()`
   - `parseRecipeHTML()`

Example:

```javascript
class NewWebsiteScraper {
  constructor() {
    this.baseUrl = 'https://newwebsite.com';
  }

  async scrapeRecipes(maxRecipes = 100) {
    // Implementation
  }

  // ... other methods
}
```

## ⚠️ Important Notes

### Legal and Ethical Considerations

1. **Respect robots.txt**: Always check the website's robots.txt file
2. **Rate limiting**: Include delays between requests (1-2 seconds minimum)
3. **Terms of service**: Ensure scraping is allowed by the website's terms
4. **Attribution**: Always credit the original source
5. **Personal use**: Only scrape for personal/educational use

### Technical Considerations

1. **CORS Issues**: The scraper runs server-side to avoid CORS problems
2. **HTML Structure**: Website changes may break the scraper
3. **Error Handling**: The scraper includes comprehensive error handling
4. **Data Validation**: Recipes are validated before saving

## 🛠️ Troubleshooting

### Common Issues

1. **"No recipes found"**
   - Check if the scraper ran successfully
   - Verify the data file exists in `data/`
   - Check console for errors

2. **Scraping fails**
   - Website structure may have changed
   - Check internet connection
   - Verify the website is accessible

3. **Missing data**
   - Some recipes may not have all fields
   - The scraper includes validation
   - Check the error log in the JSON file

### Debug Mode

Add debug logging to the scraper:

```javascript
// In scrapeRecipes.js
console.log('Debug: Scraping recipe:', url);
console.log('Debug: Extracted data:', recipe);
```

## 📊 Usage Statistics

The scraper tracks:
- Total recipes scraped
- Errors encountered
- Scraping time
- Categories processed

## 🔄 Updating Recipes

To update your recipe database:

1. Run the scraper again: `npm run scrape-recipes`
2. The new data will overwrite the existing file
3. Refresh the app to see new recipes

## 🤝 Contributing

To improve the scraper:

1. Add support for new websites
2. Improve error handling
3. Add more recipe fields
4. Optimize scraping speed
5. Add more validation rules

## 📝 License

This scraper is for educational purposes. Please respect the terms of service of the websites you scrape.

## 🆘 Support

If you encounter issues:

1. Check the console output for errors
2. Verify the website structure hasn't changed
3. Try running the scraper with fewer recipes first
4. Check the generated JSON file for error details

---

**Happy Scraping! 🍽️** 