import React, { useState } from "react";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import "./login.css";

const SignUp = () => {
  const [employeeid, setEmployeeid] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { employeeid, name, password };

    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        alert(data.detail || "Signup failed.");
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="welcome-text">Welcome</div>
        <div className="experience-text">
          <div>Have a good</div>
          <div>experience with</div>
          <div>our recipes</div>
        </div>
      </div>

      <div className="right-section">
        <Paper elevation={3} className="form-container">
          <Box component="form" onSubmit={handleSubmit} className="form-box">
            <h2 className="header">Create Account</h2>

            <TextField
              required 
              fullWidth 
              label="Employee ID" 
              variant="standard"
              value={employeeid}
              onChange={(e) => setEmployeeid(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              required 
              fullWidth 
              label="Name" 
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              required 
              fullWidth 
              label="Password" 
              type="password" 
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              className="sign-in-button"
            >
              SIGN UP
            </Button>

            <div className="signup-link">
              <Link to="/login" style={{ textDecoration: 'none' }}>
                {"Already have an account? Log in"}
              </Link>
            </div>
          </Box>
        </Paper>
      </div>
    </div>
  );
};

export default SignUp;