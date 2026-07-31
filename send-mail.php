<?php
$to = 'info@next-ji.jp';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

if (!empty($_POST['website'] ?? '')) {
    header('Location: thanks.html');
    exit;
}

function clean_text(string $value): string {
    return trim(str_replace(["\r", "\n"], ' ', $value));
}

$name = clean_text($_POST['name'] ?? '');
$tel = clean_text($_POST['tel'] ?? '');
$area = clean_text($_POST['area'] ?? '');
$status = clean_text($_POST['status'] ?? '');
$privacy = isset($_POST['privacy']);

if ($name === '' || !preg_match('/^0[0-9\-\s()]{9,14}$/', $tel) || !$privacy) {
    http_response_code(400);
    exit('入力内容をご確認ください。');
}

$subject = '【はたらくナビすぐワーク】求人応募・相談';
$body = "求人応募・相談が届きました。\n\n";
$body .= "お名前：{$name}\n";
$body .= "電話番号：{$tel}\n";
$body .= "希望勤務地：{$area}\n";
$body .= "現在の状況：{$status}\n";

$headers = "From: no-reply@" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

mb_language('Japanese');
mb_internal_encoding('UTF-8');

if (!mb_send_mail($to, $subject, $body, $headers)) {
    http_response_code(500);
    exit('送信に失敗しました。時間をおいて再度お試しください。');
}

header('Location: thanks.html');
exit;
