import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth.js';
import { useData } from '../../contexts/DataContext.js';
import { generateUniqueId } from '../../hooks/uuidHelper.js';
import apiSheets from '../../constants/api.js';

export default function BuildChallengeModal({ show, onHide, onCreated }) {
  const { user } = useAuth();
  const { currentUserData } = useData(); // Get user data from context
  
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
  
  // Calculate reward limits from context data instead of API call
  const rewardLimits = React.useMemo(() => {
    if (!currentUserData) {
      return {
        maxExpReward: 100,
        maxGoldReward: 50,
        maxGemReward: 10,
      };
    }

    // Calculate based on user stats from context
    const baseExp = 100;
    const baseGold = 50;
    const baseGem = 5;
    
    const level = currentUserData.level || 1;
    const recipesCreated = currentUserData.recipesCreated || 0;
    const loginStreak = currentUserData.loginStreak || 0;
    
    // Simple calculation (you can replace with your rewardCalculator logic)
    return {
      maxExpReward: Math.min(baseExp + (level * 10) + (recipesCreated * 2), 1000),
      maxGoldReward: Math.min(baseGold + (level * 5) + (loginStreak * 1), 500),
      maxGemReward: Math.min(baseGem + (level * 1) + Math.floor(recipesCreated / 5), 50),
    };
  }, [currentUserData]);

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      setValues({
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
    }
  }, [show]);

  useEffect(() => {
    const generateChallengeId = async () => {
      try {
        const id = await generateUniqueId(apiSheets.challengesCookQuota, { idField: 'challengeId' });
        setValues((prev) => ({ ...prev, challengeId: id }));
      } catch (err) {
        console.error('Failed to generate challenge ID:', err);
      }
    };

    if (show) generateChallengeId();
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

      const payload = {
        data: [
          {
            ...values,
            tags: values.tags.split(',').map((tag) => tag.trim()).filter(tag => tag).join(','),
            author: user?.id || '',
            participantCount: 0,
            status: 'active',
            createdBy: user?.id || '',
          },
        ],
      };

      console.log('📦 Challenge Payload:', payload);

      const res = await fetch(apiSheets.challengesCookQuota, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Failed to create challenge: ${res.status} ${txt}`);
      }

      // Update user's challenges created count in context (would need context update function)
      if (user?.id) {
        try {
          const userUpdateResponse = await fetch(`${apiSheets.users}?id=${user.id}`);
          const userData = await userUpdateResponse.json();
          if (userData.length > 0) {
            const currentUser = userData[0];
            const updatedChallengesCreated = (parseInt(currentUser.challengesCreated) || 0) + 1;
            
            await fetch(apiSheets.users, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                data: {
                  id: user.id,
                  challengesCreated: updatedChallengesCreated
                }
              })
            });
          }
        } catch (updateError) {
          console.warn('Failed to update user challenges count:', updateError);
          // Continue anyway - this is non-critical
        }
      }

      if (typeof onCreated === 'function') {
        onCreated({
          ...values,
          id: values.challengeId, // For consistency with other components
          author: user?.id || '',
          participantCount: 0,
          status: 'active'
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
          {/* Reward Limits Info - Always visible since data comes from context */}
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

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">Title *</Form.Label>
            <Form.Control
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="Enter challenge title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Enter challenge description"
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">Tags</Form.Label>
            <Form.Control
              name="tags"
              value={values.tags}
              onChange={handleChange}
              placeholder="Enter tags (comma-separated) e.g., weekly, cooking, beginner"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">Total Cook Quota *</Form.Label>
            <Form.Control
              type="number"
              name="totalCookQuota"
              value={values.totalCookQuota}
              onChange={handleChange}
              placeholder="Enter total cook quota"
              min="1"
              required
            />
            <Form.Text className="text-muted">
              How many recipes need to be cooked to complete this challenge
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">Start Date *</Form.Label>
            <Form.Control
              type="datetime-local"
              name="startDate"
              value={values.startDate}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">End Date *</Form.Label>
            <Form.Control
              type="datetime-local"
              name="endDate"
              value={values.endDate}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">
              Experience Reward (Max: {rewardLimits.maxExpReward})
            </Form.Label>
            <Form.Control
              type="number"
              name="expReward"
              value={values.expReward}
              onChange={handleChange}
              min="0"
              max={rewardLimits.maxExpReward}
              placeholder={`Max: ${rewardLimits.maxExpReward}`}
            />
            <Form.Text className="text-muted">
              Available: {rewardLimits.maxExpReward - values.expReward} EXP
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">
              Gold Reward (Max: {rewardLimits.maxGoldReward})
            </Form.Label>
            <Form.Control
              type="number"
              name="goldReward"
              value={values.goldReward}
              onChange={handleChange}
              min="0"
              max={rewardLimits.maxGoldReward}
              placeholder={`Max: ${rewardLimits.maxGoldReward}`}
            />
            <Form.Text className="text-muted">
              Available: {rewardLimits.maxGoldReward - values.goldReward} Gold
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">
              Gem Reward (Max: {rewardLimits.maxGemReward})
            </Form.Label>
            <Form.Control
              type="number"
              name="gemReward"
              value={values.gemReward}
              onChange={handleChange}
              min="0"
              max={rewardLimits.maxGemReward}
              placeholder={`Max: ${rewardLimits.maxGemReward}`}
            />
            <Form.Text className="text-muted">
              Available: {rewardLimits.maxGemReward - values.gemReward} Gems
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">Cover Image</Form.Label>
            <Form.Control
              type="text"
              name="coverImage"
              value={values.coverImage}
              disabled
              className="input-disabled-surface"
            />
            <Form.Text className="text-muted">
              Default challenge image will be used
            </Form.Text>
          </Form.Group>
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