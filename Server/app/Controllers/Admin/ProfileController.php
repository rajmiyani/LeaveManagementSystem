<?php
namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\ProfileModel;
use App\Models\EmployeeModel;
use App\Models\manage_employeesModel;
use App\Models\ManageEmployeeModel;
use CodeIgniter\HTTP\ResponseInterface;

class ProfileController extends BaseController
{
   public function profile()
{
    $token = $this->getTokenFromHeader();
    if (!$token) return $this->unauthorized('Missing or invalid Authorization header');

    try {
        $decoded = decodeJWT($token);
        $adminEmail = $decoded->data->email ?? null; // ✅ Use email from token
    } catch (\Exception $e) {
        return $this->unauthorized('Invalid or expired token');
    }

    if (!$adminEmail) {
        return $this->notFound('Admin email not found in token');
    }

    $profileModel = new ProfileModel();

    // ✅ Find profile by email
    $admin = $profileModel->where('email', $adminEmail)->first();

    if (!$admin) {
        return $this->notFound('Profile not found');
    }

    return $this->response->setJSON([
        'status' => 'success',
        'data' => [
            'first_name'   => $admin['first_name'] ?? '',
            'last_name'    => $admin['last_name'] ?? '',
            'email'        => $admin['email'] ?? '',
            'phone'        => $admin['phone'] ?? '',
            'address1'     => $admin['address1'] ?? '',
            'address2'     => $admin['address2'] ?? '',
            'country'      => $admin['country'] ?? '',
            'state'        => $admin['state'] ?? '',
            'pin_code'     => $admin['pin_code'] ?? '',
            'city'         => $admin['city'] ?? '',
            'profile_image'=> !empty($admin['profile_image']) ? base_url('uploads/' . $admin['profile_image']) : null,
        ]
    ]);
}   



    public function updateProfile()
{
    $profileModel = new \App\Models\ProfileModel();
    $userEmail = $this->request->getVar('email');

    // Handle image upload
    $profileImageFile = $this->request->getFile('profile_image');
    $imageName = null;

    if ($profileImageFile && $profileImageFile->isValid() && !$profileImageFile->hasMoved()) {
        $imageName = $profileImageFile->getRandomName(); 
        $profileImageFile->move(FCPATH . 'uploads/', $imageName); // save to public/uploads
    }

    $data = [
        'first_name'   => $this->request->getVar('first_name'),
        'last_name'    => $this->request->getVar('last_name'),
        'phone'        => $this->request->getVar('phone'),
        'address1'     => $this->request->getVar('address1'),
        'address2'     => $this->request->getVar('address2'),
        'country'      => $this->request->getVar('country'),
        'state'        => $this->request->getVar('state'),
        'pin_code'     => $this->request->getVar('pin_code'),
        'city'         => $this->request->getVar('city'),
    ];

    // Only update profile_image if new one uploaded
    if ($imageName) {
        $data['profile_image'] = $imageName;
    }

    // Check profile exists
    $profile = $profileModel->where('email', $userEmail)->first();

    if ($profile) {
        $profileModel->where('email', $userEmail)->set($data)->update();

        $updatedProfile = $profileModel->where('email', $userEmail)->first();

        // ✅ return absolute image URL
        if (!empty($updatedProfile['profile_image'])) {
            $updatedProfile['profile_image'] = base_url('uploads/' . $updatedProfile['profile_image']);
        }

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Profile updated successfully',
            'data'    => $updatedProfile
        ]);
    } else {
        return $this->response->setJSON([
            'status'  => 'error',
            'message' => 'Profile not found'
        ])->setStatusCode(404);
    }
}





    private function getTokenFromHeader()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader) return null;
        if (preg_match('/Bearer\s+(.+)/', $authHeader, $matches)) {
            return trim($matches[1]);
        }
        return null;
    }


    private function unauthorized($msg)
    {
        return $this->response->setJSON(['status' => 'error', 'message' => $msg])
            ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
    }

    private function notFound($msg)
    {
        return $this->response->setJSON(['status' => 'error', 'message' => $msg])
            ->setStatusCode(ResponseInterface::HTTP_NOT_FOUND);
    }
}
