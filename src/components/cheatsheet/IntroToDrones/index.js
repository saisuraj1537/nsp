import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { Card } from "react-bootstrap";
import {
  FaInfoCircle,
  FaCogs,
  FaListAlt,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaPlaneDeparture,
} from "react-icons/fa";
import "./index.css"; // Custom styles

const IntroToDronesCS = () => {
  const moduleName = "intro_to_drones";
  const db = getDatabase();
  const [isCompleted, setIsCompleted] = useState(false);

  const checkCompletionStatus = async () => {
    const userPhone = localStorage.getItem("user_phone");
    if (!userPhone) return;

    const moduleRef = ref(
      db,
      `users/${userPhone}/drone_module/fundamentals/${moduleName}/cheatsheet`
    );

    try {
      const snapshot = await get(moduleRef);
      if (snapshot.exists() && snapshot.val() === "Completed") {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Error checking completion status:", error);
    }
  };

  useEffect(() => {
    checkCompletionStatus();
  }, []);

  const markAsComplete = async () => {
    const userPhone = localStorage.getItem("user_phone");
    if (!userPhone) return alert("User not logged in");

    const scoreRef = ref(
      db,
      `users/${userPhone}/drone_module/fundamentals/current_score`
    );

    const moduleRef = ref(
      db,
      `users/${userPhone}/drone_module/fundamentals/${moduleName}`
    );

    try {
      const scoreSnap = await get(scoreRef);
      let currentScore = scoreSnap.exists() ? scoreSnap.val() : 0;

      await update(moduleRef, {
        cheatsheet: "Completed",
      });

      await update(ref(db, `users/${userPhone}/drone_module/fundamentals`), {
        current_score: currentScore + 1,
      });

      setIsCompleted(true);
    } catch (error) {
      console.error("Error updating completion status:", error);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4 text-primary">Introduction to Drones</h2>

      <Card className="mb-3 custom-card shadow-sm">
        <Card.Body>
          <Card.Title className="custom-title">
            <FaInfoCircle className="me-2 text-success" />
            What is a Drone?
          </Card.Title>
          <Card.Text className="custom-text">
            A drone, or Unmanned Aerial Vehicle (UAV), is an aircraft that
            operates without a human pilot onboard. It can be remotely
            controlled or fly autonomously using onboard systems.
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="mb-3 custom-card shadow-sm">
        <Card.Body>
          <Card.Title className="custom-title">
            <FaCogs className="me-2 text-warning" />
            Key Components of a Drone
          </Card.Title>
          <ul className="ps-3 custom-list">
            <li>🔩 <strong>Frame</strong> – Holds all parts together.</li>
            <li>⚙️ <strong>Propellers</strong> – Provide thrust (usually 4).</li>
            <li>🔌 <strong>Motors</strong> – Rotate the propellers.</li>
            <li>💡 <strong>ESCs</strong> – Regulate motor speed.</li>
            <li>🧠 <strong>Flight Controller</strong> – Brain of the drone.</li>
            <li>🔋 <strong>Battery</strong> – Powers the system (usually Li-Po).</li>
            <li>📍 <strong>GPS Module</strong> (optional) – Enables positioning.</li>
            <li>📡 <strong>Sensors</strong> – Accelerometer, gyroscope, compass, etc.</li>
            <li>📷 <strong>Camera</strong> (optional) – For photography or FPV.</li>
            <li>📶 <strong>Transmitter & Receiver</strong> – Pilot communication.</li>
          </ul>
        </Card.Body>
      </Card>

      <Card className="mb-3 custom-card shadow-sm">
        <Card.Body>
          <Card.Title className="custom-title">
            <FaListAlt className="me-2 text-info" />
            Types of Drones
          </Card.Title>
          <ul className="ps-3 custom-list">
            <li>🌀 <strong>Multi-Rotor Drones</strong> – Popular for hobbyists & photography.</li>
            <li>✈️ <strong>Fixed-Wing Drones</strong> – Like airplanes, good for long range.</li>
            <li>🚁 <strong>Single-Rotor Drones</strong> – Helicopter-like, efficient.</li>
            <li>🔀 <strong>Hybrid VTOL</strong> – Mix of fixed-wing & rotor functions.</li>
          </ul>
        </Card.Body>
      </Card>

      <Card className="mb-3 custom-card shadow-sm">
        <Card.Body>
          <Card.Title className="custom-title">
            <FaMapMarkedAlt className="me-2 text-danger" />
            Applications of Drones
          </Card.Title>
          <ul className="ps-3 custom-list mb-0">
            <li>📷 Aerial Photography & Videography</li>
            <li>🌾 Agriculture (Monitoring, Spraying)</li>
            <li>🔍 Surveillance & Security</li>
            <li>🚨 Disaster Management</li>
            <li>📦 Delivery Services</li>
            <li>🛡 Military & Defense</li>
            <li>🗺 Mapping & Surveying</li>
            <li>🐘 Wildlife Monitoring</li>
          </ul>
        </Card.Body>
      </Card>

      <Card className="mb-3 custom-card shadow-sm">
        <Card.Body>
          <Card.Title className="custom-title">
            <FaPlaneDeparture className="me-2 text-secondary" />
            How Drones Fly – Basics of Flight
          </Card.Title>
          <p className="custom-text">Drones adjust rotor speeds to control:</p>
          <ul className="ps-3 custom-list">
            <li>⬆️ <strong>Lift</strong> – Ascend/Descend</li>
            <li>↔️ <strong>Pitch</strong> – Tilt Forward/Backward</li>
            <li>↕️ <strong>Roll</strong> – Tilt Sideways</li>
            <li>🔄 <strong>Yaw</strong> – Rotate Left/Right</li>
          </ul>
          <p className="custom-text">Flight controllers use sensor data for stability and movement.</p>
        </Card.Body>
      </Card>

      <Card className="mb-3 custom-card shadow-sm">
        <Card.Body>
          <Card.Title className="custom-title">
            <FaShieldAlt className="me-2 text-dark" />
            Safety & Regulations
          </Card.Title>
          <ul className="ps-3 custom-list mb-0">
            <li>📝 Register your drone (if required)</li>
            <li>📏 Fly below 120 meters (400 feet)</li>
            <li>👀 Keep drone in line of sight</li>
            <li>✈️ Avoid airports & restricted zones</li>
            <li>📚 Follow DGCA (India) or FAA (USA) rules</li>
          </ul>
        </Card.Body>
      </Card>

      <div className="mt-3">
            <button 
              onClick={markAsComplete} 
              className="btn btn-primary" 
              disabled={isCompleted}
            >
              {isCompleted ? "✔ Completed" : "Mark as Complete"}
            </button>
          </div>
    </div>
  );
};

export default IntroToDronesCS;
