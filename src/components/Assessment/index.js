import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue } from "firebase/database";

function Assessment({ db }) {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const assessmentRef = ref(db, `assessments/${id}`);
    onValue(assessmentRef, (snapshot) => {
      if (snapshot.exists()) {
        setQuestions(snapshot.val().questions);
      }
    });
  }, [id, db]);

  return (
    <div>
      <h2>Assessment {id}</h2>
      {questions.map((q, index) => (
        <div key={index}>
          <p>{q.question}</p>
          {q.options.map((option, i) => (
            <button key={i}>{option}</button>
          ))}
        </div>
      ))}
      <a href={`/feedback/${id}`}>Give Feedback</a>
    </div>
  );
}

export default Assessment;