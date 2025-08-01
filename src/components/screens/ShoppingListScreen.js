import React, { useState, useEffect } from 'react';
import { useMealPlanner } from '../../context/MealPlannerContext';

const ShoppingListScreen = ({ onBack }) => {
  const { shoppingList, ingredientPrices } = useMealPlanner();
  const [checkedItems, setCheckedItems] = useState({});
  const [showPrices, setShowPrices] = useState(true);
  const [userLocation, setUserLocation] = useState('');
  const [nearbySupermarkets, setNearbySupermarkets] = useState([]);
  const [selectedSupermarket, setSelectedSupermarket] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLoadingSupermarkets, setIsLoadingSupermarkets] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Mock supermarket data with Irish supermarkets (max 6)
  const supermarketData = {
    'Tesco': {
      name: 'Tesco',
      onlineOrdering: true,
      localProduce: true,
      priceMultiplier: 1.0,
      deliveryFee: 4.50,
      minOrder: 25,
      aisleMapping: {
        'Proteins': 'Meat & Fish',
        'Grains': 'Bakery & Cereals',
        'Fruits & Vegetables': 'Fresh Produce',
        'Pantry': 'Cupboard Essentials'
      }
    },
    'SuperValu': {
      name: 'SuperValu',
      onlineOrdering: true,
      localProduce: true,
      priceMultiplier: 1.1,
      deliveryFee: 4.00,
      minOrder: 25,
      aisleMapping: {
        'Proteins': 'Meat & Fish',
        'Grains': 'Bakery & Cereals', 
        'Fruits & Vegetables': 'Fresh Produce',
        'Pantry': 'Cupboard Essentials'
      }
    },
    'Dunnes Stores': {
      name: 'Dunnes Stores',
      onlineOrdering: true,
      localProduce: false,
      priceMultiplier: 0.9,
      deliveryFee: 3.50,
      minOrder: 25,
      aisleMapping: {
        'Proteins': 'Meat & Fish',
        'Grains': 'Bakery & Cereals',
        'Fruits & Vegetables': 'Fresh Produce', 
        'Pantry': 'Cupboard Essentials'
      }
    },
    'Lidl': {
      name: 'Lidl',
      onlineOrdering: false,
      localProduce: false,
      priceMultiplier: 0.85,
      deliveryFee: 0,
      minOrder: 0,
      aisleMapping: {
        'Proteins': 'Meat & Fish',
        'Grains': 'Bakery & Cereals',
        'Fruits & Vegetables': 'Fresh Produce',
        'Pantry': 'Cupboard Essentials'
      }
    },
    'Aldi': {
      name: 'Aldi',
      onlineOrdering: false,
      localProduce: false,
      priceMultiplier: 0.8,
      deliveryFee: 0,
      minOrder: 0,
      aisleMapping: {
        'Proteins': 'Meat & Fish',
        'Grains': 'Bakery & Cereals',
        'Fruits & Vegetables': 'Fresh Produce',
        'Pantry': 'Cupboard Essentials'
      }
    },
    'Centra': {
      name: 'Centra',
      onlineOrdering: false,
      localProduce: true,
      priceMultiplier: 1.2,
      deliveryFee: 0,
      minOrder: 0,
      aisleMapping: {
        'Proteins': 'Meat & Fish',
        'Grains': 'Bakery & Cereals',
        'Fruits & Vegetables': 'Fresh Produce',
        'Pantry': 'Cupboard Essentials'
      }
    }
  };

  useEffect(() => {
    // Check if user has already set location
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setUserLocation(savedLocation);
      findNearbySupermarkets(savedLocation);
    } else {
      setShowLocationModal(true);
    }
  }, []);

  // Initialize all items as checked by default
  useEffect(() => {
    if (shoppingList && shoppingList.categories) {
      const initialCheckedItems = {};
      Object.entries(shoppingList.categories).forEach(([category, items]) => {
        items.forEach(itemObj => {
          const key = `${category}-${itemObj.item}`;
          initialCheckedItems[key] = false; // Start with all items unchecked (needed)
        });
      });
      setCheckedItems(initialCheckedItems);
    }
  }, [shoppingList]);

  const findNearbySupermarkets = async (location) => {
    setIsLoadingSupermarkets(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock nearby supermarkets based on location (max 6)
      const mockNearby = Object.keys(supermarketData).map(name => ({
        ...supermarketData[name],
        distance: Math.random() * 5, // Random distance 0-5km
        address: `${name} Store, ${location}`,
        rating: (3.5 + Math.random() * 1.5).toFixed(1) // 3.5-5.0 rating
      })).sort((a, b) => {
        // Prioritize: online ordering > local produce > distance > price
        if (a.onlineOrdering !== b.onlineOrdering) {
          return b.onlineOrdering - a.onlineOrdering;
        }
        if (a.localProduce !== b.localProduce) {
          return b.localProduce - a.localProduce;
        }
        return a.distance - b.distance;
      }).slice(0, 6); // Limit to 6 supermarkets

      setNearbySupermarkets(mockNearby);
      setIsLoadingSupermarkets(false);
    }, 1500);
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (userLocation.trim()) {
      localStorage.setItem('userLocation', userLocation);
      setShowLocationModal(false);
      findNearbySupermarkets(userLocation);
    }
  };

  const handleItemToggle = (category, item) => {
    const key = `${category}-${item}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getItemPrice = (item) => {
    // Handle both string items and object items with item property
    const itemName = typeof item === 'string' ? item : item.item;
    const priceInfo = ingredientPrices[itemName.toLowerCase()];
    return priceInfo ? priceInfo.price : null;
  };

  const getItemUnit = (item) => {
    // Handle both string items and object items with item property
    const itemName = typeof item === 'string' ? item : item.item;
    const priceInfo = ingredientPrices[itemName.toLowerCase()];
    return priceInfo ? priceInfo.unit : '';
  };

  const calculateTotalCost = (supermarket = null) => {
    let total = 0;
    Object.entries(shoppingList.categories || {}).forEach(([category, items]) => {
      items.forEach(item => {
        const key = `${category}-${item}`;
        if (!checkedItems[key]) { // Only count unchecked items (still needed)
          const price = getItemPrice(item);
          if (price) {
            const multiplier = supermarket ? supermarket.priceMultiplier : 1.0;
            total += price * multiplier;
          }
        }
      });
    });
    return total.toFixed(2);
  };

  const getCheckedCount = () => {
    return Object.values(checkedItems).filter(Boolean).length;
  };

  const getTotalItems = () => {
    let total = 0;
    Object.values(shoppingList.categories || {}).forEach(items => {
      total += items.length;
    });
    return total;
  };

  const clearAllChecked = () => {
    setCheckedItems({});
  };

  const handleEmailList = () => {
    // Simulate email sending
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
    }, 3000);
  };

  const printShoppingList = () => {
    const printWindow = window.open('', '_blank');
    const aisleGroups = {};
    
    // Group items by aisle
    Object.entries(shoppingList.categories || {}).forEach(([category, items]) => {
      const aisle = selectedSupermarket?.aisleMapping[category] || category;
      if (!aisleGroups[aisle]) {
        aisleGroups[aisle] = [];
      }
      items.forEach(itemObj => {
        const key = `${category}-${itemObj.item}`;
        if (!checkedItems[key]) { // Only include unchecked items (still needed)
          aisleGroups[aisle].push(itemObj);
        }
      });
    });

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shopping List</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .aisle { margin-bottom: 25px; }
          .aisle h3 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
          .item { padding: 8px 0; border-bottom: 1px solid #eee; }
          .checkbox { margin-right: 10px; }
          .total { margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🛒 Shopping List</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          ${selectedSupermarket ? `<p>Recommended: ${selectedSupermarket.name}</p>` : ''}
        </div>
        
        ${Object.entries(aisleGroups).map(([aisle, items]) => `
          <div class="aisle">
            <h3>${aisle}</h3>
            ${items.map(itemObj => `
              <div class="item">
                <input type="checkbox" class="checkbox"> ${itemObj.item} (${itemObj.quantity})
              </div>
            `).join('')}
          </div>
        `).join('')}
        
        <div class="total">
          <h3>Summary</h3>
          <p>Total Items: ${getTotalItems() - getCheckedCount()}</p>
          ${selectedSupermarket ? `<p>Estimated Cost: €${calculateTotalCost(selectedSupermarket)}</p>` : ''}
        </div>
        
        <div class="no-print">
          <button onclick="window.print()">Print List</button>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  if (!shoppingList || !shoppingList.categories) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>No Shopping List Available</h2>
          <p>Please generate a meal plan first to see your shopping list.</p>
          <button className="btn btn-primary" onClick={onBack}>
            Back to Meal Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Location Modal */}
      {showLocationModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>📍 Set Your Location</h2>
            <p>Enter your location to find nearby supermarkets and get price estimates.</p>
            <form onSubmit={handleLocationSubmit}>
              <input
                type="text"
                placeholder="Enter your postcode or city"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                className="location-input"
                required
              />
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Find Supermarkets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="shopping-list-container">
        <div className="shopping-list-header">
          <div className="header-left">
            <button className="btn btn-text" onClick={onBack}>
              ← Back to Meal Plan
            </button>
            <h1>🛒 Shopping List</h1>
          </div>
          <div className="header-right">
            <div className="list-stats">
              <span>{getCheckedCount()}/{getTotalItems()} items completed</span>
              <span>Estimated: €{calculateTotalCost(selectedSupermarket)}</span>
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={clearAllChecked}
            >
              Clear Completed
            </button>
          </div>
        </div>

        {/* Location and Supermarket Section */}
        <div className="location-section">
          <div className="location-info">
            <span>📍 {userLocation}</span>
            <button 
              className="btn btn-text" 
              onClick={() => setShowLocationModal(true)}
            >
              Change Location
            </button>
          </div>
          
          {isLoadingSupermarkets ? (
            <div className="loading-supermarkets">
              <div className="loading-spinner"></div>
              <p>Finding nearby supermarkets...</p>
            </div>
          ) : (
            <div className="supermarkets-section">
              <h3>🏪 Nearby Supermarkets</h3>
              <div className="supermarkets-grid">
                {nearbySupermarkets.map((supermarket, index) => (
                  <div 
                    key={index} 
                    className={`supermarket-card ${selectedSupermarket?.name === supermarket.name ? 'selected' : ''}`}
                    onClick={() => setSelectedSupermarket(supermarket)}
                  >
                    <div className="supermarket-header">
                      <h4>{supermarket.name}</h4>
                      <div className="supermarket-badges">
                        {supermarket.onlineOrdering && <span className="badge online">🛒 Online</span>}
                        {supermarket.localProduce && <span className="badge local">🌱 Local</span>}
                      </div>
                    </div>
                    <div className="supermarket-details">
                      <p>📍 {supermarket.distance.toFixed(1)}km away</p>
                      <p>⭐ {supermarket.rating} rating</p>
                      <p>💰 €{calculateTotalCost(supermarket)} estimated</p>
                      {supermarket.onlineOrdering && (
                        <p>🚚 €{supermarket.deliveryFee} delivery</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="shopping-list-controls">
          <label className="price-toggle">
            <input
              type="checkbox"
              checked={showPrices}
              onChange={(e) => setShowPrices(e.target.checked)}
            />
            Show Prices
          </label>
        </div>

        <div className="shopping-list-categories">
          {Object.entries(shoppingList.categories).map(([category, items]) => (
            <div key={category} className="category-section">
              <h2>{category}</h2>
              <div className="items-list">
                {items.map((itemObj, index) => {
                  const key = `${category}-${itemObj.item}`;
                  const isChecked = checkedItems[key];
                  const price = getItemPrice(itemObj);
                  const unit = getItemUnit(itemObj);
                  
                  return (
                    <div 
                      key={index} 
                      className={`shopping-item ${isChecked ? 'checked' : ''}`}
                    >
                      <label className="item-checkbox">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleItemToggle(category, itemObj.item)}
                        />
                        <span className="checkmark"></span>
                      </label>
                      
                      <div className="item-details">
                        <span className="item-name">{itemObj.item} ({itemObj.quantity})</span>
                        {showPrices && price && (
                          <span className="item-price">
                            €{price} {unit}
                          </span>
                        )}
                      </div>
                      
                      <div className="item-actions">
                        <button className="btn-icon">📝</button>
                        <button className="btn-icon">⭐</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="shopping-list-summary">
          <div className="summary-card">
            <h3>📊 Summary</h3>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-label">Total Items:</span>
                <span className="stat-value">{getTotalItems()}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Completed:</span>
                <span className="stat-value">{getCheckedCount()}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Remaining:</span>
                <span className="stat-value">{getTotalItems() - getCheckedCount()}</span>
              </div>
              <div className="stat total-cost">
                <span className="stat-label">Estimated Cost:</span>
                <span className="stat-value">€{calculateTotalCost(selectedSupermarket)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="shopping-list-actions">
          <button className="btn btn-primary">
            📱 Send to Phone
          </button>
          <button className="btn btn-secondary" onClick={printShoppingList}>
            📄 Print List
          </button>
          <button 
            className={`btn btn-secondary ${emailSent ? 'btn-success' : ''}`} 
            onClick={handleEmailList}
            disabled={emailSent}
          >
            {emailSent ? '✅ Email Sent' : '📧 Email List'}
          </button>
        </div>

        <div className="shopping-tips">
          <h3>💡 Shopping Tips</h3>
          <ul>
            <li>Shop with the list to avoid impulse purchases</li>
            <li>Check your pantry before shopping to avoid duplicates</li>
            <li>Buy seasonal produce for better prices and quality</li>
            <li>Consider buying in bulk for items you use frequently</li>
            <li>Look for store brands to save money on staples</li>
            {selectedSupermarket?.onlineOrdering && (
              <li>Order online from {selectedSupermarket.name} for convenience</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListScreen; 