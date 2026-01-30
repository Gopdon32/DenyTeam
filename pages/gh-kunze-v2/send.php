<?php
header("Content-Type: application/json; charset=UTF-8");

// Куди відправляти
$to = "goldmaster2003@gmail.com";

// Дані з форми
$name = $_POST["name"] ?? "";
$phone = $_POST["phone"] ?? "";
$comment = $_POST["comment"] ?? "";

// Тема листа
$subject = "Нова заявка з сайту Kunze Auto";

// Текст листа
$message = "
Ім'я: $name
Телефон: $phone
Коментар: $comment
";

// Заголовки
$headers = "From: no-reply@yourdomain.com\r\n";
$headers .= "Reply-To: $phone\r\n";

// Відправка
$success = mail($to, $subject, $message, $headers);

echo json_encode(["success" => $success]);
