import React, { useState } from 'react';
import { FaCoins, FaGem, FaLock, FaCheck, FaTimes, FaReceipt } from 'react-icons/fa';
import { purchaseRecipe } from '../../api/purchase';
import { useAuth } from '../../hooks/useAuth';
import './PurchaseModal.css';

/**
 * PurchaseModal component for modal for purchasing recipes or shop items
 * Backend Endpoint: api/recipes/purchase.php, api/shop/purchase.php
 */
const PurchaseModal = ({ item, itemType = 'recipe', onClose, onPurchaseSuccess }) => {
    const { user } = useAuth();
    const [selectedCurrency, setSelectedCurrency] = useState('gold');
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [error, setError] = useState(null);
    const [purchaseComplete, setPurchaseComplete] = useState(false);

    const handlePurchase = async () => {
        if (!user?.id) {
            setError('You must be logged in to make purchases');
            return;
        }

        if (!item) {
            setError('No item selected for purchase');
            return;
        }

        setIsPurchasing(true);
        setError(null);

        try {
            let result;

            if (itemType === 'recipe') {
                result = await purchaseRecipe(item.id, selectedCurrency);
            } else {
                // For shop items, would call a different API
                // This is a placeholder - shop API needs to be implemented
                setError('Shop purchases not yet implemented');
                return;
            }

            // Mark purchase as complete
            setPurchaseComplete(true);

            // Call success callback if provided
            if (onPurchaseSuccess) {
                onPurchaseSuccess(result);
            }

            // Auto-close after 2 seconds on success
            setTimeout(() => {
                if (onClose) onClose();
            }, 2000);

        } catch (err) {
            setError(err.message || 'Purchase failed. Please try again.');
        } finally {
            setIsPurchasing(false);
        }
    };

    const getPrice = () => {
        if (selectedCurrency === 'gold') {
            return item.gold_price || 0;
        } else {
            return item.gem_price || 0;
        }
    };

    const canAfford = () => {
        if (!user?.stats) return false;

        if (selectedCurrency === 'gold') {
            return user.stats.gold_count >= (item.gold_price || 0);
        } else {
            return user.stats.gem_count >= (item.gem_price || 0);
        }
    };

    const getItemTitle = () => {
        if (itemType === 'recipe') {
            return `Purchase Recipe: ${item.title}`;
        } else {
            return `Purchase: ${item.name}`;
        }
    };

    const getIncludedFeatures = () => {
        if (itemType === 'recipe') {
            return [
                '✓ Step-by-step instructions',
                '✓ Nutritional information',
                '✓ Cooking timers',
                '✓ EXP & Gold rewards'
            ];
        } else {
            return [
                '✓ Instant delivery',
                '✓ No expiration',
                '✓ Can be used multiple times'
            ];
        }
    };

    if (purchaseComplete) {
        return (
            <div className="purchase-modal">
                <div className="modal-content success">
                    <div className="success-icon">
                        <FaCheck />
                    </div>
                    <h2>Purchase Successful!</h2>
                    <p>You now own {itemType === 'recipe' ? item.title : item.name}</p>
                    <div className="success-details">
                        <p>Price paid: {getPrice()} {selectedCurrency === 'gold' ? 'Gold' : 'Gems'}</p>
                    </div>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes /> Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="purchase-modal">
            <div className="modal-overlay" onClick={onClose}></div>

            <div className="modal-content">
                <div className="modal-header">
                    <h2>{getItemTitle()}</h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-body">
                    {item.cover_image && itemType === 'recipe' && (
                        <div className="item-image">
                            <img src={item.cover_image} alt={item.title} />
                        </div>
                    )}

                    {item.image_url && itemType !== 'recipe' && (
                        <div className="item-image">
                            <img src={item.image_url} alt={item.name} />
                        </div>
                    )}

                    <div className="item-description-section">
                        <p>{item.description || 'Get full access to this item'}</p>
                    </div>

                    <div className="currency-selection">
                        <h4>Select Currency:</h4>
                        <div className="currency-options">
                            {item.gold_price > 0 && (
                                <label className={`currency-option ${selectedCurrency === 'gold' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="currency"
                                        value="gold"
                                        checked={selectedCurrency === 'gold'}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
                                    />
                                    <FaCoins className="currency-icon" />
                                    <span className="currency-amount">{item.gold_price} Gold</span>
                                    <span className="currency-balance">
                                        (You have: {user?.stats?.gold_count || 0})
                                    </span>
                                </label>
                            )}

                            {item.gem_price > 0 && (
                                <label className={`currency-option ${selectedCurrency === 'gem' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="currency"
                                        value="gem"
                                        checked={selectedCurrency === 'gem'}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
                                    />
                                    <FaGem className="currency-icon" />
                                    <span className="currency-amount">{item.gem_price} Gems</span>
                                    <span className="currency-balance">
                                        (You have: {user?.stats?.gem_count || 0})
                                    </span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="included-features">
                        <h4>Included:</h4>
                        <ul>
                            {getIncludedFeatures().map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </div>

                    {error && (
                        <div className="error-message">
                            <FaTimes /> {error}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button className="cancel-button" onClick={onClose} disabled={isPurchasing}>
                            <FaTimes /> Cancel
                        </button>

                        <button
                            className={`purchase-button ${!canAfford() ? 'cannot-afford' : ''}`}
                            onClick={handlePurchase}
                            disabled={isPurchasing || !canAfford()}
                        >
                            {isPurchasing ? (
                                <>
                                    <span className="spinner"></span> Processing...
                                </>
                            ) : !canAfford() ? (
                                <>
                                    <FaLock /> Cannot Afford
                                </>
                            ) : (
                                <>
                                    <FaReceipt /> Purchase for {getPrice()} {selectedCurrency === 'gold' ? 'Gold' : 'Gems'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseModal;