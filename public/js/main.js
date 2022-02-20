const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();
// Get username and room from Url
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})


// Join Chatroom
socket.emit('joinRoom', {username,room});
// Message from server
socket.on('message',message => {
    outputMessage(message);

    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight

})

// Message Submit
chatForm.addEventListener('submit',(e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit a message to server
    socket.emit('chatMessage',msg);
})

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.userName} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}