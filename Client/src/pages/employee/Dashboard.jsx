import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const leaveData = [
    { type: 'Sick Leave', from: '2025-07-01', to: '2025-07-03', status: 'Pending' },
    { type: 'Casual Leave', from: '2025-06-20', to: '2025-06-21', status: 'Approved' },
    { type: 'Paid Leave', from: '2025-05-10', to: '2025-05-14', status: 'Approved' },
    { type: 'Other Leave', from: '2025-04-05', to: '2025-04-05', status: 'Rejected' },
    { type: 'Sick Leave', from: '2025-03-10', to: '2025-03-12', status: 'Approved' },
    { type: 'Paid Leave', from: '2025-02-05', to: '2025-02-08', status: 'Rejected' },
];

const statusBadge = (status) => {
    switch (status) {
        case 'Approved': return <span className="badge rounded-pill bg-success">{status}</span>;
        case 'Pending': return <span className="badge rounded-pill bg-warning text-dark">{status}</span>;
        case 'Rejected': return <span className="badge rounded-pill bg-danger">{status}</span>;
        default: return <span className="badge rounded-pill bg-secondary">{status}</span>;
    }
};

const EmployeeDashboard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 2;

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = leaveData.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(leaveData.length / recordsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const navigate = useNavigate();

    const handleApplyLeaveClick = () => {
        navigate('/employee/apply-leave'); // Navigate to this route
    };

    return (
        <div className="container py-4">
            {/* Stats */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="dashboard-box text-center shadow-sm p-3 rounded">
                        <div className="text-muted small">Total Leave Balance</div>
                        <h4 className="fw-semibold mb-0">12</h4>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="dashboard-box text-center shadow-sm p-3 rounded">
                        <div className="text-muted small">Leave Taken</div>
                        <h4 className="fw-semibold mb-0">5</h4>
                    </div>
                </div>
            </div>

            {/* Leave Types */}
            <div className="row g-3 mb-4 text-center">
                {[
                    { name: 'Sick Leave', icon: 'umbrella-fill', color: 'success' },
                    { name: 'Casual Leave', icon: 'briefcase-fill', color: 'info' },
                    { name: 'Paid Leave', icon: 'cash-coin', color: 'primary' },
                    { name: 'Other Leave', icon: 'plus-circle', color: 'warning' },
                ].map((leave, index) => (
                    <div className="col-6 col-md-3" key={index}>
                        <div className={`leave-type-card bg-${leave.color} text-white p-3 rounded shadow-sm`}>
                            <i className={`bi bi-${leave.icon} fs-3`}></i>
                            <div className="mt-2 fw-semibold">{leave.name}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Leave Records with Pagination */}
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">My Leave Records</h5>
                    <button
                        className="btn btn-sm text-white"
                        style={{ backgroundColor: "#5e148b" }}
                        onClick={handleApplyLeaveClick}
                    >
                        Apply Leave
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Leave Type</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.type}</td>
                                    <td>{item.from}</td>
                                    <td>{item.to}</td>
                                    <td>{statusBadge(item.status)}</td>
                                    <td>
                                        <button className="btn btn-outline-secondary btn-sm">Open</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Icons */}
                <div className="d-flex justify-content-end p-3">
                    <i
                        className={`bi bi-chevron-left fs-5 mx-3 ${currentPage === 1 ? 'text-muted' : 'cursor-pointer text-dark'}`}
                        onClick={handlePrev}
                        style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    ></i>
                    <span className="text-muted small">Page {currentPage} of {totalPages}</span>
                    <i
                        className={`bi bi-chevron-right fs-5 mx-3 ${currentPage === totalPages ? 'text-muted' : 'cursor-pointer text-dark'}`}
                        onClick={handleNext}
                        style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                    ></i>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
