<?php
session_start();

function requireRole(array $roles) {
    if (!isset($_SESSION['user'])) {
        header("Location: /login.php");
        exit;
    }

    $role = $_SESSION['user']['role'];

    if (!in_array($role, $roles)) {
        header("Location: /");
        exit;
    }
}
