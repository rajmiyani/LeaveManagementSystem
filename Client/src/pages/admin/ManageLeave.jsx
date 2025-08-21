import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageLeaveType = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFocused, setIsFocused] = useState(false);

    const [leaveTypes, setLeaveTypes] = useState([]);

    // Fetch leave types from API
    useEffect(() => {
        fetch("http://localhost:8080/admin/leavetype")
            .then(res => res.json())
            .then(data => {
                setLeaveTypes(data);
            })
            .catch(() => toast.error("Failed to fetch leave types"));
    }, []);

    const filteredData = leaveTypes.filter((leave) =>
        leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.addedBy?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLast = currentPage * entriesPerPage;
    const indexOfFirst = indexOfLast - entriesPerPage;
    const currentLeaves = filteredData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);

    const handlePageChange = (direction) => {
        if (direction === "prev" && currentPage > 1) setCurrentPage(currentPage - 1);
        if (direction === "next" && currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div style={{ marginTop: "50px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0" style={{ color: "#5e148b", fontWeight: "600" }}>Manage Leave Type</h4>
            </div>

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0 mb-0">
                    <li className="breadcrumb-item">
                        <i className="fas fa-home"></i>
                        <a href="/admin/dashboard" style={{ color: "#5e148b", textDecoration: "none" }} className="ms-2">Home</a>
                    </li>
                    <li className="breadcrumb-item active text-muted" aria-current="page">Leave Type</li>
                </ol>
            </nav>

            <div className="card shadow-sm mt-4">
                <div className="card-body">
                    <h6 className="fw-semibold mb-3 mt-0" style={{ textAlign: "left" }}>LEAVE TYPE INFO</h6>

                    {/* Filters */}
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

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-sm align-middle">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Sr no</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Leave Type</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Added By</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Purpose</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentLeaves.length > 0 ? (
                                    currentLeaves.map((leave, index) => (
                                        <tr key={leave.id}>
                                            <td>{indexOfFirst + index + 1}</td>
                                            <td>{leave.leaveType}</td>
                                            <td>{leave.addedBy}</td>
                                            <td>{leave.description}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center mt-2">
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

export default ManageLeaveType;
