const socket = io({
  transports: ['polling'],
  upgrade: false
});

let currentChannel = 'general';
let username = null;

// Load navbar and user info
document.addEventListener('DOMContentLoaded', () => {
  fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('navbar').innerHTML = html;
    });

  fetch('/profile-data')
    .then(res => {
      if (res.status !== 200) window.location.href = '/login.html';
      return res.json();
    })
    .then(user => {
      username = user.username;
      loadChannels();
      loadChannelMessages(currentChannel);
      updateChannelLabel(currentChannel);
    });

  setupChannelCreation();
  setupChatForm();
});

function loadChannels() {
  fetch('/channels')
    .then(res => res.json())
    .then(channels => {
      const channelDiv = document.getElementById('channels');
      channelDiv.innerHTML = '';

      channels.forEach(channel => {
        const wrapper = document.createElement('div');
        wrapper.className = 'channel';

        const label = document.createElement('span');
        label.textContent = channel.name;
        label.style.cursor = 'pointer';
        label.onclick = () => {
          currentChannel = channel.name;
          updateChannelLabel(channel.name);
          loadChannelMessages(channel.name);
        };

        wrapper.appendChild(label);

        if (channel.creator === username && channel.name !== 'general') {
          const delBtn = document.createElement('button');
          delBtn.textContent = 'Delete';
          delBtn.onclick = () => {
            fetch(`/delete-channel/${channel.name}`, {
              method: 'DELETE'
            }).then(() => loadChannels());
          };
          wrapper.appendChild(delBtn);
        }

        channelDiv.appendChild(wrapper);
      });
    });
}

function updateChannelLabel(name) {
  document.getElementById('current-channel').textContent = `Currently in: #${name}`;
}

function loadChannelMessages(channelName) {
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML = '';

  fetch(`/channel-messages/${channelName}`)
    .then(res => {
      if (res.status === 403) {
        chatBox.innerHTML = `<i>You don’t have access to this private channel.</i>`;
        return [];
      }
      return res.json();
    })
    .then(messages => {
      messages.forEach(({ user, message }) => addMessage(user, message));
    });
}

function setupChatForm() {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('msg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;

    socket.emit('chat message', { channel: currentChannel, message: msg });
    input.value = '';
  });

  socket.on('chat message', ({ channel, user, message }) => {
    if (channel === currentChannel) {
      addMessage(user, message);
    }
  });
}

function addMessage(user, message) {
  const chatBox = document.getElementById('chat-box');
  const div = document.createElement('div');
  div.textContent = `${user}: ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function setupChannelCreation() {
  const form = document.getElementById('create-channel-form');
  const nameInput = document.getElementById('channel-name');
  const privacySelect = document.getElementById('channel-privacy');
  const membersInput = document.getElementById('channel-members');

  privacySelect.addEventListener('change', () => {
    if (privacySelect.value === 'true') {
      membersInput.style.display = 'inline-block';
    } else {
      membersInput.style.display = 'none';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const isPrivate = privacySelect.value === 'true';
    const members = membersInput.value.trim();

    fetch('/create-channel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        name,
        privateChannel: isPrivate,
        members
      })
    })
      .then(res => {
        if (res.status === 201) {
          loadChannels();
          nameInput.value = '';
          membersInput.value = '';
        } else {
          res.text().then(alert);
        }
      });
  });
}

