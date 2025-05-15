
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const ChatRoom = require('../models/ChatRoom');
const Submission = require('../models/Submission');
const Review = require('../models/Review');

const updateChatRoom = async (courseId, instructorId, students = []) => {
  try {
    console.log('🔧 Checking/creating chat room for course:', courseId);

    let chatRoom = await ChatRoom.findOne({ courseId });

    const studentParticipants = students.map(studentId => ({
      userId: studentId,
      role: 'student'
    }));

    if (!chatRoom) {
      console.log('🆕 Creating new chat room for course:', courseId);

      chatRoom = new ChatRoom({
        courseId,
        participants: [
          { userId: instructorId, role: 'tutor' },
          ...studentParticipants
        ]
      });

    } else {
      console.log('✅ Chat room already exists. Updating participants.');

      const existingParticipantsMap = new Map(
        chatRoom.participants.map(p => [p.userId.toString(), p])
      );

      for (const student of studentParticipants) {
        if (!existingParticipantsMap.has(student.userId.toString())) {
          existingParticipantsMap.set(student.userId.toString(), student);
        }
      }

      chatRoom.participants = Array.from(existingParticipantsMap.values());
    }

    await chatRoom.save();
    console.log('✅ Chat room saved:', chatRoom._id);

    return chatRoom;

  } catch (err) {
    console.error('Error updating or creating chat room:', err);
    throw err;
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}, 'title description instructorId')
      .populate('instructorId', 'name email') 
      .populate('studentsEnrolled', 'name email')
      .populate('assignments');
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, instructorId } = req.body;
    
    const newCourse = await Course.create({ title, description, instructorId });
    console.log('✅ Course created successfully:', newCourse.title);
    
    console.log('Calling updateChatRoom with:', newCourse._id, instructorId);
    const chatRoom = await updateChatRoom(newCourse._id, instructorId);
    console.log('✅ Chat room  created successfully for course:', newCourse.title);
    
    res.status(201).json({
      success: true,
      message: 'Course and chat room created successfully',
      course: newCourse,
      chatRoomId: chatRoom._id
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

exports.getMyEnrolledCourses = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      console.error('User is not a student, role:', req.user.role);
      return res.status(403).json({ error: 'Only students can fetch enrolled courses' });
    }
    const courses = await Course.find({ studentsEnrolled: req.user.id })
      .populate('instructorId', 'name email')
      .populate('assignments');
    console.log('Courses fetched for student:', req.user.id);
    res.status(200).json(courses);
  } catch (err) {
    console.error('Error fetching courses for student:', err);
    res.status(500).json({ error: 'Failed to fetch your courses', details: err.message });
  }
};

exports.getTutorCourses = async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      console.error('User is not a tutor, role:', req.user.role);
      return res.status(403).json({ error: 'Only tutors can fetch their teaching courses' });
    }

    const tutorId = req.user.id;

    const courses = await Course.find({ instructorId: tutorId })
      .populate('studentsEnrolled', 'name email')
      .populate('assignments');

    if (!courses.length) {
      console.log(`No courses found for tutor: ${tutorId}`);
      return res.status(200).json({ message: 'You are not teaching any courses yet.', courses: [] });
    }

    console.log(`Courses fetched for tutor: ${tutorId}`, courses.length);
    res.status(200).json(courses);
  } catch (err) {
    console.error('Error fetching courses for tutor:', err);
    res.status(500).json({ 
      error: 'Failed to fetch your teaching courses', 
      details: err.message 
    });
  }
};

exports.enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.studentsEnrolled.includes(studentId)) {
      return res.status(400).json({ error: 'Student already enrolled' });
    }

    course.studentsEnrolled.push(studentId);
    await course.save();

    await updateChatRoom(courseId, course.instructorId, course.studentsEnrolled);

    return res.status(200).json({ 
      message: 'Student enrolled and added to chatroom successfully', 
      course 
    });

  } catch (err) {
    return res.status(500).json({ error: 'Failed to enroll student', details: err.message });
  }
};

