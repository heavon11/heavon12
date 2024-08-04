<?php
// Veritabanı bağlantısı (Bilgilerinizi girin)
$servername = " sql209.infinityfree.com";
$username = "if0_36674463";
$password = "zqWUFbAlhaNT";
$dbname = "if0_36674463_melek";

// Mesajları veritabanından çekme
$sql = "SELECT * FROM messages ORDER BY timestamp ASC";
$result = $conn->query($sql);

$messages = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $messages[] = $row["message"];
    }
}

// Mesajları JSON formatında gönderme
echo json_encode($messages);

$conn->close();
?>
