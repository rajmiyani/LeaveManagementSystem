import React, { useState } from "react";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";

const ManageLeaveType = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFocused, setIsFocused] = useState(false);

    const [leaveTypes, setLeaveTypes] = useState([
        { id: 1, type: "Sick Leave", addedBy: "Admin" },
        { id: 2, type: "Casual Leave", addedBy: "HR" },
    ]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);

    const filteredData = leaveTypes.filter((leave) =>
        leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.addedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLast = currentPage * entriesPerPage;
    const indexOfFirst = indexOfLast - entriesPerPage;
    const currentLeaves = filteredData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);

    const handlePageChange = (direction) => {
        if (direction === "prev" && currentPage > 1) setCurrentPage(currentPage - 1);
        if (direction === "next" && currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleEditClick = (leave) => {
        setSelectedLeave(leave);
        setShowEditModal(true);
    };

    const handleDeleteClick = (id) => {
        if (window.confirm("Are you sure you want to delete this leave type?")) {
            const updated = leaveTypes.filter(l => l.id !== id);
            setLeaveTypes(updated);
        }
    };

    const handleSaveChanges = () => {
        setLeaveTypes(prev =>
            prev.map(l => l.id === selectedLeave.id ? selectedLeave : l)
        );
        setShowEditModal(false);
    };

    return (
        <div style={{marginTop:"-50px"}}>
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
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Sr no</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Leave Type</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Added By</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentLeaves.length > 0 ? (
                                    currentLeaves.map((leave, index) => (
                                        <tr key={leave.id}>
                                            <td>{indexOfFirst + index + 1}</td>
                                            <td>{leave.type}</td>
                                            <td>{leave.addedBy}</td>
                                            <td>
                                                <FaEdit
                                                    className="text-primary me-2"
                                                    title="Edit"
                                                    onClick={() => handleEditClick(leave)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                                <FaTrash
                                                    className="text-danger"
                                                    title="Delete"
                                                    onClick={() => handleDeleteClick(leave.id)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </td>
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

            {/* Edit Leave Type Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Leave Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Leave Type</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedLeave?.type || ''}
                                onChange={(e) => setSelectedLeave({ ...selectedLeave, type: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Added By</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedLeave?.addedBy || ''}
                                onChange={(e) => setSelectedLeave({ ...selectedLeave, addedBy: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button style={{ backgroundColor: "#5e148b" }} className="border-0" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageLeaveType;
