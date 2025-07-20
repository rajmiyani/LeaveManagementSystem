import React from 'react';
import { FaChartBar } from 'react-icons/fa';

const Dashboard = () => {
    const leaveStats = {
        total: 128,
        pending: 32,
        approved: 85,
        rejected: 11,
    };

    const recentRequests = [
        {
            name: "John Doe",
            type: "Sick Leave",
            from: "2024-07-01",
            to: "2024-07-03",
            status: "Pending",
        },
        {
            name: "Jane Smith",
            type: "Vacation",
            from: "2024-03-10",
            to: "2024-09-15",
            status: "Approved",
        },
        {
            name: "Michael Johnson",
            type: "Sick Leave",
            from: "2024-06-05",
            to: "2024-06-05",
            status: "Rejected",
        },
        {
            name: "Emfy Davis",
            type: "Personal Leave",
            from: "2024-09-12",
            to: "2024-09-12",
            status: "Approved",
        },
        {
            name: "Dame Brown",
            type: "Vacation",
            from: "2024-07-20",
            to: "2024-07-25",
            status: "Pending",
        }
    ];

    const getStatusBadge = (status) => {
        const statusMap = {
            Pending: 'primary',
            Approved: 'success',
            Rejected: 'danger'
        };
        return <span className={`badge bg-${statusMap[status]}`}>{status}</span>;
    };

    return (
        <div className="container-fluid py-4">
            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card text-white bg-info shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="card-title">Total Requests</h6>
                            <h3 className="fw-bold">{leaveStats.total}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card text-white bg-primary shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="card-title">Pending</h6>
                            <h3 className="fw-bold">{leaveStats.pending}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card text-white bg-success shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="card-title">Approved</h6>
                            <h3 className="fw-bold">{leaveStats.approved}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card text-white bg-danger shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="card-title">Rejected</h6>
                            <h3 className="fw-bold">{leaveStats.rejected}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Placeholder */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title mb-3 text-decoration-underline" style={{ textAlign: "left", display: "block" }}>Leave Statistics</h5>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
                        <FaChartBar size={60} className="text-secondary" />
                        <span className="ms-3 text-muted">[Chart Placeholder]</span>
                    </div>
                </div>
            </div>

            {/* Recent Requests */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <h5 className="card-title mb-3 text-decoration-underline" style={{ textAlign: "left", display: "block" }}>Recent Requests</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped align-middle">
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>ID</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Employee</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Type</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>From</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>To</th>
                                    <th style={{ backgroundColor: "#5e148b", color: "white" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentRequests.map((req, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{req.name}</td>
                                        <td>{req.type}</td>
                                        <td>{req.from}</td>
                                        <td>{req.to}</td>
                                        <td>{getStatusBadge(req.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
