<?php

namespace App\Models;
use CodeIgniter\Model;

class ProfileModel extends Model
{
    protected $table = 'profile';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'first_name', 'last_name', 'email', 'phone', 'address1', 'address2',
        'country', 'state', 'pin_code', 'city', 'profile_image'
    ];
}
