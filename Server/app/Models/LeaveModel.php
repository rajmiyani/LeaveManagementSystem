<?php

namespace App\Models;

use CodeIgniter\Model;

class LeaveModel extends Model
{
    protected $table = 'leaves';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'name',
        'mobile',
        'leave_type',
        'reason_type',
        'from_date',
        'to_date',
        'description',
        'status'
    ];
}
