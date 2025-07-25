<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// AUTHENTICATION ROUTES
$routes->group('api', function ($routes) {
    // Admin
    $routes->post('register-admin', 'AuthApi::registerAdmin');
    $routes->post('login-admin', 'AuthApi::loginAdmin');

    // Manager
    $routes->post('register-manager', 'AuthApi::registerManager');
    $routes->post('login-manager', 'AuthApi::loginManager');

    // Employee
    $routes->post('register-employee', 'AuthApi::registerEmployee');
    $routes->post('login-employee', 'AuthApi::loginEmployee');
    $routes->post('verify-employee-otp', 'AuthApi::verifyEmployeeOtp');

    // Common
    $routes->post('forgot-password', 'AuthApi::forgotPassword');
    $routes->post('reset-password', 'AuthApi::resetPassword');
});
