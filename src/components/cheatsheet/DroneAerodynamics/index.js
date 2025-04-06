import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { Card } from "react-bootstrap";
import {
  FaArrowUp,
  FaBalanceScale,
  FaRocket,
  FaWind,
  FaExpandArrowsAlt,
  FaCompass,
  FaCogs,
} from "react-icons/fa";
import "./index.css";

const DroneAerodynamicsCS = () => {
  const moduleName = "basic_aerodynamics";
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
      <h2 className="text-center mb-4 text-primary">Drone Aerodynamics</h2>

      <Card className="mb-3 custom-card shadow-sm">
        <Card.Body>
          <Card.Title className="custom-title">
            <FaBalanceScale className="me-2 text-success" />
            Four Main Forces Acting on a Drone
          </Card.Title>
          <ul className="ps-3 custom-list">
            <li>🆙 <strong>Lift</strong> – Upward force created by propellers pushing air down.</li>
            <li>⚖️ <strong>Weight</strong> – Downward force due to gravity.</li>
            <li>🚀 <strong>Thrust</strong> – Forward movement by tilting the drone (pitch/roll).</li>
            <li>💨 <strong>Drag</strong> – Resistance force from air pushing against the drone.</li>
          </ul>
        </Card.Body>
      </Card>

      <Card className="mb-3 custom-card shadow-sm">
        <Card.Body>
          <Card.Title className="custom-title">
            <FaExpandArrowsAlt className="me-2 text-info" />
            6 Degrees of Freedom (Movement Axes)
          </Card.Title>
          <ul className="ps-3 custom-list">
            <li>🔁 <strong>Pitch</strong> – Rotate forward/backward (X-axis)</li>
            <li>🔄 <strong>Roll</strong> – Tilt left/right (Y-axis)</li>
            <li>🧭 <strong>Yaw</strong> – Rotate left/right (Z-axis)</li>
            <li>⬆ <strong>Altitude</strong> – Move up/down</li>
            <li>↔️ <strong>Forward/Backward</strong> – Controlled by pitch</li>
            <li>↔️ <strong>Side-to-Side</strong> – Controlled by roll</li>
          </ul>
        </Card.Body>
      </Card>

      <Card className="mb-3 custom-card shadow-sm">
        <Card.Body>
          <Card.Title className="custom-title">
            <FaCogs className="me-2 text-warning" />
            How a Quadcopter Flies and Turns
          </Card.Title>
          <ul className="ps-3 custom-list">
            <li>⬆️ <strong>Ascend</strong> – All motors spin faster.</li>
            <li>⬇️ <strong>Descend</strong> – All motors spin slower.</li>
            <li>⤴️ <strong>Pitch Forward</strong> – Rear motors spin faster than front ones.</li>
            <li>⤵️ <strong>Roll Right</strong> – Left motors spin faster than right ones.</li>
            <li>🔁 <strong>Yaw Right</strong> – CW motors spin faster than CCW ones.</li>
          </ul>
        </Card.Body>
      </Card>

      <Card className="mb-3 custom-card shadow-sm">
        <Card.Body>
          <Card.Title className="custom-title">
            <FaWind className="me-2 text-secondary" />
            Propeller Basics
          </Card.Title>
          <ul className="ps-3 custom-list">
            <li>⚙️ Two CW and two CCW propellers maintain stability.</li>
            <li>📏 Propeller size and pitch affect lift and thrust.</li>
            <li>🔋 Larger props = more lift = more battery usage.</li>
            <li>🧰 Balance props to reduce vibration and maintain stability.</li>
          </ul>
        </Card.Body>
      </Card>

      <Card className="mb-3 custom-card shadow-sm">
        <Card.Body>
          <Card.Title className="custom-title">
            <FaCompass className="me-2 text-danger" />
            Stability & Sensors
          </Card.Title>
          <ul className="ps-3 custom-list mb-0">
            <li>📐 <strong>Gyroscope</strong> – Detects rotation (yaw, pitch, roll)</li>
            <li>📈 <strong>Accelerometer</strong> – Detects movement & tilt</li>
            <li>📊 <strong>Barometer</strong> – Measures altitude</li>
            <li>🧭 <strong>Magnetometer</strong> – Maintains heading using magnetic north</li>
            <li>🧠 <strong>Flight Controller</strong> – Processes sensor data for stability</li>
          </ul>
        </Card.Body>
      </Card>

      <Card className="mb-3 custom-card shadow-sm">
        <Card.Body>
          <Card.Title className="custom-title">
            <FaArrowUp className="me-2 text-primary" />
            Quick Lift Concept
          </Card.Title>
          <Card.Text className="custom-text">
            🚁 Faster spinning propellers = more airflow = more lift.
            Heavier drone = needs more lift = more motor power required.
          </Card.Text>
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

export default DroneAerodynamicsCS;