import React, { useState, useEffect, useRef } from 'react';
import Profile from '../assets/AboutUs.webp';
import LOGO from '../assets/LOGO.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    FaTachometerAlt,
    FaBuilding,
    FaCalendarAlt,
    FaUsers,
    FaClipboardList,
    FaChevronDown,
    FaPlus,
    FaList,
    FaUserPlus,
    FaUserCog,
    FaTools,
    FaListAlt,
    FaUser,
    FaSignInAlt,
    FaSignOutAlt
} from 'react-icons/fa';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const dropdownRef = useRef();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const [dropdowns, setDropdowns] = useState({
        department: false,
        leaveType: false,
        employee: false,
        leaveManagement: false
    });

    const toggleDropdown = (key) => {
        setDropdowns({ ...dropdowns, [key]: !dropdowns[key] });
    };

    // ✅ Load user info from localStorage (or API)
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Close dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const adminData = JSON.parse(localStorage.getItem("AdminProfileData"));

    const profileImg = adminData?.profile_image
    ? adminData.profile_image
    : Profile;

        
    return (
        <>
            <style>{`
        #root {
            margin:0;
            width:100%;
        }
        .admin-header {
            height: 60px;
            border: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 00px;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background-color: #ffffff; /* Optional: to keep content readable */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .admin-sidebar {
          border: 1px solid #ddd;
          color: black;
          position: fixed;
          top: 60px;
          left: 0;
          height: 100%;
          width: 250px;
          padding-top: 20px;
          transition: width 0.3s ease;
        }

        .admin-sidebar.collapsed {
          width: 70px;
        }

        .admin-sidebar a {
          padding: 12px 20px;
          display: flex;
          align-items: center;
          color: black;
          text-decoration: none;
        }

        .admin-sidebar a:hover {
          background-color: #5e148b;
          color: #fff;
        }

        .admin-sidebar.collapsed span {
          display: none;
        }

        .admin-content {
          margin-top: 60px;
          margin-left: 250px;
          transition: margin-left 0.3s ease;
          padding-left: 20px;
          width: 100%
        }

        .admin-content.collapsed {
          margin-left: 70px;
        }

        .icon:hover {
            color: #5e148b;
        }
        .icon:hover {
            color:white;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            left: -250px;
          }

          .admin-sidebar.show {
            left: 0;
          }

          .admin-content {
            margin-left: 0;
          }
        }
      `}</style>

            {/* Header */}
            <div className="admin-header">
                <button
                    className="btn btn-sm ms-3"
                    onClick={toggleSidebar}
                    style={{
                        color: '#5e148b',
                        border: '1px solid #5e148b',
                        backgroundColor: 'transparent',
                    }}
                >
                    <i className="fas fa-bars"></i>
                </button>

                <div className="d-flex align-items-center gap-3 position-relative me-3" ref={dropdownRef}>
                    <span className="fw-semibold">
                        {user?.name} ({user?.role})
                    </span>

                    <img
                        src={profileImg}
                        alt="user"
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                        onClick={() => setOpen(!open)}
                    />


                    {/* Dropdown Menu */}
                    {open && (
                        <div
                            className="dropdown-menu show position-absolute end-0"
                            style={{ zIndex: 1000, marginTop: "150px" }}
                        >
                            <a className="dropdown-item d-flex align-items-center gap-2" href="/admin/profile">
                                <FaUser /> Profile
                            </a>
                            <a className="dropdown-item d-flex align-items-center gap-2" href="/">
                                <FaSignInAlt /> Login
                            </a>
                            <a className="dropdown-item d-flex align-items-center gap-2" href="/logout">
                                <FaSignOutAlt /> Logout
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
                {/* Sidebar Image */}
                {/* <div className="sidebar-logo text-center">
                    <img
                        src={LOGO}
                        alt="Logo"
                        className="img-fluid"
                        style={{ maxWidth: '100px', height: 'auto' }}
                    />
                </div> */}

                {/* Dashboard */}
                <a href="Dashboard" className="active">
                    <FaTachometerAlt className="icon me-2 fs-5" /> <span>Dashboard</span>
                </a>

                {/* Department Dropdown */}
                <div className="sidebar-dropdown">
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('department'); }} className="d-flex justify-content-between align-items-center">
                        <div><FaBuilding className="icon me-2 fs-5" /> <span>Department</span></div>
                        <FaChevronDown className={`dropdown-arrow ${dropdowns.department ? 'rotate' : ''}`} />
                    </a>
                    {dropdowns.department && (
                        <div className="submenu ps-4">
                            <a href="/admin/add-department" className="d-block py-1">
                                <FaPlus className="me-2" /> Add Department
                            </a>
                            <a href="/admin/manage-department" className="d-block py-1">
                                <FaList className="me-2" /> Manage Department
                            </a>
                        </div>
                    )}
                </div>

                {/* Leave Type Dropdown */}
                <div className="sidebar-dropdown">
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('leaveType'); }} className="d-flex justify-content-between align-items-center">
                        <div><FaCalendarAlt className="icon me-2 fs-5" /> <span>Leave Type</span></div>
                        <FaChevronDown className={`dropdown-arrow ${dropdowns.leaveType ? 'rotate' : ''}`} />
                    </a>
                    {dropdowns.leaveType && (
                        <div className="submenu ps-4">
                            <a href="/admin/add-leave-type" className="d-block py-1">
                                <FaPlus className="me-2" /> Add Leave Type
                            </a>
                            <a href="/admin/manage-leave-type" className="d-block py-1">
                                <FaList className="me-2" /> Manage Leave Type
                            </a>
                        </div>
                    )}
                </div>

                {/* Leave Management Dropdown */}
                <div className="sidebar-dropdown">
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('leaveManagement'); }} className="d-flex justify-content-between align-items-center">
                        <div><FaClipboardList className="icon me-2 fs-5" /> <span>Leave Management</span></div>
                        <FaChevronDown className={`dropdown-arrow ${dropdowns.leaveManagement ? 'rotate' : ''}`} />
                    </a>
                    {dropdowns.leaveManagement && (
                        <div className="submenu ps-4">
                            <a href="/admin/show-all-leave" className="d-block py-1">
                                <FaListAlt className="me-2" /> Show All Leaves
                            </a>
                            <a href="/admin/leaves-history" className="d-block py-1">
                                <FaTools className="me-2" /> Leave History
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className={`admin-content ${collapsed ? 'collapsed' : ''}`}>
                <Outlet />
            </div>
        </>
    );
};

export default AdminLayout;