import React, { useState } from "react";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { Link as MuiLink } from '@mui/material';
import "./login.css";

const Login = () => {
  const [employeeid, setEmployeeid] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { employeeid, password };

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");
        console.log(data);
        navigate("/"); // change to your desired route
      } else {
        alert(data.detail || "Login failed.");
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
            <h2 className="header">Login</h2>

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
              LOGIN
            </Button>

            <div className="signup-link">
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </div>
          </Box>
        </Paper>
      </div>
    </div>
  );
};

export default Login;