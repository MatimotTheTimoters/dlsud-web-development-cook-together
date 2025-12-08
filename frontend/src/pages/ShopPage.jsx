import React, { useState, useEffect } from 'react';
import { FaStore, FaCoins, FaGem, FaTags, FaFilter, FaSearch, FaShoppingBag } from 'react-icons/fa';
import ShopItem from '../components/gamification/ShopItem';
import CurrencyDisplay from '../components/gamification/CurrencyDisplay';
import RewardNotification from '../components/gamification/RewardNotification';
import { getShopItems, getItemCategories } from '../api/shop';
import { getUserStats } from '../api/users';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ShopPage.css';

/**
 * ShopPage component for the in-game shop
 * Backend Endpoint: api/shop/items.php, api/users/stats.php
 */
const ShopPage = () => {
    const { user } = useAuth();
    const [shopItems, setShopItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchaseHistory, setPurchaseHistory] = useState([]);

    // Fetch shop data on component mount
    useEffect(() => {
        fetchShopData();
    }, []);

    // Update user stats when user changes
    useEffect(() => {
        if (user?.id) {
            fetchUserStats();
        }
    }, [user?.id]);

    // Filter items when category, search, or sort changes
    useEffect(() => {
        filterAndSortItems();
    }, [shopItems, selectedCategory, searchQuery, sortBy]);

    const fetchShopData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch shop items and categories
            const [itemsData, categoriesData] = await Promise.all([
                getShopItems(),
                getItemCategories()
            ]);

            setShopItems(itemsData.items || []);
            setCategories(categoriesData);

        } catch (error) {
            console.error('Error fetching shop data:', error);
            setError('Failed to load shop items. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStats = async () => {
        if (!user?.id) return;

        try {
            const stats = await getUserStats(user.id);
            setUserStats(stats);
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    const filterAndSortItems = () => {
        let filtered = [...shopItems];

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
        }

        // Sort items
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => {
                    const priceA = a.gold_price || a.gem_price || 0;
                    const priceB = b.gold_price || b.gem_price || 0;
                    return priceA - priceB;
                });
                break;
            case 'price-high':
                filtered.sort((a, b) => {
                    const priceA = a.gold_price || a.gem_price || 0;
                    const priceB = b.gold_price || b.gem_price || 0;
                    return priceB - priceA;
                });
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'popular':
                // Assuming we have a popularity field - fallback to featured
                filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                break;
            case 'featured':
            default:
                // Keep original order (backend should send featured first)
                break;
        }

        setFilteredItems(filtered);
    };

    const handlePurchaseSuccess = (purchaseResult) => {
        // Show success message
        alert(`Successfully purchased ${purchaseResult.item_name}!`);

        // Refresh user stats to update currency balances
        fetchUserStats();

        // Add to purchase history
        setPurchaseHistory(prev => [purchaseResult, ...prev.slice(0, 9)]);

        // Refresh shop items (in case stock changed)
        fetchShopData();
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const getUserBalance = () => {
        if (!userStats) return { gold: 0, gems: 0 };
        return {
            gold: userStats.gold_count || 0,
            gems: userStats.gem_count || 0
        };
    };

    if (loading && shopItems.length === 0) {
        return (
            <div className="shop-page loading">
                <LoadingSpinner size="large" />
                <p>Loading shop items...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="shop-page error">
                <div className="error-icon">⚠️</div>
                <h2>Shop Unavailable</h2>
                <p>{error}</p>
                <button onClick={fetchShopData} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    const balance = getUserBalance();

    return (
        <div className="shop-page">
            <RewardNotification autoShow={true} />

            {/* Shop Header */}
            <div className="shop-header">
                <div className="shop-title">
                    <FaStore className="shop-icon" />
                    <h1>CookTogether Shop</h1>
                </div>

                <div className="shop-balance">
                    <CurrencyDisplay showLabels={false} compact={true} />
                    <div className="balance-details">
                        <span className="balance-item">
                            <FaCoins /> {balance.gold.toLocaleString()} Gold
                        </span>
                        <span className="balance-item">
                            <FaGem /> {balance.gems.toLocaleString()} Gems
                        </span>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="shop-categories">
                <h2>
                    <FaTags /> Categories
                </h2>
                <div className="category-list">
                    <button
                        className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => handleCategorySelect('all')}
                    >
                        All Items
                    </button>

                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => handleCategorySelect(category.id)}
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
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>

                <div className="sort-controls">
                    <FaFilter className="filter-icon" />
                    <select value={sortBy} onChange={handleSortChange} className="sort-select">
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest</option>
                        <option value="popular">Most Popular</option>
                    </select>
                </div>
            </div>

            {/* Shop Items Grid */}
            <div className="shop-items-grid">
                {filteredItems.length === 0 ? (
                    <div className="no-items-message">
                        <FaShoppingBag className="no-items-icon" />
                        <h3>No items found</h3>
                        <p>Try changing your search or filter criteria</p>
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <ShopItem
                            key={item.id}
                            item={item}
                            onPurchaseSuccess={handlePurchaseSuccess}
                        />
                    ))
                )}
            </div>

            {/* Purchase History (Optional) */}
            {purchaseHistory.length > 0 && (
                <div className="purchase-history">
                    <h3>
                        <FaShoppingBag /> Recent Purchases
                    </h3>
                    <div className="history-list">
                        {purchaseHistory.map((purchase, index) => (
                            <div key={index} className="history-item">
                                <span className="history-item-name">{purchase.item_name}</span>
                                <span className="history-item-price">
                                    {purchase.gold_paid > 0 && (
                                        <><FaCoins /> {purchase.gold_paid}G</>
                                    )}
                                    {purchase.gems_paid > 0 && (
                                        <><FaGem /> {purchase.gems_paid}</>
                                    )}
                                </span>
                                <span className="history-item-time">
                                    {new Date(purchase.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Shop Info */}
            <div className="shop-info">
                <div className="info-card">
                    <h4>💡 How to Earn Currency</h4>
                    <ul>
                        <li>Complete cooking sessions</li>
                        <li>Create and share recipes</li>
                        <li>Participate in daily challenges</li>
                        <li>Level up your chef profile</li>
                        <li>Invite friends to join</li>
                    </ul>
                </div>

                <div className="info-card">
                    <h4>⚡ Daily Deals</h4>
                    <p>Check back daily for limited-time offers and discounts!</p>
                    <div className="daily-deal">
                        <span className="deal-badge">🔥 50% OFF</span>
                        <span className="deal-text">Golden Cooking Utensils</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;