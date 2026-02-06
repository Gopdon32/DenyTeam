<?php
// ==============================
// BACKEND: JWT (спрощений варіант)
// ==============================
$JWT_SECRET = 'super_secret_key_change_me';

function jwt_encode(array $payload): string {
    global $JWT_SECRET;

    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $body   = base64_encode(json_encode($payload));
    $sig    = hash_hmac('sha256', "$header.$body", $JWT_SECRET, true);
    $sigB64 = base64_encode($sig);

    return "$header.$body.$sigB64";
}

function jwt_decode(string $token): ?array {
    global $JWT_SECRET;

    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    [$header, $body, $sig] = $parts;

    $check = base64_encode(hash_hmac('sha256', "$header.$body", $JWT_SECRET, true));
    if (!hash_equals($check, $sig)) return null;

    $data = json_decode(base64_decode($body), true);
    return is_array($data) ? $data : null;
}
