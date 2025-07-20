import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const LeaveHistory = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFocused, setIsFocused] = useState(false);

    const leaveData = [
        {
            id: 1,
            leaveType: "Casual Leave",
            startDate: "2025-07-10",
            endDate: "2025-07-12",
            description: "Family function attendance",
            postingDate: "2025-07-08 10:32:45",
            adminRemark: "Leave Approved 2025-07-09 09:21:45",
            status: "Approved",
        },
        {
            id: 2,
            leaveType: "Medical Leave",
            startDate: "2025-07-15",
            endDate: "2025-07-17",
            description: "Flu and fever",
            postingDate: "2025-07-14 14:12:30",
            adminRemark: "Leave Approved 2025-07-15 08:00:00",
            status: "Approved",
        },
        {
            id: 3,
            leaveType: "Emergency Leave",
            startDate: "2025-07-05",
            endDate: "2025-07-05",
            description: "Urgent personal work",
            postingDate: "2025-07-04 18:45:22",
            adminRemark: "Leave Rejected 2025-07-04 20:00:00",
            status: "Rejected",
        },
    ];

    const filteredData = leaveData.filter((leave) =>
        leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLast = currentPage * entriesPerPage;
    const indexOfFirst = indexOfLast - entriesPerPage;
    const currentLeaves = filteredData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);

    const handlePageChange = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0" style={{ color: "#5e148b", fontWeight: "600" }}>Leave History</h4>
            </div>

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0 mb-0">
                    <li className="breadcrumb-item">
                        <i className="fas fa-home"></i>
                        <a href="/admin/dashboard" style={{ color: "#5e148b", textDecoration: "none" }} className="ms-2">Home</a>
                    </li>
                    <li className="breadcrumb-item active text-muted" aria-current="page">Leave History</li>
                </ol>
            </nav>

            <div className="card shadow-sm mt-4">
                <div className="card-body">
                    <div className="row mb-3 align-items-center justify-content-between">
                        <div className="col-md-3 col-sm-6 d-flex align-items-center gap-2">
                            <label className="mb-0 fw-semibold">Show</label>
                            <select
                                className="form-select form-select-sm w-auto"
                                value={entriesPerPage}
                                onChange={(e) => {
                                    setEntriesPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                {[5, 10, 15, 20].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4 col-sm-6 text-end">
                            <div className="position-relative w-100" style={{ maxWidth: "300px" }}>
                                <input
                                    type="text"
                                    className="form-control form-control-sm pe-4 custom-input"
                                    placeholder="Search records"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    style={{
                                        paddingRight: "30px",
                                        border: isFocused ? "2px solid #5e148b" : "1px solid #ccc",
                                        boxShadow: "none",
                                    }}
                                />
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    className="position-absolute"
                                    style={{
                                        top: '50%',
                                        right: '10px',
                                        transform: 'translateY(-50%)',
                                        color: isFocused ? '#5e148b' : '#999',
                                        pointerEvents: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-sm align-middle">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>#</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Leave Type</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Start Date</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>End Date</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Description</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Posting Date</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Admin Remark</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentLeaves.length > 0 ? (
                                    currentLeaves.map((leave, index) => (
                                        <tr key={leave.id}>
                                            <td>{indexOfFirst + index + 1}</td>
                                            <td>{leave.leaveType}</td>
                                            <td>{leave.startDate}</td>
                                            <td>{leave.endDate}</td>
                                            <td>{leave.description}</td>
                                            <td>{leave.postingDate}</td>
                                            <td>{leave.adminRemark}</td>
                                            <td>
                                                <span className={`badge ${leave.status === "Approved"
                                                    ? "bg-success"
                                                    : leave.status === "Rejected"
                                                        ? "bg-danger"
                                                        : "bg-warning text-dark"}`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">No leave records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            Showing {indexOfFirst + 1} to{" "}
                            {Math.min(indexOfLast, filteredData.length)} of {filteredData.length} entries
                        </div>
                        <div>
                            <button
                                className="btn btn-outline-secondary btn-sm me-2"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange("prev")}
                            >
                                <FaChevronLeft />
                            </button>
                            <span className="fw-bold px-2">{currentPage}</span>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange("next")}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveHistory;
