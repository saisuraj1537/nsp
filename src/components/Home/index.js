import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../Header";
import fundamentalsImg from "../../assets/drone-fundamentals.jpg";
import planningImg from "../../assets/mission-planning.jpg";
import computingImg from "../../assets/onboard-computing.jpg";
import { getDatabase, ref, get } from "firebase/database"; // Firebase functions
import "./index.css";

const Home = () => {
  const navigate = useNavigate();
  const [moduleScores, setModuleScores] = useState({});

  useEffect(() => {
    const verifyUserAndFetchData = async () => {
      const email = localStorage.getItem("user_email");
      const phone = localStorage.getItem("user_phone");

      if (!email || !phone) {
        navigate("/login");
        return;
      }

      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${phone}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists() || snapshot.val().email !== email) {
          console.error("User verification failed.");
          localStorage.clear();
          navigate("/login");
          return;
        }

        console.log("User verified:", email, phone);

        // Fetch all module scores using current_score / target_score
        const moduleRef = ref(db, `users/${phone}/drone_module`);
        const moduleSnapshot = await get(moduleRef);

        if (moduleSnapshot.exists()) {
          const data = moduleSnapshot.val();

          const scores = {};
          Object.keys(data).forEach((moduleKey) => {
            const module = data[moduleKey];
            const current = module.current_score || 0;
            const target = module.target_score || 1; // Prevent division by 0
            const percent = Math.round((current / target) * 100);

            scores[`${moduleKey}_score`] = percent;
            scores[`${moduleKey}_details`] = `${current}/${target} Tasks Done`;
          });

          setModuleScores(scores);
        }
      } catch (error) {
        console.error("Error verifying user or fetching module scores:", error);
        navigate("/login");
      }
    };

    verifyUserAndFetchData();
  }, [navigate]);

  const modules = [
    {
      name: "Module 1: Drone Fundamentals",
      image: fundamentalsImg,
      path: "/fundamentals",
      description:
        "Learn the basics of drone technology, aerodynamics, and key components that make drones fly.",
      scoreKey: "fundamentals_score",
    },
    {
      name: "Module 2: Mission Planning",
      image: planningImg,
      path: "/planning",
      description:
        "Understand how to create, manage, and optimize flight missions for various applications.",
      scoreKey: "planning_score",
    },
    {
      name: "Module 3: On Board Computing",
      image: computingImg,
      path: "/computing",
      description:
        "Explore embedded computing systems used in drones for real-time decision-making and automation.",
      scoreKey: "computing_score",
    },
  ];

  return (
    <div className="container-fluid p-0">
      <Header />
      <div className="container pt-3">
        <h2 className="fw-bold course-head text-center mb-4">Drone Course</h2>
        <div className="row d-flex justify-content-center mt-1">
          {modules.map((module, index) => {
            const score = moduleScores[module.scoreKey] || 0;
            const details = moduleScores[module.scoreKey + "_details"] || "";

            return (
              <div key={index} className="col-md-4 mb-4 d-flex">
                <div
                  className="card module-card shadow-lg w-100 d-flex flex-column"
                  onClick={() => navigate(module.path)}
                >
                  <img
                    src={module.image}
                    className="card-img-top img-fluid"
                    style={{ height: "250px", objectFit: "cover" }}
                    alt={module.name}
                  />
                  <div className="card-body text-center bg-light flex-grow-1 d-flex flex-column">
                    <h5 className="card-title fw-bold text-primary">
                      {module.name}
                    </h5>
                    <p className="card-text text-muted flex-grow-1">
                      {module.description}
                    </p>
                    <div className="progress mt-2" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${score}%` }}
                        aria-valuenow={score}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <p className="mt-2">{score}% Completed</p>
                    <p className="text-muted">{details}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
