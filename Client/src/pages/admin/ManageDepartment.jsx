import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ManageDepartments = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFocused, setIsFocused] = useState(false);

    const [departments, setDepartments] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);

    // NEW states for delete confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteDeptId, setDeleteDeptId] = useState(null);

    const fetchDepartments = () => {
        fetch("http://localhost:8080/admin/department")
            .then(res => res.json())
            .then(data => setDepartments(data))
            .catch(err => {
                console.error(err);
                toast.error("Failed to fetch departments from server");
            });
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const filteredData = departments.filter((dept) => {
        const term = searchTerm.toLowerCase();
        return (
            dept.name?.toLowerCase().includes(term) ||
            dept.code?.toLowerCase().includes(term) ||
            dept.email?.toLowerCase().includes(term) ||
            dept.mobileNo?.toLowerCase().includes(term) ||
            dept.status?.toLowerCase().includes(term) ||
            (dept.shortName && dept.shortName.toLowerCase().includes(term))
        );
    });

    const indexOfLast = currentPage * entriesPerPage;
    const indexOfFirst = indexOfLast - entriesPerPage;
    const currentDepartments = filteredData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);

    const handlePageChange = (direction) => {
        if (direction === "prev" && currentPage > 1) setCurrentPage(currentPage - 1);
        if (direction === "next" && currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleEditClick = (dept) => {
        setSelectedDept(dept);
        setShowEditModal(true);
    };

    // Open delete modal instead of confirm
    const handleDeleteClick = (id) => {
        setDeleteDeptId(id);
        setShowDeleteModal(true);
    };

    // Confirm delete
    const confirmDelete = () => {
        fetch(`http://localhost:8080/admin/department/${deleteDeptId}`, {
            method: "DELETE",
            // mode: "cors"
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Delete failed");
                const data = await res.json();
                toast.success(data.message || "Department deleted successfully");
                setDepartments(prev => prev.filter(d => d.id !== deleteDeptId));
            })
            .catch(() => toast.error("Failed to delete department"))
            .finally(() => {
                setShowDeleteModal(false);
                setDeleteDeptId(null);
            });
    };

    const handleSaveChanges = () => {
        const formData = new FormData();
        for (const key in selectedDept) {
            if (selectedDept[key] !== undefined && selectedDept[key] !== null) {
                formData.append(key, selectedDept[key]);
            }
        }

        fetch(`http://localhost:8080/admin/department/${selectedDept.id}`, {
            method: "POST",
            body: formData
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Update failed");
                const data = await res.json();
                toast.success(data.message || "Department updated successfully");
                setDepartments(prev =>
                    prev.map(d => d.id === selectedDept.id ? selectedDept : d)
                );
                setShowEditModal(false);
            })
            .catch(() => toast.error("Failed to update department"));
    };

    return (
        <div>
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0" style={{ color: "#5e148b", fontWeight: "600" }}>Manage Departments</h4>
            </div>

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0 mb-0">
                    <li className="breadcrumb-item">
                        <i className="fas fa-home"></i>
                        <a href="/admin/dashboard" style={{ color: "#5e148b", textDecoration: "none" }} className="ms-2">Home</a>
                    </li>
                    <li className="breadcrumb-item active text-muted" aria-current="page">Manage Departments</li>
                </ol>
            </nav>

            {/* Table */}
            <div className="card shadow-sm mt-4">
                <div className="card-body">
                    <h6 className="fw-semibold mb-3 mt-0" style={{ textAlign: "left" }}>DEPARTMENTS INFO</h6>

                    {/* Table Controls */}
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

                    {/* Table Data */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-sm align-middle">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Sr no</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Dept Name</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Dept Short Name</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Dept Code</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Email</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Mobile No</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Status</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Creation Date</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDepartments.length > 0 ? (
                                    currentDepartments.map((dept, index) => (
                                        <tr key={dept.id}>
                                            <td>{indexOfFirst + index + 1}</td>
                                            <td>{dept.name}</td>
                                            <td>{dept.shortName || '-'}</td>
                                            <td>{dept.code}</td>
                                            <td>{dept.email}</td>
                                            <td>{dept.mobileNo}</td>
                                            <td>{dept.status}</td>
                                            <td>{new Date(dept.date).toLocaleString()}</td>
                                            <td>
                                                <FaEdit
                                                    className="text-primary me-2 cursor-pointer"
                                                    title="Edit"
                                                    onClick={() => handleEditClick(dept)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                                <FaTrash
                                                    className="text-danger cursor-pointer"
                                                    title="Delete"
                                                    onClick={() => handleDeleteClick(dept.id)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <div>
                            Showing {filteredData.length === 0 ? 0 : indexOfFirst + 1} to{" "}
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
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => handlePageChange("next")}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Department Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Department</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Department Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedDept?.name || ''}
                                onChange={(e) => setSelectedDept({ ...selectedDept, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Short Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedDept?.shortName || ''}
                                onChange={(e) => setSelectedDept({ ...selectedDept, shortName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Department Code</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedDept?.code || ''}
                                onChange={(e) => setSelectedDept({ ...selectedDept, code: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={selectedDept?.email || ''}
                                onChange={(e) => setSelectedDept({ ...selectedDept, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mobile No</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedDept?.mobileNo || ''}
                                onChange={(e) => setSelectedDept({ ...selectedDept, mobileNo: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                value={selectedDept?.status || 'Active'}
                                onChange={(e) => setSelectedDept({ ...selectedDept, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="InActive">InActive</option>
                            </Form.Select>
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

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: "#5e148b", color: "white" }}>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p style={{ fontSize: "1.1rem" }}>Are you sure you want to delete this department?</p>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button style={{ backgroundColor: "#5e148b", border: "none" }} onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ManageDepartments;
