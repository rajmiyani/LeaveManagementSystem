import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Applyleave() {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        leaveType: "",
        reasonType: "",
        fromDate: "",
        toDate: "",
        description: ""
    });

    // Fetch leave types from backend when component mounts
    useEffect(() => {
        axios
            .get("http://localhost:8080/admin/leavetype")
            .then((res) => {
                setLeaveTypes(res.data.data);
            })
            .catch((err) => {
                console.error("Error fetching leave types:", err);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/manager/applyLeaves", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Leave request submitted successfully!");
            setFormData({
                name: "",
                mobile: "",
                leaveType: "",
                reasonType: "",
                fromDate: "",
                toDate: "",
                description: ""
            });
        } catch (error) {
            console.error("Leave submission failed:", error);
            alert("Failed to submit leave.");
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4
                    className="mb-0"
                    style={{ color: "#5e148b", fontWeight: "600" }}
                >
                    Apply for Leave
                </h4>
            </div>

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0 mb-0">
                    <li className="breadcrumb-item">
                        <i className="fas fa-home"></i>
                        <a
                            href="/employee/dashboard"
                            className="ms-2"
                            style={{ color: "#5e148b", textDecoration: "none" }}
                        >
                            Home
                        </a>
                    </li>
                    <li
                        className="breadcrumb-item active text-muted"
                        aria-current="page"
                    >
                        Apply Leave
                    </li>
                </ol>
            </nav>

            {/* Form */}
            <div className="bg-white rounded p-4 shadow-sm mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-4">

                        {/* Full Name */}
                        <div className="col-md-6">
                            <label className="form-label" style={{ textAlign: "left", display: "block" }}>
                                Full Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="form-control custom-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Mobile No */}
                        <div className="col-md-6">
                            <label className="form-label" style={{ textAlign: "left", display: "block" }}>
                                Mobile No <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="mobile"
                                className="form-control custom-input"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Leave Type (Dynamic) */}
                        <div className="col-md-6">
                            <label className="form-label" style={{ textAlign: "left", display: "block" }}>
                                Leave Type <span className="text-danger">*</span>
                            </label>
                            <select
                                name="leaveType"
                                className="form-select custom-input"
                                value={formData.leaveType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Select Leave Type --</option>
                                {leaveTypes.map((type) => (
                                    <option key={type.id} value={type.leaveType}>
                                        {type.leaveType}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Reason Type */}
                        <div className="col-md-6">
                            <label className="form-label" style={{ textAlign: "left", display: "block" }}>
                                Leave Reason Type <span className="text-danger">*</span>
                            </label>
                            <select
                                name="reasonType"
                                className="form-select custom-input"
                                value={formData.reasonType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Select Reason --</option>
                                <option value="Personal">Personal</option>
                                <option value="Medical">Medical</option>
                                <option value="Emergency">Emergency</option>
                                <option value="Vacation">Vacation</option>
                            </select>
                        </div>

                        {/* From Date */}
                        <div className="col-md-6">
                            <label className="form-label" style={{ textAlign: "left", display: "block" }}>
                                From Date <span className="text-danger">*</span>
                            </label>
                            <input
                                type="date"
                                name="fromDate"
                                className="form-control custom-input"
                                value={formData.fromDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* To Date */}
                        <div className="col-md-6">
                            <label className="form-label" style={{ textAlign: "left", display: "block" }}>
                                To Date <span className="text-danger">*</span>
                            </label>
                            <input
                                type="date"
                                name="toDate"
                                className="form-control custom-input"
                                value={formData.toDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="col-12">
                            <label className="form-label" style={{ textAlign: "left", display: "block" }}>
                                Description <span className="text-danger">*</span>
                            </label>
                            <textarea
                                name="description"
                                className="form-control custom-input"
                                rows="4"
                                placeholder="Describe your leave reason"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="d-flex justify-content-end mt-4">
                        <button type="reset" className="btn btn-outline-secondary me-2">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn text-white px-4"
                            style={{ backgroundColor: "#5e148b" }}
                        >
                            Submit Leave
                        </button>
                    </div>
                </form>

                {/* Styles */}
                <style>
                    {`
            .custom-input:focus {
              border: 2px solid #5e148b !important;
              box-shadow: none !important;
            }
            .custom-input {
              margin-top: 15px;
            }
          `}
                </style>
            </div>
        </div>
    );
}
