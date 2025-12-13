import React, { useState } from 'react';
import { FaShoppingCart, FaLock, FaCheck, FaCoins, FaGem, FaExclamationTriangle } from 'react-icons/fa';
import { purchaseItem } from '../../api/shop';
import { useAuth } from '../../hooks/useAuth';

/**
 * ShopItem component for displaying shop items with purchase functionality
 * Backend Endpoint: api/shop/purchase.php
 */
const ShopItem = ({ item, onPurchaseSuccess }) => {
    const { user } = useAuth();
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [purchaseError, setPurchaseError] = useState(null);
    const [isPurchased, setIsPurchased] = useState(false);

    const canAfford = () => {
        if (!user?.stats || !item) return false;

        if (item.gold_price > 0 && user.stats.gold_count < item.gold_price) return false;
        if (item.gem_price > 0 && user.stats.gem_count < item.gem_price) return false;

        return true;
    };

    const hasRequiredLevel = () => {
        if (!user?.stats) return false;
        if (!item.required_level) return true;

        return (user.stats.level || 1) >= item.required_level;
    };

    const isAvailable = () => {
        if (item.is_available === false) return false;
        if (item.stock_quantity === 0) return false;
        return true;
    };

    const handlePurchase = async () => {
        if (!user?.id) {
            setPurchaseError('You must be logged in to make purchases');
            return;
        }

        if (!canAfford()) {
            setPurchaseError('You cannot afford this item');
            return;
        }

        if (!hasRequiredLevel()) {
            setPurchaseError(`Requires level ${item.required_level}`);
            return;
        }

        if (!isAvailable()) {
            setPurchaseError('This item is not available');
            return;
        }

        setIsPurchasing(true);
        setPurchaseError(null);

        try {
            const purchaseResult = await purchaseItem(item.id);

            // Update local state
            setIsPurchased(true);

            // Call success callback if provided
            if (onPurchaseSuccess) {
                onPurchaseSuccess(purchaseResult);
            }

            // Reset error state
            setPurchaseError(null);

        } catch (error) {
            setPurchaseError(error.message || 'Purchase failed. Please try again.');
        } finally {
            setIsPurchasing(false);
        }
    };

    const getPriceDisplay = () => {
        if (item.gold_price > 0 && item.gem_price > 0) {
            return (
                <div className="item-prices">
                    <span className="price gold-price">
                        <FaCoins /> {item.gold_price.toLocaleString()}G
                    </span>
                    <span className="price-separator">or</span>
                    <span className="price gem-price">
                        <FaGem /> {item.gem_price.toLocaleString()}
                    </span>
                </div>
            );
        } else if (item.gold_price > 0) {
            return (
                <div className="item-price gold-price">
                    <FaCoins /> {item.gold_price.toLocaleString()}G
                </div>
            );
        } else if (item.gem_price > 0) {
            return (
                <div className="item-price gem-price">
                    <FaGem /> {item.gem_price.toLocaleString()}
                </div>
            );
        }
        return <div className="item-price free">FREE</div>;
    };

    const getPurchaseButton = () => {
        if (!isAvailable()) {
            return (
                <button className="purchase-button unavailable" disabled>
                    <FaExclamationTriangle /> Out of Stock
                </button>
            );
        }

        if (!hasRequiredLevel()) {
            return (
                <button className="purchase-button locked" disabled>
                    <FaLock /> Level {item.required_level}+
                </button>
            );
        }

        if (!canAfford()) {
            return (
                <button className="purchase-button cannot-afford" disabled>
                    <FaLock /> Cannot Afford
                </button>
            );
        }

        if (isPurchased) {
            return (
                <button className="purchase-button purchased" disabled>
                    <FaCheck /> Purchased
                </button>
            );
        }

        return (
            <button
                className={`purchase-button ${isPurchasing ? 'purchasing' : 'available'}`}
                onClick={handlePurchase}
                disabled={isPurchasing}
            >
                {isPurchasing ? (
                    <>
                        <span className="spinner"></span> Processing...
                    </>
                ) : (
                    <>
                        <FaShoppingCart /> Purchase
                    </>
                )}
            </button>
        );
    };

    return (
        <div className={`shop-item ${!isAvailable() ? 'unavailable' : ''} ${isPurchased ? 'purchased' : ''}`}>
            <div className="item-image">
                {item.image_url ? (
                    <img src={item.image_url} alt={item.name} />
                ) : (
                    <div className="item-image-placeholder">
                        {item.item_type === 'consumable' ? '🍯' :
                            item.item_type === 'boost' ? '⚡' :
                                item.item_type === 'currency' ? '💰' : '🎁'}
                    </div>
                )}
            </div>

            <div className="item-content">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>

                <div className="item-meta">
                    <div className="item-category">{item.category}</div>
                    {item.duration_days && (
                        <div className="item-duration">
                            {item.duration_days} days
                        </div>
                    )}
                </div>

                <div className="item-pricing">
                    {getPriceDisplay()}
                </div>

                {purchaseError && (
                    <div className="purchase-error">
                        <FaExclamationTriangle /> {purchaseError}
                    </div>
                )}

                <div className="item-actions">
                    {getPurchaseButton()}
                </div>
            </div>
        </div>
    );
};

export default ShopItem;