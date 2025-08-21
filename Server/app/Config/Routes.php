<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// ✅ Default route
$routes->get('/', 'Home::index');

// ✅ Auth routes (with CORS filter)
$routes->group('auth', ['filter' => 'cors'], function ($routes) {
    $routes->post('register', 'Auth\AuthController::register');
    $routes->post('login', 'Auth\AuthController::login');
    $routes->post('verify-otp', 'Auth\AuthController::verifyEmployeeOtp');
    $routes->post('resend-otp', 'Auth\AuthController::resendOtp');
    $routes->post('forgot-password', 'Auth\AuthController::forgotPassword');
    $routes->post('check-email-roles', 'Auth\AuthController::checkEmailRoles');
    $routes->post('reset-password', 'Auth\AuthController::resetPassword');
    $routes->get('test-email', 'Auth\AuthController::testEmail');
    $routes->options('(:any)', 'Auth\AuthController::options'); // for CORS preflight
});

// ✅ Admin Panel (JWT Protected + Role Check)
$routes->group('admin', function ($routes) {
    $routes->get('dashboard', 'AdminController::dashboard');

    $routes->post('add-department', 'Admin\DepartmentController::addDepartment'); // create
    $routes->get('department', 'Admin\DepartmentController::index');              // List all
    $routes->get('department/(:num)', 'Admin\DepartmentController::show/$1');     // Get single
    $routes->post('department/(:num)', 'Admin\DepartmentController::update/$1');   // Update
    $routes->delete('department/(:num)', 'Admin\DepartmentController::delete/$1');// Delete
    $routes->get('all-employees', 'AdminController::getAllEmployees');

    $routes->get('leavetype', 'Admin\LeaveTypeController::index');              // GET all leave types
    $routes->post('leavetype', 'Admin\LeaveTypeController::addLeaveType');      // POST create leave type
    $routes->options('(:any)', 'PreflightController::index');

    $routes->get('profile', 'Admin\ProfileController::profile');
    $routes->post('profile/update', 'Admin\ProfileController::updateProfile');
});


// ✅ Manager Panel (JWT Protected + Role Check)

// $routes->group('manager', ['filter' => 'jwt'], function ($routes) {
$routes->group('manager', function ($routes) {
    $routes->get('dashboard', 'manager\ManagerController::dashboard');
    $routes->post('approve-leave', 'manager\ManagerController::approveLeave');
    $routes->get('team-leaves', 'manager\ManagerController::teamLeaves');

    $routes->get('profile', 'manager\ProfileController::profile');
    $routes->post('profile/update', 'manager\ProfileController::updateProfile');

    $routes->post('applyLeaves', 'manager\LeaveController::applyLeaves');
    $routes->get('getLeaves', 'manager\LeaveController::index');
    $routes->get('myLeaves', 'manager\LeaveController::getMyLeaves');

});

// ✅ Employee Panel (JWT Protected)
$routes->group('employee', ['filter' => 'jwt'], function ($routes) {
    $routes->get('dashboard', 'EmployeeController::dashboard');
    $routes->post('apply-leave', 'EmployeeController::applyLeave');
    $routes->get('my-leaves', 'EmployeeController::myLeaves');
});

// ✅ Test route
$routes->get('test', function () {
    return "API is working!";
});