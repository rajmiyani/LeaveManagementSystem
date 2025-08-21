<?php

namespace App\Controllers\Auth;

use App\Models\OtpModel;    
use App\Models\AdminModel;
use App\Models\ManagerModel;
use App\Models\EmployeeModel;

use CodeIgniter\RESTful\ResourceController;

helper('jwt');

class AuthController extends ResourceController
{

        protected $adminModel;
        protected $managerModel;
        protected $employeeModel;

    public function __construct()
    {
        $this->adminModel = new AdminModel();
        $this->managerModel = new ManagerModel();
        $this->employeeModel = new EmployeeModel();
    }

    /**
     * USER REGISTRATION
     * Handles registration for admins, managers, and employees.
     */
    public function register()
    {
        $data = $this->request->getJSON(true);

        // Validate required fields (add more as needed)
        $rules = [
            'name'     => 'required|min_length[3]',
            'email'    => 'required|valid_email',
            'password' => 'required|min_length[8]',
            'role'     => 'required|in_list[admin,manager,employee]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = $this->getModelByRole($data['role']);
        if (!$model) {
            return $this->fail('Invalid role.');
        }

        // Check unique email for this role/table
        if ($model->where('email', $data['email'])->first()) {
            return $this->failValidationErrors(['email' => 'Email already registered.']);
        }

        // Build insert data array
        $saveData = [
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT),
        ];

        if (!empty($data['mobile']) && $data['role'] === 'employee') {
            $saveData['mobile'] = $data['mobile'];
        }
        if (isset($model->allowedFields) && in_array('role', $model->allowedFields)) {
            $saveData['role'] = $data['role'];
        }

        $model->save($saveData);

        return $this->respondCreated([
            'status'  => true,
            'message' => ucfirst($data['role']) . ' registered successfully!',
        ]);
    }


    /**
     * LOGIN
     * Handles login for all roles (password for admin/manager, OTP for employee)
     */
    public function login()
{
    $data = $this->request->getJSON(true);

    $rules = [
        'email'    => 'required|valid_email',
        'password' => 'required|min_length[8]',
        'role'     => 'required|in_list[admin,manager,employee]'
    ];

    if (!$this->validate($rules)) {
        return $this->failValidationErrors($this->validator->getErrors());
    }

    $model = $this->getModelByRole($data['role']);
    $user = $model->where('LOWER(email)', strtolower($data['email']))->first();

    if (!$user || !password_verify($data['password'], $user['password'])) {
        return $this->failUnauthorized('Invalid email or password.');
    }

    // ✅ Employee login → OTP based
    if ($data['role'] === 'employee') {
        $otp = (string)random_int(1000, 9999);
        log_message('info', "OTP for employee {$user['email']} is: {$otp}");

        $expiry = date('Y-m-d H:i:s', strtotime('+10 minutes'));
        $model->update($user['id'], ['otp' => $otp, 'otp_expiry' => $expiry]);

        $emailSent = $this->sendEmail(
            $user['email'],
            'Login OTP',
            "Hi {$user['name']},<br>Your OTP is <b>{$otp}</b>. It expires in 10 minutes.<br><br>Thanks,<br>LMS Team"
        );

        if (!$emailSent) {
            log_message('error', 'Failed to send OTP to ' . $user['email']);
            return $this->fail('Failed to send OTP email.');
        }

        return $this->respond([
            'status'  => true,
            'step'    => 'otp',
            'id'      => $user['id'],
            'email'   => $user['email'],
            'message' => 'OTP sent to your email.'
        ]);
    }

    // ✅ Admin / Manager login → JWT
    $jwtPayload = [
        'id'    => $user['id'],
        'email' => $user['email'],
        'name'  => $user['name'],
        'role'  => $data['role'],   // ✅ Keep role inside payload
    ];

    try {
        // ✅ Fixed: generateJWT now expects just `$jwtPayload`
        $token = generateJWT($jwtPayload);

        return $this->respond([
            'status'  => true,
            'token'   => $token,
            'user'    => $jwtPayload,
            'message' => 'Login successful.'
        ]);
    } catch (\Exception $e) {
        log_message('error', 'JWT generation failed: ' . $e->getMessage());
        return $this->fail('Internal error occurred.', 500);
    }
}
 


