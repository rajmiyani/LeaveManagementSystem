// ManageEmployee.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";

const API_BASE = "http://localhost:8080/admin"; 

const ManageEmployee = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE}/employee`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = employees.filter((emp) =>
    Object.values(emp).some((val) =>
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

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${API_BASE}/employee/${id}`);
        setEmployees((prev) => prev.filter((e) => e.id !== id));
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`${API_BASE}/employee/${selectedEmployee.id}`, selectedEmployee);
      fetchEmployees();
      setShowEditModal(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0" style={{ color: "#5e148b", fontWeight: "600" }}>
          Manage Employee
        </h4>
      </div>

      {/* Search + Pagination Controls */}
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
            {[5, 10, 15, 20].map((n) => (
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
                boxShadow: "none",
              }}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="position-absolute"
              style={{
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                color: isFocused ? "#5e148b" : "#999",
                pointerEvents: "none",
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
              {["#", "Name", "Email", "Mobile", "Gender", "Department", "City", "DOB", "Country", "Action"].map((header, i) => (
                <th key={i} style={{ backgroundColor: "#5e148b", color: "white" }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  {/* <td>{emp.empCode}</td> */}
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.mobile}</td>
                  <td>{emp.gender}</td>
                  <td>{emp.department}</td>
                  <td>{emp.city}</td>
                  <td>{emp.dob}</td>
                  <td>{emp.country}</td>
                  <td>
                    <FaEdit className="text-primary me-2" title="Edit" onClick={() => handleEditClick(emp)} style={{ cursor: "pointer" }} />
                    <FaTrash className="text-danger" title="Delete" onClick={() => handleDeleteClick(emp.id)} style={{ cursor: "pointer" }} />
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="11" className="text-center">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-2">
        <div>
          Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredData.length)} of {filteredData.length} entries
        </div>
        <div>
          <button className="btn btn-outline-secondary btn-sm me-2" disabled={currentPage === 1} onClick={() => handlePageChange("prev")}><FaChevronLeft /></button>
          <span className="fw-bold px-2">{currentPage}</span>
          <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === totalPages} onClick={() => handlePageChange("next")}><FaChevronRight /></button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton><Modal.Title>Edit Employee</Modal.Title></Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {selectedEmployee && (
            <Form>
              {["name", "email", "mobile", "department", "city", "dob", "address", "country"].map((field, idx) => (
                <Form.Group className="mb-3" key={idx}>
                  <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                  <Form.Control
                    type={field === "dob" ? "date" : "text"}
                    value={selectedEmployee[field] || ""}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, [field]: e.target.value })}
                  />
                </Form.Group>
              ))}
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  value={selectedEmployee.gender}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button style={{ backgroundColor: "#5e148b" }} className="border-0" onClick={handleSaveChanges}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageEmployee;
