const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

// Persistent storage
const DB_FILE = path.join(__dirname, 'nexus_db.json');

// Database
let db = {
  users: {},
  chats: {},
  channels: {},
  groups: {},
  messages: {},
  unreadCounts: {},
  bots: {},
  dailyUsage: {}
};

// Load database from file
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
      console.log('Database loaded');
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
}

// Save database to file
function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Auto-save every 10 seconds
setInterval(saveDB, 10000);

// Limits
const LIMITS = {
  free: {
    image: 30 * 1024,
    file: 70 * 1024,
    daily: 1.5 * 1024 * 1024
  },
  premium: {
    image: 300 * 1024,
    file: 700 * 1024,
    daily: 15 * 1024 * 1024
  }
};

// Active WebSocket connections
const connections = new Map();

// Initialize database
loadDB();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initialize default users if database is empty
if (!db.users['Mimimitya']) {
  const superAdmin = {
    id: 'Mimimitya',
    username: 'Mimimitya',
    password: hashPassword('nexus2026'),
    isSuperAdmin: true,
    isPremium: true,
    verified: true,
    avatar: '👑',
    status: 'offline',
    sessions: [],
    developerMode: false,
    createdAt: Date.now()
  };
  db.users['Mimimitya'] = superAdmin;
  
  const robotBuilder = {
    id: 'robot_builder_bot',
    username: 'Robot Builder',
    isBot: true,
    avatar: '🤖',
    status: 'online',
    createdAt: Date.now()
  };
  db.users['robot_builder_bot'] = robotBuilder;
  
  saveDB();
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generateApiKey() {
  return 'nxs_' + crypto.randomBytes(24).toString('hex');
}

function checkDailyLimit(userId, size) {
  const today = new Date().toDateString();
  const key = `${userId}_${today}`;
  const usage = db.dailyUsage[key] || 0;
  const user = db.users[userId];
  const limit = user?.isPremium ? LIMITS.premium.daily : LIMITS.free.daily;
  
  if (usage + size > limit) {
    return false;
  }
  
  db.dailyUsage[key] = usage + size;
  saveDB();
  return true;
}

function broadcast(data, excludeUserId = null) {
  const message = JSON.stringify(data);
  connections.forEach((ws, userId) => {
    if (userId !== excludeUserId && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}

function sendToUser(userId, data) {
  const ws = connections.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function createChat(user1Id, user2Id) {
  const chatId = [user1Id, user2Id].sort().join('_');
  if (!db.chats[chatId]) {
    db.chats[chatId] = {
      id: chatId,
      type: 'private',
      participants: [user1Id, user2Id],
      createdAt: Date.now(),
      lastMessage: null
    };
    db.messages[chatId] = [];
    db.unreadCounts[chatId] = {};
    saveDB();
  }
  return chatId;
}

function createGroup(name, creatorId, members = []) {
  const groupId = 'grp_' + crypto.randomBytes(8).toString('hex');
  const inviteCode = crypto.randomBytes(6).toString('hex');
  
  const group = {
    id: groupId,
    type: 'group',
    name,
    description: '',
    creator: creatorId,
    admins: [creatorId],
    members: [creatorId, ...members],
    createdAt: Date.now(),
    inviteCode,
    slowMode: 0,
    avatar: '👥'
  };
  
  db.groups[groupId] = group;
  db.messages[groupId] = [];
  db.unreadCounts[groupId] = {};
  saveDB();
  return group;
}

function createChannel(name, username, description, creatorId) {
  const channelId = 'ch_' + crypto.randomBytes(8).toString('hex');
  const inviteCode = crypto.randomBytes(6).toString('hex');
  
  const channel = {
    id: channelId,
    type: 'channel',
    name,
    username,
    description,
    creator: creatorId,
    admins: [creatorId],
    subscribers: [creatorId],
    createdAt: Date.now(),
    inviteCode,
    slowMode: 0
  };
  
  db.channels[channelId] = channel;
  db.messages[channelId] = [];
  db.unreadCounts[channelId] = {};
  saveDB();
  return channel;
}

function incrementUnread(chatId, userId) {
  if (!db.unreadCounts[chatId]) {
    db.unreadCounts[chatId] = {};
  }
  db.unreadCounts[chatId][userId] = (db.unreadCounts[chatId][userId] || 0) + 1;
  saveDB();
}

function resetUnread(chatId, userId) {
  if (db.unreadCounts[chatId]) {
    db.unreadCounts[chatId][userId] = 0;
    saveDB();
  }
}

function sendRobotBuilderWelcome(userId) {
  const apiKey = generateApiKey();
  const chatId = createChat('robot_builder_bot', userId);
  
  const message = {
    id: crypto.randomBytes(8).toString('hex'),
    chatId,
    sender: 'robot_builder_bot',
    text: `👋 Добро пожаловать в Robot Builder!

Вы активировали режим разработчика. Ваш API ключ:

${apiKey}

📌 Команды:
/newbot - создать нового бота
/mybots - список ваших ботов
/token - получить токен бота
/setwebhook - настроить webhook
/deletebot - удалить бота
/help - помощь

🔗 API Endpoint: https://api.nexus.app
📚 Документация: https://docs.nexus.app

Начните с команды /newbot для создания первого бота!`,
    timestamp: Date.now(),
    type: 'text',
    reactions: {}
  };
  
  if (!db.messages[chatId]) {
    db.messages[chatId] = [];
  }
  db.messages[chatId].push(message);
  
  // Update user with API key
  const user = db.users[userId];
  if (user) {
    user.apiKey = apiKey;
    saveDB();
  }
  
  // Send to user
  sendToUser(userId, {
    type: 'new_message',
    message
  });
  
  return message;
}

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  let currentUserId = null;
  const clientHost = req.headers.host;
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      
      switch (msg.type) {
        case 'auth':
          handleAuth(ws, msg);
          break;
        case 'register':
          handleRegister(ws, msg);
          break;
        case 'message':
          handleMessage(ws, msg);
          break;
        case 'edit_message':
          handleEditMessage(ws, msg);
          break;
        case 'delete_message':
          handleDeleteMessage(ws, msg);
          break;
        case 'reaction':
          handleReaction(ws, msg);
          break;
        case 'create_channel':
          handleCreateChannel(ws, msg);
          break;
        case 'create_group':
          handleCreateGroup(ws, msg);
          break;
        case 'join_channel':
          handleJoinChannel(ws, msg);
          break;
        case 'add_members':
          handleAddMembers(ws, msg);
          break;
        case 'update_group':
          handleUpdateGroup(ws, msg);
          break;
        case 'update_channel':
          handleUpdateChannel(ws, msg);
          break;
        case 'set_slow_mode':
          handleSetSlowMode(ws, msg);
          break;
        case 'search_users':
          handleSearchUsers(ws, msg);
          break;
        case 'mark_read':
          handleMarkRead(ws, msg);
          break;
        case 'update_status':
          handleUpdateStatus(ws, msg);
          break;
        case 'toggle_developer_mode':
          handleToggleDeveloperMode(ws, msg);
          break;
        case 'change_password':
          handleChangePassword(ws, msg);
          break;
        case 'delete_session':
          handleDeleteSession(ws, msg);
          break;
        case 'admin_action':
          handleAdminAction(ws, msg);
          break;
        case 'typing':
          handleTyping(ws, msg);
          break;
        case 'bot_command':
          handleBotCommand(ws, msg);
          break;
        default:
          console.log('Unknown message type:', msg.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({ type: 'error', error: error.message }));
    }
  });
  
  ws.on('close', () => {
    if (currentUserId) {
      connections.delete(currentUserId);
      const user = db.users[currentUserId];
      if (user && !user.isBot) {
        user.status = 'offline';
        user.lastSeen = Date.now();
        saveDB();
        broadcast({ type: 'user_status', userId: currentUserId, status: 'offline' });
      }
    }
  });
  
  function handleAuth(ws, msg) {
    const user = Object.values(db.users).find(
      u => u.username === msg.username && u.password === hashPassword(msg.password)
    );
    
    if (user) {
      if (user.banned) {
        ws.send(JSON.stringify({ type: 'auth_failed', error: 'Вы забанены' }));
        return;
      }
      
      const session = {
        id: crypto.randomBytes(8).toString('hex'),
        device: msg.device || 'Web Browser',
        lastActive: Date.now(),
        ip: msg.ip || '0.0.0.0'
      };
      
      user.sessions = user.sessions || [];
      user.sessions.push(session);
      user.status = 'online';
      user.lastSeen = Date.now();
      
      currentUserId = user.id;
      connections.set(user.id, ws);
      
      // Prepare user data
      const userData = { ...user };
      delete userData.password;
      
      // Get user's chats
      const userChats = Object.values(db.chats).filter(chat =>
        chat.participants.includes(user.id)
      );
      
      // Get user's groups
      const userGroups = Object.values(db.groups).filter(group =>
        group.members.includes(user.id)
      );
      
      // Get user's channels
      const userChannels = Object.values(db.channels).filter(channel =>
        channel.subscribers.includes(user.id) || channel.admins.includes(user.id)
      );
      
      // Get all messages for user's chats, groups and channels
      const allMessages = {};
      const allUnread = {};
      [...userChats, ...userGroups, ...userChannels].forEach(item => {
        const id = item.id;
        allMessages[id] = db.messages[id] || [];
        allUnread[id] = db.unreadCounts[id]?.[user.id] || 0;
      });
      
      // Get all users
      const allUsers = Object.values(db.users).map(u => {
        const userData = { ...u };
        delete userData.password;
        return userData;
      });
      
      saveDB();
      
      ws.send(JSON.stringify({
        type: 'auth_success',
        user: userData,
        users: allUsers,
        chats: userChats,
        groups: userGroups,
        channels: userChannels,
        messages: allMessages,
        unreadCounts: allUnread,
        session,
        serverHost: clientHost
      }));
      
      broadcast({ type: 'user_status', userId: user.id, status: 'online' }, user.id);
    } else {
      ws.send(JSON.stringify({ type: 'auth_failed', error: 'Неверный логин или пароль' }));
    }
  }
  
  function handleRegister(ws, msg) {
    const exists = Object.values(db.users).find(u => u.username === msg.username);
    
    if (exists) {
      ws.send(JSON.stringify({ type: 'register_failed', error: 'Пользователь уже существует' }));
      return;
    }
    
    const newUser = {
      id: crypto.randomBytes(16).toString('hex'),
      username: msg.username,
      password: hashPassword(msg.password),
      isPremium: false,
      verified: false,
      avatar: msg.avatar || '👤',
      status: 'offline',
      sessions: [],
      createdAt: Date.now(),
      developerMode: false
    };
    
    db.users[newUser.id] = newUser;
    saveDB();
    
    ws.send(JSON.stringify({ type: 'register_success' }));
  }
  
  function handleMessage(ws, msg) {
    const user = db.users[currentUserId];
    if (!user) return;
    
    if (user.muted || user.banned) {
      ws.send(JSON.stringify({ type: 'error', error: 'Вы не можете отправлять сообщения' }));
      return;
    }
    
    const chatId = msg.chatId;
    if (!db.messages[chatId]) {
      db.messages[chatId] = [];
    }
    
    const newMessage = {
      id: crypto.randomBytes(8).toString('hex'),
      chatId,
      sender: currentUserId,
      text: msg.text,
      timestamp: Date.now(),
      type: msg.messageType || 'text',
      reactions: {},
      replyTo: msg.replyTo || null,
      fileData: msg.fileData,
      fileName: msg.fileName,
      edited: false,
      formatting: msg.formatting || null
    };
    
    db.messages[chatId].push(newMessage);
    
    // Update last message
    if (db.chats[chatId]) {
      db.chats[chatId].lastMessage = newMessage;
    } else if (db.groups[chatId]) {
      db.groups[chatId].lastMessage = newMessage;
    } else if (db.channels[chatId]) {
      db.channels[chatId].lastMessage = newMessage;
    }
    
    // Increment unread for other participants
    const chat = db.chats[chatId] || db.groups[chatId] || db.channels[chatId];
    if (chat) {
      const participants = chat.participants || chat.members || chat.subscribers || [];
      participants.forEach(participantId => {
        if (participantId !== currentUserId) {
          incrementUnread(chatId, participantId);
        }
      });
    }
    
    saveDB();
    
    // Broadcast to all participants
    broadcast({
      type: 'new_message',
      message: newMessage
    });
  }
  
  function handleEditMessage(ws, msg) {
    const messages = db.messages[msg.chatId] || [];
    const message = messages.find(m => m.id === msg.messageId);
    
    if (message && message.sender === currentUserId) {
      message.text = msg.text;
      message.edited = true;
      message.editedAt = Date.now();
      message.formatting = msg.formatting || null;
      
      saveDB();
      
      broadcast({
        type: 'message_edited',
        chatId: msg.chatId,
        messageId: msg.messageId,
        text: msg.text,
        editedAt: message.editedAt,
        formatting: message.formatting
      });
    }
  }
  
  function handleDeleteMessage(ws, msg) {
    const messages = db.messages[msg.chatId] || [];
    const messageIndex = messages.findIndex(m => m.id === msg.messageId);
    
    if (messageIndex !== -1) {
      const message = messages[messageIndex];
      const user = db.users[currentUserId];
      
      if (message.sender === currentUserId || user?.isSuperAdmin) {
        messages.splice(messageIndex, 1);
        saveDB();
        
        broadcast({
          type: 'message_deleted',
          chatId: msg.chatId,
          messageId: msg.messageId
        });
      }
    }
  }
  
  function handleReaction(ws, msg) {
    const messages = db.messages[msg.chatId] || [];
    const message = messages.find(m => m.id === msg.messageId);
    
    if (message) {
      if (!message.reactions) message.reactions = {};
      if (!message.reactions[msg.emoji]) message.reactions[msg.emoji] = [];
      
      const index = message.reactions[msg.emoji].indexOf(currentUserId);
      if (index > -1) {
        message.reactions[msg.emoji].splice(index, 1);
      } else {
        message.reactions[msg.emoji].push(currentUserId);
      }
      
      saveDB();
      
      broadcast({
        type: 'reaction_updated',
        chatId: msg.chatId,
        messageId: msg.messageId,
        reactions: message.reactions
      });
    }
  }
  
  function handleCreateChannel(ws, msg) {
    const channel = createChannel(msg.name, msg.username, msg.description, currentUserId);
    channel.inviteLink = `${clientHost}/join/${msg.username}?code=${channel.inviteCode}`;
    
    saveDB();
    
    ws.send(JSON.stringify({
      type: 'channel_created',
      channel
    }));
    
    broadcast({
      type: 'channel_created',
      channel
    }, currentUserId);
  }
  
  function handleCreateGroup(ws, msg) {
    const group = createGroup(msg.name, currentUserId, msg.members || []);
    group.inviteLink = `${clientHost}/join/g/${group.inviteCode}`;
    
    saveDB();
    
    ws.send(JSON.stringify({
      type: 'group_created',
      group
    }));
    
    // Notify all members
    group.members.forEach(memberId => {
      if (memberId !== currentUserId) {
        sendToUser(memberId, {
          type: 'group_created',
          group
        });
      }
    });
  }
  
  function handleJoinChannel(ws, msg) {
    const channel = db.channels[msg.channelId];
    if (channel && !channel.subscribers.includes(currentUserId)) {
      channel.subscribers.push(currentUserId);
      saveDB();
      
      broadcast({
        type: 'channel_updated',
        channel
      });
    }
  }
  
  function handleAddMembers(ws, msg) {
    const group = db.groups[msg.groupId];
    if (group && group.admins.includes(currentUserId)) {
      msg.memberIds.forEach(memberId => {
        if (!group.members.includes(memberId)) {
          group.members.push(memberId);
          
          // Notify new member
          sendToUser(memberId, {
            type: 'group_updated',
            group
          });
        }
      });
      
      saveDB();
      
      broadcast({
        type: 'group_updated',
        group
      });
    }
  }
  
  function handleUpdateGroup(ws, msg) {
    const group = db.groups[msg.groupId];
    if (group && group.admins.includes(currentUserId)) {
      if (msg.name) group.name = msg.name;
      if (msg.description !== undefined) group.description = msg.description;
      if (msg.avatar) group.avatar = msg.avatar;
      
      saveDB();
      
      broadcast({
        type: 'group_updated',
        group
      });
    }
  }
  
  function handleUpdateChannel(ws, msg) {
    const channel = db.channels[msg.channelId];
    if (channel && channel.admins.includes(currentUserId)) {
      if (msg.name) channel.name = msg.name;
      if (msg.description !== undefined) channel.description = msg.description;
      if (msg.username) channel.username = msg.username;
      
      saveDB();
      
      broadcast({
        type: 'channel_updated',
        channel
      });
    }
  }
  
  function handleSetSlowMode(ws, msg) {
    const target = db.groups[msg.targetId] || db.channels[msg.targetId];
    if (target && target.admins.includes(currentUserId)) {
      target.slowMode = msg.seconds;
      saveDB();
      
      broadcast({
        type: target.type === 'group' ? 'group_updated' : 'channel_updated',
        [target.type]: target
      });
    }
  }
  
  function handleSearchUsers(ws, msg) {
    const query = msg.query.toLowerCase();
    const results = Object.values(db.users)
      .filter(u => !u.isBot && u.username.toLowerCase().includes(query))
      .map(u => {
        const userData = { ...u };
        delete userData.password;
        return userData;
      })
      .slice(0, 10);
    
    ws.send(JSON.stringify({
      type: 'search_results',
      results
    }));
  }
  
  function handleMarkRead(ws, msg) {
    resetUnread(msg.chatId, currentUserId);
    
    ws.send(JSON.stringify({
      type: 'unread_updated',
      chatId: msg.chatId,
      count: 0
    }));
  }
  
  function handleUpdateStatus(ws, msg) {
    const user = db.users[currentUserId];
    if (user) {
      user.status = msg.status;
      saveDB();
      broadcast({ type: 'user_status', userId: currentUserId, status: msg.status });
    }
  }
  
  function handleToggleDeveloperMode(ws, msg) {
    const user = db.users[currentUserId];
    if (user) {
      user.developerMode = msg.enabled;
      saveDB();
      
      if (msg.enabled && !user.apiKey) {
        sendRobotBuilderWelcome(currentUserId);
        
        ws.send(JSON.stringify({
          type: 'developer_mode_updated',
          enabled: true,
          apiKey: user.apiKey
        }));
      } else {
        ws.send(JSON.stringify({
          type: 'developer_mode_updated',
          enabled: msg.enabled
        }));
      }
    }
  }
  
  function handleChangePassword(ws, msg) {
    const user = db.users[currentUserId];
    if (user && user.password === hashPassword(msg.oldPassword)) {
      user.password = hashPassword(msg.newPassword);
      saveDB();
      ws.send(JSON.stringify({ type: 'password_changed' }));
    } else {
      ws.send(JSON.stringify({ type: 'error', error: 'Неверный старый пароль' }));
    }
  }
  
  function handleDeleteSession(ws, msg) {
    const user = db.users[currentUserId];
    if (user) {
      user.sessions = user.sessions.filter(s => s.id !== msg.sessionId);
      saveDB();
      ws.send(JSON.stringify({ type: 'session_deleted', sessionId: msg.sessionId }));
    }
  }
  
  function handleAdminAction(ws, msg) {
    const admin = db.users[currentUserId];
    if (!admin?.isSuperAdmin) {
      ws.send(JSON.stringify({ type: 'error', error: 'Нет прав доступа' }));
      return;
    }
    
    const targetUser = db.users[msg.targetUserId];
    if (!targetUser) return;
    
    switch (msg.action) {
      case 'toggle_premium':
        targetUser.isPremium = !targetUser.isPremium;
        break;
      case 'toggle_verified':
        targetUser.verified = !targetUser.verified;
        break;
      case 'toggle_ban':
        targetUser.banned = !targetUser.banned;
        if (targetUser.banned) {
          const targetWs = connections.get(targetUser.id);
          if (targetWs) {
            targetWs.close();
          }
        }
        break;
      case 'toggle_mute':
        targetUser.muted = !targetUser.muted;
        break;
    }
    
    saveDB();
    
    broadcast({
      type: 'user_updated',
      user: {
        id: targetUser.id,
        username: targetUser.username,
        isPremium: targetUser.isPremium,
        verified: targetUser.verified,
        banned: targetUser.banned,
        muted: targetUser.muted
      }
    });
  }
  
  function handleTyping(ws, msg) {
    broadcast({
      type: 'typing',
      chatId: msg.chatId,
      userId: currentUserId,
      isTyping: msg.isTyping
    }, currentUserId);
  }
  
  function handleBotCommand(ws, msg) {
    const command = msg.command;
    const user = db.users[currentUserId];
    
    if (!user.developerMode) return;
    
    const chatId = createChat('robot_builder_bot', currentUserId);
    let responseText = '';
    
    switch (command) {
      case '/newbot':
        const botId = 'bot_' + crypto.randomBytes(8).toString('hex');
        const botToken = generateToken();
        const newBot = {
          id: botId,
          name: msg.botName || 'New Bot',
          token: botToken,
          owner: currentUserId,
          createdAt: Date.now()
        };
        db.bots[botId] = newBot;
        saveDB();
        
        responseText = `✅ Бот успешно создан!

🤖 Название: ${newBot.name}
🆔 ID: ${botId}
🔑 Token: ${botToken}

Используйте /setwebhook для настройки webhook или начните разработку с документацией: https://docs.nexus.app`;
        break;
        
      case '/mybots':
        const userBots = Object.values(db.bots).filter(b => b.owner === currentUserId);
        if (userBots.length === 0) {
          responseText = 'У вас пока нет ботов. Создайте первого командой /newbot';
        } else {
          responseText = '🤖 Ваши боты:\n\n' + userBots.map((b, i) => 
            `${i + 1}. ${b.name}\n   ID: ${b.id}\n   Token: ${b.token}`
          ).join('\n\n');
        }
        break;
        
      case '/help':
        responseText = `📚 Справка по командам:

/newbot - создать нового бота
/mybots - показать список ваших ботов
/token <bot_id> - получить токен бота
/setwebhook <bot_id> <url> - настроить webhook
/deletebot <bot_id> - удалить бота
/help - эта справка

Полная документация: https://docs.nexus.app`;
        break;
        
      default:
        responseText = 'Неизвестная команда. Используйте /help для списка команд.';
    }
    
    const responseMsg = {
      id: crypto.randomBytes(8).toString('hex'),
      chatId,
      sender: 'robot_builder_bot',
      text: responseText,
      timestamp: Date.now(),
      type: 'text',
      reactions: {}
    };
    
    db.messages[chatId].push(responseMsg);
    saveDB();
    
    sendToUser(currentUserId, {
      type: 'new_message',
      message: responseMsg
    });
  }
});

// REST API endpoints
app.post('/api/upload', (req, res) => {
  try {
    const { userId, fileData, fileName, fileType } = req.body;
    const user = db.users[userId];
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' }));
    }
    
    const fileSize = fileData.length;
    const limit = fileType === 'image' 
      ? (user.isPremium ? LIMITS.premium.image : LIMITS.free.image)
      : (user.isPremium ? LIMITS.premium.file : LIMITS.free.file);
    
    if (fileSize > limit) {
      return res.status(413).json({ 
        error: 'Файл слишком большой',
        limit,
        size: fileSize
      });
    }
    
    if (!checkDailyLimit(userId, fileSize)) {
      return res.status(429).json({ 
        error: 'Превышен дневной лимит',
        premium: !user.isPremium
      });
    }
    
    res.json({ 
      success: true,
      fileData,
      fileName,
      size: fileSize
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', (req, res) => {
  res.json({
    users: Object.keys(db.users).length,
    chats: Object.keys(db.chats).length,
    groups: Object.keys(db.groups).length,
    channels: Object.keys(db.channels).length,
    messages: Object.values(db.messages).reduce((sum, msgs) => sum + msgs.length, 0)
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  saveDB();
  process.exit(0);
});

const PORT = process.env.PORT || 2222;
server.listen(PORT, () => {
  console.log(`🚀 Nexus Server running on port ${PORT}`);
  console.log(`📊 Users: ${Object.keys(db.users).length}`);
  console.log(`💬 Chats: ${Object.keys(db.chats).length}`);
  console.log(`📢 Channels: ${Object.keys(db.channels).length}`);
});
