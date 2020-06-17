const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

socket.emit("joinRoom", {username, room });
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", message => {
  outputMessage(message);
  deleteMsg(message);
  updateMsg(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", e => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit("chatMessage", msg,);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.setAttribute('data_id', message.id);
  div.innerHTML = `
    <p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">${message.text}</p> 
    <button class="btn end action-btn-upd" data-id=${message.id}>Update</button>
    <button class="btn end action-btn-del" data-id=${message.id}>Delete</button>
    `;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function deleteMsg(message) {
  const deleteBtns =  document.querySelectorAll(".action-btn-del");

  if (deleteBtns) {
    deleteBtns.forEach(btn => {
      if (message.id.includes(btn.dataset.id)) {
        btn.addEventListener('click', (e) => {
          socket.emit('deleteMessage', message.id);
          btn.parentElement.remove();
        });
      }
    })
  }
}

function updateMsg(message) {
  const updateBtns =  document.querySelectorAll(".action-btn-upd");

  if (updateBtns) {
    updateBtns.forEach(btn => {
      if (message.id.includes(btn.dataset.id)) {
        btn.addEventListener('click', (e) => {
          btn.parentElement.innerText = 'Извини, было сильно долго менять еще и текст, пока что так, потом исправлю =)'
        });
      }
    })
  }
}

function outputUsers(users) {
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join("")}
  `;
}
