import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // assuming you're using react-router

const LeaveList = () => {
    const [leaveData, setLeaveData] = useState([]);
    const navigate = useNavigate(); // for navigation

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const userTokens = localStorage.getItem("userTokens");
                if (!userTokens) {
                    console.error("No tokens found in localStorage");
                    setLeaveData([]);
                    return;
                }

                const tokensArray = JSON.parse(userTokens);
                const managerTokenObj = tokensArray.find(t => t.role === "manager");
                if (!managerTokenObj) {
                    console.error("No token found for manager role");
                    setLeaveData([]);
                    return;
                }

                const token = managerTokenObj.token;

                const res = await axios.get("http://localhost:8080/manager/myLeaves", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setLeaveData(res.data.data || []);
            } catch (err) {
                console.error("Error fetching leaves:", err);
                setLeaveData([]);
            }
        };

        fetchLeaves();
    }, []);

    return (
        <div style={{ marginTop: "-250px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0" style={{ color: "#5e148b", fontWeight: "600" }}>
                    Leave List
                </h4>

                {/* Apply New Leave Button */}
                <button
                    className="btn"
                    style={{
                        backgroundColor: "#5e148b",
                        color: "#fff",
                        fontWeight: "600",
                        borderRadius: "5px",
                        padding: "6px 15px",
                    }}
                    onClick={() => navigate("/apply-leave")} // navigate to leave application page
                >
                    Apply New Leave
                </button>
            </div>

            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0 mb-0">
                    <li className="breadcrumb-item">
                        <i className="fas fa-home"></i>
                        <a
                            href="/admin/dashboard"
                            style={{ color: "#5e148b", textDecoration: "none" }}
                            className="ms-2"
                        >
                            Home
                        </a>
                    </li>
                    <li className="breadcrumb-item active text-muted" aria-current="page">
                        Leave List
                    </li>
                </ol>
            </nav>

            <div className="table-responsive mt-4">
                <table className="table table-bordered table-striped text-center">
                    <thead className="table-dark">
                        <tr>
                            <th style={{ backgroundColor: "#5e148b" }}>#</th>
                            <th style={{ backgroundColor: "#5e148b" }}>Leave Type</th>
                            <th style={{ backgroundColor: "#5e148b" }}>From</th>
                            <th style={{ backgroundColor: "#5e148b" }}>To</th>
                            <th style={{ backgroundColor: "#5e148b" }}>Reason</th>
                            <th style={{ backgroundColor: "#5e148b" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveData.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center text-muted">
                                    No leave records found.
                                </td>
                            </tr>
                        ) : (
                            leaveData.map((leave, index) => (
                                <tr key={leave.id}>
                                    <td>{index + 1}</td>
                                    <td>{leave.leave_type}</td>
                                    <td>{leave.from_date}</td>
                                    <td>{leave.to_date}</td>
                                    <td>{leave.description}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                leave.status === "Approved"
                                                    ? "bg-success"
                                                    : leave.status === "Rejected"
                                                    ? "bg-danger"
                                                    : "bg-warning text-dark"
                                            }`}
                                        >
                                            {leave.status || "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveList;
