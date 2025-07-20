import React, { useState, useEffect, useRef } from 'react';
import Profile from '../assets/react.svg';
import LOGO from '../assets/LOGO.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTachometerAlt, FaClipboardList, FaCalendarPlus, FaListUl, FaHistory, FaUser, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { Outlet } from 'react-router-dom';

const managerLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const [dropdowns, setDropdowns] = useState({
        department: false,
        leaveType: false,
        manager: false,
        leaveManagement: false
    });

    const toggleDropdown = (key) => {
        setDropdowns({ ...dropdowns, [key]: !dropdowns[key] });
    };

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

    return (
        <>
            <style>{`
        #root {
            margin:0;
            width:100%;
        }
        .manager-header {
            height: 60px;
            border: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background-color: #ffffff; /* Optional: to keep content readable */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .manager-sidebar {
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

        .manager-sidebar.collapsed {
          width: 70px;
        }

        .manager-sidebar a {
          padding: 12px 20px;
          display: flex;
          align-items: center;
          color: black;
          text-decoration: none;
        }

        .manager-sidebar a:hover {
          background-color: #5e148b;
          color: #fff;
        }

        .manager-sidebar.collapsed span {
          display: none;
        }

        .manager-content {
          margin-top: 60px;
          margin-left: 250px;
          transition: margin-left 0.3s ease;
          padding-left: 20px;
          width: 100%
        }

        .manager-content.collapsed {
          margin-left: 70px;
        }

        .icon:hover {
            color: #5e148b;
        }
        .icon:hover {
            color:white;
        }

        @media (max-width: 768px) {
          .manager-sidebar {
            left: -250px;
          }

          .manager-sidebar.show {
            left: 0;
          }

          .manager-content {
            margin-left: 0;
          }
        }
      `}</style>

            {/* Header */}
            <div className="manager-header">
                <button
                    className="btn btn-sm"
                    onClick={toggleSidebar}
                    style={{
                        color: '#5e148b',
                        border: '1px solid #5e148b',
                        backgroundColor: 'transparent',
                    }}
                >
                    <i className="fas fa-bars"></i>
                </button>

                <div className="d-flex align-items-center gap-3 position-relative" ref={dropdownRef}>
                    <span className="fw-semibold">manager Dashboard</span>

                    {/* Profile Image */}
                    <img
                        src={Profile}
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
                            <a className="dropdown-item d-flex align-items-center gap-2" href="/manager/profile">
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
            <div className={`manager-sidebar ${collapsed ? 'collapsed' : ''}`}>
                {/* Sidebar Image */}
                {/* <div className="sidebar-logo text-center">
                    <img
                        src={LOGO}
                        alt="Logo"
                        className="img-fluid"
                        style={{ maxWidth: '120px', height: 'auto' }}
                    />
                </div> */}

                {/* Dashboard */}
                <a href="/manager/dashboard" className="active">
                    <FaTachometerAlt className="icon me-2 fs-5" /> <span>Dashboard</span>
                </a>

                <a href="/manager/apply-leave" className="active">
                    <FaCalendarPlus className="icon me-2 fs-5" /> <span>Apply Leave</span>
                </a>

                <a href="/manager/leave-list" className="active">
                    <FaClipboardList className="icon me-2 fs-5" /> <span>Leave List</span>
                </a>

                <a href="/manager/show-all-leave" className="active">
                    <FaListUl className="icon me-2 fs-5" /> <span>Show All Leave</span>
                </a>

                <a href="/manager/leaves-history" className="active">
                    <FaHistory className="icon me-2 fs-5" /> <span>Leave History</span>
                </a>
            </div>

            <div className={`manager-content ${collapsed ? 'collapsed' : ''}`}>
                <Outlet />
            </div>
        </>
    );
};

export default managerLayout;