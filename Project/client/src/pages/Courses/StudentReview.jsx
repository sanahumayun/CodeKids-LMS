import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const questions = [
  "The instructor explained concepts clearly.",
  "The course materials were helpful.",
  "Assignments helped me learn effectively.",
  "The instructor was responsive to questions.",
  "The course met my expectations.",
  "I would recommend this course to others.",
];

const StudentReviewForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [comment, setComment] = useState("");

  const handleChange = (qIndex, value) => {
    setResponses((prev) => ({
      ...prev,
      [qIndex]: parseInt(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(responses).length !== questions.length) {
      toast.error("Please answer all questions.");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      const formattedResponses = questions.map((question, index) => ({
        question,
        rating: responses[index],
      }));

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/courses/student/courses/${courseId}/reviews`,
        { responses: formattedResponses, comment },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      
      toast.success("Review submitted successfully!");
      navigate(`/student/courses/${courseId}`);
    } catch (err) {
      console.error("Review submit error:", err);
      toast.error(err.response?.data?.error || "Failed to submit review.");
    }
  };

  return (
    <div className="page-wrapper container">
      <button className="button button-primary" onClick={() => navigate(-1)}>← Back</button>
      <h2 className="page-title">Course Review</h2>

      <form onSubmit={handleSubmit} className="review-form">
        {questions.map((q, idx) => (
          <div key={idx} className="review-question">
            <label>{q}</label>
            <div className="likert-scale">
              {[1, 2, 3, 4, 5].map((val) => (
                <label key={val}>
                  <input
                    type="radio"
                    name={`q-${idx}`}
                    value={val}
                    checked={responses[idx] === val}
                    onChange={() => handleChange(idx, val)}
                  />
                  {val}
                </label>
              ))}
              <span className="scale-labels">1 = Strongly Disagree, 5 = Strongly Agree</span>
            </div>
          </div>
        ))}

        <div className="comment-box">
          <label>Additional Comments</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share any thoughts about the course or instructor..."
          />
        </div>

        <button type="submit" className="button button-primary">Submit Review</button>
      </form>
    </div>
  );
};

export default StudentReviewForm;
