import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import UserCard from '../components/users/UserCard';
import RecipeCard from '../components/recipes/RecipeCard';
import RecipeList from '../components/recipes/RecipeList';
import { FaCompass, FaFire, FaTrophy, FaUsers, FaStar, FaSearch, FaFilter, FaSync } from 'react-icons/fa';
import * as usersApi from '../api/users';
import * as recipesApi from '../api/recipes';
import * as shopApi from '../api/shop';
import ShopItem from '../components/gamification/ShopItem';
import { DataContext } from '../contexts/DataContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * DiscoverPage Component
 * Page for discovering recipes, users, and shop items
 */
const DiscoverPage = () => {
    const { currentUserData, getCachedData, setCachedData } = useContext(DataContext);

    // State for top chefs
    const [topChefs, setTopChefs] = useState([]);
    const [isLoadingChefs, setIsLoadingChefs] = useState(true);

    // State for trending recipes
    const [trendingRecipes, setTrendingRecipes] = useState([]);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);

    // State for shop items
    const [shopItems, setShopItems] = useState([]);
    const [isLoadingShop, setIsLoadingShop] = useState(true);

    // State for search
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Active tab
    const [activeTab, setActiveTab] = useState('trending'); // 'trending', 'chefs', 'shop'

    // Load data on component mount
    useEffect(() => {
        loadTrendingRecipes();
        loadTopChefs();
        loadShopItems();
    }, []);

    // Load trending recipes
    const loadTrendingRecipes = async () => {
        setIsLoadingRecipes(true);
        try {
            const cachedRecipes = getCachedData('trending_recipes');
            if (cachedRecipes) {
                setTrendingRecipes(cachedRecipes);
                setIsLoadingRecipes(false);
                return;
            }

            const response = await recipesApi.getAllRecipes({
                sortBy: 'cook_count',
                order: 'desc',
                limit: 12,
                isPublic: true
            });

            const recipes = response.recipes || [];
            setTrendingRecipes(recipes);
            setCachedData('trending_recipes', recipes, 300);
        } catch (error) {
            console.error('Error loading trending recipes:', error);
            setTrendingRecipes([]);
        } finally {
            setIsLoadingRecipes(false);
        }
    };

    // Load top chefs
    const loadTopChefs = async () => {
        setIsLoadingChefs(true);
        try {
            const cachedChefs = getCachedData('top_chefs');
            if (cachedChefs) {
                setTopChefs(cachedChefs);
                setIsLoadingChefs(false);
                return;
            }

            const response = await usersApi.searchUsers('', {
                sortBy: 'level',
                order: 'desc',
                limit: 10
            });

            const chefs = response.users || [];
            setTopChefs(chefs);
            setCachedData('top_chefs', chefs, 300);
        } catch (error) {
            console.error('Error loading top chefs:', error);
            setTopChefs([]);
        } finally {
            setIsLoadingChefs(false);
        }
    };

    // Load shop items
    const loadShopItems = async () => {
        setIsLoadingShop(true);
        try {
            const cachedItems = getCachedData('shop_items');
            if (cachedItems) {
                setShopItems(cachedItems);
                setIsLoadingShop(false);
                return;
            }

            const response = await shopApi.getShopItems();
            const items = response.items || [];
            setShopItems(items);
            setCachedData('shop_items', items, 600);
        } catch (error) {
            console.error('Error loading shop items:', error);
            setShopItems([]);
        } finally {
            setIsLoadingShop(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            // Search for users
            const usersResponse = await usersApi.searchUsers(searchQuery, { limit: 5 });
            const users = usersResponse.users || [];

            // Search for recipes
            const recipesResponse = await recipesApi.getAllRecipes({
                search: searchQuery,
                limit: 5,
                isPublic: true
            });
            const recipes = recipesResponse.recipes || [];

            setSearchResults([
                ...users.map(u => ({ ...u, type: 'user' })),
                ...recipes.map(r => ({ ...r, type: 'recipe' }))
            ]);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const refreshData = () => {
        loadTrendingRecipes();
        loadTopChefs();
        loadShopItems();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
                                <FaCompass className="text-white" /> Discover
                            </h1>
                            <p className="text-xl text-orange-100">
                                Find amazing chefs, trending recipes, and shop items
                            </p>
                        </div>
                        <button
                            onClick={refreshData}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <FaSync /> Refresh
                        </button>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mt-8 max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for chefs, recipes, or ingredients..."
                                className="w-full px-6 py-4 pr-12 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 hover:text-orange-600"
                                disabled={isSearching}
                            >
                                <FaSearch className="text-xl" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('trending')}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'trending'
                                ? 'bg-white border-t border-l border-r border-gray-200 text-orange-600'
                                : 'text-gray-600 hover:text-orange-500'
                            }`}
                    >
                        <FaFire /> Trending
                    </button>
                    <button
                        onClick={() => setActiveTab('chefs')}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'chefs'
                                ? 'bg-white border-t border-l border-r border-gray-200 text-orange-600'
                                : 'text-gray-600 hover:text-orange-500'
                            }`}
                    >
                        <FaUsers /> Top Chefs
                    </button>
                    <button
                        onClick={() => setActiveTab('shop')}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'shop'
                                ? 'bg-white border-t border-l border-r border-gray-200 text-orange-600'
                                : 'text-gray-600 hover:text-orange-500'
                            }`}
                    >
                        <FaStar /> Shop
                    </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="mb-8 bg-white rounded-xl shadow p-6">
                        <h2 className="text-2xl font-bold mb-4">Search Results</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {searchResults.map((result) => (
                                result.type === 'user' ? (
                                    <Link key={result.id} to={`/profile/${result.id}`}>
                                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <img
                                                src={result.profile_picture || '/default-avatar.png'}
                                                alt={result.full_name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <h3 className="font-semibold">{result.full_name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Level {result.level} • {result.recipes_count || 0} recipes
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <Link key={result.id} to={`/recipe/${result.id}`}>
                                        <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <h3 className="font-semibold">{result.title}</h3>
                                            <p className="text-sm text-gray-500 truncate">{result.description}</p>
                                            <div className="flex items-center gap-2 mt-2 text-sm">
                                                <span>⭐ {result.rating || 'New'}</span>
                                                <span>•</span>
                                                <span>👤 {result.user?.full_name || 'Unknown Chef'}</span>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab Content */}
                <div className="space-y-8">
                    {/* Trending Section */}
                    {activeTab === 'trending' && (
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <FaFire className="text-orange-500" /> Trending Recipes
                                </h2>
                                <Link to="/recipes" className="text-orange-500 hover:text-orange-600 font-medium">
                                    View all recipes →
                                </Link>
                            </div>

                            {isLoadingRecipes ? (
                                <div className="py-12">
                                    <LoadingSpinner type="recipe-list" />
                                </div>
                            ) : trendingRecipes.length > 0 ? (
                                <RecipeList recipes={trendingRecipes} />
                            ) : (
                                <div className="text-center py-12">
                                    <FaFire className="text-4xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No trending recipes found</p>
                                </div>
                            )}

                            {/* Recipe Stats */}
                            {trendingRecipes.length > 0 && (
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-blue-700">Most Popular</h3>
                                        <p className="text-2xl font-bold mt-2">
                                            {trendingRecipes[0]?.title || 'N/A'}
                                        </p>
                                        <p className="text-sm text-blue-600">
                                            Cooked {trendingRecipes[0]?.cook_count || 0} times
                                        </p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-green-700">Fastest Growing</h3>
                                        <p className="text-2xl font-bold mt-2">
                                            {trendingRecipes[1]?.title || trendingRecipes[0]?.title || 'N/A'}
                                        </p>
                                        <p className="text-sm text-green-600">
                                            +125 cooks this week
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-purple-700">Highest Rated</h3>
                                        <p className="text-2xl font-bold mt-2">
                                            {trendingRecipes[2]?.title || trendingRecipes[0]?.title || 'N/A'}
                                        </p>
                                        <p className="text-sm text-purple-600">
                                            ⭐ 4.8 average rating
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Top Chefs Section */}
                    {activeTab === 'chefs' && (
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <FaUsers className="text-orange-500" /> Top Chefs
                                </h2>
                                <span className="text-sm text-gray-500">
                                    Updated just now
                                </span>
                            </div>

                            {isLoadingChefs ? (
                                <div className="py-12">
                                    <LoadingSpinner type="user" />
                                </div>
                            ) : topChefs.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                    {topChefs.slice(0, 5).map((chef, index) => (
                                        <UserCard key={chef.id} user={chef} showRank={index + 1} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FaUsers className="text-4xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No chefs found</p>
                                </div>
                            )}

                            {/* Additional chefs in grid */}
                            {topChefs.length > 5 && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold mb-4">More Top Chefs</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {topChefs.slice(5).map((chef) => (
                                            <UserCard key={chef.id} user={chef} compact={true} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Shop Section */}
                    {activeTab === 'shop' && (
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <FaStar className="text-yellow-500" /> Shop Items
                                </h2>
                                <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2">
                                    <FaFilter /> Filter
                                </button>
                            </div>

                            {isLoadingShop ? (
                                <div className="py-12">
                                    <LoadingSpinner />
                                </div>
                            ) : shopItems.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {shopItems.map((item) => (
                                        <ShopItem key={item.id} item={item} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FaStar className="text-4xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No shop items found</p>
                                </div>
                            )}

                            {/* Shop Stats */}
                            {currentUserData && (
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl">
                                        <h3 className="font-bold text-lg">Your Gold</h3>
                                        <p className="text-3xl font-bold mt-2">
                                            {currentUserData.stats?.gold_count || 0}
                                        </p>
                                        <p className="text-yellow-100 mt-1">Available balance</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                                        <h3 className="font-bold text-lg">Your Gems</h3>
                                        <p className="text-3xl font-bold mt-2">
                                            {currentUserData.stats?.gem_count || 0}
                                        </p>
                                        <p className="text-purple-100 mt-1">Premium currency</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                                        <h3 className="font-bold text-lg">Items Owned</h3>
                                        <p className="text-3xl font-bold mt-2">0</p>
                                        <p className="text-green-100 mt-1">In your inventory</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl p-8">
                    <h2 className="text-2xl font-bold mb-6">Ready to Level Up?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            to="/create-recipe"
                            className="bg-white/20 hover:bg-white/30 p-6 rounded-xl transition-colors text-center"
                        >
                            <div className="text-3xl mb-3">🍳</div>
                            <h3 className="font-bold text-lg">Create Recipe</h3>
                            <p className="text-white/80 mt-2">Share your culinary creations</p>
                        </Link>
                        <Link
                            to="/profile"
                            className="bg-white/20 hover:bg-white/30 p-6 rounded-xl transition-colors text-center"
                        >
                            <div className="text-3xl mb-3">👥</div>
                            <h3 className="font-bold text-lg">Find Friends</h3>
                            <p className="text-white/80 mt-2">Connect with other chefs</p>
                        </Link>
                        <Link
                            to="/shop"
                            className="bg-white/20 hover:bg-white/30 p-6 rounded-xl transition-colors text-center"
                        >
                            <div className="text-3xl mb-3">🏆</div>
                            <h3 className="font-bold text-lg">View Shop</h3>
                            <p className="text-white/80 mt-2">Get exclusive items</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscoverPage;