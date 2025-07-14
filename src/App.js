import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Login/signUp.js";
import Login from "E:/cat_hackathon/frontend/src/pages/Login/login.js";
import SpeechToText from "E:/cat_hackathon/frontend/src/pages/Voice/SpeechToText.js";
import Home from "E:/cat_hackathon/frontend/src/pages/Home/home.js";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/speech-to-text" element={<SpeechToText />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
