import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/Login/signUp.js";
import Login from "E:/cat_hackathon/frontend/src/pages/Login/login.js";
import SmartAssist from "E:/cat_hackathon/frontend/src/pages/Voice/SpeechToText.js";
import Home from "E:/cat_hackathon/frontend/src/pages/Home/home.js";

const ProtectedRoute = ({ children }) => {
  const sessionId = localStorage.getItem('session_id');
  
  if (!sessionId) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const sessionId = localStorage.getItem('session_id');
  
  if (sessionId) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/smartassist" 
            element={
              <ProtectedRoute>
                <SmartAssist />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;