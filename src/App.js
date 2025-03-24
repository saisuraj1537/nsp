// import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import Home from "./components/Home";
// import VideoLesson from "./components/VideoLesson";
import Assessment from "./components/Assessment";
import CheatSheet from "./components/CheatSheet";
import Feedback from "./components/Feedback";
import UploadVideo from "./components/UploadVideo";

const firebaseConfig = {
  apiKey: "AIzaSyBCpW4tsg3QwJLdo_rAEBh5WsSgdKkGDys",
  authDomain: "sample-a028e.firebaseapp.com",
  databaseURL: "https://sample-a028e-default-rtdb.firebaseio.com",
  projectId: "sample-a028e",
  storageBucket: "sample-a028e.appspot.com",
  messagingSenderId: "1026622472453",
  appId: "1:1026622472453:web:955159f18b1936d5faf76c",
  measurementId: "G-DQ9LD03K0Y"
};

initializeApp(firebaseConfig);
const db = getDatabase();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/video/:id" element={<VideoLesson db={db} />} /> */}
        <Route path="/assessment/:id" element={<Assessment db={db} />} />
        <Route path="/cheatsheet" element={<CheatSheet />} />
        <Route path="/upload" element={<UploadVideo db={db} />} />
        <Route path="/feedback/:id" element={<Feedback db={db} />} />
      </Routes>
    </Router>
  );
}

export default App;