    /**
     * OTP VERIFICATION for EMPLOYEE login.
     */
    public function verifyEmployeeOtp()
    {
        $data = $this->request->getJSON(true);

        $email = $data['email'] ?? null;
        $otp = $data['otp'] ?? null;
        $role = $data['role'] ?? 'employee';
        $purpose = $data['purpose'] ?? 'login';

        if (!$email || !$otp) {
            return $this->failValidationErrors('Email and OTP are required.');
        }

        $otpModel = new \App\Models\OtpModel();

        // Find the latest matching OTP record that is not used yet
        $otpRecord = $otpModel
            ->where('email', $email)
            ->where('otp', $otp)
            ->where('role', $role)
            ->where('purpose', $purpose)
            ->where('is_used', 0)
            ->orderBy('created_at', 'DESC')
            ->first();

        // SKIP returning error if $otpRecord not found (as per your request)
        // Instead, proceed as if OTP is valid (or handle differently if desired)

        // Proceed with expiry and usage only if OTP record found
        if ($otpRecord) {
            $createdTimestamp = strtotime($otpRecord['created_at']);
            if ((time() - $createdTimestamp) > 300) { // 5 minutes expiry
                return $this->fail('OTP has expired.');
            }

            // Mark OTP as used
            $otpModel->update($otpRecord['id'], ['is_used' => 1]);
        }

        // Load user model based on role
        $userModel = match ($role) {
            'admin' => new \App\Models\AdminModel(),
            'manager' => new \App\Models\ManagerModel(),
            default => new \App\Models\EmployeeModel(),
        };

        if (!$userModel) {
            return $this->fail('Invalid role');
        }

        // Find user by email
        $user = $userModel->where('email', $email)->first();

        if ($purpose === 'login') {
            // Auto-create employee if not found (optional)
            if (!$user && $role === 'employee') {
                $userModel->insert(['email' => $email]);
                $user = $userModel->where('email', $email)->first();
            }
            if (!$user) {
                return $this->failNotFound('User not found.');
            }

            return $this->respond([
                'status' => true,
                'message' => 'OTP verified. Logged in successfully.',
                'user' => $user,
            ]);
        }

        if ($purpose === 'forgot-password') {
            return $this->respond([
                'status' => true,
                'message' => 'OTP verified. You may now reset your password.',
            ]);
        }

        return $this->fail('Invalid OTP purpose.');
    }

    public function resendOtp()
    {
        $data = $this->request->getJSON(true);
        $model = new EmployeeModel();

        $user = $model->where('email', $data['email'])->first();
        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $otp = strval(rand(1000, 9999));
        $expiry = date('Y-m-d H:i:s', strtotime('+10 minutes'));
        $model->update($user['id'], ['otp' => $otp, 'otp_expiry' => $expiry]);

        // ✅ Load Email Library
        $email = \Config\Services::email();
        $email->setTo($user['email']);
        $email->setFrom(getenv('email.fromEmail'), getenv('email.fromName'));
        $email->setSubject('Your OTP Code');
        $email->setMessage("<p>Your OTP is: <strong>{$otp}</strong></p><p>This will expire in 10 minutes.</p>");

        if ($email->send()) {
            return $this->respond([
                'status' => true,
                'message' => 'OTP sent successfully to your email.',
            ]);
        } else {
            // Log error for debugging
            log_message('error', $email->printDebugger(['headers']));
            return $this->failServerError('Failed to send OTP email.');
        }
    }


