import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useData } from '../../contexts/DataContext.js'; // 🚀 Only need useData
import { makeId } from '../../hooks/uuidHelper.js';
import apiSheets from '../../constants/api.js';

export default function BuildChallengeModal({ show, onHide, onCreated }) {
  const { currentUserData, userRewardLimits } = useData(); // 🚀 Get both from DataContext

  const [values, setValues] = useState({
    title: '',
    description: '',
    challengeId: '',
    createdAt: new Date().toISOString(),
    coverImage: '/src/assets/placeholders/new-recipe.png',
    tags: '',
    totalCookQuota: 0,
    startDate: '',
    endDate: '',
    expReward: 0,
    goldReward: 0,
    gemReward: 0,
  });
  const [loading, setLoading] = useState(false);

  const rewardLimits = React.useMemo(() => {
    // Use the pre-calculated limits from DataContext
    return {
      maxExpReward: userRewardLimits?.maxExp || 100,
      maxGoldReward: userRewardLimits?.maxGold || 50,
      maxGemReward: userRewardLimits?.maxGem || 10,
    };
  }, [userRewardLimits]);

  // Reset form and generate ID locally when modal opens
  useEffect(() => {
    if (show) {
      setValues({
        title: '',
        description: '',
        challengeId: makeId(), // Generate ID locally
        createdAt: new Date().toISOString(),
        coverImage: '/src/assets/placeholders/new-recipe.png',
        tags: '',
        totalCookQuota: 0,
        startDate: '',
        endDate: '',
        expReward: 0,
        goldReward: 0,
        gemReward: 0,
      });
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Auto-cap values to reward limits
    if (['expReward', 'goldReward', 'gemReward'].includes(name)) {
      const numValue = Number(value);
      const maxField = `max${name.charAt(0).toUpperCase() + name.slice(1)}Reward`;
      const cappedValue = Math.min(Math.max(0, numValue), rewardLimits[maxField]);
      setValues((prev) => ({ ...prev, [name]: cappedValue }));
      return;
    }

    setValues((prev) => ({
      ...prev,
      [name]: type === 'number' ? Math.max(0, Number(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!values.title.trim() || !values.description.trim()) {
        alert('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      if (!values.startDate || !values.endDate) {
        alert('Please set both start and end dates.');
        setLoading(false);
        return;
      }

      // Validate dates
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      if (endDate <= startDate) {
        alert('End date must be after start date.');
        setLoading(false);
        return;
      }

      if (values.totalCookQuota <= 0) {
        alert('Total cook quota must be greater than 0.');
        setLoading(false);
        return;
      }

      // Reward validation using context data
      if (
        values.expReward > rewardLimits.maxExpReward ||
        values.goldReward > rewardLimits.maxGoldReward ||
        values.gemReward > rewardLimits.maxGemReward
      ) {
        alert('Reward values exceed the allowed limits.');
        setLoading(false);
        return;
      }

      // Get user ID from currentUserData (already in DataContext)
      const userId = currentUserData?.id || '';

      // Prepare payload
      const payload = {
        data: [
          {
            ...values,
            tags: values.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag)
              .join(','),
            author: userId,
            participantCount: 0,
            status: 'active',
            createdBy: userId,
          },
        ],
      };

      console.log('📦 Challenge Payload:', payload);

      // Post challenge to SheetDB
      const res = await fetch(apiSheets.challengesCookQuota, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Failed to create challenge: ${res.status} ${txt}`);
      }

      if (typeof onCreated === 'function') {
        onCreated({
          ...values,
          id: values.challengeId,
          author: userId,
          participantCount: 0,
          status: 'active',
        });
      }

      onHide();
    } catch (err) {
      console.error('Challenge creation error:', err);
      alert('Failed to create challenge: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="modal-ct">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="text-ct-ink">Create Challenge</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Reward Limits Info */}
          <div className="mb-3 p-3 bg-light rounded">
            <h6 className="text-ct-muted mb-2">Your Reward Limits</h6>
            <div className="d-flex justify-content-between small">
              <span>Max EXP: <strong>{rewardLimits.maxExpReward}</strong></span>
              <span>Max Gold: <strong>{rewardLimits.maxGoldReward}</strong></span>
              <span>Max Gems: <strong>{rewardLimits.maxGemReward}</strong></span>
            </div>
            {currentUserData && (
              <div className="mt-2 text-muted small">
                Based on: Level {currentUserData.level || 1} • 
                {currentUserData.recipesCreated || 0} recipes created • 
                {currentUserData.loginStreak || 0} day streak
              </div>
            )}
          </div>

          {/* ... rest of your form JSX remains the same ... */}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="btn-ct-primary" 
            disabled={loading}
          >
            {loading ? 'Creating Challenge…' : 'Create Challenge'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}