const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const http = require('http');

const app = express();

const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  transports: ['polling'],
});

const USERS_FILE = path.join(__dirname, 'users.json');

const CHANNELS_FILE = path.join(__dirname, 'channels.json');
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

app.set('trust proxy', 1);


const sessionMiddleware = session({
  secret: 'epitahub_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: 'auto',
    httpOnly: true,
    sameSite: 'lax'
  }
});

const PROJECTS_FILE = path.join(__dirname, 'projects.json');

function loadProjects() {
  if (!fs.existsSync(PROJECTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
}

function saveProjects(projects) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

app.use(sessionMiddleware);

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

let chatMessages = [];

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function saveUser(user) {
  const users = loadUsers();
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.post('/signup', (req, res) => {
  const { username, password, campus, bio, photo } = req.body;
  const users = loadUsers();

  if (users.find(u => u.username === username)) {
    return res.send('Username already exists. <a href="/signup.html">Try again</a>');
  }

  const user = { username, password, campus, bio, photo };
  saveUser(user);
  req.session.user = user;
  res.redirect('/profile.html');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.send('Invalid login. <a href="/login.html">Try again</a>');
  }

  req.session.user = user;
  res.redirect('/profile.html');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

app.post('/edit', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');

  const users = loadUsers();
  const index = users.findIndex(u => u.username === req.session.user.username);

  if (index !== -1) {
    users[index].campus = req.body.campus;
    users[index].bio = req.body.bio;
    users[index].photo = req.body.photo;

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    req.session.user = users[index];
    res.redirect('/profile.html');
  } else {
    res.status(404).send('User not found');
  }
});

app.get('/profile-data', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');
  res.json(req.session.user);
});

app.get('/calendar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/calendar.html'));
});

app.get('/profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/profile.html'));
});

app.get('/chat-history', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');
  res.json(chatMessages);
});

io.on('connection', (socket) => {
  console.log('✅ Socket connected via polling:', socket.id);

  const session = socket.request.session;
  const user = session?.user;
  if (!user) {
    console.log('❌ No user in session');
    return;
  }

  console.log('🔐 Connected as', user.username);

  socket.on('chat message', ({ channel, message }) => {
    const username = user.username;

    const ch = channels[channel];
    if (!ch) return;
    if (ch.private && !(ch.members.includes(username) || ch.creator === username)) return;

    const msg = { user: username, message };

    if (!messages[channel]) messages[channel] = [];
    messages[channel].push(msg);
    saveMessages(messages);

    io.emit('chat message', { channel, user: username, message });
  });
});

function loadChannels() {
  if (!fs.existsSync(CHANNELS_FILE)) {
    return { general: { name: "general", creator: "system", private: false, members: [] } };
  }
  return JSON.parse(fs.readFileSync(CHANNELS_FILE, 'utf8'));
}

function saveChannels(channels) {
  fs.writeFileSync(CHANNELS_FILE, JSON.stringify(channels, null, 2));
}

function loadMessages() {
  if (!fs.existsSync(MESSAGES_FILE)) {
    return { general: [] };
  }
  return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
}

function saveMessages(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

let channels = loadChannels();
let messages = loadMessages();

app.get('/channels', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');
  const username = req.session.user.username;

  const visibleChannels = Object.values(channels).filter(channel => {
    return !channel.private || channel.members.includes(username) || channel.creator === username;
  });

  res.json(visibleChannels);
});

app.post('/create-channel', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');
  const { name, privateChannel, members } = req.body;

  const channelName = name.trim().toLowerCase();
  if (channels[channelName]) {
    return res.status(400).send('Channel already exists');
  }

  const isPrivate = privateChannel === 'true';
  const creator = req.session.user.username;
  const allowedUsers = isPrivate ? members.split(',').map(u => u.trim()).concat(creator) : [];

  channels[channelName] = {
    name: channelName,
    creator,
    private: isPrivate,
    members: allowedUsers
  };
  messages[channelName] = [];

  saveChannels(channels);
  saveMessages(messages);

  res.status(201).send('Channel created');
});

