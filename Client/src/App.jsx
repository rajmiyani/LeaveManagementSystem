import { Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Layout Pages
import AdminLayout from './layouts/AdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import ManagerLayout from './layouts/ManagerLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgetPassword from './pages/auth/ForgetPassword';
import ResetPassword from './pages/auth/ResetPassword';
import EmailSent from './pages/auth/EmailSent';
import OtpVerification from './pages/auth/OTPVerification';

// Admin Pages
import Profile from './pages/admin/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AddDepartment from './pages/admin/AddDepartment';
import ManageDepartment from './pages/admin/ManageDepartment';
import AddLeaveType from './pages/admin/AddLeaves';
import ManageLeaveType from './pages/admin/ManageLeave';
import AddEmployee from './pages/admin/AddEmployee';
import ManageEmployee from './pages/admin/ManageEmployee';
import ManageAllLeave from './pages/admin/ManageAllLeave';
import LeaveDetails from './pages/admin/LeaveDetails';
import LeaveHistory from './pages/admin/LeaveHistory';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerProfile from './pages/manager/Profile';
import LeavesList from './pages/manager/LeaveList';
// import ApplyLeave from './pages/manager/ApplyLeave';
import Applyleave from './pages/manager/Applyleave';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeProfile from './pages/employee/Profile';
import EmployeeLeaveList from './pages/employee/LeaveHistory';
import EmployeeApplyLeave from './pages/employee/ApplyLeave';

// Logout
import LogoutPage from './components/Logout';

// CSS
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/EmailSent" element={<EmailSent />} />
      <Route path="/OTPVerification" element={<OtpVerification />} />
      <Route path="/ResetPassword" element={<ResetPassword />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="add-department" element={<AddDepartment />} />
        <Route path="manage-department" element={<ManageDepartment />} />
        <Route path="add-leave-type" element={<AddLeaveType />} />
        <Route path="manage-leave-type" element={<ManageLeaveType />} />
        <Route path="add-employee" element={<AddEmployee />} />
        <Route path="manage-employee" element={<ManageEmployee />} />
        <Route path="show-all-leave" element={<ManageAllLeave />} />
        <Route path="show-all-leave/:id" element={<LeaveDetails />} />
        <Route path="leaves-history" element={<LeaveHistory />} />
      </Route>

      {/* Manager Protected Routes */}
      <Route path="/manager" element={<ManagerLayout />}>
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="profile" element={<ManagerProfile />} />
        <Route path="show-all-leave" element={<ManageAllLeave />} />
        <Route path="show-all-leave/:id" element={<LeaveDetails />} />
        <Route path="leaves-history" element={<LeaveHistory />} />
        <Route path="apply-leave" element={<Applyleave />} />
        <Route path="leave-list" element={<LeavesList />} />
      </Route>

      {/* Employee Protected Routes */}
      <Route path="/employee" element={<EmployeeLayout />}>
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="show-all-leave" element={<ManageAllLeave />} />
        <Route path="show-all-leave/:id" element={<LeaveDetails />} />
        <Route path="leaves-history" element={<LeaveHistory />} />
        <Route path="apply-leave" element={<EmployeeApplyLeave />} />
        <Route path="leave-list" element={<EmployeeLeaveList />} />
      </Route>

      <Route path="/logout" element={<LogoutPage />} />
    </Routes>
  );
}

export default App;
