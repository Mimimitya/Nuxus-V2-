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
app.use(express.static(__dirname));

const DB_FILE = path.join(__dirname, 'nexus_db.json');

let db = {
  users: {},
  chats: {},
  channels: {},
  groups: {},
  servers: {},
  messages: {},
  unreadCounts: {},
  bots: {},
  dailyUsage: {},
  friends: {},
  friendRequests: {},
  blockedUsers: {},
  pinnedChats: {},
  pinnedMessages: {},
  stickerPacks: {},
  userStickers: {}
};

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const loadedDb = JSON.parse(data);
      
      // Объединяем с дефолтной структурой
      db = {
        users: loadedDb.users || {},
        chats: loadedDb.chats || {},
        channels: loadedDb.channels || {},
        groups: loadedDb.groups || {},
        servers: loadedDb.servers || {},
        messages: loadedDb.messages || {},
        unreadCounts: loadedDb.unreadCounts || {},
        bots: loadedDb.bots || {},
        dailyUsage: loadedDb.dailyUsage || {},
        friends: loadedDb.friends || {},
        friendRequests: loadedDb.friendRequests || {},
        blockedUsers: loadedDb.blockedUsers || {},
        pinnedChats: loadedDb.pinnedChats || {},
        pinnedMessages: loadedDb.pinnedMessages || {},
        stickerPacks: loadedDb.stickerPacks || {},
        userStickers: loadedDb.userStickers || {}
      };
      
      // Инициализируем дефолтных пользователей и ботов если их нет
      if (!db.users['Mimimitya']) {
        db.users['Mimimitya'] = {
          id: 'Mimimitya',
          username: 'Mimimitya',
          password: hashPassword('nexus2026'),
          isSuperAdmin: true,
          isPremium: true,
          verified: true,
          avatar: '👑',
          bio: 'Super Admin',
          status: 'offline',
          sessions: [],
          developerMode: false,
          createdAt: Date.now()
        };
      }
      
      if (!db.users['robot_builder_bot']) {
        db.users['robot_builder_bot'] = {
          id: 'robot_builder_bot',
          username: 'Robot Builder',
          isBot: true,
          avatar: '🤖',
          bio: 'Bot creation assistant',
          status: 'online',
          createdAt: Date.now()
        };
      }
      
      if (!db.users['sticker_bot']) {
        db.users['sticker_bot'] = {
          id: 'sticker_bot',
          username: 'Sticker Bot',
          isBot: true,
          avatar: '🎨',
          bio: 'Sticker pack manager',
          status: 'online',
          createdAt: Date.now()
        };
      }
      
      if (!db.users['support_bot']) {
        db.users['support_bot'] = {
          id: 'support_bot',
          username: 'Support',
          isBot: true,
          avatar: '💬',
          bio: 'Support assistant',
          status: 'online',
          createdAt: Date.now()
        };
      }
      
      if (!db.stickerPacks['default']) {
        db.stickerPacks['default'] = {
          id: 'default',
          name: 'Default Stickers',
          stickers: ['😀', '😂', '❤️', '👍', '🔥', '🎉', '😊', '😎', '🤔', '😍']
        };
      }
      
      console.log('✅ Database loaded');
      saveDB();
    } else {
      initializeDefaultUsers();
      saveDB();
    }
  } catch (error) {
    console.error('Error loading database:', error);
    initializeDefaultUsers();
    saveDB();
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

function initializeDefaultUsers() {
  db.users['Mimimitya'] = {
    id: 'Mimimitya',
    username: 'Mimimitya',
    password: hashPassword('nexus2026'),
    isSuperAdmin: true,
    isPremium: true,
    verified: true,
    avatar: '👑',
    bio: 'Super Admin',
    status: 'offline',
    sessions: [],
    developerMode: false,
    createdAt: Date.now()
  };
  
  db.users['robot_builder_bot'] = {
    id: 'robot_builder_bot',
    username: 'Robot Builder',
    isBot: true,
    avatar: '🤖',
    bio: 'Bot creation assistant',
    status: 'online',
    createdAt: Date.now()
  };
  
  db.users['sticker_bot'] = {
    id: 'sticker_bot',
    username: 'Sticker Bot',
    isBot: true,
    avatar: '🎨',
    bio: 'Sticker pack manager',
    status: 'online',
    createdAt: Date.now()
  };
  
  db.users['support_bot'] = {
    id: 'support_bot',
    username: 'Support',
    isBot: true,
    avatar: '💬',
    bio: 'Support assistant',
    status: 'online',
    createdAt: Date.now()
  };
  
  // Инициализация стикерпаков по умолчанию
  db.stickerPacks['default'] = {
    id: 'default',
    name: 'Default Stickers',
    stickers: ['😀', '😂', '❤️', '👍', '🔥', '🎉', '😊', '😎', '🤔', '😍']
  };
}

loadDB();
setInterval(saveDB, 5000);

const LIMITS = {
  free: { image: 30 * 1024, file: 70 * 1024, daily: 1.5 * 1024 * 1024 },
  premium: { image: 300 * 1024, file: 700 * 1024, daily: 15 * 1024 * 1024 }
};

const connections = new Map();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generateApiKey() {
  return 'nxs_' + crypto.randomBytes(24).toString('hex');
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
      createdAt: Date.now()
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
  
  db.groups[groupId] = {
    id: groupId,
    type: 'group',
    name,
    description: '',
    creator: creatorId,
    admins: [creatorId],
    members: [creatorId, ...members.filter(m => m !== creatorId)],
    createdAt: Date.now(),
    inviteCode,
    avatar: '👥',
    isServer: false
  };
  
  db.messages[groupId] = [];
  db.unreadCounts[groupId] = {};
  saveDB();
  return db.groups[groupId];
}

function createChannel(name, username, description, creatorId) {
  const channelId = 'ch_' + crypto.randomBytes(8).toString('hex');
  const inviteCode = crypto.randomBytes(6).toString('hex');
  
  db.channels[channelId] = {
    id: channelId,
    type: 'channel',
    name,
    username,
    description,
    creator: creatorId,
    admins: [creatorId],
    subscribers: [creatorId],
    createdAt: Date.now(),
    inviteCode
  };
  
  db.messages[channelId] = [];
  db.unreadCounts[channelId] = {};
  saveDB();
  return db.channels[channelId];
}

function createServer(groupId) {
  const group = db.groups[groupId];
  if (!group) return null;
  
  const serverId = 'srv_' + crypto.randomBytes(8).toString('hex');
  
  db.servers[serverId] = {
    id: serverId,
    groupId,
    name: group.name,
    categories: [{
      id: 'cat_default',
      name: 'General',
      channels: [{
        id: 'ch_general',
        name: 'general',
        type: 'text'
      }]
    }],
    roles: [],
    forumChannels: []
  };
  
  group.isServer = true;
  group.serverId = serverId;
  
  saveDB();
  return db.servers[serverId];
}

function incrementUnread(chatId, userId) {
  if (!db.unreadCounts[chatId]) db.unreadCounts[chatId] = {};
  db.unreadCounts[chatId][userId] = (db.unreadCounts[chatId][userId] || 0) + 1;
}

function resetUnread(chatId, userId) {
  if (db.unreadCounts[chatId]) {
    db.unreadCounts[chatId][userId] = 0;
  }
}

function sendBotWelcome(botId, userId, message) {
  const chatId = createChat(botId, userId);
  
  const msg = {
    id: crypto.randomBytes(8).toString('hex'),
    chatId,
    sender: botId,
    text: message,
    timestamp: Date.now(),
    type: 'text',
    reactions: {}
  };
  
  if (!db.messages[chatId]) db.messages[chatId] = [];
  db.messages[chatId].push(msg);
  
  incrementUnread(chatId, userId);
  saveDB();
  
  sendToUser(userId, { type: 'new_message', message: msg });
  return { message: msg, chatId };
}

function sendRobotBuilderWelcome(userId) {
  const apiKey = generateApiKey();
  const user = db.users[userId];
  if (user) user.apiKey = apiKey;
  
  const text = `👋 Добро пожаловать в Robot Builder!

Вы активировали режим разработчика. Ваш API ключ:

${apiKey}

📌 Команды:
/newbot - создать нового бота
/mybots - список ваших ботов
/help - помощь

🔗 API: https://api.nexus.app
📚 Docs: https://docs.nexus.app`;
  
  const result = sendBotWelcome('robot_builder_bot', userId, text);
  saveDB();
  return { ...result, apiKey };
}

wss.on('connection', (ws, req) => {
  let currentUserId = null;
  const clientHost = req.headers.host;
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      
      switch (msg.type) {
        case 'auth': handleAuth(ws, msg); break;
        case 'register': handleRegister(ws, msg); break;
        case 'message': handleMessage(ws, msg); break;
        case 'edit_message': handleEditMessage(ws, msg); break;
        case 'delete_message': handleDeleteMessage(ws, msg); break;
        case 'forward_message': handleForwardMessage(ws, msg); break;
        case 'reaction': handleReaction(ws, msg); break;
        case 'create_channel': handleCreateChannel(ws, msg); break;
        case 'create_group': handleCreateGroup(ws, msg); break;
        case 'update_profile': handleUpdateProfile(ws, msg); break;
        case 'search_users': handleSearchUsers(ws, msg); break;
        case 'send_friend_request': handleSendFriendRequest(ws, msg); break;
        case 'accept_friend_request': handleAcceptFriendRequest(ws, msg); break;
        case 'reject_friend_request': handleRejectFriendRequest(ws, msg); break;
        case 'remove_friend': handleRemoveFriend(ws, msg); break;
        case 'block_user': handleBlockUser(ws, msg); break;
        case 'unblock_user': handleUnblockUser(ws, msg); break;
        case 'pin_chat': handlePinChat(ws, msg); break;
        case 'unpin_chat': handleUnpinChat(ws, msg); break;
        case 'pin_message': handlePinMessage(ws, msg); break;
        case 'unpin_message': handleUnpinMessage(ws, msg); break;
        case 'invite_to_channel': handleInviteToChannel(ws, msg); break;
        case 'accept_channel_invite': handleAcceptChannelInvite(ws, msg); break;
        case 'convert_to_server': handleConvertToServer(ws, msg); break;
        case 'create_server_channel': handleCreateServerChannel(ws, msg); break;
        case 'create_server_role': handleCreateServerRole(ws, msg); break;
        case 'send_sticker': handleSendSticker(ws, msg); break;
        case 'create_sticker_pack': handleCreateStickerPack(ws, msg); break;
        case 'mark_read': handleMarkRead(ws, msg); break;
        case 'toggle_developer_mode': handleToggleDeveloperMode(ws, msg); break;
        case 'admin_action': handleAdminAction(ws, msg); break;
        case 'typing': handleTyping(ws, msg); break;
        case 'bot_command': handleBotCommand(ws, msg); break;
        default: console.log('Unknown:', msg.type);
      }
    } catch (error) {
      console.error('Error:', error);
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
    if (!db.users) {
      ws.send(JSON.stringify({ type: 'auth_failed', error: 'Database error' }));
      return;
    }
    
    const user = Object.values(db.users).find(
      u => u.username === msg.username && u.password === hashPassword(msg.password)
    );
    
    if (user) {
      if (user.banned) {
        ws.send(JSON.stringify({ type: 'auth_failed', error: 'Вы забанены' }));
        return;
      }
      
      user.status = 'online';
      user.lastSeen = Date.now();
      currentUserId = user.id;
      connections.set(user.id, ws);
      
      const userData = { ...user };
      delete userData.password;
      
      // Инициализируем структуры если их нет
      if (!db.friends) db.friends = {};
      if (!db.friendRequests) db.friendRequests = {};
      if (!db.blockedUsers) db.blockedUsers = {};
      if (!db.pinnedChats) db.pinnedChats = {};
      if (!db.pinnedMessages) db.pinnedMessages = {};
      if (!db.userStickers) db.userStickers = {};
      
      if (!db.friends[user.id]) db.friends[user.id] = [];
      if (!db.friendRequests[user.id]) db.friendRequests[user.id] = [];
      if (!db.blockedUsers[user.id]) db.blockedUsers[user.id] = [];
      if (!db.pinnedChats[user.id]) db.pinnedChats[user.id] = [];
      if (!db.pinnedMessages[user.id]) db.pinnedMessages[user.id] = {};
      if (!db.userStickers[user.id]) db.userStickers[user.id] = ['default'];
      
      // Получаем список друзей
      const userFriends = db.friends[user.id] || [];
      
      // Чаты только с друзьями
      const userChats = Object.values(db.chats).filter(chat =>
        chat.participants.includes(user.id) &&
        chat.participants.some(p => userFriends.includes(p) || p.includes('_bot'))
      );
      
      const userGroups = Object.values(db.groups).filter(group =>
        group.members.includes(user.id)
      );
      
      const userChannels = Object.values(db.channels).filter(channel =>
        channel.subscribers.includes(user.id) || channel.admins.includes(user.id)
      );
      
      const allMessages = {};
      const allUnread = {};
      [...userChats, ...userGroups, ...userChannels].forEach(item => {
        allMessages[item.id] = db.messages[item.id] || [];
        allUnread[item.id] = db.unreadCounts[item.id]?.[user.id] || 0;
      });
      
      const allUsers = Object.values(db.users).map(u => {
        const data = { ...u };
        delete data.password;
        return data;
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
        friends: userFriends,
        friendRequests: db.friendRequests[user.id] || [],
        blockedUsers: db.blockedUsers[user.id] || [],
        pinnedChats: db.pinnedChats[user.id] || [],
        pinnedMessages: db.pinnedMessages[user.id] || {},
        stickerPacks: db.stickerPacks,
        userStickers: db.userStickers[user.id] || ['default'],
        serverHost: clientHost
      }));
      
      broadcast({ type: 'user_status', userId: user.id, status: 'online' }, user.id);
    } else {
      ws.send(JSON.stringify({ type: 'auth_failed', error: 'Неверный логин или пароль' }));
    }
  }
  
  function handleRegister(ws, msg) {
    if (!db.users) {
      db.users = {};
    }
    
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
      avatar: '👤',
      bio: '',
      status: 'offline',
      sessions: [],
      createdAt: Date.now(),
      developerMode: false
    };
    
    db.users[newUser.id] = newUser;
    
    // Инициализируем структуры для нового пользователя
    if (!db.friends) db.friends = {};
    if (!db.friendRequests) db.friendRequests = {};
    if (!db.blockedUsers) db.blockedUsers = {};
    if (!db.pinnedChats) db.pinnedChats = {};
    if (!db.pinnedMessages) db.pinnedMessages = {};
    if (!db.userStickers) db.userStickers = {};
    
    db.friends[newUser.id] = [];
    db.friendRequests[newUser.id] = [];
    db.blockedUsers[newUser.id] = [];
    db.pinnedChats[newUser.id] = [];
    db.pinnedMessages[newUser.id] = {};
    db.userStickers[newUser.id] = ['default'];
    
    saveDB();
    
    ws.send(JSON.stringify({ type: 'register_success' }));
  }
  
  function handleMessage(ws, msg) {
    const user = db.users[currentUserId];
    if (!user || user.muted || user.banned) {
      ws.send(JSON.stringify({ type: 'error', error: 'Вы не можете отправлять сообщения' }));
      return;
    }
    
    const chatId = msg.chatId;
    if (!db.messages[chatId]) db.messages[chatId] = [];
    
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
      formatting: msg.formatting || null,
      forwarded: msg.forwarded || false,
      forwardedFrom: msg.forwardedFrom || null
    };
    
    db.messages[chatId].push(newMessage);
    
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
    broadcast({ type: 'new_message', message: newMessage });
  }
  
  function handleForwardMessage(ws, msg) {
    const originalMsg = (db.messages[msg.fromChatId] || []).find(m => m.id === msg.messageId);
    if (!originalMsg) return;
    
    msg.toChatIds.forEach(chatId => {
      const forwarded = {
        id: crypto.randomBytes(8).toString('hex'),
        chatId,
        sender: currentUserId,
        text: originalMsg.text,
        timestamp: Date.now(),
        type: originalMsg.type,
        reactions: {},
        fileData: originalMsg.fileData,
        fileName: originalMsg.fileName,
        forwarded: true,
        forwardedFrom: originalMsg.sender,
        forwardedOriginalTime: originalMsg.timestamp
      };
      
      if (!db.messages[chatId]) db.messages[chatId] = [];
      db.messages[chatId].push(forwarded);
      
      broadcast({ type: 'new_message', message: forwarded });
    });
    
    saveDB();
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
  
  function handleSearchUsers(ws, msg) {
    const query = msg.query.toLowerCase();
    const results = Object.values(db.users)
      .filter(u => !u.isBot && u.username.toLowerCase().includes(query))
      .map(u => {
        const userData = { ...u };
        delete userData.password;
        const isFriend = (db.friends[currentUserId] || []).includes(u.id);
        const hasRequest = (db.friendRequests[u.id] || []).some(r => r.from === currentUserId);
        userData.isFriend = isFriend;
        userData.hasPendingRequest = hasRequest;
        return userData;
      })
      .slice(0, 10);
    
    ws.send(JSON.stringify({
      type: 'search_results',
      results
    }));
  }
  
  function handleSendFriendRequest(ws, msg) {
    const targetUser = db.users[msg.targetUserId];
    if (!targetUser) return;
    
    if (!db.friendRequests[msg.targetUserId]) db.friendRequests[msg.targetUserId] = [];
    
    const existing = db.friendRequests[msg.targetUserId].find(r => r.from === currentUserId);
    if (!existing) {
      db.friendRequests[msg.targetUserId].push({
        from: currentUserId,
        timestamp: Date.now()
      });
      
      saveDB();
      
      sendToUser(msg.targetUserId, {
        type: 'friend_request',
        from: currentUserId,
        user: db.users[currentUserId]
      });
    }
  }
  
  function handleAcceptFriendRequest(ws, msg) {
    if (!db.friends[currentUserId]) db.friends[currentUserId] = [];
    if (!db.friends[msg.userId]) db.friends[msg.userId] = [];
    
    db.friends[currentUserId].push(msg.userId);
    db.friends[msg.userId].push(currentUserId);
    
    db.friendRequests[currentUserId] = (db.friendRequests[currentUserId] || [])
      .filter(r => r.from !== msg.userId);
    
    const chatId = createChat(currentUserId, msg.userId);
    
    saveDB();
    
    sendToUser(msg.userId, {
      type: 'friend_added',
      friendId: currentUserId,
      chatId
    });
    
    ws.send(JSON.stringify({
      type: 'friend_added',
      friendId: msg.userId,
      chatId
    }));
  }
  
  function handleRejectFriendRequest(ws, msg) {
    db.friendRequests[currentUserId] = (db.friendRequests[currentUserId] || [])
      .filter(r => r.from !== msg.userId);
    saveDB();
  }
  
  function handleRemoveFriend(ws, msg) {
    db.friends[currentUserId] = (db.friends[currentUserId] || [])
      .filter(id => id !== msg.userId);
    db.friends[msg.userId] = (db.friends[msg.userId] || [])
      .filter(id => id !== currentUserId);
    
    saveDB();
    
    sendToUser(msg.userId, {
      type: 'friend_removed',
      userId: currentUserId
    });
  }
  
  function handleBlockUser(ws, msg) {
    if (!db.blockedUsers[currentUserId]) db.blockedUsers[currentUserId] = [];
    if (!db.blockedUsers[currentUserId].includes(msg.userId)) {
      db.blockedUsers[currentUserId].push(msg.userId);
      saveDB();
    }
  }
  
  function handleUnblockUser(ws, msg) {
    db.blockedUsers[currentUserId] = (db.blockedUsers[currentUserId] || [])
      .filter(id => id !== msg.userId);
    saveDB();
  }
  
  function handlePinChat(ws, msg) {
    if (!db.pinnedChats[currentUserId]) db.pinnedChats[currentUserId] = [];
    if (!db.pinnedChats[currentUserId].includes(msg.chatId)) {
      db.pinnedChats[currentUserId].push(msg.chatId);
      saveDB();
    }
  }
  
  function handleUnpinChat(ws, msg) {
    db.pinnedChats[currentUserId] = (db.pinnedChats[currentUserId] || [])
      .filter(id => id !== msg.chatId);
    saveDB();
  }
  
  function handlePinMessage(ws, msg) {
    if (!db.pinnedMessages[currentUserId]) db.pinnedMessages[currentUserId] = {};
    db.pinnedMessages[currentUserId][msg.chatId] = msg.messageId;
    saveDB();
    
    broadcast({
      type: 'message_pinned',
      chatId: msg.chatId,
      messageId: msg.messageId
    });
  }
  
  function handleUnpinMessage(ws, msg) {
    if (db.pinnedMessages[currentUserId]) {
      delete db.pinnedMessages[currentUserId][msg.chatId];
      saveDB();
    }
  }
  
  function handleInviteToChannel(ws, msg) {
    const targetUser = db.users[msg.targetUsername];
    if (!targetUser) return;
    
    const channel = db.channels[msg.channelId] || db.groups[msg.channelId];
    if (!channel) return;
    
    sendToUser(targetUser.id, {
      type: 'channel_invite',
      from: currentUserId,
      fromUser: db.users[currentUserId],
      channel,
      channelId: msg.channelId
    });
  }
  
  function handleAcceptChannelInvite(ws, msg) {
    const channel = db.channels[msg.channelId];
    const group = db.groups[msg.channelId];
    
    if (channel) {
      if (!channel.subscribers.includes(currentUserId)) {
        channel.subscribers.push(currentUserId);
        saveDB();
      }
    } else if (group) {
      if (!group.members.includes(currentUserId)) {
        group.members.push(currentUserId);
        saveDB();
      }
    }
    
    ws.send(JSON.stringify({
      type: 'joined_channel',
      channel: channel || group
    }));
  }
  
  function handleConvertToServer(ws, msg) {
    const group = db.groups[msg.groupId];
    if (!group || !group.admins.includes(currentUserId)) return;
    
    const server = createServer(msg.groupId);
    
    broadcast({
      type: 'server_created',
      server,
      groupId: msg.groupId
    });
  }
  
  function handleCreateServerChannel(ws, msg) {
    const server = db.servers[msg.serverId];
    if (!server) return;
    
    const category = server.categories.find(c => c.id === msg.categoryId);
    if (!category) return;
    
    category.channels.push({
      id: 'ch_' + crypto.randomBytes(6).toString('hex'),
      name: msg.channelName,
      type: msg.channelType || 'text'
    });
    
    saveDB();
    broadcast({
      type: 'server_updated',
      server
    });
  }
  
  function handleCreateServerRole(ws, msg) {
    const server = db.servers[msg.serverId];
    if (!server) return;
    
    server.roles.push({
      id: 'role_' + crypto.randomBytes(6).toString('hex'),
      name: msg.roleName,
      color: msg.roleColor,
      permissions: msg.permissions || []
    });
    
    saveDB();
    broadcast({
      type: 'server_updated',
      server
    });
  }
  
  function handleSendSticker(ws, msg) {
    const chatId = msg.chatId;
    if (!db.messages[chatId]) db.messages[chatId] = [];
    
    const stickerMsg = {
      id: crypto.randomBytes(8).toString('hex'),
      chatId,
      sender: currentUserId,
      timestamp: Date.now(),
      type: 'sticker',
      sticker: msg.sticker,
      reactions: {}
    };
    
    db.messages[chatId].push(stickerMsg);
    saveDB();
    
    broadcast({ type: 'new_message', message: stickerMsg });
  }
  
  function handleCreateStickerPack(ws, msg) {
    const packId = 'pack_' + crypto.randomBytes(8).toString('hex');
    
    db.stickerPacks[packId] = {
      id: packId,
      name: msg.name,
      stickers: msg.stickers,
      creator: currentUserId
    };
    
    if (!db.userStickers[currentUserId]) db.userStickers[currentUserId] = ['default'];
    db.userStickers[currentUserId].push(packId);
    
    saveDB();
    
    ws.send(JSON.stringify({
      type: 'sticker_pack_created',
      pack: db.stickerPacks[packId]
    }));
  }
  
  function handleCreateChannel(ws, msg) {
    const channel = createChannel(msg.name, msg.username, msg.description, currentUserId);
    channel.inviteLink = `http://${clientHost}/join/${msg.username}`;
    
    ws.send(JSON.stringify({ type: 'channel_created', channel }));
    broadcast({ type: 'channel_created', channel }, currentUserId);
  }
  
  function handleCreateGroup(ws, msg) {
    const group = createGroup(msg.name, currentUserId, msg.members || []);
    group.inviteLink = `http://${clientHost}/join/g/${group.inviteCode}`;
    
    ws.send(JSON.stringify({ type: 'group_created', group }));
    
    group.members.forEach(memberId => {
      if (memberId !== currentUserId) {
        sendToUser(memberId, { type: 'group_created', group });
      }
    });
  }
  
  function handleUpdateProfile(ws, msg) {
    const user = db.users[currentUserId];
    if (user) {
      if (msg.avatar) user.avatar = msg.avatar;
      if (msg.bio !== undefined) user.bio = msg.bio;
      
      saveDB();
      
      const userData = { ...user };
      delete userData.password;
      
      broadcast({ type: 'user_updated', user: userData });
      ws.send(JSON.stringify({ type: 'profile_updated', user: userData }));
    }
  }
  
  function handleMarkRead(ws, msg) {
    resetUnread(msg.chatId, currentUserId);
    saveDB();
    
    ws.send(JSON.stringify({
      type: 'unread_updated',
      chatId: msg.chatId,
      count: 0
    }));
  }
  
  function handleToggleDeveloperMode(ws, msg) {
    const user = db.users[currentUserId];
    if (user) {
      user.developerMode = msg.enabled;
      
      if (msg.enabled) {
        const chatId = createChat('robot_builder_bot', currentUserId);
        const result = sendRobotBuilderWelcome(currentUserId);
        
        if (!db.friends[currentUserId]) db.friends[currentUserId] = [];
        if (!db.friends[currentUserId].includes('robot_builder_bot')) {
          db.friends[currentUserId].push('robot_builder_bot');
        }
        
        const userChats = Object.values(db.chats).filter(chat =>
          chat.participants.includes(currentUserId)
        );
        
        ws.send(JSON.stringify({
          type: 'developer_mode_updated',
          enabled: true,
          apiKey: result.apiKey,
          chats: userChats,
          newChatId: chatId
        }));
      } else {
        ws.send(JSON.stringify({
          type: 'developer_mode_updated',
          enabled: false
        }));
      }
      
      saveDB();
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
          if (targetWs) targetWs.close();
        }
        break;
      case 'toggle_mute':
        targetUser.muted = !targetUser.muted;
        break;
    }
    
    saveDB();
    
    const userData = { ...targetUser };
    delete userData.password;
    broadcast({ type: 'user_updated', user: userData });
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
        
        responseText = `✅ Бот создан!\n\n🤖 ${newBot.name}\n🆔 ${botId}\n🔑 ${botToken}`;
        break;
        
      case '/mybots':
        const userBots = Object.values(db.bots).filter(b => b.owner === currentUserId);
        responseText = userBots.length === 0 ? 
          'У вас нет ботов. /newbot' : 
          '🤖 Ваши боты:\n\n' + userBots.map((b, i) => `${i + 1}. ${b.name}\nID: ${b.id}`).join('\n\n');
        break;
        
      case '/help':
        responseText = `📚 Команды:\n\n/newbot - создать бота\n/mybots - список ботов\n/help - справка`;
        break;
        
      default:
        responseText = 'Неизвестная команда. /help';
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
    
    sendToUser(currentUserId, { type: 'new_message', message: responseMsg });
  }
});

app.get('/join/:username', (req, res) => res.redirect('/'));
app.get('/join/g/:code', (req, res) => res.redirect('/'));

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  saveDB();
  process.exit(0);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Nexus Server on port ${PORT}`);
  console.log(`👥 Users: ${Object.keys(db.users).length}`);
  console.log(`💬 Chats: ${Object.keys(db.chats).length}`);
});
