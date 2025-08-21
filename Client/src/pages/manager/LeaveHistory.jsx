import React, { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  const [analytics, setAnalytics] = useState({
    totalLeaves: 0,
    totalSick: 0,
    totalEarned: 0,
  });

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const userTokens = localStorage.getItem("userTokens");
        if (!userTokens) return;

        const tokensArray = JSON.parse(userTokens);
        const managerTokenObj = tokensArray.find(t => t.role === "manager");
        const token = managerTokenObj?.token;
        if (!token) return;

        const res = await axios.get("http://localhost:8080/manager/leaveHistory", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLeaves(res.data.data || []);
        setFilteredLeaves(res.data.data || []);
      } catch (err) {
        console.error("Error fetching leaves:", err);
      }
    };

    fetchLeaves();
  }, []);

  // Update filtered leaves based on filters
  useEffect(() => {
    let temp = [...leaves];

    if (yearFilter) temp = temp.filter(leave => leave.from_date.startsWith(yearFilter));
    if (monthFilter) temp = temp.filter(leave => leave.from_date.slice(5,7) === monthFilter);
    if (employeeFilter) temp = temp.filter(leave => leave.name.toLowerCase().includes(employeeFilter.toLowerCase()));

    setFilteredLeaves(temp);

    // Update analytics
    const totalLeaves = temp.length;
    const totalSick = temp.filter(l => l.leave_type === "Sick Leave").length;
    const totalEarned = temp.filter(l => l.leave_type === "Earned Leave").length;

    setAnalytics({ totalLeaves, totalSick, totalEarned });
  }, [yearFilter, monthFilter, employeeFilter, leaves]);

  return (
    <div style={{ marginTop: "-250px" }}>
      <h4 className="mb-3" style={{ color: "#5e148b", fontWeight: "600" }}>
        Leave History
      </h4>

      {/* Filters */}
      <div className="d-flex gap-3 mb-3 flex-wrap">
        <input
          type="text"
          placeholder="Year (YYYY)"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="form-control"
          style={{ maxWidth: "150px" }}
        />
        <input
          type="text"
          placeholder="Month (MM)"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="form-control"
          style={{ maxWidth: "150px" }}
        />
        <input
          type="text"
          placeholder="Employee Name"
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
          className="form-control"
          style={{ maxWidth: "200px" }}
        />
        <CSVLink
          data={filteredLeaves}
          filename={"leave_history.csv"}
          className="btn btn-primary"
          style={{ backgroundColor: "#5e148b", border: "none" }}
        >
          Export CSV
        </CSVLink>
      </div>

      {/* Analytics */}
      <div className="d-flex gap-3 mb-4 flex-wrap">
        <div className="card text-center p-3 flex-fill" style={{ backgroundColor: "#f5f5f5" }}>
          <h6>Total Leaves</h6>
          <h4 style={{ color: "#5e148b" }}>{analytics.totalLeaves}</h4>
        </div>
        <div className="card text-center p-3 flex-fill" style={{ backgroundColor: "#f5f5f5" }}>
          <h6>Total Sick Leave</h6>
          <h4 style={{ color: "#5e148b" }}>{analytics.totalSick}</h4>
        </div>
        <div className="card text-center p-3 flex-fill" style={{ backgroundColor: "#f5f5f5" }}>
          <h6>Total Earned Leave</h6>
          <h4 style={{ color: "#5e148b" }}>{analytics.totalEarned}</h4>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center">
          <thead className="table-dark">
            <tr>
              <th style={{ backgroundColor: "#5e148b" }}>#</th>
              <th style={{ backgroundColor: "#5e148b" }}>Employee</th>
              <th style={{ backgroundColor: "#5e148b" }}>Leave Type</th>
              <th style={{ backgroundColor: "#5e148b" }}>From</th>
              <th style={{ backgroundColor: "#5e148b" }}>To</th>
              <th style={{ backgroundColor: "#5e148b" }}>Reason</th>
              <th style={{ backgroundColor: "#5e148b" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No leave records found.
                </td>
              </tr>
            ) : (
              filteredLeaves.map((leave, index) => (
                <tr key={leave.id}>
                  <td>{index + 1}</td>
                  <td>{leave.name}</td>
                  <td>{leave.leave_type}</td>
                  <td>{leave.from_date}</td>
                  <td>{leave.to_date}</td>
                  <td>{leave.description}</td>
                  <td>
                    <span
                      className={`badge ${
                        leave.status === "Approved"
                          ? "bg-success"
                          : leave.status === "Rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {leave.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveHistory;
