<?php namespace App\Models;

use CodeIgniter\Model;

class EmployeeModel extends Model
{
    protected $table = 'employees';
    protected $primaryKey = 'id';
    protected $allowedFields = ['name', 'email', 'mobile', 'password', 'otp', 'otp_expiry'];
    protected $returnType = 'array';
}
