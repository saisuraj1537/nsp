import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { get, ref, update } from "firebase/database";
import { db } from "../../firebase-config";
import "./index.css";

const DroneQuiz = () => {
  const { category, id } = useParams(); // 🔥 get URL params
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const quizRef = ref(db, `mcq/${id}`);
    get(quizRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const parsedData = typeof data === "string" ? JSON.parse(data) : data;
          setQuestions(parsedData);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching quiz:", error);
      });
  }, [id]);

  if (questions.length === 0)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading Questions ....</p>
      </div>
    );

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (option) => {
    if (selected) return;
    setSelected(option);
    if (option === currentQuestion.answer) setScore(score + 1);
  };

  const nextQuestion = () => {
    const finalScore = score + (selected === currentQuestion.answer ? 1 : 0);
    const passed = finalScore / questions.length >= 0.7;
  
    if (currentIndex + 1 === questions.length) {
      setShowResult(true);
  
      if (passed) {
        const userPhone = localStorage.getItem("user_phone");
        const pathBase = `users/${userPhone}/drone_module/${category}/${id}`;
        const userRef = ref(db, pathBase);
  
        get(userRef).then((snapshot) => {
          const userData = snapshot.val();
          const alreadyAttempted = userData?.mcq?.attempted === "Completed";
          const currentScoreRef = `users/${userPhone}/drone_module/${category}/current_score`;
  
          const updates = {
            [`${pathBase}/mcq/attempted`]: "Completed",
            [`${pathBase}/mcq/score`]: finalScore,
          };
  
          if (!alreadyAttempted) {
            const scoreRef = ref(db, currentScoreRef);
            get(scoreRef).then((scoreSnapshot) => {
              const oldScore = scoreSnapshot.val() || 0;
              updates[currentScoreRef] = oldScore + 1;
  
              // ✅ Only update after current_score is ready
              update(ref(db), updates)
                .then(() => console.log("✅ Firebase updated successfully"))
                .catch((error) => console.error("❌ Error updating Firebase:", error));
            });
          } else {
            // ✅ If already attempted, update only attempted + score
            update(ref(db), updates)
              .then(() => console.log("⚠️ Only MCQ data updated"))
              .catch((error) => console.error("❌ Error updating Firebase:", error));
          }
        });
      }
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
    }
  };
  
  

  const quitQuiz = () => {
    setShowResult(true);
  };

  return (
    <div className="quiz-container">
      <div className="navbar">
        <button className="quit-btn" onClick={quitQuiz}>
          Quit MCQ
        </button>
        <div className="score-display">Score: {score}</div>
        <div className="progress-count">
          Attempted: {currentIndex}/{questions.length}
        </div>
      </div>

      <h2 className="text-primary text-center mt-4">Drone Quiz</h2>

      {showResult ? (
        <div className="result-popup">
          <h2 className="result-title">🎉 Quiz Completed!</h2>
          <p className="score-text">
            Your Score: <strong>{score} / {questions.length}</strong>
          </p>
          <p className={`status ${score / questions.length >= 0.7 ? "passed" : "failed"}`}>
            {score / questions.length >= 0.7 ? "✅ Passed" : "❌ Failed"}
          </p>
          {score / questions.length >= 0.7 && (
            <p className="text-success mt-2">Progress Updated ✅</p>
          )}
          {score / questions.length < 0.7 && (
            <button
              className="btn btn-danger mt-3"
              onClick={() => {
                setCurrentIndex(0);
                setSelected(null);
                setScore(0);
                setShowResult(false);
              }}
            >
              Re-attempt Quiz
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="question-section">
            <h5>{currentIndex + 1}. {currentQuestion.question}</h5>
            <ul className="option-list">
              {currentQuestion.options.map((option, i) => (
                <li
                  key={i}
                  className={`option-item 
                    ${selected === option && option === currentQuestion.answer ? "correct" : ""}
                    ${selected === option && option !== currentQuestion.answer ? "wrong" : ""}
                    ${selected && option === currentQuestion.answer ? "correct" : ""}
                  `}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={nextQuestion}
            disabled={!selected}
            className="btn btn-primary mt-3"
          >
            {currentIndex + 1 === questions.length ? "Finish" : "Next"}
          </button>
        </>
      )}
    </div>
  );
};

export default DroneQuiz;
