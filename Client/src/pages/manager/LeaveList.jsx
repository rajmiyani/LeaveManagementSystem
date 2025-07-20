import React from "react";

const LeaveList = () => {
    // Sample leave data
    const leaveData = [
        {
            id: 1,
            type: "Sick Leave",
            from: "2025-07-20",
            to: "2025-07-22",
            reason: "Fever and weakness",
            status: "Pending"
        },
        {
            id: 2,
            type: "Casual Leave",
            from: "2025-07-15",
            to: "2025-07-16",
            reason: "Family function",
            status: "Approved"
        }
    ];

    return (
        <div style={{ marginTop:"-250px"}}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0" style={{ color: "#5e148b", fontWeight: "600" }}>Leave List</h4>
            </div>

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0 mb-0">
                    <li className="breadcrumb-item">
                        <i className="fas fa-home"></i>
                        <a href="/admin/dashboard" style={{ color: "#5e148b", textDecoration: "none" }} className="ms-2">Home</a>
                    </li>
                    <li className="breadcrumb-item active text-muted" aria-current="page">Leave List</li>
                </ol>
            </nav>
            <div className="table-responsive mt-4">
                <table className="table table-bordered table-striped text-center">
                    <thead className="table-dark">
                        <tr>
                            <th style={{backgroundColor:" #5e148b"}}>#</th>
                            <th style={{backgroundColor:" #5e148b"}}>Leave Type</th>
                            <th style={{backgroundColor:" #5e148b"}}>From</th>
                            <th style={{backgroundColor:" #5e148b"}}>To</th>
                            <th style={{backgroundColor:" #5e148b"}}>Reason</th>
                            <th style={{backgroundColor:" #5e148b"}}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveData.map((leave, index) => (
                            <tr key={leave.id}>
                                <td>{index + 1}</td>
                                <td>{leave.type}</td>
                                <td>{leave.from}</td>
                                <td>{leave.to}</td>
                                <td>{leave.reason}</td>
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
                                        {leave.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveList;
