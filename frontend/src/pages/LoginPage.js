import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState(true);
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Please provide email and password.');
      setLoadingState(false);
      return;
    }

    try {
      await login(form.email.trim(), form.password);
      navigate('/feed');
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoadingState(false);
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
                disabled={loadingState}
                required
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
                disabled={loadingState}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center">
              <Button 
                type="submit" 
                className="btn-ct-primary" 
                disabled={loadingState}
              >
                {loadingState ? 'Logging in...' : 'Login'}
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