<?php

namespace App\Controllers\Manager;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

use App\Models\LeaveTypeModel;
use App\Models\LeaveModel;
use CodeIgniter\RESTful\ResourceController;

class LeaveController extends ResourceController
{
    protected $format = 'json';

    /**
     * Apply for a Leave
     */
    public function applyLeaves()
    {
        $rules = [
            'name'        => 'required|min_length[3]',
            'mobile'      => 'required|min_length[10]|max_length[15]',
            'leaveType'   => 'required',
            'reasonType'  => 'required',
            'fromDate'    => 'required|valid_date',
            'toDate'      => 'required|valid_date',
            'description' => 'required|min_length[3]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $leaveModel = new LeaveModel();

        $name     = $this->request->getVar('name');
        $mobile   = $this->request->getVar('mobile');
        $fromDate = $this->request->getVar('fromDate');
        $toDate   = $this->request->getVar('toDate');

        // Check overlapping leaves for same person & mobile
        $existingLeave = $leaveModel
            ->where('name', $name)
            ->where('mobile', $mobile)
            ->groupStart()
                ->where('from_date <=', $toDate)
                ->where('to_date >=', $fromDate)
            ->groupEnd()
            ->first();

        if ($existingLeave) {
            return $this->respond([
                'status'  => 409,
                'message' => 'You have already applied for leave during this date range.',
            ], 409);
        }

        $data = [
            'name'        => $name,
            'mobile'      => $mobile,
            'leave_type'  => $this->request->getVar('leaveType'),
            'reason_type' => $this->request->getVar('reasonType'),
            'from_date'   => $fromDate,
            'to_date'     => $toDate,
            'description' => $this->request->getVar('description'),
        ];

        $leaveModel->insert($data);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Leave request submitted successfully!',
            'data'    => $data,
        ]);
    }

    /**
     * Get all leave applications
     */
    public function getLeaves()
    {
        $leaveModel = new LeaveModel();
        $leaves = $leaveModel->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $leaves,
        ]);
    }

    /**
     * Get logged-in user's leaves
     */
    public function getMyLeaves()
{
    $leaveModel = new LeaveModel();
    $request = service('request');

    // Extract token
    $authHeader = $request->getHeaderLine('Authorization');
    if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        return $this->respond([
            'status' => 401,
            'message' => 'Unauthorized: No token provided'
        ], 401);
    }

    $token = $matches[1];

    try {
        $decoded = decodeJWT($token);
        $userData = (array) $decoded->data;

        $userName = $userData['name'] ?? null; // Use name as identifier
        $userRole = $userData['role'] ?? null;

        if (!$userName || !$userRole) {
            return $this->respond([
                'status' => 401,
                'message' => 'Unauthorized: Missing name or role in token'
            ], 401);
        }

    } catch (\Exception $e) {
        return $this->respond([
            'status' => 401,
            'message' => 'Unauthorized: Invalid token',
            'error'   => $e->getMessage()
        ], 401);
    }

    // Fetch leaves using name only
    $leaves = $leaveModel
        ->where('name', $userName) // <-- query by name
        ->orderBy('from_date', 'DESC')
        ->findAll();

    return $this->respond([
        'status' => 200,
        'data'   => $leaves
    ]);
}



}
