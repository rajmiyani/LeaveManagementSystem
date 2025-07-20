import { useState } from "react";

export default function ProfileSettings() {
    const [profileImage, setProfileImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setProfileImage(URL.createObjectURL(file));
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0" style={{ color: "#5e148b", fontWeight: "600" }}>Profile</h4>
            </div>

            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0 mb-0">
                    <li className="breadcrumb-item">
                        <i className="fas fa-home"></i>
                        <a href="/" style={{ color: "#5e148b", textDecoration: "none" }} className="ms-2">Home</a>
                    </li>
                    <li className="breadcrumb-item active text-muted" aria-current="page">Profile</li>
                </ol>
            </nav>

            {/* Form Card */}
            <div className="bg-white rounded p-4 shadow-sm mt-4">
                <h6 className="fw-bold mb-3 text-decoration-underline" style={{ textAlign: "left" }}>Basic Information</h6>

                {/* Profile Image Upload */}
                <div className="mb-4 d-flex align-items-center mt-5">
                    <div style={{ position: "relative", width: "80px", height: "80px" }}>
                        <img
                            src={
                                profileImage ||
                                "https://media.licdn.com/dms/image/v2/D4E03AQFdZBRVSvq7tA/profile-displayphoto-shrink_200_200/B4EZRFUcZkHkAg-/0/1736329775667?e=2147483647&v=beta&t=l-TUw49oCO3nEl4UchOSz9M8QbujtHGlpS-Ezhw1RoM"
                            }
                            alt="Profile"
                            className="rounded-circle border"
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />

                        <label
                            htmlFor="upload"
                            className="position-absolute top-0 start-100 translate-middle  btn-sm rounded-circle d-flex justify-content-center align-items-center"
                            style={{ width: "28px", height: "28px", cursor: "pointer", backgroundColor:"#5e148b" }}
                        >
                            <i className="fas fa-edit" style={{ fontSize: "14px", color:"white" }}></i>
                            <input
                                id="upload"
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    <div className="ms-3 text-muted" style={{ fontSize: "12px" }}>
                        JPG or PNG format, not exceeding 1MB.
                    </div>
                </div>

                {/* Basic Info */}
                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <label className="form-label" style={{textAlign:"left", display:"block"}}>First Name <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="Enter first name" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" style={{textAlign:"left", display:"block"}}>Last Name <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="Enter last name" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" style={{textAlign:"left", display:"block"}}>Email Address <span className="text-danger">*</span></label>
                        <input type="email" className="form-control" placeholder="example@email.com" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" style={{textAlign:"left", display:"block"}}>Phone Number <span className="text-danger">*</span></label>
                        <input type="tel" className="form-control" placeholder="+91-XXXXXXX" />
                    </div>
                </div>

                {/* Address Info */}
                <h6 className="fw-bold my-4 text-text-text-decoration-underline" style={{textAlign:"left", display:"block"}}>Address Information</h6>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label" style={{textAlign:"left", display:"block"}}>Address Line 1 <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="Street Address" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" style={{textAlign:"left", display:"block"}}>Address Line 2</label>
                        <input type="text" className="form-control" placeholder="Apartment, floor, etc." />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" style={{textAlign:"left", display:"block"}}>Country <span className="text-danger">*</span></label>
                        <select className="form-select">
                            <option>Select</option>
                            <option>India</option>
                            <option>USA</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" style={{textAlign:"left", display:"block"}}>State <span className="text-danger">*</span></label>
                        <select className="form-select">
                            <option>Select</option>
                            <option>Gujarat</option>
                            <option>Maharashtra</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" style={{textAlign:"left", display:"block"}}>Pin Code <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="Enter PIN" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" style={{textAlign:"left", display:"block"}}>City <span className="text-danger">*</span></label>
                        <select className="form-select">
                            <option>Select</option>
                            <option>Ahmedabad</option>
                            <option>Mumbai</option>
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-end mt-4">
                    <button className="btn btn-outline-secondary me-2">Cancel</button>
                    <button className="btn px-4 text-white" style={{backgroundColor:"#5e148b"}}>Save Changes</button>
                </div>
            </div>
        </div>
    );
}
