import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Image } from "react-bootstrap";
import goldIcon from "../assets/icons/gold-icon.png";
import gemIcon from "../assets/icons/gem-icon.png";
import profileIcon from "../assets/icons/profile-icon.png";
import "../styles/layout.css";

const SettingsPage = () => {
  const userData = {
    id: "a0a73fdd-1d90-4842-9af6-966c7454c91c",
    fullName: "Test",
    email: "test@gmail.com",
    password: "123",
    age: 18,
    gender: "non-binary",
    loginStreak: 0,
    level: 1,
    currentEXP: 0,
    currentLevelCeiling: 100,
    goldCount: 0,
    gemCount: 0,
    profilePicture: profileIcon, 
    friends: 0,
    recipesCreated: 0,
    recipesCooked: 0,
  };

  const [formData, setFormData] = useState(userData);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files.length > 0) {
      setFormData({ ...formData, profilePicture: URL.createObjectURL(files[0]) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved user data:", formData);
    alert("Changes saved! (test mode)");
  };

  return (
    <div className="container py-4">
      <Card className="p-4 shadow-sm">
        <h2 className="mb-4 text-center">Settings</h2>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col md={4} className="text-center">
              <Image
                src={formData.profilePicture || profileIcon}
                roundedCircle
                width={120}
                height={120}
                alt="Profile"
              />
              <Form.Group controlId="profilePicture" className="mt-3">
                <Form.Control type="file" name="profilePicture" onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={8}>
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="age">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          <hr />

          {/* Stats section */}
          <Row className="text-center mb-4">
  {[
    { label: "Login Streak", value: formData.loginStreak },
    { label: "Level", value: formData.level },
    { label: "EXP", value: formData.currentEXP,  },
    { label: "Gold", value: formData.goldCount, icon: goldIcon },
    { label: "Gems", value: formData.gemCount, icon: gemIcon },
  ].map((stat, i) => (
    <Col key={i} className="d-flex flex-column align-items-center">
      <div className="d-flex align-items-center gap-2">
        {stat.icon && (
          <img
            src={stat.icon}
            alt={stat.label}
            style={{ width: "20px", height: "20px", objectFit: "contain" }}
          />
        )}
        <h5 className="mb-0">{stat.value}</h5>
      </div>
      <p className="text-muted small mb-0">{stat.label}</p>
    </Col>
  ))}
</Row>


          <div className="text-center">
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPage;
