import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useData } from '../contexts/DataContext.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { users, getUserById } = useData(); // Fetch users and helper functions from DataContext

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const validateCredentials = (email, password) => {
    if (!email || !password) return null;
    const user = users?.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    return user || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Please provide email and password.');
      setLoading(false);
      return;
    }

    try {
      const user = validateCredentials(form.email.trim(), form.password);
      if (!user) {
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }

      // Log the user in
      login({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        level: user.level,
        goldCount: user.goldCount,
        gemCount: user.gemCount,
      });

      navigate('/feed');
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Card className="ct-card mx-auto" style={{ maxWidth: 480 }}>
        <Card.Body>
          <h3 className="text-ct-ink mb-2">Sign in</h3>
          <p className="text-ct-muted small mb-4">
            Welcome back — continue to Cook Together.
          </p>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="loginEmail" className="mb-3">
              <Form.Label className="text-ct-muted">Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group controlId="loginPassword" className="mb-3">
              <Form.Label className="text-ct-muted">Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
                disabled={loading}
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center">
              <Button type="submit" className="btn-ct-primary" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              <Link to="/registration" className="text-ct-muted small">
                Create an account
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;