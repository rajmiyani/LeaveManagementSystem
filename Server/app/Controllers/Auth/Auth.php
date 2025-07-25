<?php namespace App\Controllers;

use App\Models\AdminModel;
use App\Models\ManagerModel;
use App\Models\EmployeeModel;
use CodeIgniter\RESTful\ResourceController;

class AuthApi extends ResourceController
{
    public function registerAdmin()
    {
        $data = $this->request->getJSON();
        $rules = [
            'name' => 'required',
            'email' => 'required|valid_email|is_unique[admins.email]',
            'password' => 'required|min_length[6]',
        ];
        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }
        $model = new AdminModel();

        $model->save([
            'name' => $data->name,
            'email' => $data->email,
            'password' => password_hash($data->password, PASSWORD_DEFAULT)
        ]);
        return $this->respondCreated(['status' => true, 'message' => 'Registered successfully!']);
    }

    // Login endpoint for all roles (admin, manager, employee)
    public function login()
    {
        $data = $this->request->getJSON();
        $role = $data->role ?? '';
        $email = $data->email ?? '';
        $password = $data->password ?? '';

        if ($role == 'admin') {
            $model = new AdminModel();
        } elseif ($role == 'manager') {
            $model = new ManagerModel();
        } elseif ($role == 'employee') {
            $model = new EmployeeModel();
        } else {
            return $this->fail(['message' => 'Invalid role selected.']);
        }

        $user = $model->where('email', $email)->first();
        if ($user && password_verify($password, $user['password'])) {
            if ($role === 'employee') {
                $otp = (string)random_int(100000, 999999);
                $otp_expiry = date('Y-m-d H:i:s', strtotime('+10 minutes'));
                $model->update($user['id'], ['otp' => $otp, 'otp_expiry' => $otp_expiry]);

                // Send Email
                $emailService = \Config\Services::email();
                $emailService->setFrom('rajmiyani15@gmail.com', 'LMS Admin');
                $emailService->setTo($user['email']);
                $emailService->setSubject('Your OTP for Login');
                $emailService->setMessage("Dear {$user['name']},<br>Your OTP is <b>$otp</b>. It expires in 10 minutes. Please do not share to other person.");

                if (!$emailService->send()) {
                    return $this->fail(['message' => 'Failed to send OTP email.']);
                }

                return $this->respond([
                    'status' => true,
                    'step' => 'otp',
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'message' => 'OTP sent to your email.'
                ]);
            } else {
                // For admin / manager, consider JWT token in production
                return $this->respond([
                    'status' => true,
                    'user' => [
                        'id' => $user['id'],
                        'email' => $user['email'],
                        'name' => $user['name'],
                        'role' => $role
                    ],
                    'message' => 'Logged in successfully.'
                ]);
            }
        }
        return $this->failUnauthorized('Invalid email or password.');
    }

    public function verifyEmployeeOtp()
    {
        $data = $this->request->getJSON();
        $id = $data->id;
        $otp = $data->otp;

        $model = new EmployeeModel();
        $employee = $model->find($id);

        if (
            $employee &&
            $employee['otp'] === $otp &&
            strtotime($employee['otp_expiry']) > time()
        ) {
            $model->update($employee['id'], ['otp' => null, 'otp_expiry' => null]);
            // Success - Return user info (or JWT)
            return $this->respond([
                'status' => true,
                'user' => [
                    'id' => $employee['id'],
                    'email' => $employee['email'],
                    'name' => $employee['name'],
                    'role' => 'employee'
                ],
                'message' => 'Logged in successfully.'
            ]);
        } else {
            return $this->failUnauthorized('Invalid or expired OTP.');
        }
    }

    // Forgot password (for admin only, example)
    public function forgotPassword()
    {
        $data = $this->request->getJSON();
        $email = $data->email ?? '';
        $model = new AdminModel();
        $admin = $model->where('email', $email)->first();
        if ($admin) {
            $otp = (string)random_int(100000, 999999);
            $otp_expiry = date('Y-m-d H:i:s', strtotime('+10 minutes'));
            $model->update($admin['id'], ['otp' => $otp, 'otp_expiry' => $otp_expiry]);

            // Send Email
            $emailService = \Config\Services::email();
            $emailService->setFrom('rajmiyani15@gmail.com', 'LMS Admin');
            $emailService->setTo($admin['email']);
            $emailService->setSubject('OTP for Password Reset');
            $emailService->setMessage("Your OTP for password reset is <b>$otp</b>. It expires in 10 minutes.");

            if (!$emailService->send()) {
                return $this->fail('Failed to send OTP email.');
            }

            return $this->respond(['status' => true, 'message' => 'OTP sent to your email.']);
        } else {
            return $this->failNotFound('Email not found.');
        }
    }

    // Reset Password
    public function resetPassword()
    {
        $data = $this->request->getJSON();
        $email = $data->email ?? '';
        $otp = $data->otp ?? '';
        $newPassword = $data->password ?? '';

        $model = new AdminModel();
        $admin = $model->where('email', $email)->first();

        if (
            $admin &&
            $admin['otp'] === $otp &&
            strtotime($admin['otp_expiry']) > time()
        ) {
            $model->update($admin['id'], [
                'password' => password_hash($newPassword, PASSWORD_DEFAULT),
                'otp' => null,
                'otp_expiry' => null,
            ]);
            return $this->respond(['status' => true, 'message' => 'Password updated successfully.']);
        } else {
            return $this->failUnauthorized('Invalid or expired OTP.');
        }
    }
}
