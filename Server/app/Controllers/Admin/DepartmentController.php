<?php

namespace App\Controllers\Admin;

use App\Models\DepartmentModel;
use CodeIgniter\RESTful\ResourceController;

class DepartmentController extends ResourceController
{
    protected $modelName = DepartmentModel::class;
    protected $format    = 'json';

    // GET - List all departments
    public function index()
    {
        $departments = $this->model->findAll();
        return $this->respond($departments, 200);
    }

    // POST - Create new department
    public function addDepartment()
    {
        $rules = [
            'code'      => 'required|is_unique[departments.code]',
            'name'      => 'required|min_length[2]',
            'email'     => 'required|valid_email',
            'mobileNo'  => 'required|numeric|min_length[10]|max_length[15]',
            'status'    => 'required|in_list[Active,InActive]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'code'        => $this->request->getVar('code'),
            'name'        => $this->request->getVar('name'),
            'email'       => $this->request->getVar('email'),
            'mobileNo'    => $this->request->getVar('mobileNo'),
            'description' => $this->request->getVar('description'),
            'status'      => $this->request->getVar('status'),
            'date'        => date('Y-m-d H:i:s'),
        ];

        if (!$this->model->insert($data)) {
            return $this->failServerError('Failed to create department');
        }

        return $this->respondCreated(['message' => 'Department added successfully']);
    }

        // Get single department by ID (for edit form)
    public function show($id = null)
    {
        $department = $this->model->find($id);
        if (!$department) {
            return $this->failNotFound('Department not found');
        }
        return $this->respond($department);
    }

    // PUT/PATCH - Update department
   public function update($id = null)
    {
        // Collect all fields from request
        $data = [
            'name'       => $this->request->getVar('name'),
            'shortName' => $this->request->getVar('shortName'),
            'code'       => $this->request->getVar('code'),
            'email'           => $this->request->getVar('email'),
            'mobileNo'       => $this->request->getVar('mobileNo'),
            'status'          => $this->request->getVar('status'),
            'created_at'      => $this->request->getVar('created_at'), // Allow updating if needed
            'updated_at'      => date('Y-m-d H:i:s') // Auto-update timestamp
        ];

        // Validate required fields
        if (empty($data['name']) || empty($data['code'])) {
            return $this->respond([
                'status'  => false,
                'message' => 'Department name and code are required'
            ], 400);
        }

        // Attempt update
        if ($this->model->update($id, $data)) {
            return $this->respond([
                'status'  => true,
                'message' => 'Department updated successfully',
                'data'    => $this->model->find($id) // Return updated record
            ], 200);
        }

        return $this->respond([
            'status'  => false,
            'message' => 'Failed to update department'
        ], 500);
    }



    // DELETE - Remove department
    public function delete($id = null)
    {
        if (!$id) {
            return $this->failValidationError('Department ID is required');
        }

        if (!$this->model->find($id)) {
            return $this->failNotFound('Department not found');
        }

        if (!$this->model->delete($id)) {
            return $this->failServerError('Failed to delete department');
        }

        return $this->respondDeleted(['message' => 'Department deleted successfully']);
    }
}
