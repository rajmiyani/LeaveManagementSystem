import { useState } from "react";

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Data:", formData);

        // Reset form after submit
        setFormData({
            name: '',
            code: '',
            email: '',
            mobileNo: '',
            description: '',
            status: 'Active',
        });
    };

    return (
        <div style={{marginTop:"-60px"}}>
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
                            <label className="form-label" style={{ textAlign: "left", display: "block" }}>Department Code <span className="text-danger">*</span></label>
                            <input type="text" className="form-control custom-input" name="code" placeholder="Enter code" value={formData.code} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{ textAlign: "left", display: "block" }}>Department Name <span className="text-danger">*</span></label>
                            <input type="text" className="form-control custom-input" name="name" placeholder="Enter name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{ textAlign: "left", display: "block" }}>Email <span className="text-danger">*</span></label>
                            <input type="email" className="form-control custom-input" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{ textAlign: "left", display: "block" }}>Mobile No <span className="text-danger">*</span></label>
                            <input type="text" className="form-control custom-input" name="mobileNo" placeholder="Enter mobile no" value={formData.mobileNo} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{ textAlign: "left", display: "block" }}>Status <span className="text-danger">*</span></label>
                            <select className="form-select custom-input" name="status" value={formData.status} onChange={handleChange}>
                                <option value="Active">Active</option>
                                <option value="InActive">InActive</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{ textAlign: "left", display: "block" }}>Description</label>
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
                            margin-top:100px;
                        }
                        .custom-input {
                            margin-top:15px;
                        }
                    `}
                </style>
            </div>
        </div>
    );
}
