import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Profile from '../../assets/LOGO.png';

const LeaveDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const leave = location.state?.leave;

    const [status, setStatus] = useState(leave?.status || '');
    const [adminNote, setAdminNote] = useState('');

    const handleUpdate = () => {
        alert(`Leave ${status} with note: ${adminNote}`);
        navigate('/admin/show-all-leave');
    };

    if (!leave) return <p className="text-center mt-5 text-danger">No leave found.</p>;

    return (
        <div className="container mt-5 mb-5">
            <div className="card shadow-sm border-0 rounded-4 mt-4">
                <div className="card-header text-white rounded-top-4 py-3" style={{ backgroundColor: "#5e148b" }}>
                    <h4 className="mb-0" style={{ textAlign: "left", display: "block" }}>Leave Request Details</h4>
                </div>
                <div className="card-body p-4">
                    <div className="row align-items-start mb-4">
                        {/* Left Side - Image */}
                        <div className="col-md-2 d-flex justify-content-center mb-3 mb-md-0">
                            <img
                                src={Profile}
                                alt="Profile"
                                className="img-fluid rounded-circle border"
                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                            />
                        </div>

                        {/* Center Details */}
                        <div className="col-md-5">
                            <p><strong>Name:</strong> {leave.firstName} {leave.lastName}</p>
                            <p><strong>Leave Type:</strong> {leave.leaveType}</p>
                            <p><strong>Total Days:</strong> {leave.totalDays}</p>
                            <p><strong>Applied By:</strong> {leave.appliedBy}</p>
                        </div>

                        {/* Right Details */}
                        <div className="col-md-5">
                            <p><strong>Department:</strong> {leave.department}</p>
                            <p><strong>Duration:</strong> {leave.startDate} to {leave.endDate}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span className={`badge ${leave.status === "Approved" ? "bg-success" : leave.status === "Rejected" ? "bg-danger" : "bg-secondary"}`}>
                                    {leave.status}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="row">
                        <div className="col-md-12">
                            <strong>Description:</strong>
                            <p className="text-muted mt-1 border rounded-3 p-3 bg-light">{leave.description}</p>
                        </div>
                    </div>

                    <hr className="my-4" />

                    <div className="mb-3">
                        <label className="form-label"><strong>Status Update:</strong></label>
                        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">Select</option>
                            <option value="Approved">Approve</option>
                            <option value="Rejected">Reject</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="form-label"><strong>Admin Note:</strong></label>
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Add any remarks or note here..."
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="d-flex justify-content-end gap-3">
                        <button className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
                            <i className="fas fa-arrow-left me-2"></i> Back
                        </button>
                        <button className="btn px-4 text-white" style={{ backgroundColor: "#5e148b" }} onClick={handleUpdate}>
                            <i className="fas fa-check-circle me-2"></i> Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveDetails;
