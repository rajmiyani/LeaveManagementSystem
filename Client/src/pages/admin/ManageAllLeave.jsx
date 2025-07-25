import React from 'react';
import { useNavigate } from 'react-router-dom';

const dummyLeaves = [
    {
        id: 1,
        firstName: 'Raj',
        lastName: 'Miyani',
        department: 'Digital Marketing',
        leaveType: 'Sick Leave',
        startDate: '2025-07-20',
        endDate: '2025-07-22',
        totalDays: 3,
        status: 'Pending',
        appliedBy: 'Admin',
        description: 'Fever and doctor consultation',
    },
    {
        id: 2,
        firstName: 'Nisha',
        lastName: 'Shah',
        department: 'HR',
        leaveType: 'Casual Leave',
        startDate: '2025-07-25',
        endDate: '2025-07-27',
        totalDays: 3,
        status: 'Approved',
        appliedBy: 'Self',
        description: 'Personal work',
    },
    {
        id: 2,
        firstName: 'Nisha',
        lastName: 'Shah',
        department: 'HR',
        leaveType: 'Casual Leave',
        startDate: '2025-07-25',
        endDate: '2025-07-27',
        totalDays: 3,
        status: 'Approved',
        appliedBy: 'Self',
        description: 'Personal work',
    },
    {
        id: 2,
        firstName: 'Nisha',
        lastName: 'Shah',
        department: 'HR',
        leaveType: 'Casual Leave',
        startDate: '2025-07-25',
        endDate: '2025-07-27',
        totalDays: 3,
        status: 'Approved',
        appliedBy: 'Self',
        description: 'Personal work',
    },
];

const ManageAllLeave = () => {
    const navigate = useNavigate();

    const handleViewLeave = (leave) => {
        navigate(`/admin/show-all-leave/${leave.id}`, { state: { leave } });
    };

    const getStatusClass = (status) => {
        if (status === 'Approved') return 'bg-success';
        if (status === 'Rejected') return 'bg-danger';
        return 'bg-warning text-dark';
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0" style={{ color: "#5e148b", fontWeight: "600" }}>Show All Leaves</h4>
            </div>

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0 mb-0">
                    <li className="breadcrumb-item">
                        <i className="fas fa-home"></i>
                        <a href="/admin/dashboard" style={{ color: "#5e148b", textDecoration: "none" }} className="ms-2">Home</a>
                    </li>
                    <li className="breadcrumb-item active text-muted" aria-current="page">All Leaves</li>
                </ol>
            </nav>

            <div className="d-flex flex-column gap-3 mt-5">
                {dummyLeaves.map((leave) => (
                    <div
                        key={leave.id}
                        className="p-4 rounded shadow-sm d-flex justify-content-between align-items-center"
                        style={{
                            background: '#fff',
                            borderLeft: `5px solid rgb(94, 20, 139)`,
                        }}
                    >
                        {/* Left Details */}
                        <div className="d-flex flex-column">
                            <h5 className="mb-1 text-dark fw-semibold">
                                {leave.firstName} {leave.lastName}
                            </h5>
                            <small className="text-muted mb-1">
                                <strong>Department:</strong> {leave.department}
                            </small>
                            <small className="text-muted mb-1">
                                <strong>Leave:</strong> {leave.startDate} to {leave.endDate}
                            </small>
                            <span
                                className={`badge ${getStatusClass(leave.status)} px-3 py-1 w-fit`}
                            >
                                {leave.status}
                            </span>
                        </div>

                        {/* Right Button */}
                        <div>
                            <button
                                className="btn text-white"
                                style={{ backgroundColor: 'rgb(94, 20, 139)' }}
                                onClick={() => handleViewLeave(leave)}
                            >
                                Take Action
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageAllLeave;
