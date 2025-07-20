import React, { useState } from "react";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";

const ManageEmployee = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFocused, setIsFocused] = useState(false);

    const [employees, setEmployees] = useState([
        {
            id: 1,
            empCode: "EMP001",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            mobile: "1234567890",
            gender: "Male",
            department: "HR",
            city: "New York",
            dob: "1990-01-01",
            country: "USA"
        },
        {
            id: 2,
            empCode: "EMP002",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane@example.com",
            mobile: "9876543210",
            gender: "Female",
            department: "Finance",
            city: "London",
            dob: "1992-05-12",
            country: "UK"
        },
    ]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // ✅ Define filteredData properly
    const filteredData = employees.filter(emp =>
        Object.values(emp).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const indexOfLast = currentPage * entriesPerPage;
    const indexOfFirst = indexOfLast - entriesPerPage;
    const currentEmployees = filteredData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);

    const handlePageChange = (direction) => {
        if (direction === "prev" && currentPage > 1) setCurrentPage(currentPage - 1);
        if (direction === "next" && currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleEditClick = (emp) => {
        setSelectedEmployee(emp);
        setShowEditModal(true);
    };

    const handleDeleteClick = (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            const updated = employees.filter(e => e.id !== id);
            setEmployees(updated);
        }
    };

    const handleSaveChanges = () => {
        setEmployees(prev =>
            prev.map(e => e.id === selectedEmployee.id ? selectedEmployee : e)
        );
        setShowEditModal(false);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0" style={{ color: "#5e148b", fontWeight: "600" }}>Manage Employee</h4>
            </div>

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0 mb-0">
                    <li className="breadcrumb-item">
                        <i className="fas fa-home"></i>
                        <a href="/admin/dashboard" style={{ color: "#5e148b", textDecoration: "none" }} className="ms-2">Home</a>
                    </li>
                    <li className="breadcrumb-item active text-muted" aria-current="page">Manage Employee</li>
                </ol>
            </nav>

            <div className="card shadow-sm mt-4">
                <div className="card-body">
                    <h6 className="fw-semibold mb-3" style={{ textAlign: "left", display: "block" }}>EMPLOYEE INFO</h6>

                    <div className="row mb-3 align-items-center justify-content-between">
                        <div className="col-md-3 d-flex align-items-center gap-2">
                            <label className="fw-semibold">Show</label>
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

                        <div className="col-md-4 text-end">
                            <div className="position-relative w-100" style={{ maxWidth: "300px" }}>
                                <input
                                    type="text"
                                    className="form-control form-control-sm pe-4 custom-input"
                                    placeholder="Search employees"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    style={{
                                        paddingRight: "30px",
                                        border: isFocused ? "2px solid #5e148b" : "1px solid #ccc",
                                        boxShadow: "none"
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
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Emp Code</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Name</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Email</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Mobile</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Gender</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Department</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>City</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>DOB</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Country</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEmployees.length > 0 ? (
                                    currentEmployees.map((emp, index) => (
                                        <tr key={emp.id}>
                                            <td>{indexOfFirst + index + 1}</td>
                                            <td>{emp.empCode}</td>
                                            <td>{emp.firstName} {emp.lastName}</td>
                                            <td>{emp.email}</td>
                                            <td>{emp.mobile}</td>
                                            <td>{emp.gender}</td>
                                            <td>{emp.department}</td>
                                            <td>{emp.city}</td>
                                            <td>{emp.dob}</td>
                                            <td>{emp.country}</td>
                                            <td>
                                                <FaEdit
                                                    className="text-primary me-2"
                                                    title="Edit"
                                                    onClick={() => handleEditClick(emp)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                                <FaTrash
                                                    className="text-danger"
                                                    title="Delete"
                                                    onClick={() => handleDeleteClick(emp.id)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="text-center">No records found.</td>
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

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {selectedEmployee && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Employee Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedEmployee.empCode}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, empCode: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedEmployee.firstName}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, firstName: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedEmployee.lastName}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, lastName: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={selectedEmployee.email}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, email: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Mobile No</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedEmployee.mobile}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, mobile: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={selectedEmployee.password}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, password: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Gender</Form.Label>
                                <Form.Select
                                    value={selectedEmployee.gender}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, gender: e.target.value })
                                    }
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Department</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedEmployee.department}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, department: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>City/Town</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedEmployee.city}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, city: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={selectedEmployee.dob}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, dob: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={selectedEmployee.address}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, address: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedEmployee.country}
                                    onChange={(e) =>
                                        setSelectedEmployee({ ...selectedEmployee, country: e.target.value })
                                    }
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        style={{ backgroundColor: "#5e148b" }}
                        className="border-0"
                        onClick={handleSaveChanges}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageEmployee;