    // PHP Controller Logic Example
    public function checkEmailRoles()
    {
        $json = $this->request->getJSON();
        $email = $json->email ?? null;

        if (!$email) {
            return $this->fail("Email is required.");
        }

        $roles = [];

        if ($this->adminModel->where('email', $email)->first()) {
            $roles[] = 'admin';
        }
        if ($this->managerModel->where('email', $email)->first()) {
            $roles[] = 'manager';
        }
        if ($this->employeeModel->where('email', $email)->first()) {
            $roles[] = 'employee';
        }

        return $this->respond([
            'roles' => $roles,
            'count' => count($roles)
        ]);
    }


    /**
     * FORGOT PASSWORD: Send OTP
     */

    public function forgotPassword()
    {
        $json = $this->request->getJSON(true);

        $email = $json['email'] ?? null;
        $inputMobile = $json['mobile_no'] ?? null;

        if (!$email) {
            return $this->fail("Email is required.");
        }

        // Step 1: Check email across all roles
        $models = [
            'admin'   => ['model' => new \App\Models\AdminModel(),    'mobile_field' => null],
            'manager' => ['model' => new \App\Models\ManagerModel(),  'mobile_field' => 'phone'],
            'employee'=> ['model' => new \App\Models\EmployeeModel(), 'mobile_field' => 'mobile'],
        ];

        $matchedUsers = [];
        foreach ($models as $role => $details) {
            $user = $details['model']->where('email', $email)->first();
            if ($user) {
                $matchedUsers[] = [
                    'user' => $user,
                    'role' => $role,
                    'mobile_field' => $details['mobile_field'],
                ];
            }
        }

        if (empty($matchedUsers)) {
            return $this->failNotFound("No user found with this email.");
        }

        // Step 2: If multiple matches, mobile required
        if (count($matchedUsers) > 1) {
            if (!$inputMobile) {
                return $this->respond([
                    "status" => false,
                    "message" => "Multiple roles found with this email. Please enter your registered mobile number.",
                ]);
            }

            $found = null;
            foreach ($matchedUsers as $match) {
                $mobileField = $match['mobile_field'];
                if ($mobileField && isset($match['user'][$mobileField]) && $match['user'][$mobileField] === $inputMobile) {
                    $found = $match;
                    break;
                }
            }

            if (!$found) {
                return $this->failNotFound("Mobile number does not match any role for this email.");
            }

            $user = $found['user'];
            $role = $found['role'];
            $mobileNo = $found['mobile_field'] ? $user[$found['mobile_field']] : null;

        } else {
            // One match, no need to check mobile
            $single = $matchedUsers[0];
            $user = $single['user'];
            $role = $single['role'];
            // $mobileNo = $single['mobile_field'] ? $user[$single['mobile_field']] : null;
        }

        // Step 3: Generate OTP
        $otp = rand(1000, 9999);
        $subject = "Your OTP Code";
        $message = "
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    padding: 20px;
                }
                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                .otp {
                    font-size: 20px;
                    color: #2c3e50;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <h2>Hello " . htmlspecialchars($user['name']) . ",</h2>
                <p>We received a request to reset your password for the Leave Management System account.</p>
                <p>Please use the following One-Time Password (OTP) to proceed:</p>
                <p class='otp'>Your OTP is: <strong>" . $otp . "</strong></p>
                <p>This OTP is valid for the next 10 minutes.</p>
                <br>
                <p>If you did not request this, you can safely ignore this email.</p>
                <br>
                <p>Regards,<br><strong>LMS Support Team</strong></p>
            </div>
        </body>
        </html>
        ";

        // Send email
        $emailSent = $this->sendEmail($email, $subject, $message);

        if (!$emailSent) {
            // Get the logger
            $logger = \Config\Services::logger();

            // Get the last email debug message
            $emailService = \Config\Services::email();
            $debugInfo = $emailService->printDebugger(['headers', 'subject', 'body']);

            // Log it
            $logger->error("Failed to send OTP email to {$email}. Debug Info:\n" . $debugInfo);

            return $this->fail("Failed to send OTP.");
        }


        // Step 5: Save OTP
        $otpModel = new OtpModel();
        $otpModel->insert([
            'email'      => $email,
            // 'mobile_no'  => $mobileNo,
            'role'       => $role,
            'otp'        => $otp,
            'purpose'    => 'forgot-password',
            'is_used'    => 0,
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        return $this->respond([
            "status" => true,
            "message" => "OTP sent to your email.",
            "role"    => $role,
            "email"   => $email
        ]);
    }


    /**
     * RESET PASSWORD using OTP
     */
    public function resetPassword()
    {
        $data = $this->request->getJSON(true);
        $rules = [
            'email'    => 'required|valid_email',
            'otp'      => 'required|exact_length[6]|numeric',
            'password' => 'required|min_length[8]',
            'role'     => 'required|in_list[admin,manager,employee]',
        ];
        if (!$this->validate($rules)) return $this->failValidationErrors($this->validator->getErrors());

        $model = $this->getModelByRole($data['role']);
        $user = $model->where('email', $data['email'])->first();

        if (
            !$user ||
            $user['otp'] !== $data['otp'] ||
            strtotime($user['otp_expiry']) < time()
        ) {
            return $this->failUnauthorized('Invalid or expired OTP.');
        }

        $model->update($user['id'], [
            'password'   => password_hash($data['password'], PASSWORD_DEFAULT),
            'otp'        => null,
            'otp_expiry' => null,
        ]);

        return $this->respond(['status' => true, 'message' => 'Password reset successful.']);
    }

    /**
     * [OPTIONAL] Example endpoint: Change password (JWT protected)
     */
    public function changePassword()
    {
        $data = $this->request->getJSON(true);
        $rules = [
            'old_password' => 'required|min_length[8]',
            'new_password' => 'required|min_length[8]',
            'role'         => 'required|in_list[admin,manager,employee]',
        ];
        if (!$this->validate($rules)) return $this->failValidationErrors($this->validator->getErrors());
        $userId = $this->request->user->id ?? null; // comes from JWT filter
        if (!$userId) return $this->failUnauthorized('No user.');

        $model = $this->getModelByRole($data['role']);
        $user = $model->find($userId);
        if (!$user || !password_verify($data['old_password'], $user['password'])) {
            return $this->failUnauthorized('Old password invalid.');
        }
        $model->update($userId, ['password' => password_hash($data['new_password'], PASSWORD_DEFAULT)]);
        return $this->respond(['status' => true, 'message' => 'Password updated successfully.']);
    }

    /**
     * CORS OPTIONS
     */
    public function options()
    {
        return $this->response->setStatusCode(200); // let CORS filter handle headers!
    }

//    public function testEmail()
// {
//     $email = \Config\Services::email();

//     $email->setTo('raj@gmail.com');
//     $email->setFrom('rajmorsy15@gmail.com', 'Leave Management System');
//     $email->setSubject('Test SMTP');
//     $email->setMessage('This is a test SMTP email from CodeIgniter 4.');

//     if ($email->send()) {
//         echo "Email sent successfully!";
//     } else {
//         echo "Failed to send email.<br>";
//         print_r($email->printDebugger(['headers']));
//     }
// }




    /**
     * Helper: Get model instance by role
     */
    private function getModelByRole(string $role)
    {
        return match ($role) {
            'admin'    => new AdminModel(),
            'manager'  => new ManagerModel(),
            'employee' => new EmployeeModel(),
            default    => null,
        };
    }

    /**
     * Helper: Send email (you should configure in .env for real SMTP)
     */
    private function sendEmail($to, $subject, $message)
    {
        $email = \Config\Services::email();

        $email->setTo($to);
        $email->setFrom('rajmorsy15@gmail.com', 'LMS System');
        $email->setSubject($subject);
        $email->setMessage($message);

        if (!$email->send()) {
            log_message('error', $email->printDebugger(['headers', 'subject', 'body']));
            return false;
        }

        return true;
    }
}
