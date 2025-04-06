import React, { useState, useEffect } from "react";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdError, MdCheckCircle } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { getDatabase, ref, get } from "firebase/database";
import "./index.css";

const subTopics = [
    { title: "Intro to Drones", path: "intro_to_drones" },
  { title: "Basic Aerodynamics", path: "basic_aerodynamics" },
  { title: "Drone Laws and Regulations", path: "drone_laws_regulations" },
  
];

const Module1Fundamentals = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [userVerified, setUserVerified] = useState(false);

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

        if (!snapshot.exists()) {
          console.error("User not found.");
          localStorage.clear();
          navigate("/login");
          return;
        }

        const userData = snapshot.val();
        if (userData.email !== email) {
          console.error("Email mismatch. Unauthorized access.");
          localStorage.clear();
          navigate("/login");
          return;
        }

        // console.log("User verified:", email, phone);
        setUserVerified(true);

        const moduleRef = ref(db, `users/${phone}/drone_module/fundamentals`);
        const moduleSnapshot = await get(moduleRef);

        if (moduleSnapshot.exists()) {
          setUserProgress(moduleSnapshot.val());
        }
      } catch (error) {
        console.error("Error verifying user or fetching module data:", error);
        navigate("/login");
      }
    };

    verifyUserAndFetchData();
  }, [navigate]);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getStatusIcon = (status) => {
    console.log(status)
    return status === "Completed" ? (
      <MdCheckCircle color="green" size={22} />
    ) : (
      <MdError color="red" size={22} />
    );
  };

  return (
    <div className="container-fluid p-0 bg-light min-vh-100">
      <Header />
      <div className="container py-5">
        {userVerified ? (
          <>
            <h2 className="text-center fw-bold text-primary mb-5">
              🚁 Module 1: Drone Fundamentals
            </h2>

            {subTopics.map((topic, index) => {
              const progress = userProgress[topic.path] || {};
              const allCompleted =
                progress.video === "Completed" &&
                progress.cheatsheet === "Completed" &&
                progress.mcq?.attempted === "Completed";

              return (
                <motion.div
                  key={index}
                  className="card shadow-sm mb-4"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <motion.div
                    className="card-header d-flex justify-content-between align-items-center"
                    onClick={() => toggleDropdown(index)}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      cursor: "pointer",
                      padding: "18px 24px",
                      fontWeight: "600",
                      fontSize: "20px",
                      background: "#f0f8ff",
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                    <div>{topic.title}</div>
                    <div className="d-flex align-items-center">
                      {allCompleted && (
                        <MdCheckCircle color="#28a745" size={24} className="me-2" />
                      )}
                      {openIndex === index ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
                    </div>
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        className="card-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{
                          background: "#ffffff",
                          padding: "20px",
                          borderBottomLeftRadius: "12px",
                          borderBottomRightRadius: "12px",
                        }}
                      >
                        <motion.div
                          className="mb-3 d-flex justify-content-between align-items-center px-3 py-2"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/fundamentals/${topic.path}/videos`)}
                          style={{
                            cursor: "pointer",
                            background: "#d0f0fd",
                            borderRadius: "10px",
                            fontWeight: "500",
                            fontSize: "16px",
                            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)",
                          }}
                        >
                          📹 Watch Video {getStatusIcon(progress.video)}
                        </motion.div>

                        <motion.div
                          className="mb-3 d-flex justify-content-between align-items-center px-3 py-2"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/fundamentals/${topic.path}/cheatsheet`)}
                          style={{
                            cursor:"pointer",
                            background: "#f7f7f7",
                            borderRadius: "10px",
                            fontWeight: "500",
                            fontSize: "16px",
                            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)",
                          }}
                        >
                          📄 Cheatsheet {getStatusIcon(progress.cheatsheet)}
                        </motion.div>

                        <motion.div
                          className="d-flex justify-content-between align-items-center px-3 py-2"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/fundamentals/${topic.path}/mcq`)}
                          style={{
                            background: "#e3f9e5",
                            borderRadius: "10px",
                            fontWeight: "500",
                            fontSize: "16px",
                            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)",
                          }}
                        >
                          ✅ MCQ Test {getStatusIcon(progress.mcq?.attempted)}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </>
        ) : (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Verifying user...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Module1Fundamentals;
