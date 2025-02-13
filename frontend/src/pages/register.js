import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // TODO: Handle registration logic (e.g., API request)
    console.log("Registering with:", { email, password });

    // Clear error if registration is valid
    setErrorMessage("");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 shadow-lg rounded bg-white" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Register</h2>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleSubmit}>

          {/* Email Field */}
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          {/* Password Field */}
          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {/* Confirm Password Field */}
          <Form.Group controlId="confirmPassword" className="mt-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-100 mt-4 text-light"
            style={{cursor: 'pointer'}}
            disabled={!email || !password || !confirmPassword} // Disable if fields are empty
          >
            Register
          </Button>
        </Form>
      </div>
    </Container>
  );
}
