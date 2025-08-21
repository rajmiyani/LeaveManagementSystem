<?php namespace App\Models;

use CodeIgniter\Model;

class OtpModel extends Model
{
    protected $table = 'otps';
    protected $allowedFields = ['email', 'mobile_no', 'role', 'otp', 'purpose', 'is_used', 'created_at'];
    protected $useTimestamps = false;
}
