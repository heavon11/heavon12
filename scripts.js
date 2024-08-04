document.addEventListener("DOMContentLoaded", function() {
    const chatBox = document.getElementById("chat-box");
    const chatForm = document.getElementById("chat-form");
    const messageInput = document.getElementById("message");
    let username = localStorage.getItem('username') || '';
    let lastMessageTime = '';

    function setUsername() {
        username = document.getElementById("username").value.trim();
        if (username) {
            localStorage.setItem('username', username);
            document.getElementById("username-container").style.display = 'none';
            document.getElementById("chat-container").style.display = 'block';
            fetchMessages();
        }
    }

    if (username) {
        document.getElementById("username-container").style.display = 'none';
        document.getElementById("chat-container").style.display = 'block';
        fetchMessages();
    }

    function fetchMessages() {
        fetch("chat.php?action=get")
            .then(response => response.text())
            .then(data => {
                chatBox.innerHTML = data;
                chatBox.scrollTop = chatBox.scrollHeight;
                checkForNewMessages(data);
            });
    }

    function checkForNewMessages(data) {
        const messages = data.trim().split('\n');
        const lastMessage = messages[messages.length - 1];
        const messageTime = lastMessage.split(' - ')[0];

        if (messageTime !== lastMessageTime) {
            lastMessageTime = messageTime;
            showNotification(lastMessage);
        }
    }

    function showNotification(message) {
        if (Notification.permission === 'granted') {
            new Notification('Yeni Mesaj', {
                body: message,
                icon: 'https://example.com/icon.png' // İkon URL'sini güncelleyin
            });
        } else {
            console.log('Bildirim izni verilmedi veya bildirimler devre dışı.');
        }
    }

    function requestNotificationPermission() {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        console.log('Bildirim izni verildi.');
                    } else if (permission === 'denied') {
                        console.log('Bildirim izni reddedildi.');
                    }
                });
            } else if (Notification.permission === 'granted') {
                console.log('Bildirim izni zaten verilmiş.');
            } else {
                console.log('Bildirim izni reddedildi.');
            }
        } else {
            console.log('Tarayıcı bildirimlerini desteklemiyor.');
        }
    }

    chatForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (message && username) {
            fetch("chat.php?action=post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `username=${encodeURIComponent(username)}&message=${encodeURIComponent(message)}`
            }).then(() => {
                messageInput.value = "";
                fetchMessages();
            });
        }
    });

    setInterval(fetchMessages, 1000); // Mesajları her saniye kontrol et
    window.setUsername = setUsername; // Global erişim için
    requestNotificationPermission(); // Sayfa yüklendiğinde bildirim izni iste
});
