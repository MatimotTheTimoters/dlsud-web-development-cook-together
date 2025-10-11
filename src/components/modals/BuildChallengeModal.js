import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth.js';
import { generateUniqueId } from '../../hooks/uuidHelper.js';
import { useRewardLimits } from '../../hooks/useSheetData.js';
import apiLinks from '../../constants/api.js';

export default function BuildChallengeModal({ show, onHide, onCreated }) {
  const { user } = useAuth();
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
  
  // Use the custom hook for reward limits
  const { rewardLimits, loading: limitsLoading, error: limitsError } = useRewardLimits(user?.id);

  useEffect(() => {
    const generateChallengeId = async () => {
      try {
        const id = await generateUniqueId(apiLinks.challengesCookQuota, { idField: 'challengeId' });
        setValues((prev) => ({ ...prev, challengeId: id }));
      } catch (err) {
        console.error('Failed to generate challenge ID:', err);
      }
    };

    if (show) generateChallengeId();
  }, [show]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
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

      // Show loading state if reward limits are still loading
      if (limitsLoading) {
        alert('Please wait while we load your reward limits...');
        setLoading(false);
        return;
      }

      // Show error if reward limits failed to load
      if (limitsError) {
        alert('Failed to load reward limits. Please try again.');
        setLoading(false);
        return;
      }

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
            tags: values.tags.split(',').map((tag) => tag.trim()).join(','),
            author: user?.id || '',
          },
        ],
      };

      const res = await fetch(apiLinks.challengesCookQuota, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Failed to create challenge: ${res.status} ${txt}`);
      }

      if (typeof onCreated === 'function') onCreated(values);
      onHide();
    } catch (err) {
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
          {/* Reward Limits Status Display */}
          {limitsLoading && (
            <div className="alert alert-info mb-3">
              Loading your reward limits...
            </div>
          )}
          
          {limitsError && (
            <div className="alert alert-warning mb-3">
              Unable to load reward limits. Using default values.
            </div>
          )}

          {/* Reward Limits Info */}
          {!limitsLoading && !limitsError && (
            <div className="mb-3 p-3 bg-light rounded">
              <h6 className="text-ct-muted mb-2">Your Reward Limits</h6>
              <div className="d-flex justify-content-between small">
                <span>Max EXP: <strong>{rewardLimits.maxExpReward}</strong></span>
                <span>Max Gold: <strong>{rewardLimits.maxGoldReward}</strong></span>
                <span>Max Gems: <strong>{rewardLimits.maxGemReward}</strong></span>
              </div>
            </div>
          )}

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">Title</Form.Label>
            <Form.Control
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="Enter challenge title"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Enter challenge description"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">Tags</Form.Label>
            <Form.Control
              name="tags"
              value={values.tags}
              onChange={handleChange}
              placeholder="Enter tags (comma-separated)"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">Total Cook Quota</Form.Label>
            <Form.Control
              type="number"
              name="totalCookQuota"
              value={values.totalCookQuota}
              onChange={handleChange}
              placeholder="Enter total cook quota"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">Start Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="startDate"
              value={values.startDate}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">End Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="endDate"
              value={values.endDate}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">
              Experience Reward {!limitsLoading && `(Max: ${rewardLimits.maxExpReward})`}
            </Form.Label>
            <Form.Control
              type="number"
              name="expReward"
              value={values.expReward}
              onChange={handleChange}
              max={rewardLimits.maxExpReward}
              placeholder={limitsLoading ? 'Loading limits...' : `Max: ${rewardLimits.maxExpReward}`}
              disabled={limitsLoading || limitsError}
            />
            {!limitsLoading && (
              <Form.Text className="text-muted">
                Available: {rewardLimits.maxExpReward - values.expReward}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">
              Gold Reward {!limitsLoading && `(Max: ${rewardLimits.maxGoldReward})`}
            </Form.Label>
            <Form.Control
              type="number"
              name="goldReward"
              value={values.goldReward}
              onChange={handleChange}
              max={rewardLimits.maxGoldReward}
              placeholder={limitsLoading ? 'Loading limits...' : `Max: ${rewardLimits.maxGoldReward}`}
              disabled={limitsLoading || limitsError}
            />
            {!limitsLoading && (
              <Form.Text className="text-muted">
                Available: {rewardLimits.maxGoldReward - values.goldReward}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-ct-muted">
              Gem Reward {!limitsLoading && `(Max: ${rewardLimits.maxGemReward})`}
            </Form.Label>
            <Form.Control
              type="number"
              name="gemReward"
              value={values.gemReward}
              onChange={handleChange}
              max={rewardLimits.maxGemReward}
              placeholder={limitsLoading ? 'Loading limits...' : `Max: ${rewardLimits.maxGemReward}`}
              disabled={limitsLoading || limitsError}
            />
            {!limitsLoading && (
              <Form.Text className="text-muted">
                Available: {rewardLimits.maxGemReward - values.gemReward}
              </Form.Text>
            )}
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
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading || limitsLoading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="btn-ct-primary" 
            disabled={loading || limitsLoading || limitsError}
          >
            {loading ? 'Saving…' : limitsLoading ? 'Loading Limits...' : 'Create'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}