import { useState } from "react";

export default function AddEmployee() {
    const [formData, setFormData] = useState({
        empCode: '',
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        password: '',
        gender: '',
        department: '',
        city: '',
        dob: '',
        address: '',
        country: '',
        role: '',
        joiningDate: '',
        profileImage: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profileImage") {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Employee:", formData);
        alert("Employee added successfully!");

        // Reset form
        setFormData({
            empCode: '',
            firstName: '',
            lastName: '',
            email: '',
            mobile: '',
            password: '',
            gender: '',
            department: '',
            city: '',
            dob: '',
            address: '',
            country: '',
            role: '',
            joiningDate: '',
            profileImage: null
        });
    };

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0" style={{ color: "#5e148b", fontWeight: "600" }}>Add Employee</h4>
            </div>

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0 mb-0">
                    <li className="breadcrumb-item">
                        <i className="fas fa-home"></i>
                        <a href="/admin/dashboard" style={{ color: "#5e148b", textDecoration: "none" }} className="ms-2">Home</a>
                    </li>
                    <li className="breadcrumb-item active text-muted" aria-current="page">Add Employee</li>
                </ol>
            </nav>

            {/* Form */}
            <div className="bg-white rounded p-4 shadow-sm mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>Employee Code <span className="text-danger">*</span></label>
                            <input type="text" className="form-control custom-input" name="empCode" value={formData.empCode} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>Profile Image</label>
                            <input type="file" className="form-control custom-input" name="profileImage" onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>First Name <span className="text-danger">*</span></label>
                            <input type="text" className="form-control custom-input" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>Last Name <span className="text-danger">*</span></label>
                            <input type="text" className="form-control custom-input" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>Email <span className="text-danger">*</span></label>
                            <input type="email" className="form-control custom-input" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>Mobile No <span className="text-danger">*</span></label>
                            <input type="text" className="form-control custom-input" name="mobile" value={formData.mobile} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>Password <span className="text-danger">*</span></label>
                            <input type="password" className="form-control custom-input" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>Gender <span className="text-danger">*</span></label>
                            <select className="form-select custom-input" name="gender" value={formData.gender} onChange={handleChange} required>
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>Department <span className="text-danger">*</span></label>
                            <input type="text" className="form-control custom-input" name="department" value={formData.department} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>Role <span className="text-danger">*</span></label>
                            <input type="text" className="form-control custom-input" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. HR, Developer" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>City/Town <span className="text-danger">*</span></label>
                            <input type="text" className="form-control custom-input" name="city" value={formData.city} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>Country <span className="text-danger">*</span></label>
                            <input type="text" className="form-control custom-input" name="country" value={formData.country} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>Date of Birth <span className="text-danger">*</span></label>
                            <input type="date" className="form-control custom-input" name="dob" value={formData.dob} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>Joining Date <span className="text-danger">*</span></label>
                            <input type="date" className="form-control custom-input" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
                        </div>
                        <div className="col-12">
                            <label className="form-label" style={{textAlign:"left", display:"block"}}>Address <span className="text-danger">*</span></label>
                            <textarea className="form-control custom-input" name="address" rows="3" value={formData.address} onChange={handleChange} required></textarea>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="d-flex justify-content-end mt-4">
                        <button className="btn btn-outline-secondary me-2" type="reset">Cancel</button>
                        <button className="btn text-white px-4" type="submit" style={{ backgroundColor: "#5e148b" }}>Add Employee</button>
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
