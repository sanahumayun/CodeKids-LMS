import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";

const DeleteAccount = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("");
    const [students, setStudents] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");

    useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const headers = {
          Authorization: `Bearer ${authToken}`,
        };

        const [tutorsRes, studentsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/users?role=tutor`, { headers }),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/users?role=student`, { headers }),
        ]);

        console.log("Tutors:", tutorsRes.data);
        console.log("Students:", studentsRes.data);

        setTutors(tutorsRes.data);
        setStudents(studentsRes.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!selectedUserId || !role) return alert("Please select a user to delete.");

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/users/${selectedUserId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("User deleted successfully!");

      // Remove user from local state
      if (role === "student") {
        setStudents(students.filter((user) => user._id !== selectedUserId));
      } else {
        setTutors(tutors.filter((user) => user._id !== selectedUserId));
      }

      setSelectedUserId("");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Error deleting user.");
    }
  };

  const getUsersByRole = () => (role === "student" ? students : tutors);

  return (
    <div className="container">
    <button className="button button-secondary" onClick={() => navigate('/admin-dashboard')}>← Back</button>
      <h2>Delete User Profile</h2>
      <form className="form">
        <label>Role:</label>
        <select value={role} onChange={(e) => { setRole(e.target.value); setSelectedUserId(""); }}>
          <option value="">-- Select Role --</option>
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
        </select>

        {role && (
          <>
            <label>User:</label>
            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
              <option value="">-- Select User --</option>
              {getUsersByRole().map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </>
        )}

        <button type="button" onClick={handleDelete} disabled={!selectedUserId}>
          Delete User
        </button>
      </form>
    </div>
  );
};

export default DeleteAccount;