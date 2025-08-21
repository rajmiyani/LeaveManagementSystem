import { useState, useEffect } from "react";
import axios from "axios";
import Profile from "../../assets/AboutUs.webp";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function getAdminToken() {
    const raw = localStorage.getItem("userTokens");
    if (!raw) return "";
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            const adminEntry = parsed.find(t => t.role === "admin");
            return adminEntry?.token || "";
        }
        return parsed.token || "";
    } catch {
        return "";
    }
}


export default function ProfileSettings() {
    const [profileImage, setProfileImage] = useState(Profile);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "", last_name: "", email: "", phone: "",
        address1: "", address2: "", country: "", state: "",
        pin_code: "", city: ""
    });

    useEffect(() => {
        const token = getAdminToken();
        if (!token) {
            console.error("No token found for admin in localStorage");
            return;
        }
        console.log(token);


        axios.get("http://localhost:8080/admin/profile", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                const data = res.data?.data || {};
                setFormData({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address1: data.address1 || "",
                    address2: data.address2 || "",
                    country: data.country || "",
                    state: data.state || "",
                    pin_code: data.pin_code || "",
                    city: data.city || "",
                });
                setProfileImage(data.profile_image || Profile);
            })
            .catch((err) => {
                console.error("Error fetching profile:", err);
                if (err.response?.status === 401) {
                    alert("Session expired. Please log in again.");
                }
            });
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        const token = getAdminToken();
        if (!token) {
            alert("No token found. Please log in again.");
            return;
        }

        const form = new FormData();
        Object.keys(formData).forEach((key) => form.append(key, formData[key]));
        if (imageFile) form.append("profile_image", imageFile);

        axios.post("http://localhost:8080/admin/profile/update", form, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        })
            .then((res) => {
                const updated = res.data?.data;

                if (updated) {
                    // update local state
                    setFormData(updated);
                    setProfileImage(updated.profile_image || Profile);

                    // store updated profile in localStorage
                    localStorage.setItem("AdminProfileData", JSON.stringify(updated));

                    // ✅ If you also keep token + user together (like authUser in example),
                    // you can merge them here as well if needed.
                }

                toast.success("Profile updated successfully!");
            })
            .catch((err) => {
                console.error("Error updating profile:", err);
                toast.error("Update failed. Please try again.");
            });


    };


    return (
        <div style={{ marginTop: "80px" }}>
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

            <div className="bg-white rounded p-4 shadow-sm mt-4">
                <h6 className="fw-bold mb-3 text-decoration-underline" style={{ textAlign: "left" }}>Basic Information</h6>

                <div className="mb-4 d-flex align-items-center mt-5">
                    <div style={{ position: "relative", width: "80px", height: "80px" }}>
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="rounded-circle border"
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />
                        <label
                            htmlFor="upload"
                            className="position-absolute top-0 start-100 translate-middle btn-sm rounded-circle d-flex justify-content-center align-items-center"
                            style={{ width: "28px", height: "28px", cursor: "pointer", backgroundColor: "#5e148b" }}
                        >
                            <i className="fas fa-edit" style={{ fontSize: "14px", color: "white" }}></i>
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
                        <label className="form-label">First Name <span className="text-danger">*</span></label>
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="form-control" placeholder="Enter first name" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Last Name <span className="text-danger">*</span></label>
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="form-control" placeholder="Enter last name" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Email Address <span className="text-danger">*</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="example@email.com" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-control" placeholder="+91-XXXXXXX" />
                    </div>
                </div>

                <h6 className="fw-bold my-4 text-decoration-underline" style={{ textAlign: "left" }}>Address Information</h6>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Address Line 1 <span className="text-danger">*</span></label>
                        <input type="text" name="address1" value={formData.address1} onChange={handleChange} className="form-control" placeholder="Street Address" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Address Line 2</label>
                        <input type="text" name="address2" value={formData.address2} onChange={handleChange} className="form-control" placeholder="Apartment, floor, etc." />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Country <span className="text-danger">*</span></label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-control" placeholder="Country" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">State <span className="text-danger">*</span></label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control" placeholder="State" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Pin Code <span className="text-danger">*</span></label>
                        <input type="text" name="pin_code" value={formData.pin_code} onChange={handleChange} className="form-control" placeholder="Enter PIN" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">City <span className="text-danger">*</span></label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" placeholder="City" />
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                    <button className="btn btn-outline-secondary me-2">Cancel</button>
                    <button className="btn px-4 text-white" style={{ backgroundColor: "#5e148b" }} onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
