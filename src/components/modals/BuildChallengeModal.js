import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useData } from '../../contexts/DataContext.js';
import { makeId } from '../../hooks/uuidHelper.js';
import apiSheets from '../../constants/api.js';

export default function BuildChallengeModal({ show, onHide, onCreated }) {
  const { currentUserData, userRewardLimits } = useData();

  const [values, setValues] = useState({
    title: '',
    description: '',
    challengeId: '',
    createdAt: new Date().toISOString(),
    coverImage: '/src/assets/placeholders/new-challenge.png',
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
        coverImage: '/src/assets/placeholders/new-challenge.png',
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
    <Modal show={show} onHide={onHide} centered className="modal-ct" size="lg">
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

          {/* Basic Information */}
          <Form.Group className="mb-3">
            <Form.Label className="text-ct-ink fw-semibold">Challenge Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="Enter challenge title"
              required
              maxLength={100}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-ct-ink fw-semibold">Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Describe the challenge rules and objectives"
              required
              maxLength={500}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-ct-ink fw-semibold">Tags</Form.Label>
            <Form.Control
              type="text"
              name="tags"
              value={values.tags}
              onChange={handleChange}
              placeholder="Enter tags separated by commas (e.g., beginner, quick, healthy)"
              maxLength={200}
            />
            <Form.Text className="text-muted">
              Separate multiple tags with commas
            </Form.Text>
          </Form.Group>

          {/* Challenge Details */}
          <div className="row">
            <Form.Group className="col-md-6 mb-3">
              <Form.Label className="text-ct-ink fw-semibold">Total Cook Quota *</Form.Label>
              <Form.Control
                type="number"
                name="totalCookQuota"
                value={values.totalCookQuota}
                onChange={handleChange}
                min="1"
                max="1000"
                placeholder="Number of completions needed"
                required
              />
              <Form.Text className="text-muted">
                Total number of times this challenge needs to be completed
              </Form.Text>
            </Form.Group>

            <Form.Group className="col-md-6 mb-3">
              <Form.Label className="text-ct-ink fw-semibold">Cover Image URL</Form.Label>
              <Form.Control
                type="url"
                name="coverImage"
                value={values.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              <Form.Text className="text-muted">
                Optional: URL for challenge cover image
              </Form.Text>
            </Form.Group>
          </div>

          {/* Date Range */}
          <div className="row">
            <Form.Group className="col-md-6 mb-3">
              <Form.Label className="text-ct-ink fw-semibold">Start Date *</Form.Label>
              <Form.Control
                type="datetime-local"
                name="startDate"
                value={values.startDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="col-md-6 mb-3">
              <Form.Label className="text-ct-ink fw-semibold">End Date *</Form.Label>
              <Form.Control
                type="datetime-local"
                name="endDate"
                value={values.endDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </div>

          {/* Rewards Section */}
          <div className="border-top pt-3 mt-3">
            <h6 className="text-ct-ink mb-3">Rewards</h6>
            <div className="row">
              <Form.Group className="col-md-4 mb-3">
                <Form.Label className="text-ct-ink fw-semibold">
                  EXP Reward (Max: {rewardLimits.maxExpReward})
                </Form.Label>
                <Form.Control
                  type="number"
                  name="expReward"
                  value={values.expReward}
                  onChange={handleChange}
                  min="0"
                  max={rewardLimits.maxExpReward}
                  placeholder="0"
                />
              </Form.Group>

              <Form.Group className="col-md-4 mb-3">
                <Form.Label className="text-ct-ink fw-semibold">
                  Gold Reward (Max: {rewardLimits.maxGoldReward})
                </Form.Label>
                <Form.Control
                  type="number"
                  name="goldReward"
                  value={values.goldReward}
                  onChange={handleChange}
                  min="0"
                  max={rewardLimits.maxGoldReward}
                  placeholder="0"
                />
              </Form.Group>

              <Form.Group className="col-md-4 mb-3">
                <Form.Label className="text-ct-ink fw-semibold">
                  Gem Reward (Max: {rewardLimits.maxGemReward})
                </Form.Label>
                <Form.Control
                  type="number"
                  name="gemReward"
                  value={values.gemReward}
                  onChange={handleChange}
                  min="0"
                  max={rewardLimits.maxGemReward}
                  placeholder="0"
                />
              </Form.Group>
            </div>
          </div>
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