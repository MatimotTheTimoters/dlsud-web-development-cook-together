import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import apiSheets from '../constants/api.js';
import { useAuth } from '../hooks/useAuth.js';

/**
 * Query SheetDB for a user matching email+password and return the id field (or null).
 * - sheetUrl: apiSheets.users (contains ?sheet=Users)
 * - returns string id or null
 */
export async function getUserIdByCredentials(email, password, sheetUrl = apiSheets.users) {
  if (!email || !password) return null;
  const url = `${sheetUrl}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const json = await res.json().catch(() => []);
    if (!Array.isArray(json) || json.length === 0) return null;
    // return the id field from the first matching row
    return json[0].id ?? null;
  } catch {
    return null;
  }
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      alert('Please provide email and password.');
      return;
    }
    const id = await getUserIdByCredentials(form.email.trim(), form.password);
    if (!id) {
      alert('Invalid email or password.');
      return;
    }
    // optionally fetch user profile row to get fullName/email and store that
    const userObj = { id, email: form.email.trim() };
    login(userObj);
    navigate('/feed');
  };

  return (
    <Container className="my-5">
      <Card className="ct-card mx-auto" style={{ maxWidth: 480 }}>
        <Card.Body>
          <h3 className="text-ct-ink mb-2">Sign in</h3>
          <p className="text-ct-muted small mb-4">
            Welcome back — continue to Cook Together.
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="loginEmail" className="mb-3">
              <Form.Label className="text-ct-muted">Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
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
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center">
              <Button type="submit" className="btn-ct-primary">
                Login
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