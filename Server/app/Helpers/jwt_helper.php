<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;

if (!function_exists('generateJWT')) {
    /**
     * Generate JWT token.
     *
     * @param array $user User data (must include id, email, name, role, etc.)
     * @return string JWT token
     */
    function generateJWT(array $user): string
    {
        if (empty($user['id']) || empty($user['email']) || empty($user['name']) || empty($user['role'])) {
            throw new \UnexpectedValueException('User data must include id, email, name, and role');
        }

        $key = getenv('JWT_SECRET');
        if (!$key) {
            throw new \InvalidArgumentException('JWT_SECRET environment variable is not set');
        }

        $issuedAt = time();
        $expire   = $issuedAt + 3600; // 1 hour

        // $payload = [
        //     'iat'  => $issuedAt,
        //     'exp'  => $expire,
        //     'data' => $user   // put all user info directly here
        // ];

        $payload = array(
        'iat' => $issuedAt,
        'exp' => $expire,
        'data' => array(
            'id' => $user['id'],
            'name' => $user['name'],  // ✅ Added name
            'email' => $user['email'], // ✅ Added email
            'role' => $user['role']   // ✅ Added role
        )
    );

        return JWT::encode($payload, $key, 'HS256');
    }
}

if (!function_exists('decodeJWT')) {
    /**
     * Decode JWT token.
     *
     * @param string $token JWT token string
     * @return \stdClass Decoded token payload
     * @throws ExpiredException
     * @throws SignatureInvalidException
     * @throws \InvalidArgumentException
     */
    function decodeJWT(string $token): \stdClass
    {
        $key = getenv('JWT_SECRET');
        if (!$key) {
            throw new \InvalidArgumentException('JWT_SECRET environment variable is not set');
        }

        return JWT::decode($token, new Key($key, 'HS256'));
    }
}
