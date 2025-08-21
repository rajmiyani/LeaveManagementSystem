import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddDepartment() {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        email: '',
        mobileNo: '',
        description: '',
        status: 'Active',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/admin/add-department", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams(formData) // Sending form-data style
            });


            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Department added successfully!");
                setFormData({
                    name: '',
                    code: '',
                    email: '',
                    mobileNo: '',
                    description: '',
                    status: 'Active',
                });
            } else {
                toast.error(data.message || JSON.stringify(data));
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to connect to server. Please check backend.");
        }
    };

    return (
        <div style={{ marginTop: "-60px" }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0" style={{ color: "#5e148b", fontWeight: "600" }}>Add Department</h4>
            </div>

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0 mb-0">
                    <li className="breadcrumb-item">
                        <i className="fas fa-home"></i>
                        <a href="/admin/dashboard" style={{ color: "#5e148b", textDecoration: "none" }} className="ms-2">Home</a>
                    </li>
                    <li className="breadcrumb-item active text-muted" aria-current="page">Add Department</li>
                </ol>
            </nav>

            {/* Form Card */}
            <div className="bg-white rounded p-4 shadow-sm mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="form-label">Department Code <span className="text-danger">*</span></label>
                            <input type="text" className="form-control custom-input" name="code" placeholder="Enter code" value={formData.code} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Department Name <span className="text-danger">*</span></label>
                            <input type="text" className="form-control custom-input" name="name" placeholder="Enter name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Email <span className="text-danger">*</span></label>
                            <input type="email" className="form-control custom-input" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Mobile No <span className="text-danger">*</span></label>
                            <input type="text" className="form-control custom-input" name="mobileNo" placeholder="Enter mobile no" value={formData.mobileNo} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Status <span className="text-danger">*</span></label>
                            <select className="form-select custom-input" name="status" value={formData.status} onChange={handleChange}>
                                <option value="Active">Active</option>
                                <option value="InActive">InActive</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Description</label>
                            <textarea className="form-control custom-input" name="description" rows="3" placeholder="Enter description" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="d-flex justify-content-end mt-5">
                        <button className="btn btn-outline-secondary me-2" type="reset">Cancel</button>
                        <button className="btn text-white px-4" type="submit" style={{ backgroundColor: "#5e148b" }}>Add Department</button>
                    </div>
                </form>

                <style>
                    {`
                        .custom-input:focus {
                            border: 2px solid #5e148b !important;
                            box-shadow: none !important;
                        }
                        .custom-input {
                            margin-top:15px;
                        }
                    `}
                </style>
            </div>

            {/* Toast container */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} />
        </div>
    );
}
