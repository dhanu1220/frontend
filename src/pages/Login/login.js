import React, { useState } from "react";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { Link as MuiLink } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./login.css";

const Login = () => {
  const [employeeid, setEmployeeid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = { employeeid, password };

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (res.ok) {
        // Store session data in localStorage
        localStorage.setItem('session_id', data.session_id);
        localStorage.setItem('employeeid', data.employeeid);
        localStorage.setItem('name', data.name);

        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
        console.log(data);
        
        // Navigate to home page
        navigate("/");
      } else {
        setSnackbar({
          open: true,
          message: data.detail || "Login failed.",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setSnackbar({
        open: true,
        message: "Error connecting to server",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
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
              disabled={loading}
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
              disabled={loading}
            />

            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              className="sign-in-button"
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </Button>

            <div className="signup-link">
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </div>
          </Box>
        </Paper>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;