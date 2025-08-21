<?php

namespace App\Models;

use CodeIgniter\Model;

class LeaveTypeModel extends Model
{
    protected $table      = 'leave_types';
    protected $primaryKey = 'id';
    protected $allowedFields = ['name','leaveType', 'addedBy', 'description', 'created_at', 'updated_at'];
    protected $useTimestamps = false; // We’re setting manually
}
