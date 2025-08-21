<?php
namespace App\Controllers\Manager;

use App\Controllers\BaseController;
use App\Models\ProfileModel;
use CodeIgniter\HTTP\ResponseInterface;

class ProfileController extends BaseController
{
   public function profile()
{
    $token = $this->getTokenFromHeader();
    if (!$token) return $this->unauthorized('Missing or invalid Authorization header');

    try {
        $decoded = decodeJWT($token);
        $managerEmail = $decoded->data->email ?? null; // ✅ Use email from token
    } catch (\Exception $e) {
        return $this->unauthorized('Invalid or expired token');
    }

    if (!$managerEmail) {
        return $this->notFound('manager email not found in token');
    }

    $profileModel = new ProfileModel();

    // ✅ Find profile by email
    $manager = $profileModel->where('email', $managerEmail)->first();

    if (!$manager) {
        return $this->notFound('Profile not found');
    }

    return $this->response->setJSON([
        'status' => 'success',
        'data' => [
            'first_name'   => $manager['first_name'] ?? '',
            'last_name'    => $manager['last_name'] ?? '',
            'email'        => $manager['email'] ?? '',
            'phone'        => $manager['phone'] ?? '',
            'address1'     => $manager['address1'] ?? '',
            'address2'     => $manager['address2'] ?? '',
            'country'      => $manager['country'] ?? '',
            'state'        => $manager['state'] ?? '',
            'pin_code'     => $manager['pin_code'] ?? '',
            'city'         => $manager['city'] ?? '',
            'profile_image'=> !empty($manager['profile_image']) ? base_url('uploads/' . $manager['profile_image']) : null,
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
