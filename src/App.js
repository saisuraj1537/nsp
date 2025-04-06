import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Home from "./components/Home";
import VideoLesson from "./components/VideoLesson";
import Assessment from "./components/Assessment";
// import CheatSheet from "./components/cheatSheet";
import Feedback from "./components/Feedback";
import UploadVideo from "./components/UploadVideo";
import GoogleAuth from "./components/GoogleAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import M1fundamentals from "./components/M1fundamentals"
import IntroToDronesCS from "./components/cheatsheet/IntroToDrones";
import BasicAerodynamicsCS from "./components/cheatsheet/DroneAerodynamics";
import Mcq from "./components/MCQ"
// import Planning from "./components/Planning"
// import Computing from "./components/Computing"


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);
const db = getDatabase();

function App() {
  const token = localStorage.getItem("jwt_token");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <GoogleAuth />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path=":category/:id/videos" element={<ProtectedRoute><VideoLesson db={db} /></ProtectedRoute>} />
        <Route path="/assessment/:id" element={<ProtectedRoute><Assessment db={db} /></ProtectedRoute>} />
        {/* <Route path="/cheatsheet" element={<ProtectedRoute><CheatSheet /></ProtectedRoute>} /> */}
        <Route path="/upload" element={<ProtectedRoute><UploadVideo db={db} /></ProtectedRoute>} />
        <Route path="/feedback/:id" element={<ProtectedRoute><Feedback db={db} /></ProtectedRoute>} />
        <Route path="/fundamentals" element={<ProtectedRoute><M1fundamentals db={db} /></ProtectedRoute>} />
        <Route path="fundamentals/intro_to_drones/cheatsheet" element={<ProtectedRoute><IntroToDronesCS /></ProtectedRoute>} />
        <Route path="fundamentals/basic_aerodynamics/cheatsheet" element={<ProtectedRoute><BasicAerodynamicsCS /></ProtectedRoute>} />
        <Route path=":category/:id/mcq" element={<ProtectedRoute><Mcq db={db} /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
