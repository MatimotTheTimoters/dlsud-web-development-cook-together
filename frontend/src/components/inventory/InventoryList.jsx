import React, { useState, useEffect } from 'react';
import { FaFilter, FaSort, FaSearch, FaBoxOpen } from 'react-icons/fa';
import InventoryItem from './InventoryItem';
import { getUserInventory } from '../../api/inventory';
import { useAuth } from '../../hooks/useAuth';
import './InventoryList.css';

/**
 * InventoryList component for displaying user's inventory with filtering
 * Backend Endpoint: api/inventory/list.php
 */
const InventoryList = () => {
    const { user } = useAuth();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadInventory();
    }, [user?.id]);

    const loadInventory = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            setError(null);
            const items = await getUserInventory(user.id);
            setInventory(items);
        } catch (err) {
            setError('Failed to load inventory');
            console.error('Error loading inventory:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterByType = (items) => {
        if (filterType === 'all') return items;
        return items.filter(item => item.item_type === filterType);
    };

    const sortItems = (items) => {
        const sorted = [...items];

        switch (sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.purchased_at) - new Date(a.purchased_at));
            case 'quantity':
                return sorted.sort((a, b) => b.quantity - a.quantity);
            case 'expiring':
                const expiringItems = sorted.filter(item => item.expires_at);
                const nonExpiring = sorted.filter(item => !item.expires_at);

                expiringItems.sort((a, b) => new Date(a.expires_at) - new Date(b.expires_at));
                return [...expiringItems, ...nonExpiring];
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return sorted;
        }
    };

    const searchItems = (items) => {
        if (!searchQuery.trim()) return items;

        const query = searchQuery.toLowerCase();
        return items.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
    };

    const handleUseSuccess = (result) => {
        // Refresh inventory after using an item
        loadInventory();

        // Show success notification (could be implemented with a notification context)
        console.log('Item used successfully:', result);
    };

    const filteredInventory = searchItems(sortItems(filterByType(inventory)));

    if (loading) {
        return (
            <div className="inventory-list loading">
                <div className="loading-message">
                    <FaBoxOpen className="loading-icon" />
                    <p>Loading your inventory...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="inventory-list error">
                <div className="error-message">
                    <FaTimes /> {error}
                </div>
                <button onClick={loadInventory} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="inventory-list">
            <div className="inventory-header">
                <h2>📦 Inventory ({filteredInventory.length} items)</h2>

                <div className="inventory-controls">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-controls">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Items</option>
                            <option value="consumable">Consumables</option>
                            <option value="boost">Boosts</option>
                            <option value="currency">Currency</option>
                            <option value="equipment">Equipment</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="newest">Newest First</option>
                            <option value="quantity">Most Quantity</option>
                            <option value="expiring">Expiring Soon</option>
                            <option value="name">Alphabetical</option>
                        </select>
                    </div>
                </div>
            </div>

            {filteredInventory.length === 0 ? (
                <div className="empty-inventory">
                    <FaBoxOpen className="empty-icon" />
                    <h3>Your inventory is empty</h3>
                    <p>Visit the shop to purchase items!</p>
                </div>
            ) : (
                <div className="inventory-grid">
                    {filteredInventory.map(item => (
                        <InventoryItem
                            key={item.id}
                            item={item}
                            onUseSuccess={handleUseSuccess}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default InventoryList;