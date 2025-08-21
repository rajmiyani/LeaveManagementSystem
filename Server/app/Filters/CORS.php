<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class CORS implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $response = service('response');
        $this->setHeaders($response);

        if (strtoupper($request->getMethod()) === 'OPTIONS') {
            return $response->setStatusCode(200);
        }

        return null;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        $this->setHeaders($response);
        return $response;
    }

    private function setHeaders(ResponseInterface $response)
    {
        // Allow during development
        $allowedOrigins = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'https://yourdomain.com'
        ];

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

        if (in_array($origin, $allowedOrigins)) {
            $response->setHeader('Access-Control-Allow-Origin', $origin);
        } else {
            $response->setHeader('Access-Control-Allow-Origin', '*');
        }

        $response->setHeader('Access-Control-Allow-Credentials', 'true');
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
        $response->setHeader(
            'Access-Control-Allow-Headers',
            'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
        $response->setHeader('Access-Control-Max-Age', '86400');
    }
}
