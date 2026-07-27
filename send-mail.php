<?php
/**
 * はたらくナビすぐワーク 応募フォーム送信処理
 * 公開前に $to を実際の受信用メールアドレスへ変更してください。
 */
mb_language('Japanese');
mb_internal_encoding('UTF-8');

$to = 'YOUR-EMAIL@example.com'; // 必ず変更してください
$subject = '【はたらくナビすぐワーク】LPから新規応募';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

// bot対策用の隠し項目
if (!empty($_POST['website'] ?? '')) {
    header('Location: thanks.html');
    exit;
}

function clean(string $value): string {
    return trim(str_replace(["\r", "\0"], '', strip_tags($value)));
}

$name = clean($_POST['name'] ?? '');
$tel = clean($_POST['tel'] ?? '');
$age = clean($_POST['age'] ?? '未選択');
$area = clean($_POST['area'] ?? '未入力');
$timing = clean($_POST['timing'] ?? '未選択');
$privacy = isset($_POST['privacy']);
$supportRaw = $_POST['support'] ?? [];
$support = is_array($supportRaw) ? implode('、', array_map(fn($v) => clean((string)$v), $supportRaw)) : '未選択';

if ($name === '' || $tel === '' || !$privacy || !preg_match('/^0[0-9\-\s()]{9,14}$/', $tel)) {
    header('Location: index.html?error=1#entry');
    exit;
}

$date = date('Y-m-d H:i:s');

$body = <<<BODY
はたらくナビすぐワークのLPから応募がありました。

■お名前
{$name}

■電話番号
{$tel}

■年齢
{$age}

■希望勤務地
{$area}

■勤務開始希望
{$timing}

■希望するサポート
{$support}

送信日時：{$date}
BODY;


$domain = $_SERVER['HTTP_HOST'] ?? 'example.com';
$domain = preg_replace('/[^a-zA-Z0-9.\-]/', '', $domain);
$headers = "From: webform@{$domain}\r\n";
$headers .= "Reply-To: webform@{$domain}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if ($to === 'YOUR-EMAIL@example.com') {
    // 未設定状態で誤送信しないための停止処理
    header('Location: index.html?error=mail-setting#entry');
    exit;
}

if (mb_send_mail($to, $subject, $body, $headers)) {
    header('Location: thanks.html');
    exit;
}

header('Location: index.html?error=send#entry');
exit;
