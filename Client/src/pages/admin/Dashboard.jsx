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

    const upcomingLeaves = [
        { name: "Daniel Martinz", date: "2024-07-22", img: "https://randomuser.me/api/portraits/men/55.jpg" },
        { name: "Emily Clark", date: "2024-07-25", img: "https://randomuser.me/api/portraits/women/19.jpg" },
        { name: "Daniel Patrick", date: "2024-07-30", img: "https://randomuser.me/api/portraits/men/65.jpg" },
        { name: "Sophia White", date: "2024-08-01", img: "https://randomuser.me/api/portraits/women/65.jpg" },
        { name: "Madison Andrew", date: "2024-08-04", img: "https://randomuser.me/api/portraits/men/35.jpg" },
    ];

    const teamLeads = [
        { name: "Braun Kelton", role: "PHP", img: "https://randomuser.me/api/portraits/men/32.jpg" },
        { name: "Sarah Michelle", role: "iOS", img: "https://randomuser.me/api/portraits/women/44.jpg" },
        { name: "Daniel Patrick", role: "HTML", img: "https://randomuser.me/api/portraits/men/54.jpg" },
        { name: "Emily Lauren", role: "UI/UX", img: "https://randomuser.me/api/portraits/women/62.jpg" },
    ];

    const activities = [
        { name: "John Carter", action: "Added new project HRMS Dashboard", time: "06:20 PM", img: "https://randomuser.me/api/portraits/men/11.jpg" },
        { name: "Sophia White", action: "Commented on uploaded document", time: "04:00 PM", img: "https://randomuser.me/api/portraits/women/16.jpg" },
        { name: "Michael Johnson", action: "Approved task projects", time: "02:30 PM", img: "https://randomuser.me/api/portraits/men/21.jpg" },
        { name: "Emily Clark", action: "Requested module access", time: "12:10 PM", img: "https://randomuser.me/api/portraits/women/20.jpg" },
        { name: "David Anderson", action: "Downloaded app reports", time: "10:40 AM", img: "https://randomuser.me/api/portraits/men/41.jpg" },
        { name: "Olivia Haris", action: "Completed HRMS ticket", time: "09:50 AM", img: "https://randomuser.me/api/portraits/women/30.jpg" },
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
                {["Total Requests", "Pending", "Approved", "Rejected"].map((title, i) => (
                    <div key={i} className="col-12 col-sm-6 col-lg-3">
                        <div className={`card text-white bg-${["info", "primary", "success", "danger"][i]} shadow-sm h-100`}>
                            <div className="card-body">
                                <h6 className="card-title">{title}</h6>
                                <h3 className="fw-bold">{Object.values(leaveStats)[i]}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Placeholder */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title mb-3 text-decoration-underline">Leave Statistics</h5>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
                        <FaChartBar size={60} className="text-secondary" />
                        <span className="ms-3 text-muted">[Chart Placeholder]</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title text-decoration-underline mb-3">Recent Requests</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped align-middle">
                            <thead>
                                <tr>
                                    {["ID", "Employee", "Type", "From", "To", "Status"].map((head, i) => (
                                        <th key={i} style={{ backgroundColor: "#5e148b", color: "white" }}>{head}</th>
                                    ))}
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

            {/* Widgets Row */}
            <div className="row g-4">
                {/* Team Leads */}
                <div className="col-lg-4 col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-header d-flex justify-content-between">
                            <h6 className="card-title mb-0">Team Leads</h6>
                            <button className="btn btn-sm btn-outline-primary">Manage</button>
                        </div>
                        <div className="card-body">
                            {teamLeads.map((lead, index) => (
                                <div key={index} className="d-flex align-items-center mb-3">
                                    <img src={lead.img} className="rounded-circle me-3" width="40" height="40" alt=""/>
                                    <div>
                                        <div className="fw-semibold">{lead.name}</div>
                                        <small className="text-muted">{lead.role}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="col-lg-4 col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-header d-flex justify-content-between">
                            <h6 className="card-title mb-0">Recent Activities</h6>
                            <i className="fas fa-sync text-muted"></i>
                        </div>
                        <div className="card-body">
                            {activities.map((act, i) => (
                                <div key={i} className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center">
                                        <img src={act.img} className="rounded-circle me-3" width="40" height="40" alt=""/>
                                        <div>
                                            <div className="fw-semibold">{act.name}</div>
                                            <small className="text-muted">{act.action}</small>
                                        </div>
                                    </div>
                                    <span className="badge bg-light text-dark">
                                        <i className="fas fa-clock me-1"></i> {act.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upcoming Leaves */}
                <div className="col-lg-4 col-md-12">
                    <div className="card shadow-sm h-100">
                        <div className="card-header d-flex justify-content-between">
                            <h6 className="card-title mb-0">Upcoming Leaves</h6>
                            <button className="btn btn-sm btn-outline-primary">Manage</button>
                        </div>
                        <div className="card-body">
                            <table className="table table-borderless align-middle">
                                <thead>
                                    <tr><th>Employee</th><th>Date</th></tr>
                                </thead>
                                <tbody>
                                    {upcomingLeaves.map((leave, i) => (
                                        <tr key={i}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img src={leave.img} className="rounded-circle me-2" width="35" height="35" alt=""/>
                                                    {leave.name}
                                                </div>
                                            </td>
                                            <td>{leave.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
