const Badge      = require('../models/Badge');
const Course     = require('../models/Course');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// GET /api/badges
// List all badges this student has earned
exports.getMyBadges = async (req, res) => {
  try {
    const badges = await Badge.find({ awardedTo: req.user._id })
      .populate('course', 'title');
    res.json(badges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.awardCourseBadge = async (req, res) => {
  const userId   = req.user._id;
  const { courseId } = req.body;

  try {
    const course = await Course.findById(courseId).select('status studentsEnrolled');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.status !== 'complete') {
      return res.status(400).json({ message: 'Course not completed' });
    }
    if (!course.studentsEnrolled.includes(userId)) {
      return res.status(403).json({ message: 'Not enrolled in course' });
    }

   
    const assignments = await Assignment.find({ course: courseId }).select('maxScore');
    const totalPossible = assignments.reduce((sum,a) => sum + (a.maxScore||0), 0);
    const ids            = assignments.map(a => a._id);
    const subs           = await Submission.find({
      studentId: userId,
      assignmentId: { $in: ids }
    }).select('grade');
    const totalEarned    = subs.reduce((sum,s) => sum + (s.grade||0), 0);
    const percent        = totalPossible
      ? Math.round((totalEarned/totalPossible)*10000)/100
      : 0;

    let badge = await Badge.findOne({ course: courseId });
    if (!badge) {
      return res
        .status(404)
        .json({ message: 'Badge configuration missing for course' });
    }

    if (percent >= badge.threshold && !badge.awardedTo.includes(userId)) {
      badge.awardedTo.push(userId);
      badge.awardedAt.push(new Date());
      await badge.save();
      return res.json({ awarded: badge });
    }

    res.json({ awarded: null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};