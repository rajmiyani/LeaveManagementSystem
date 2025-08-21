<?php namespace App\Models;

use CodeIgniter\Model;

class ManagerModel extends Model
{
    protected $table = 'managers';
    protected $primaryKey = 'id';
    protected $allowedFields = ['name', 'email', 'password', 'role', 'otp', 'otp_expiry'];
    protected $returnType = 'array';
}
