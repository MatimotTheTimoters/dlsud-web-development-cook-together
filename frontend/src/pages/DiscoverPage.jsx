import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import UserCard from '../components/users/UserCard';
import RecipeCard from '../components/recipes/RecipeCard';
import { FaCompass, FaFire, FaTrophy, FaUsers, FaSearch, FaFilter, FaSync } from 'react-icons/fa';
import * as usersApi from '../api/users';
import * as recipesApi from '../api/recipes';
import * as relationshipsApi from '../api/relationships';
import { DataContext } from '../contexts/DataContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * DiscoverPage Component
 * Page for discovering users, recipes, and community challenges
 */
const DiscoverPage = () => {
    const { updateUsers, updateRecipes, getCachedData, setCachedData } = useContext(DataContext);

    // State for top chefs
    const [topChefs, setTopChefs] = useState([]);
    const [isLoadingChefs, setIsLoadingChefs] = useState(true);

    // State for trending recipes
    const [trendingRecipes, setTrendingRecipes] = useState([]);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);

    // State for community challenges
    const [communityChallenges, setCommunityChallenges] = useState([
        {
            id: 1,
            title: 'Vegan Week Challenge',
            description: 'Cook 5 vegan recipes this week',
            participants: 342,
            reward: '🏆 Vegan Chef Badge + 500 Gold',
            endsIn: '3 days',
            difficulty: 'medium'
        },
        {
            id: 2,
            title: 'Master Chef Competition',
            description: 'Top 10% get exclusive rewards',
            participants: 128,
            reward: '👑 Master Chef Title + 1000 Gems',
            endsIn: '1 week',
            difficulty: 'hard'
        },
        {
            id: 3,
            title: 'Quick Meal Challenge',
            description: 'Cook meals under 30 minutes',
            participants: 215,
            reward: '⚡ Speed Chef Badge + 250 Gold',
            endsIn: '2 days',
            difficulty: 'easy'
        }
    ]);

    // State for search
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Active tab
    const [activeTab, setActiveTab] = useState('chefs'); // 'chefs', 'recipes', 'challenges'

    // Load data on component mount
    useEffect(() => {
        loadTopChefs();
        loadTrendingRecipes();
    }, []);

    // Check cache first, then load from API
    const loadTopChefs = async () => {
        setIsLoadingChefs(true);

        try {
            // Check cache first
            const cachedChefs = getCachedData('top_chefs');
            if (cachedChefs) {
                setTopChefs(cachedChefs);
                setIsLoadingChefs(false);
                return;
            }

            // Load from API - using search with level filter to get top users
            const response = await usersApi.searchUsers('', { sortBy: 'level', order: 'desc', limit: 10 });
            const chefs = response.users || [];

            setTopChefs(chefs);
            setCachedData('top_chefs', chefs, 300); // Cache for 5 minutes
            updateUsers(chefs); // Update global context
        } catch (error) {
            console.error('Error loading top chefs:', error);
            // Fallback to sample data
            setTopChefs(getSampleChefs());
        } finally {
            setIsLoadingChefs(false);
        }
    };

    const loadTrendingRecipes = async () => {
        setIsLoadingRecipes(true);

        try {
            // Check cache first
            const cachedRecipes = getCachedData('trending_recipes');
            if (cachedRecipes) {
                setTrendingRecipes(cachedRecipes);
                setIsLoadingRecipes(false);
                return;
            }

            // Load from API - get recipes sorted by popularity (cook_count)
            const response = await recipesApi.getAllRecipes({
                sortBy: 'cook_count',
                order: 'desc',
                limit: 12,
                isPublic: true
            });

            const recipes = response.recipes || [];
            setTrendingRecipes(recipes);
            setCachedData('trending_recipes', recipes, 300); // Cache for 5 minutes
            updateRecipes(recipes); // Update global context
        } catch (error) {
            console.error('Error loading trending recipes:', error);
            // Fallback to empty array
            setTrendingRecipes([]);
        } finally {
            setIsLoadingRecipes(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

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

            setSearchResults([...users.map(u => ({ ...u, type: 'user' })), ...recipes.map(r => ({ ...r, type: 'recipe' }))]);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const refreshData = () => {
        loadTopChefs();
        loadTrendingRecipes();
    };

    // Sample data fallback
    const getSampleChefs = () => {
        return [
            { id: 'usr_001', full_name: 'Chef Marco', level: 25, profile_picture: null, recipes_count: 42 },
            { id: 'usr_002', full_name: 'Chef Sarah', level: 22, profile_picture: null, recipes_count: 38 },
            { id: 'usr_003', full_name: 'Chef Alex', level: 20, profile_picture: null, recipes_count: 35 },
            { id: 'usr_004', full_name: 'Chef Maria', level: 18, profile_picture: null, recipes_count: 29 },
            { id: 'usr_005', full_name: 'Chef David', level: 17, profile_picture: null, recipes_count: 26 }
        ];
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
                                <FaCompass className="text-white" /> Discover
                            </h1>
                            <p className="text-xl text-blue-100">
                                Find amazing chefs, trending recipes, and community challenges
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
                                className="w-full px-6 py-4 pr-12 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
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
                        onClick={() => setActiveTab('chefs')}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'chefs'
                                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                                : 'text-gray-600 hover:text-blue-500'
                            }`}
                    >
                        <FaUsers /> Top Chefs
                    </button>
                    <button
                        onClick={() => setActiveTab('recipes')}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'recipes'
                                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                                : 'text-gray-600 hover:text-blue-500'
                            }`}
                    >
                        <FaFire /> Trending Recipes
                    </button>
                    <button
                        onClick={() => setActiveTab('challenges')}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'challenges'
                                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                                : 'text-gray-600 hover:text-blue-500'
                            }`}
                    >
                        <FaTrophy /> Challenges
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
                                                <p className="text-sm text-gray-500">Level {result.level} • {result.recipes_count || 0} recipes</p>
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
                    {/* Top Chefs Section */}
                    {activeTab === 'chefs' && (
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <FaUsers className="text-blue-500" /> Top Chefs This Week
                                </h2>
                                <span className="text-sm text-gray-500">
                                    Updated just now
                                </span>
                            </div>

                            {isLoadingChefs ? (
                                <div className="py-12">
                                    <LoadingSpinner />
                                </div>
                            ) : topChefs.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                    {topChefs.map((chef, index) => (
                                        <div key={chef.id} className="text-center">
                                            <div className="relative">
                                                <Link to={`/profile/${chef.id}`}>
                                                    <img
                                                        src={chef.profile_picture || '/default-avatar.png'}
                                                        alt={chef.full_name}
                                                        className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                                                    />
                                                </Link>
                                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                                                    #{index + 1}
                                                </div>
                                            </div>
                                            <h3 className="font-semibold mt-3">{chef.full_name}</h3>
                                            <p className="text-sm text-gray-600">Level {chef.level}</p>
                                            <p className="text-xs text-gray-500">
                                                {chef.recipes_count || 0} recipes
                                            </p>
                                            <Link
                                                to={`/profile/${chef.id}`}
                                                className="mt-3 inline-block text-blue-500 hover:text-blue-600 text-sm font-medium"
                                            >
                                                View Profile →
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FaUsers className="text-4xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No chefs found</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Trending Recipes Section */}
                    {activeTab === 'recipes' && (
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <FaFire className="text-orange-500" /> Trending Recipes
                                </h2>
                                <Link to="/recipes" className="text-blue-500 hover:text-blue-600 font-medium">
                                    View all recipes →
                                </Link>
                            </div>

                            {isLoadingRecipes ? (
                                <div className="py-12">
                                    <LoadingSpinner />
                                </div>
                            ) : trendingRecipes.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {trendingRecipes.map((recipe) => (
                                        <RecipeCard key={recipe.id} recipe={recipe} />
                                    ))}
                                </div>
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

                    {/* Community Challenges Section */}
                    {activeTab === 'challenges' && (
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <FaTrophy className="text-yellow-500" /> Community Challenges
                                </h2>
                                <button className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-2">
                                    <FaFilter /> Filter
                                </button>
                            </div>

                            <div className="space-y-4">
                                {communityChallenges.map((challenge) => (
                                    <div key={challenge.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                                                <p className="text-gray-600 mb-4">{challenge.description}</p>

                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <FaUsers className="text-gray-400" />
                                                        <span className="font-medium">{challenge.participants} participants</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaTrophy className="text-yellow-500" />
                                                        <span className="font-medium">{challenge.reward}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                                                challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                            }`}>
                                                            {challenge.difficulty}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-sm text-gray-500 mb-2">Ends in</div>
                                                <div className="text-lg font-bold text-blue-600">{challenge.endsIn}</div>
                                                <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                                    Join Challenge
                                                </button>
                                            </div>
                                        </div>

                                        {/* Progress bar (example) */}
                                        <div className="mt-6">
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>Progress</span>
                                                <span>42% complete</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{ width: '42%' }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Challenge Stats */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                                    <h3 className="font-bold text-lg">Total Participants</h3>
                                    <p className="text-3xl font-bold mt-2">685</p>
                                    <p className="text-blue-100 mt-1">Active this month</p>
                                </div>
                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                                    <h3 className="font-bold text-lg">Rewards Distributed</h3>
                                    <p className="text-3xl font-bold mt-2">12,450G</p>
                                    <p className="text-purple-100 mt-1">+ 845 Gems</p>
                                </div>
                                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                                    <h3 className="font-bold text-lg">Recipes Created</h3>
                                    <p className="text-3xl font-bold mt-2">128</p>
                                    <p className="text-green-100 mt-1">Through challenges</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8">
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
                            to="/discover?tab=chefs"
                            className="bg-white/20 hover:bg-white/30 p-6 rounded-xl transition-colors text-center"
                        >
                            <div className="text-3xl mb-3">👥</div>
                            <h3 className="font-bold text-lg">Find Friends</h3>
                            <p className="text-white/80 mt-2">Connect with other chefs</p>
                        </Link>
                        <Link
                            to="/challenges"
                            className="bg-white/20 hover:bg-white/30 p-6 rounded-xl transition-colors text-center"
                        >
                            <div className="text-3xl mb-3">🏆</div>
                            <h3 className="font-bold text-lg">View Challenges</h3>
                            <p className="text-white/80 mt-2">Join community events</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscoverPage;