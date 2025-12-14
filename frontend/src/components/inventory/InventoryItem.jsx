import React, { useState } from 'react';
import { FaCheck, FaTimes, FaBox, FaFire, FaClock, FaInfoCircle } from 'react-icons/fa';
import { useConsumable } from '../../api/inventory';

/**
 * InventoryItem component for displaying inventory item with use functionality for consumables
 * Backend Endpoint: api/inventory/use.php
 */
const InventoryItem = ({ item, onUseSuccess }) => {
    const [isUsing, setIsUsing] = useState(false);
    const [error, setError] = useState(null);

    const handleUse = async () => {
        if (!item.id) return;

        setIsUsing(true);
        setError(null);

        try {
            const result = await useConsumable(item.id);

            if (onUseSuccess) {
                onUseSuccess(result);
            }
        } catch (err) {
            setError(err.message || 'Failed to use item');
        } finally {
            setIsUsing(false);
        }
    };

    const getEffectDescription = () => {
        switch (item.item_type) {
            case 'boost':
                return `+${item.effect_value}% ${item.category} boost`;
            case 'consumable':
                return `Grants ${item.effect_value} ${item.category}`;
            case 'currency':
                return `Adds ${item.effect_value} ${item.category}`;
            default:
                return item.description || 'No effect description';
        }
    };

    const getTimeRemaining = () => {
        if (!item.expires_at) return null;

        const expires = new Date(item.expires_at);
        const now = new Date();
        const diffMs = expires - now;

        if (diffMs <= 0) return 'Expired';

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (diffDays > 0) return `${diffDays}d ${diffHours}h`;
        return `${diffHours}h`;
    };

    const getItemIcon = () => {
        switch (item.category) {
            case 'avatar':
                return '👤';
            case 'tool':
                return '🔪';
            case 'ingredient':
                return '🥕';
            case 'boost':
                return '⚡';
            case 'currency':
                return '💰';
            default:
                return '🎁';
        }
    };

    const isConsumable = item.item_type === 'consumable';
    const isEquipped = item.is_equipped;
    const isExpired = item.expires_at && new Date(item.expires_at) < new Date();

    return (
        <div className={`inventory-item ${isExpired ? 'expired' : ''} ${isEquipped ? 'equipped' : ''}`}>
            <div className="item-header">
                <div className="item-icon">{getItemIcon()}</div>
                {isEquipped && <div className="equipped-badge">Equipped</div>}
                {isExpired && <div className="expired-badge">Expired</div>}
            </div>

            <div className="item-content">
                <h4 className="item-name">{item.name}</h4>
                <p className="item-description">{getEffectDescription()}</p>

                <div className="item-meta">
                    {item.quantity > 1 && (
                        <div className="item-quantity">×{item.quantity}</div>
                    )}
                    {item.expires_at && (
                        <div className="item-expiry">
                            <FaClock /> {getTimeRemaining()}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="item-error">
                        <FaTimes /> {error}
                    </div>
                )}

                <div className="item-actions">
                    {isConsumable && !isExpired && (
                        <button
                            className={`use-button ${isUsing ? 'using' : ''}`}
                            onClick={handleUse}
                            disabled={isUsing || isExpired}
                        >
                            {isUsing ? (
                                <>
                                    <span className="spinner"></span> Using...
                                </>
                            ) : (
                                <>
                                    <FaFire /> Use Now
                                </>
                            )}
                        </button>
                    )}

                    {!isConsumable && (
                        <button className="info-button" title="View item details">
                            <FaInfoCircle /> Details
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryItem;