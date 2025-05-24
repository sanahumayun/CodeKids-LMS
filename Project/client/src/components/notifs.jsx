import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const authToken = localStorage.getItem("authToken");
                const res = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/notifications/my`,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
                setNotifications(res.data);
            } catch (error) {
                console.error("Failed to load notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const markAsRead = async (notifId) => {
        try {
            const authToken = localStorage.getItem("authToken");
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/notifications/${notifId}/read`,
                {},
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            setNotifications((prev) =>
                prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            await Promise.all(
                notifications
                    .filter((n) => !n.isRead)
                    .map((notif) =>
                        axios.post(
                            `${process.env.REACT_APP_API_BASE_URL}/notifications/${notif._id}/read`,
                            {},
                            { headers: { Authorization: `Bearer ${authToken}` } }
                        )
                    )
            );
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all notifications as read", error);
        }
    };

    if (loading) return <p>Loading notifications...</p>;
    if (notifications.length === 0) return <p>No notifications.</p>;

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
  <div
    className="notifications-container"
    style={{
      border: "1px solid #ccc",
      borderRadius: "12px",
      padding: "1.5rem",
      maxWidth: "700px",
      margin: "2rem auto",
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
    }}
  >
    <h4>
      Notifications {unreadCount > 0 && <span>({unreadCount} unread)</span>}
    </h4>

    <button
      className="button button-secondary"
      onClick={markAllAsRead}
      disabled={unreadCount === 0}
      style={{ marginBottom: "1rem" }}
    >
      Mark all as read
    </button>

    <ul style={{ listStyleType: "none", padding: 0 }}>
      {notifications.map((notif) => (
        <li
          key={notif._id}
          style={{
            fontWeight: notif.isRead ? "normal" : "bold",
            cursor: notif.link ? "pointer" : "default",
            padding: "1rem",
            marginBottom: "0.75rem",
            backgroundColor: notif.isRead ? "#f9f9f9" : "#eef6ff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
          onClick={async () => {
            if (!notif.isRead) {
              await markAsRead(notif._id);
            }
            if (notif.link) {
              navigate(notif.link);
            }
          }}
          title={notif.message || ""}
        >
          {notif.message || "(No message)"}
        </li>
      ))}
    </ul>
  </div>
);

};

export default Notifications;
