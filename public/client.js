const socket = io();
// User list updates
socket.on('user:list', (list) => {
    userList.innerHTML = '';
    list.forEach((name) => {
        const li = document.createElement('li');
        li.textContent = name;
        userList.appendChild(li);
    });
});


// System messages
socket.on('system:info', (text) => {
    const li = document.createElement('li');
    li.className = 'system';
    li.textContent = text;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
});


// Chat messages
socket.on('chat:message', ({ from, text, ts }) => {
    const li = document.createElement('li');
    li.className = 'msg';
    li.innerHTML = `<span class="from">${from}</span> <span class="time">${fmtTime(ts)}</span><div class="bubble">${escapeHtml(text)}</div>`;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
});


// Typing indicator
let typingTimeout;
messageInput.addEventListener('input', () => {
    socket.emit('chat:typing', messageInput.value.length > 0);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => socket.emit('chat:typing', false), 1200);
});


socket.on('chat:typing', ({ from, isTyping }) => {
    if (isTyping) {
        typing.hidden = false;
        typing.textContent = `${from} is typing…`;
    } else {
        typing.hidden = true;
    }
});


// Send message
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;
    socket.emit('chat:message', text);
    messageInput.value = '';
    socket.emit('chat:typing', false);
});


// Simple HTML escaper
function escapeHtml(str) {
    return str
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}