exports.removeStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const index = course.studentsEnrolled.indexOf(studentId);
    if (index === -1) {
      return res.status(400).json({ error: 'Student not enrolled' });
    }

    course.studentsEnrolled.splice(index, 1);
    await course.save();

    const chatRoom = await ChatRoom.findOne({ courseId });
    if (chatRoom) {
      chatRoom.participants = chatRoom.participants.filter(
        p => p.userId.toString() !== studentId
      );
      await chatRoom.save();
    }

    res.status(200).json({ message: 'Student removed successfully', course });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove student', details: err.message });
  }
};

exports.uploadAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, dueDate, maxScore } = req.body;
    const tutorId = req.user.id;
    const file = req.file;

    const newAssignment = new Assignment({
      course: courseId,
      tutor: tutorId,
      title,
      description,
      dueDate,
      maxScore,
      fileUrl: file ? file.location : null,
    });

    const savedAssignment = await newAssignment.save();

    await Course.findByIdAndUpdate(courseId, {
      $push: { assignments: savedAssignment._id },
    });

    res.status(201).json({ message: 'Assignment uploaded successfully', assignment: savedAssignment });
  } catch (err) {
    console.error('Error uploading assignment:', err);
    res.status(500).json({ error: 'Failed to upload assignment', details: err.message });
  }
};

exports.getTutorCourseDetail = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate('studentsEnrolled', 'name email')
      .populate('assignments');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Optional: Check if tutor owns the course
    if (course.instructorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to view this course' });
    }

    const reviews = await Review.find({ courseId }).select('responses comment createdAt');

    const courseWithReviews = {
      ...course.toObject(),
      reviews, 
    };

    res.status(200).json(courseWithReviews);
  } catch (err) {
    console.error('Error fetching tutor course detail:', err);
    res.status(500).json({ error: 'Failed to fetch course details', details: err.message });
  }
};

exports.updateCourseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { status } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this course' });
    }

    course.status = status;
    await course.save();

    res.status(200).json({ message: 'Course status updated', course });
  } catch (err) {
    console.error('Error updating course status:', err);
    res.status(500).json({ error: 'Failed to update course status', details: err.message });
  }
};

exports.getStudentCourseDetail = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Fetch course details for the student
    const course = await Course.findById(courseId)
      .populate('instructorId', 'name email')
      .populate({
        path: 'assignments',
        model: 'Assignment',
      })
      .populate('studentsEnrolled', 'name email')
      .populate('materials')
      .lean();

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Optional: Check if the student is enrolled in the course
    if (!course.studentsEnrolled.some(student => student._id.toString() === req.user.id)) {
      return res.status(403).json({ error: 'You are not enrolled in this course' });
    }

    const assignmentsWithSubmissions = await Promise.all(
      course.assignments.map(async (assignment) => {
        const submissions = await Submission.find({
          assignmentId: assignment._id,
          studentId: studentId
        }).lean();

        return {
          ...assignment,
          submissions
        };
      })
    );

    course.assignments = assignmentsWithSubmissions;

    res.status(200).json(course);
  } catch (err) {
    console.error('Error fetching student course detail:', err);
    res.status(500).json({ error: 'Failed to fetch course details', details: err.message });
  }
};

exports.uploadCourseMaterial = async (req, res) => {
  try {
    const { courseId } = req.params;
    const tutorId = req.user.id;
    const { title, description } = req.body;
    const file = req.file;

    if (!title) {
      return res.status(400).json({ error: 'Material title is required' });
    }
    if (!file) {
      return res.status(400).json({ error: 'Material file is required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    if (course.instructorId.toString() !== tutorId) {
      return res.status(403).json({ error: 'You are not the instructor of this course' });
    }

    const newMaterial = {
      title,
      description: description || '',
      fileUrl: file.location, // <-- ✅ use file.location like in assignment upload
      uploadedBy: tutorId,
      createdAt: new Date(),
    };

    course.materials.push(newMaterial);
    await course.save();

    res.status(201).json({ message: 'Material saved successfully', material: newMaterial });
  } catch (err) {
    console.error('Error saving course material:', err);
    res.status(500).json({ error: 'Failed to save material' });
  }
};