app.delete('/delete-channel/:name', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');
  const channelName = req.params.name.toLowerCase();
  const username = req.session.user.username;

  if (!channels[channelName]) return res.status(404).send('Channel not found');
  if (channels[channelName].creator !== username) {
    return res.status(403).send('Only the creator can delete this channel');
  }

  delete channels[channelName];
  delete messages[channelName];
  saveChannels(channels);
  saveMessages(messages);

  res.send('Channel deleted');
});

app.get('/channel-messages/:name', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');
  const channelName = req.params.name.toLowerCase();
  const username = req.session.user.username;

  const channel = channels[channelName];
  if (!channel) return res.status(404).send('Channel not found');

  if (channel.private && !channel.members.includes(username)) {
    return res.status(403).send('Access denied');
  }

  res.json(messages[channelName] || []);
});

app.get('/projects', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');

  const user = req.session.user.username;
  const projects = loadProjects();
  const visibleProjects = projects.filter(p => p.owner === user || p.members.includes(user));
  res.json(visibleProjects);
});

app.get('/projects', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');

  const user = req.session.user.username;
  const projects = loadProjects();
  const visibleProjects = projects.filter(p => p.owner === user || p.members.includes(user));
  res.json(visibleProjects);
});

app.post('/projects', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');

  const { projectName } = req.body;
  const username = req.session.user.username;

  const projects = loadProjects();
  const newProject = {
    id: Date.now(),
    projectName,
    owner: username,
    members: [username],
    tasks: []
  };

  projects.push(newProject);
  saveProjects(projects);
  res.status(201).send('Project created');
});

app.get('/projects/:id', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');
  const projects = loadProjects();
  const project = projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).send('Project not found');
  res.json(project);
});

app.post('/projects/:id/tasks', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');

  const { title, assignedTo, dueDate, status } = req.body;
  const projects = loadProjects();
  const project = projects.find(p => p.id == req.params.id);

  if (!project) return res.status(404).send('Project not found');

  const newTask = {
    id: Date.now(),
    title,
    assignedTo: assignedTo || '',
    dueDate: dueDate || '',
    status: status || 'To Do'
  };

  project.tasks.push(newTask);
  saveProjects(projects);
  res.status(201).send('Task added');
});

app.post('/projects/:id/members', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');

  const username = req.session.user.username;
  const { newMember } = req.body;
  const projects = loadProjects();
  const project = projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).send('Project not found');
  if (project.owner !== username) return res.status(403).send('Only owner can add members');

  if (!project.members.includes(newMember)) {
    project.members.push(newMember);
    saveProjects(projects);
  }

  res.send('Member added');
});

app.patch('/projects/:id/tasks/:taskId/status', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');
  const { status } = req.body;

  const projects = loadProjects();
  const project = projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).send('Project not found');
  if (project.owner !== req.session.user.username) return res.status(403).send('Only owner can modify status');

  const task = project.tasks.find(t => t.id == req.params.taskId);
  if (!task) return res.status(404).send('Task not found');

  task.status = status;
  saveProjects(projects);
  res.send('Status updated');
});

app.delete('/projects/:id/tasks/:taskId', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');

  const projects = loadProjects();
  const project = projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).send('Project not found');
  if (project.owner !== req.session.user.username) return res.status(403).send('Only owner can delete tasks');

  project.tasks = project.tasks.filter(t => t.id != req.params.taskId);
  saveProjects(projects);
  res.send('Task deleted');
});

app.delete('/projects/:id', (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');
  const username = req.session.user.username;

  let projects = loadProjects();
  const project = projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).send('Project not found');
  if (project.owner !== username) return res.status(403).send('Only owner can delete project');

  projects = projects.filter(p => p.id != req.params.id);
  saveProjects(projects);
  res.send('Project deleted');
});

// Server Launch
server.listen(3000, () => {
  console.log('✅ EPITA Hub server running on http://localhost:3000');
});

