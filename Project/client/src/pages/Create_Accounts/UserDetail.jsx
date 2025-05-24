import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserDetailPage = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const authToken = localStorage.getItem("authToken");
                const headers = { Authorization: `Bearer ${authToken}` };
                const res = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/users/admin/users/${userId}/details`,
                    { headers }
                );
                setUserDetails(res.data);
            } catch (err) {
                setError("Failed to load user details");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]);

    if (loading) return <p>Loading user details...</p>;
    if (error) return <p>{error}</p>;
    if (!userDetails) return <p>No user found.</p>;

    const { user, enrolledCourses, assignmentSubmissions, classworkUploads, tutorFeedbacks, taughtCourses, studentEnrollments } = userDetails;

    return (
        <div className="user-detail-page">
            <button className="button button-secondary" onClick={() => navigate(-1)}>← Back</button>
            <h1>User Detail: {user.name}</h1>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Password:</strong> {user.password}</p>
            <p><strong>Role:</strong> {user.role}</p>
            {user.profilePic && (
                <img
                    src={user.profilePic}
                    alt={`${user.name}'s profile`}
                    width={150}
                    style={{ borderRadius: "8px" }}
                />
            )}

            {user.role === "student" && (
                <>
                    <section>
                        <h2>Enrolled Courses</h2>
                        {enrolledCourses.length ? (
                            <ul>
                                {enrolledCourses.map((course) => (
                                    <li
                                        key={course._id}
                                        style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                                        onClick={() => navigate(`/admin/courses/${course._id}`)}
                                    >
                                        {course.title}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No courses enrolled.</p>
                        )}
                    </section>

                    <section>
                        <h2>Assignment Submissions</h2>
                        {assignmentSubmissions.length ? (
                            <ul>
                                {assignmentSubmissions.map((sub) => (
                                    <li key={sub._id}>
                                        <div>
                                            <strong>Assignment:</strong> {sub.assignmentTitle} <br />
                                            <strong>Submitted on:</strong>{" "}
                                            {new Date(sub.submittedAt).toLocaleDateString()}
                                            <br />
                                            {sub.fileUrl && (
                                                <a
                                                    href={sub.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: "blue", textDecoration: "underline" }}
                                                >
                                                    View/Download Submission
                                                </a>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No assignment submissions.</p>
                        )}
                    </section>

                    <section>
                        <h2>Classwork Uploads</h2>
                        {classworkUploads.length ? (
                            <ul>
                                {classworkUploads.map((upload) => (
                                    <li key={upload._id}>
                                        <div>
                                            <strong>{upload.title}</strong> - Uploaded on:{" "}
                                            {new Date(upload.createdAt).toLocaleDateString()}
                                            <br />
                                            {upload.fileUrl && (
                                                <a
                                                    href={upload.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: "blue", textDecoration: "underline" }}
                                                >
                                                    View/Download File
                                                </a>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No classwork uploads.</p>
                        )}
                    </section>

                    <section>
                        <h2>Tutor Feedbacks</h2>
                        {tutorFeedbacks.length ? (
                            <ul>
                                {tutorFeedbacks.map((feedback) => (
                                    <li key={feedback._id}>
                                        <strong>From Tutor:</strong> {feedback.tutorName} <br />
                                        <em>{feedback.comments}</em> <br />
                                        <small>
                                            Submitted: {new Date(feedback.date).toLocaleDateString()}
                                        </small>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No feedbacks available.</p>
                        )}
                    </section>
                </>
            )}

            {user.role === "tutor" && (
                <>
                    <section>
                        <h2>Courses Taught</h2>
                        {taughtCourses.length ? (
                            <ul>
                                {taughtCourses.map((course) => (
                                    <li key={course._id}>
                                        <Link to={`/admin/courses/${course._id}`}>{course.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No courses taught.</p>
                        )}
                    </section>

                    <section>
                        <h2>Students Enrolled in Courses</h2>
                        {studentEnrollments.length ? (
                            studentEnrollments.map(({ course, students }) => (
                                <div key={course._id} style={{ marginBottom: "1rem" }}>
                                    <h3>{course.title}</h3>
                                    <ul>
                                        {students.length ? (
                                            students.map((student) => (
                                                <li key={student._id}>
                                                    <Link to={`/admin/users/${student._id}`}>
                                                        {student.name}
                                                    </Link>
                                                </li>
                                            ))
                                        ) : (
                                            <li>No students enrolled.</li>
                                        )}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p>No student enrollments found.</p>
                        )}
                    </section>

                    <section>
                        <h2>Assignment Submissions by Students</h2>
                        {assignmentSubmissions.length ? (
                            <ul>
                                {assignmentSubmissions.map((sub) => (
                                    <li key={sub._id}>
                                        Student:{" "}
                                        <Link to={`/admin/users/${sub.studentId}`}>
                                            {sub.studentName}
                                        </Link>{" "}
                                        - Assignment: {sub.assignmentTitle} - Submitted on:{" "}
                                        {new Date(sub.submittedAt).toLocaleDateString()}
                                        <br />
                                        {sub.fileUrl && (
                                            <a
                                                href={sub.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: "blue", textDecoration: "underline" }}
                                            >
                                                View/Download Submission
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No assignment submissions found.</p>
                        )}
                    </section>

                    <section>
                        <h2>Feedbacks Given</h2>
                        {tutorFeedbacks.length ? (
                            <ul>
                                {tutorFeedbacks.map((feedback) => (
                                    <li key={feedback._id}>
                                        To Student:{" "}
                                        <Link to={`/admin/users/${feedback.studentId}`}>
                                            {feedback.studentName}
                                        </Link>{" "}
                                        <br />
                                        <em>{feedback.comments}</em> <br />
                                        <small>
                                            Submitted: {new Date(feedback.date).toLocaleDateString()}
                                        </small>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No feedbacks given.</p>
                        )}
                    </section>
                </>
            )}
        </div>
    );
};

export default UserDetailPage;
