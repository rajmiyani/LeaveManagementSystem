import { useState } from "react";

export default function AddLeaves() {
    const [formData, setFormData] = useState({
        leaveType: '',
        description: '',
        status: 'Active',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.leaveType.trim()) {
            alert("Leave type is required.");
            return;
        }

        console.log("Submitted Leave:", formData);

        // Reset form
        setFormData({
            leaveType: '',
            description: '',
            status: 'Active',
        });
    };

    return (
        <div style={{marginTop:"-150px"}}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0" style={{ color: "#5e148b", fontWeight: "600" }}>Add Leave Type</h4>
            </div>

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0 mb-0">
                    <li className="breadcrumb-item">
                        <i className="fas fa-home"></i>
                        <a href="/admin/dashboard" style={{ color: "#5e148b", textDecoration: "none" }} className="ms-2">Home</a>
                    </li>
                    <li className="breadcrumb-item active text-muted" aria-current="page">Add Leaves</li>
                </ol>
            </nav>

            {/* Form */}
            <div className="bg-white rounded p-4 shadow-sm mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="form-label" style={{ display: "block", textAlign: "left" }}>
                                Leave Type <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control custom-input"
                                name="leaveType"
                                placeholder="Enter leave type (e.g., Sick Leave)"
                                value={formData.leaveType}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label" style={{ display: "block", textAlign: "left" }}>
                                Status <span className="text-danger">*</span>
                            </label>
                            <select
                                className="form-select custom-input"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Active">Active</option>
                                <option value="InActive">InActive</option>
                            </select>
                        </div>

                        <div className="col-md-12">
                            <label className="form-label" style={{ display: "block", textAlign: "left" }}>
                                Description
                            </label>
                            <textarea
                                className="form-control custom-input"
                                name="description"
                                rows="3"
                                placeholder="Enter leave type description"
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="d-flex justify-content-end mt-5">
                        <button className="btn btn-outline-secondary me-2" type="reset">Cancel</button>
                        <button className="btn text-white px-4" type="submit" style={{ backgroundColor: "#5e148b" }}>
                            Add Leave
                        </button>
                    </div>
                </form>

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
