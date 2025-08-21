<?php

namespace App\Models;
use CodeIgniter\Model;

class manage_employeesModel extends Model
{
    protected $table = 'manage_employees';
    protected $primaryKey = 'id';
    
    protected $allowedFields = [
        'name', 'email', 'mobile',
        'gender', 'department', 'city', 'dob', 'country',
        'address'
    ];
    
    protected $returnType = 'array';
}
