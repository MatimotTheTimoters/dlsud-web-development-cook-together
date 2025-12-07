import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
//import apiSheets from '../constants/api.js';
import { generateBatchIds } from '../hooks/uuidHelper.js';
import { useAuth } from '../hooks/useAuth.js';
import { calculateAllUserLimits, calculateLevelUpRequirements } from '../utils/userCalculations.js';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // For auto-login after registration

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: '',
    age: 18,
    gender: 'non-binary',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.password) {
      return "Please fill in full name, email, and password.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (form.password !== form.confirm) {
      return "Passwords do not match.";
    }
    if (form.age < 13) {
      return "You must be at least 13 years old to register.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Generate user ID locally
      const [id] = await generateBatchIds(1, 'user');

      // Set default values for the new user
      const currentDate = new Date().toISOString();
      const defaultLevel = 1;
      const defaultEXP = 0;
      const levelRequirements = calculateLevelUpRequirements(defaultLevel, defaultEXP);
      const defaultLimits = calculateAllUserLimits({
        level: defaultLevel,
        recipesCreated: 0,
        recipesCooked: 0,
        successfulCooks: 0,
        failedCooks: 0,
        loginStreak: 0,
        challengesCompleted: 0,
        recipesSold: 0,
        totalRevenue: 0,
        premiumSubscriber: false,
      });

      const newUser = {
        id,
        createdAt: currentDate,
        lastUpdated: currentDate,
        profilePicture: '/src/assets/placeholders/user-avatar.png',
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        age: String(Number(form.age) || 18),
        gender: form.gender,
        loginStreak: "0",
        level: String(defaultLevel),
        currentEXP: String(defaultEXP),
        currentLevelCeiling: String(levelRequirements.expNeeded),
        goldCount: "50",
        gemCount: "5",
        friends: "0",
        recipesCreated: "0",
        recipesCooked: "0",
        maxExpReward: String(defaultLimits.maxExp),
        maxGoldReward: String(defaultLimits.maxGold),
        maxGemReward: String(defaultLimits.maxGem),
        maxGoldPrice: String(defaultLimits.maxGoldPrice),
        maxGemPrice: String(defaultLimits.maxGemPrice),
      };

      const payload = { data: [newUser] };

      console.log('📦 Registration Payload:', payload);

      /*
      // Post new user to the API
      const res = await fetch(apiSheets.users, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Registration failed: ${res.status} ${text}`);
      }

      console.log('✅ Registration successful');
      */

      // Auto-login after successful registration
      await login({
        id,
        fullName: form.fullName,
        email: form.email,
        level: defaultLevel,
        goldCount: 50,
        gemCount: 5,
      });

      alert(`Welcome to Cook Together, ${form.fullName}! You've received 50 Gold and 5 Gems to get started.`);
      navigate("/feed");
    } catch (err) {
      console.error('❌ Registration failed:', err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Card className="ct-card mx-auto" style={{ maxWidth: 560 }}>
        <Card.Body>
          <h3 className="text-ct-ink mb-2">Create your account</h3>
          <p className="text-ct-muted small mb-4">
            Join Cook Together — share recipes, form parties, create challenges, and earn rewards.
            <br />
            <small className="text-success">🎁 Get 50 Gold & 5 Gems to start your journey!</small>
          </p>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="regName" className="mb-3">
              <Form.Label className="text-ct-muted">Full name *</Form.Label>
              <Form.Control
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group controlId="regEmail" className="mb-3">
              <Form.Label className="text-ct-muted">Email *</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group controlId="regPassword" className="mb-3">
              <Form.Label className="text-ct-muted">Password *</Form.Label>
              <Form.Control
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password (min. 6 characters)"
                required
                minLength="6"
                disabled={loading}
              />
              <Form.Text className="text-muted">
                Must be at least 6 characters long
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="regConfirm" className="mb-3">
              <Form.Label className="text-ct-muted">Confirm password *</Form.Label>
              <Form.Control
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat password"
                required
                minLength="6"
                disabled={loading}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="regAge" className="mb-3">
                  <Form.Label className="text-ct-muted">Age</Form.Label>
                  <Form.Control
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    min="13"
                    max="120"
                    disabled={loading}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="regGender" className="mb-4">
                  <Form.Label className="text-ct-muted">Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="non-binary">Non-binary</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <Button
                type="submit"
                className="btn-ct-primary"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>

              <Link to="/login" className="text-ct-muted small">
                Already registered? Log in
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}