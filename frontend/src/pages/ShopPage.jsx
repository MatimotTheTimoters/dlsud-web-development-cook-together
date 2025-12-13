import React, { useState, useEffect } from 'react';
import { FaStore, FaCoins, FaGem, FaTags, FaFilter, FaSearch } from 'react-icons/fa';
import ShopItem from '../components/gamification/ShopItem';

const ShopPage = () => {
    const [shopItems, setShopItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    const [loading, setLoading] = useState(true);

    // Load shop items
    const loadShopItems = async () => {
        try {
            setLoading(true);
            // Mock data - replace with actual API call
            setTimeout(() => {
                setShopItems([
                    {
                        id: 1,
                        name: 'Golden Whisk',
                        description: '+15% cooking speed for 24h',
                        item_type: 'boost',
                        category: 'tools',
                        gold_price: 500,
                        gem_price: 50,
                        image_url: null
                    },
                    {
                        id: 2,
                        name: 'Recipe Unlock Pack',
                        description: 'Unlock 5 premium recipes',
                        item_type: 'currency',
                        category: 'recipes',
                        gold_price: 1000,
                        gem_price: 100,
                        image_url: null
                    },
                    {
                        id: 3,
                        name: 'EXP Boost',
                        description: 'Double EXP for next 3 sessions',
                        item_type: 'boost',
                        category: 'boosts',
                        gold_price: 300,
                        gem_price: 30,
                        image_url: null
                    }
                ]);

                setCategories([
                    { id: 'all', name: 'All Items', icon: '🏪' },
                    { id: 'tools', name: 'Tools', icon: '🔧' },
                    { id: 'recipes', name: 'Recipes', icon: '📖' },
                    { id: 'boosts', name: 'Boosts', icon: '⚡' },
                    { id: 'consumables', name: 'Consumables', icon: '🍯' }
                ]);

                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error loading shop items:', error);
            setLoading(false);
        }
    };

    // Handle item purchase
    const handlePurchase = async (itemId) => {
        try {
            // Purchase logic would go here
            alert(`Purchased item ${itemId}!`);
            // Refresh shop items after purchase
            loadShopItems();
        } catch (error) {
            console.error('Error purchasing item:', error);
            alert('Failed to purchase item. Please try again.');
        }
    };

    // Filter items by category
    const filterItems = (category) => {
        if (category === 'all') return shopItems;
        return shopItems.filter(item => item.category === category);
    };

    useEffect(() => {
        loadShopItems();
    }, []);

    const filteredItems = filterItems(selectedCategory);

    if (loading) {
        return (
            <div className="shop-page loading">
                <div className="loading-container">
                    <FaStore className="loading-icon" />
                    <p>Loading shop items...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="shop-page">
            {/* Shop Header */}
            <div className="shop-header">
                <div className="shop-title">
                    <FaStore className="shop-icon" />
                    <h1>CookTogether Shop</h1>
                </div>
            </div>

            {/* Categories */}
            <div className="shop-categories">
                <h2>
                    <FaTags /> Categories
                </h2>
                <div className="category-list">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.icon && <span className="category-icon">{category.icon}</span>}
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search and Filters */}
            <div className="shop-controls">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="sort-controls">
                    <FaFilter className="filter-icon" />
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>
            </div>

            {/* Shop Items Grid */}
            <div className="shop-items-grid">
                {filteredItems.length === 0 ? (
                    <div className="no-items-message">
                        <h3>No items found</h3>
                        <p>Try changing your search or filter criteria</p>
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <ShopItem
                            key={item.id}
                            item={item}
                            onPurchase={() => handlePurchase(item.id)}
                        />
                    ))
                )}
            </div>

            {/* Shop Info */}
            <div className="shop-info">
                <div className="info-card">
                    <h4>💡 How to Earn Currency</h4>
                    <ul>
                        <li>Complete cooking sessions</li>
                        <li>Create and share recipes</li>
                        <li>Participate in daily challenges</li>
                        <li>Level up your chef profile</li>
                    </ul>
                </div>

                <div className="info-card">
                    <h4>⚡ Daily Deals</h4>
                    <p>Check back daily for limited-time offers and discounts!</p>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;