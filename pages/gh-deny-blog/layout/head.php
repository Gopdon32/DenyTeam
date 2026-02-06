<?php
if (!isset($pageTitle)) $pageTitle = "DenysBlog";
if (!isset($pageScripts)) $pageScripts = [];
?>
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?></title>

    <!-- Основні стилі сайту -->
    <link rel="stylesheet" href="/css/style.css">

    <!-- Quill Editor -->
    <link href="https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css" rel="stylesheet">
</head>
<body>
