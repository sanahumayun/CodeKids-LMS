
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

    // Check if either content OR file is provided
    if (!content && !req.file) {
      return res.status(400).json({ message: "Submission content or file is required." });
    }

    // Prepare submission data
    const submissionData = {
      assignmentId,
      studentId,
      content: content || "",
    };

    // If a file is uploaded, add file URL or key to submission data
    if (req.file) {
      // req.file.location has the S3 public URL if acl is public-read
      // or req.file.key has the S3 object key (useful if private)
      submissionData.fileUrl = req.file.location || null;
      submissionData.fileKey = req.file.key || null;
    }

    const submission = new Submission(submissionData);

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

exports.updateSubmissionGrade = async (req, res) => {
  try {
    const { assignmentId, submissionId } = req.params;
    const { grade } = req.body;

    // Validate grade (number and non-negative)
    if (typeof grade !== "number" || grade < 0) {
      return res.status(400).json({ message: "Invalid grade value." });
    }

    // Find the submission, ensure it belongs to the assignment
    const submission = await Submission.findOne({ _id: submissionId, assignmentId });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    // Update the grade field
    submission.grade = grade;
    await submission.save();

    return res.status(200).json({ message: "Grade updated successfully.", submission });
  } catch (err) {
    console.error("Error updating submission grade:", err);
    return res.status(500).json({ message: "Failed to update grade." });
  }
};

