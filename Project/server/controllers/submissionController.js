
const Submission = require("../models/Submission");  
const Assignment = require("../models/Assignment");  
const User = require("../models/User"); 

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { content } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in." });
    }

    const studentId = req.user.id; 

    if (!content) {
      return res.status(400).json({ message: "Submission content is required." });
    }

    const submission = new Submission({
      assignmentId,
      studentId, 
      content,
    });

    await submission.save();

    return res.status(201).json({
      message: "Assignment submitted successfully.",
      submission,
    });
  } catch (err) {
    console.error("Error submitting assignment:", err);
    return res.status(500).json({ message: "Error submitting assignment." });
  }
};

exports.getSubmissionsForAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    console.log(`Fetching submissions for assignment ID: ${assignmentId}`);

    const assignment = await Assignment.findById(assignmentId);
    console.log(`Fetched assignment: ${assignment ? assignment.title : "Assignment not found"}`);

    if (!assignment) {
      console.log("Assignment not found in the database");
      return res.status(404).json({ message: "Assignment not found." });
    }

    const submissions = await Submission.find({ assignmentId }).populate("studentId", "name email");
    console.log(`Found ${submissions.length} submissions for assignment ID: ${assignmentId}`);
    submissions.forEach((sub, i) => {
      console.log(`Submission #${i + 1}:`, sub.studentId); // 👈 Should print a full user object with name
    });

    return res.status(200).json({
      submissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return res.status(500).json({ message: "Error fetching submissions." });
  }
};
