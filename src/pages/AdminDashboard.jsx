import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>
            <nav>
                <Link to="/admin-topup" style={{ marginRight: "10px", textDecoration: "none" }}>
                    Wallet Top-up
                </Link>
                <Link to="/admin/users" style={{ textDecoration: "none" }}>
                    View All users
                </Link>
            </nav>
            <p>Welcome, admin! Manage your platform here.</p>
        </div>
    );
};

export default AdminDashboard;