import React, { useState, useEffect, useRef } from "react";
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { BrowserMultiFormatReader } from '@zxing/browser';
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
  const [showScanner, setShowScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState("Ready to scan...");
  const [scanCount, setScanCount] = useState(0);
  const navigate = useNavigate();
  const codeReaderRef = useRef(null);
  const controlsRef = useRef(null);

  // Initialize code reader
  useEffect(() => {
    try {
      codeReaderRef.current = new BrowserMultiFormatReader();
      console.log("Scanner initialized successfully");
      console.log("Auto-detects: QR codes, Code128, Code39, EAN13, UPC, and more");
    } catch (error) {
      console.error("Error initializing scanner:", error);
      setScanStatus("❌ Scanner initialization failed");
    }
  }, []);

  // Auto-login function for barcode scan
  const handleBarcodeLogin = async (scannedId) => {
    setLoading(true);
    setScanStatus("🔍 Checking ID in database...");

    try {
      const res = await fetch("http://localhost:8000/barcode-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeid: scannedId }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store session data
        localStorage.setItem('session_id', data.session_id);
        localStorage.setItem('employeeid', data.employeeid);
        localStorage.setItem('name', data.name);

        setSnackbar({
          open: true,
          message: `Login successful! Welcome ${data.name}`,
          severity: "success",
        });

        setScanStatus("✅ Login successful!");
        console.log("Auto-login successful:", data);
        
        // Navigate to home after brief delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        // ID not found in database or other error
        setSnackbar({
          open: true,
          message: data.detail || "Employee ID not found. Please use manual login.",
          severity: "error",
        });
        setScanStatus("❌ ID not found in database");
        
        // Keep the scanned ID in the field for manual login
        setEmployeeid(scannedId);
        setShowScanner(false);
      }
    } catch (err) {
      console.error("Barcode login error:", err);
      setSnackbar({
        open: true,
        message: "Error connecting to server",
        severity: "error",
      });
      setScanStatus("❌ Connection error");
      
      // Keep the scanned ID in the field for manual login
      setEmployeeid(scannedId);
      setShowScanner(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const codeReader = codeReaderRef.current;

    if (showScanner && codeReader) {
      const videoElement = document.getElementById('barcode-scanner');
      
      if (videoElement) {
        setScanStatus("📷 Starting camera...");
        setScanCount(0);
        
        // Clear any existing controls first
        if (controlsRef.current) {
          try {
            controlsRef.current.stop();
          } catch (e) {
            console.log("Error stopping existing controls:", e);
          }
        }
        
        // Start scanning with proper error handling
        codeReader
          .decodeFromVideoDevice(null, videoElement, (result, error, controls) => {
            if (result) {
              console.log("✅ Barcode scanned:", result.getText());
              console.log("📱 Barcode format:", result.getBarcodeFormat());
              
              const scannedText = result.getText();
              setScanStatus(`✅ Barcode found: ${scannedText}`);
              
              // Show initial success message
              setSnackbar({
                open: true,
                message: `Barcode scanned: ${scannedText}. Checking database...`,
                severity: "info",
              });
              
              // Attempt auto-login
              handleBarcodeLogin(scannedText);
            }
            
            if (error) {
              setScanCount(prev => prev + 1);
              
              // Only log significant errors, not NotFoundException
              if (error.name !== 'NotFoundException') {
                console.error("❌ Scan error:", error);
                setScanStatus(`❌ Error: ${error.message}`);
              } else {
                // Normal scanning process - no barcode found yet
                const attempts = Math.floor(scanCount / 10);
                setScanStatus(`🔍 Scanning... ${attempts > 0 ? `(${attempts}s)` : ''}`);
              }
            }
          })
          .then((controls) => {
            controlsRef.current = controls;
            setScanStatus("📷 Camera ready - point at barcode");
          })
          .catch((err) => {
            console.error("❌ Camera error:", err);
            setScanStatus("❌ Camera access failed");
            setSnackbar({
              open: true,
              message: `Camera error: ${err.message}`,
              severity: "error",
            });
          });
      }
    }

    return () => {
      // Cleanup function
      if (controlsRef.current) {
        try {
          controlsRef.current.stop();
          controlsRef.current = null;
        } catch (e) {
          console.log("Cleanup error:", e);
        }
      }
    };
  }, [showScanner]);

  // Regular manual login
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
        localStorage.setItem('session_id', data.session_id);
        localStorage.setItem('employeeid', data.employeeid);
        localStorage.setItem('name', data.name);

        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
        console.log(data);
        
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

  const handleScannerToggle = () => {
    if (showScanner) {
      // Stop the scanner before hiding
      if (controlsRef.current) {
        try {
          controlsRef.current.stop();
          controlsRef.current = null;
        } catch (e) {
          console.log("Error stopping scanner:", e);
        }
      }
      setScanStatus("Ready to scan...");
      setScanCount(0);
    }
    setShowScanner(!showScanner);
  };

  // Enhanced manual scan function
  const triggerManualScan = async () => {
    const codeReader = codeReaderRef.current;
    const videoElement = document.getElementById('barcode-scanner');
    
    if (!codeReader || !videoElement) {
      setSnackbar({
        open: true,
        message: "Scanner not ready",
        severity: "error",
      });
      return;
    }

    setScanStatus("📸 Manual scan in progress...");
    
    try {
      const result = await codeReader.decodeOnceFromVideoDevice(null, videoElement);
      
      if (result) {
        const scannedText = result.getText();
        console.log("✅ Manual scan result:", scannedText);
        setScanStatus(`✅ Manual scan success: ${scannedText}`);
        
        setSnackbar({
          open: true,
          message: `Manual scan successful: ${scannedText}. Checking database...`,
          severity: "info",
        });

        // Attempt auto-login
        handleBarcodeLogin(scannedText);
      }
    } catch (err) {
      console.error("❌ Manual scan error:", err);
      setScanStatus("❌ Manual scan failed");
      setSnackbar({
        open: true,
        message: `Manual scan failed: ${err.message}`,
        severity: "error",
      });
    }
  };

  // Reset scanner function
  const resetScanner = () => {
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
        controlsRef.current = null;
      } catch (e) {
        console.log("Error stopping scanner for reset:", e);
      }
    }
    
    setScanStatus("🔄 Resetting scanner...");
    setScanCount(0);
    
    // Restart scanner after brief delay
    setTimeout(() => {
      if (showScanner) {
        setScanStatus("📷 Camera ready - point at barcode");
      }
    }, 1000);
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

            <Box sx={{ textAlign: 'center', my: 2 }}>
              <span>or</span>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleScannerToggle}
              disabled={loading}
            >
              {showScanner ? "❌ Close Scanner" : "📱 Scan Barcode"}
            </Button>

            {showScanner && (
              <Box sx={{ mt: 2, maxWidth: 400, margin: 'auto' }}>
                <video 
                  id="barcode-scanner" 
                  style={{ 
                    width: '100%', 
                    height: '300px',
                    border: '3px solid #1976d2',
                    borderRadius: '12px',
                    backgroundColor: '#000',
                    objectFit: 'cover'
                  }} 
                  autoPlay
                  muted
                  playsInline
                />
                
                <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                  <Box sx={{ 
                    fontSize: '1em', 
                    color: scanStatus.includes('✅') ? '#4caf50' : 
                           scanStatus.includes('❌') ? '#f44336' : 
                           scanStatus.includes('🔍') ? '#ff9800' : '#1976d2', 
                    fontWeight: 'bold',
                    minHeight: '24px',
                    mb: 1
                  }}>
                    {scanStatus}
                  </Box>
                  <Box sx={{ fontSize: '0.85em', color: '#666', mb: 1 }}>
                    📋 Scan barcode to login automatically
                  </Box>
                  <Box sx={{ fontSize: '0.75em', color: '#999' }}>
                    ✅ Supports: QR codes, Code128, Code39, EAN13, UPC, and more
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={triggerManualScan}
                    sx={{ flex: 1 }}
                    disabled={!codeReaderRef.current || loading}
                  >
                    📸 Manual Scan
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={resetScanner}
                    sx={{ flex: 1 }}
                    disabled={loading}
                  >
                    🔄 Reset
                  </Button>
                </Box>
              </Box>
            )}

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