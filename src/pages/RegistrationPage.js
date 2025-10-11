import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import apiLinks from '../constants/api.js';
import { generateUniqueId } from '../hooks/uuidHelper.js';

export default function RegistrationPage() {
  const usersSheet = apiLinks.users;

  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '', age: 18, gender: 'non-binary', loginStreak: 0, level: 0, currentEXP: 0, currentLevelCeiling: 0, goldCount: 0, gemCount: 0 });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // generate unique id for this sheet (throws on repeated failure)
    const id = await generateUniqueId(usersSheet, { idField: 'id', retries: 5, check: true });

    // basic validation (use the sheet field names)
    if (!form.fullName.trim() || !form.email.trim() || !form.password) {
      alert("Please fill full name, email and password.");
      return;
    }
    if (form.password !== form.confirm) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // build payload using exact spreadsheet header names
      const row = {
        // get a unique id (checks the Users sheet). awaiting at top-level of handleSubmit.
        id,
        fullName: String(form.fullName).trim(),
        email: String(form.email).trim(),
        password: String(form.password),
        age: String(Number(form.age) || 0),
        gender: String(form.gender),
        loginStreak: String(Number(form.loginStreak) || 0),
        level: String(Number(form.level) || 0),
        currentEXP: String(Number(form.currentEXP) || 0),
        currentLevelCeiling: String(Number(form.currentLevelCeiling) || 0),
        goldCount: String(Number(form.goldCount) || 0),
        gemCount: String(Number(form.gemCount) || 0),
      };

      const payload = { data: [row] };

      // debug: optionally console.log(JSON.stringify(payload));
      const res = await fetch(usersSheet, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${text}`);
      }

      await res.json();
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <Container className="my-5">
      <Card className="ct-card mx-auto" style={{ maxWidth: 560 }}>
        <Card.Body>
          <h3 className="text-ct-ink mb-2">Create your account</h3>
          <p className="text-ct-muted small mb-4">
            Join Cook Together — share recipes, form parties, create challenges and earn rewards.
          </p>

          {/* removed action attribute to prevent any native form submission interference */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="regName" className="mb-3">
              <Form.Label className="text-ct-muted">Full name</Form.Label>
              <Form.Control
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
              />
            </Form.Group>

            <Form.Group controlId="regEmail" className="mb-3">
              <Form.Label className="text-ct-muted">Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </Form.Group>

            <Form.Group controlId="regPassword" className="mb-3">
              <Form.Label className="text-ct-muted">Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
            </Form.Group>

            <Form.Group controlId="regConfirm" className="mb-4">
              <Form.Label className="text-ct-muted">Confirm password</Form.Label>
              <Form.Control
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat password"
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center">
              <Button type="submit" className="btn-ct-primary">
                Register
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