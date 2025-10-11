import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Image, Container } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import AsideComponent from "../components/AsideComponent";
import goldIcon from "../assets/icons/gold-icon.png";
import gemIcon from "../assets/icons/gem-icon.png";
import profileIcon from "../assets/icons/profile-icon.png";

const SettingsPage = () => {
  const { user, login } = useAuth();
  
  // Use actual user data from useAuth, fallback to defaults if needed
  const userData = user || {
    id: "a0a73fdd-1d90-4842-9af6-966c7454c91c",
    fullName: "Test User",
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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files.length > 0) {
      setFormData({ ...formData, profilePicture: URL.createObjectURL(files[0]) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call to update user data
      console.log("Updating user data:", formData);
      
      // In a real app, you would call your SheetDB API here
      // await updateUserInSheetDB(formData);
      
      // Update the auth context with new user data
      login(formData);
      
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(userData);
  };

  return (
    <Container fluid className="settings-page">
      <Row>
        {/* Settings Navigation Sidebar */}
        <Col lg={3} className="mb-4">
          <AsideComponent />
        </Col>

        {/* Settings Content */}
        <Col lg={9}>
          <Card className="p-4 shadow-sm">  
            <Form onSubmit={handleSubmit}>
              <Row className="mb-4">
                <Col md={4} className="text-center">
                  <Image
                    src={formData.profilePicture || profileIcon}
                    roundedCircle
                    width={120}
                    height={120}
                    alt="Profile"
                    className="border"
                    style={{ objectFit: 'cover' }}
                  />
                  <Form.Group controlId="profilePicture" className="mt-3">
                    <Form.Label className="small text-muted">Profile Picture</Form.Label>
                    <Form.Control 
                      type="file" 
                      name="profilePicture" 
                      onChange={handleChange}
                      accept="image/*"
                    />
                  </Form.Group>
                </Col>

                <Col md={8}>
                  <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName || ''}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password || ''}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                    <Form.Text className="text-muted">
                      Leave blank to keep current password
                    </Form.Text>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="age">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          value={formData.age || ''}
                          onChange={handleChange}
                          min="13"
                          max="120"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender || 'non-binary'}
                          onChange={handleChange}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
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
                  { label: "Login Streak", value: formData.loginStreak || 0, suffix: "days" },
                  { label: "Level", value: formData.level || 1 },
                  { label: "EXP", value: `${formData.currentEXP || 0}/${formData.currentLevelCeiling || 100}` },
                  { label: "Gold", value: formData.goldCount || 0, icon: goldIcon },
                  { label: "Gems", value: formData.gemCount || 0, icon: gemIcon },
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
                      <h5 className="mb-0">
                        {stat.value} {stat.suffix || ''}
                      </h5>
                    </div>
                    <p className="text-muted small mb-0">{stat.label}</p>
                  </Col>
                ))}
              </Row>

              {/* Additional user stats */}
              <Row className="text-center mb-4">
                {[
                  { label: "Friends", value: formData.friends || 0 },
                  { label: "Recipes Created", value: formData.recipesCreated || 0 },
                  { label: "Recipes Cooked", value: formData.recipesCooked || 0 },
                ].map((stat, i) => (
                  <Col key={i}>
                    <h5 className="mb-0">{stat.value}</h5>
                    <p className="text-muted small mb-0">{stat.label}</p>
                  </Col>
                ))}
              </Row>

              <div className="text-center">
                <Button 
                  variant="outline-secondary" 
                  className="me-3" 
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  Reset Changes
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsPage;