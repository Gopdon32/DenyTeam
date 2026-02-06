<?php
session_start();

function requireRole($role) {
    if (empty($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(["error" => "Not logged in"]);
        exit;
    }

    if ($_SESSION['user']['role'] !== $role) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden"]);
        exit;
    }
}
