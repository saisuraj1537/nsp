import { useState } from "react";
import { useParams } from "react-router-dom";
import { ref, push } from "firebase/database";

function Feedback({ db }) {
  const { id } = useParams();
  const [feedback, setFeedback] = useState("");

  const submitFeedback = () => {
    const feedbackRef = ref(db, `feedback/${id}`);
    push(feedbackRef, { feedback });
    setFeedback("");
  };

  return (
    <div>
      <h2>Feedback for Video {id}</h2>
      <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}></textarea>
      <button onClick={submitFeedback}>Submit Feedback</button>
    </div>
  );
}

export default Feedback;