<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$messagesFile = 'messages.txt';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_GET['action'] == 'post') {
    if (isset($_POST['username'], $_POST['message']) && !empty(trim($_POST['username'])) && !empty(trim($_POST['message']))) {
        $username = trim($_POST['username']);
        $message = trim($_POST['message']);
        $timestamp = date('Y-m-d H:i:s');
        $formattedMessage = htmlspecialchars($timestamp . ' - ' . $username . ': ' . $message, ENT_QUOTES, 'UTF-8');
        file_put_contents($messagesFile, $formattedMessage . "\n", FILE_APPEND);
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && $_GET['action'] == 'get') {
    if (file_exists($messagesFile)) {
        echo nl2br(file_get_contents($messagesFile));
    }
}
?>
