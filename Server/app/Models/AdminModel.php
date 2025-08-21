<?php namespace App\Models;

use CodeIgniter\Model;

class AdminModel extends Model
{
    protected $table = 'admins';
    protected $primaryKey = 'id';
    protected $allowedFields = ['name', 'email', 'password', 'otp', 'otp_expiry', 'role'];
    protected $returnType = 'array';
}
