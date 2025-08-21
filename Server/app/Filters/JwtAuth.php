<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use DomainException;
use InvalidArgumentException;
use UnexpectedValueException;

class JwtAuth implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $this->unauthorizedResponse('Token not provided or invalid format.');
        }

        $token = $matches[1];

        try {
            $decoded = decodeJWT($token); // custom helper you must create
            $userData = $decoded->data;

            // Optional DB validation
            if ($userData->role === 'admin' || $userData->role === 'manager') {
                $adminModel = new \App\Models\AdminModel();
                $admin = $adminModel->find($userData->id);
                if (!$admin) return $this->unauthorizedResponse('Admin not found');
            } elseif ($userData->role === 'employee') {
                $empModel = new \App\Models\EmployeeModel();
                $emp = $empModel->find($userData->id);
                if (!$emp) return $this->unauthorizedResponse('Employee not found');
            }

            // Attach user data to request for controller access
            $request->user = $userData;
            return; // continue request
        } catch (ExpiredException $e) {
            return $this->unauthorizedResponse('Token expired');
        } catch (SignatureInvalidException $e) {
            return $this->unauthorizedResponse('Invalid signature');
        } catch (DomainException | InvalidArgumentException | UnexpectedValueException $e) {
            return $this->unauthorizedResponse('Invalid token');
        } catch (\Exception $e) {
            return $this->unauthorizedResponse('Token error');
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return $response;
    }

    private function unauthorizedResponse(string $message): ResponseInterface
    {
        return Services::response()
            ->setJSON(['status' => false, 'message' => $message])
            ->setStatusCode(401);
    }
}
