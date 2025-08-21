<?php

namespace App\Controllers\Admin;

use App\Models\LeaveTypeModel;
use App\Models\LeaveModel; // for fetching applied leaves
use CodeIgniter\RESTful\ResourceController;

class LeaveTypeController extends ResourceController
{
    protected $modelName = LeaveTypeModel::class;
    protected $format    = 'json';

    /**
     * GET - List all leave types
     */
    public function index()
    {
        $leaveTypes = $this->model->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $leaveTypes
        ], 200);
    }

    /**
     * POST - Create a new leave type
     * (converted from createLeaveType)
     */
    public function addLeaveType()
    {
        $data = $this->request->getJSON(true);

        // Validation
        if (!$data || !isset($data['leaveType']) || trim($data['leaveType']) === '') {
            return $this->failValidationErrors("Leave type name required");
        }

        $insertData = [
            'leaveType'   => $data['leaveType'],
            'addedBy'     => $data['addedBy'] ?? null,
            'description' => $data['description'] ?? null,
            'created_at'  => date('Y-m-d H:i:s'),
            'updated_at'  => date('Y-m-d H:i:s'),
        ];

        if (!$this->model->insert($insertData)) {
            return $this->failServerError('Failed to create leave type');
        }

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Leave type created successfully!',
            'data'    => $insertData
        ]);
    }

    /**
     * GET - Single leave type by ID
     */
    public function show($id = null)
    {
        $leaveType = $this->model->find($id);
        if (!$leaveType) {
            return $this->failNotFound('Leave type not found');
        }
        return $this->respond($leaveType);
    }

    /**
     * GET - All applied leaves
     * (converted from getLeaves in LeaveController)
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
}
