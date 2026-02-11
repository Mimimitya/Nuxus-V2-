<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nexus</title>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; overflow: hidden; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
.message-animation { animation: slideIn 0.3s ease-out; }
@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.context-menu { animation: fadeIn 0.15s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.typing-indicator span { animation: typing 1.4s infinite; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } }
.unread-badge { animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
.send-animation { animation: sendPulse 0.4s ease-out; }
@keyframes sendPulse { 0% { transform: scale(1); } 50% { transform: scale(0.9); } 100% { transform: scale(1); } }
.format-btn.active { background: rgba(147, 51, 234, 0.3); }
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
const { useState, useEffect, useRef } = React;

const Icons = {
Send: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
Phone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
Video: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/></svg>,
Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
Hash: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
Image: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
File: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>,
X: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
LogOut: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
Crown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
Shield: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
Moon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
Sun: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
Reply: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>,
Copy: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
Code: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
UserPlus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
};

function NexusApp() {
const [ws, setWs] = useState(null);
const [view, setView] = useState('login');
const [currentUser, setCurrentUser] = useState(null);
const [users, setUsers] = useState({});
const [chats, setChats] = useState([]);
const [groups, setGroups] = useState([]);
const [channels, setChannels] = useState([]);
const [messages, setMessages] = useState({});
const [unreadCounts, setUnreadCounts] = useState({});
const [activeChat, setActiveChat] = useState(null);
const [activeChatType, setActiveChatType] = useState('chat');
const [inputMessage, setInputMessage] = useState('');
const [sidebarView, setSidebarView] = useState('chats');
const [searchQuery, setSearchQuery] = useState('');
const [theme, setTheme] = useState('dark');
const [showSettings, setShowSettings] = useState(false);
const [showCreateModal, setShowCreateModal] = useState(null);
const [showInviteLink, setShowInviteLink] = useState(false);
const [showAdminPanel, setShowAdminPanel] = useState(false);
const [showSearchUsers, setShowSearchUsers] = useState(false);
const [loginForm, setLoginForm] = useState({ username: '', password: '' });
const [registerForm, setRegisterForm] = useState({ username: '', password: '', confirmPassword: '' });
const [isRegistering, setIsRegistering] = useState(false);
const [selectedFiles, setSelectedFiles] = useState([]);
const [contextMenu, setContextMenu] = useState(null);
const [editingMessage, setEditingMessage] = useState(null);
const [replyingTo, setReplyingTo] = useState(null);
const [typingUsers, setTypingUsers] = useState({});
const [onlineUsers, setOnlineUsers] = useState(new Set());
const [inviteLink, setInviteLink] = useState('');
const [apiKey, setApiKey] = useState('');
const [sessions, setSessions] = useState([]);
const [serverHost, setServerHost] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [channelForm, setChannelForm] = useState({ name: '', username: '', description: '' });
const [groupForm, setGroupForm] = useState({ name: '', description: '', members: [] });
const [formatting, setFormatting] = useState({ bold: false, italic: false, underline: false, strikethrough: false });

const fileInputRef = useRef(null);
const imageInputRef = useRef(null);
const messagesEndRef = useRef(null);
const typingTimeoutRef = useRef(null);

useEffect(() => {
connectWebSocket();
return () => ws?.close();
}, []);

useEffect(() => {
messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages, activeChat]);

useEffect(() => {
const handleClickOutside = () => setContextMenu(null);
document.addEventListener('click', handleClickOutside);
return () => document.removeEventListener('click', handleClickOutside);
}, []);

const connectWebSocket = () => {
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const websocket = new WebSocket(`${protocol}//${window.location.host}`);

websocket.onopen = () => {
console.log('Connected to Nexus');
setWs(websocket);
};

websocket.onmessage = (event) => {
const data = JSON.parse(event.data);
handleWebSocketMessage(data);
};

websocket.onerror = (error) => {
console.error('WebSocket error:', error);
};

websocket.onclose = () => {
console.log('Disconnected');
setTimeout(connectWebSocket, 3000);
};
};

const handleWebSocketMessage = (data) => {
switch (data.type) {
case 'auth_success':
setCurrentUser(data.user);
setUsers(data.users.reduce((acc, u) => ({ ...acc, [u.id]: u }), {}));
setChats(data.chats || []);
setGroups(data.groups || []);
setChannels(data.channels || []);
setMessages(data.messages || {});
setUnreadCounts(data.unreadCounts || {});
setSessions(data.user.sessions || []);
setApiKey(data.user.apiKey || '');
setServerHost(data.serverHost || window.location.host);
setView('messenger');
setOnlineUsers(new Set(data.users.filter(u => u.status === 'online').map(u => u.id)));
break;
case 'auth_failed':
case 'register_failed':
alert(data.error);
break;
case 'register_success':
alert('Регистрация успешна! Войдите');
setIsRegistering(false);
break;
case 'new_message':
setMessages(prev => ({
...prev,
[data.message.chatId]: [...(prev[data.message.chatId] || []), data.message]
}));
if (data.message.sender !== currentUser?.id) {
setUnreadCounts(prev => ({
...prev,
[data.message.chatId]: (prev[data.message.chatId] || 0) + 1
}));
}
break;
case 'message_edited':
setMessages(prev => {
const chatMessages = prev[data.chatId] || [];
return {
...prev,
[data.chatId]: chatMessages.map(m =>
m.id === data.messageId ? { ...m, text: data.text, edited: true, editedAt: data.editedAt, formatting: data.formatting } : m
)
};
});
break;
case 'message_deleted':
setMessages(prev => ({
...prev,
[data.chatId]: (prev[data.chatId] || []).filter(m => m.id !== data.messageId)
}));
break;
case 'reaction_updated':
setMessages(prev => {
const chatMessages = prev[data.chatId] || [];
return {
...prev,
[data.chatId]: chatMessages.map(m =>
m.id === data.messageId ? { ...m, reactions: data.reactions } : m
)
};
});
break;
case 'channel_created':
case 'group_created':
if (data.channel) {
setChannels(prev => [...prev, data.channel]);
} else if (data.group) {
setGroups(prev => [...prev, data.group]);
}
break;
case 'channel_updated':
setChannels(prev => prev.map(ch => ch.id === data.channel.id ? data.channel : ch));
break;
case 'group_updated':
setGroups(prev => prev.map(gr => gr.id === data.group.id ? data.group : gr));
break;
case 'user_status':
setUsers(prev => ({
...prev,
[data.userId]: { ...prev[data.userId], status: data.status }
}));
setOnlineUsers(prev => {
const updated = new Set(prev);
if (data.status === 'online') updated.add(data.userId);
else updated.delete(data.userId);
return updated;
});
break;
case 'user_updated':
setUsers(prev => ({
...prev,
[data.user.id]: { ...prev[data.user.id], ...data.user }
}));
break;
case 'developer_mode_updated':
if (data.apiKey) setApiKey(data.apiKey);
break;
case 'typing':
setTypingUsers(prev => ({
...prev,
[data.chatId]: { ...prev[data.chatId], [data.userId]: data.isTyping }
}));
break;
case 'search_results':
setSearchResults(data.results);
break;
case 'unread_updated':
setUnreadCounts(prev => ({
...prev,
[data.chatId]: data.count
}));
break;
case 'error':
alert(data.error);
break;
}
};

const sendWsMessage = (data) => {
if (ws && ws.readyState === WebSocket.OPEN) {
ws.send(JSON.stringify(data));
}
};

const handleLogin = () => {
sendWsMessage({
type: 'auth',
username: loginForm.username,
password: loginForm.password,
device: 'Web Browser'
});
};

const handleRegister = () => {
if (registerForm.password !== registerForm.confirmPassword) {
alert('Пароли не совпадают');
return;
}
sendWsMessage({
type: 'register',
username: registerForm.username,
password: registerForm.password
});
};

const compressImage = async (file) => {
return new Promise((resolve) => {
const reader = new FileReader();
reader.onload = (e) => {
const img = new Image();
img.onload = () => {
const canvas = document.createElement('canvas');
let width = img.width;
let height = img.height;
const maxSize = 800;
if (width > height && width > maxSize) {
height *= maxSize / width;
width = maxSize;
} else if (height > maxSize) {
width *= maxSize / height;
height = maxSize;
}
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0, width, height);
let quality = 0.7;
let compressed = canvas.toDataURL('image/jpeg', quality);
const limit = currentUser.isPremium ? 300 * 1024 : 30 * 1024;
while (compressed.length > limit && quality > 0.1) {
quality -= 0.1;
compressed = canvas.toDataURL('image/jpeg', quality);
}
resolve({ data: compressed, size: compressed.length, name: file.name });
};
img.src = e.target.result;
};
reader.readAsDataURL(file);
});
};

const compressFile = async (file) => {
return new Promise((resolve) => {
const reader = new FileReader();
reader.onload = (e) => {
let data = e.target.result;
const limit = currentUser.isPremium ? 700 * 1024 : 70 * 1024;
if (data.length > limit) {
data = data.substring(0, limit);
}
resolve({ data, size: data.length, name: file.name });
};
reader.readAsDataURL(file);
});
};

const handleFileSelect = async (e, type) => {
const files = Array.from(e.target.files);
const processed = [];
for (const file of files) {
const compressed = type === 'image' ? await compressImage(file) : await compressFile(file);
processed.push({ ...compressed, type });
}
setSelectedFiles([...selectedFiles, ...processed]);
};

const sendMessage = () => {
if (!inputMessage.trim() && selectedFiles.length === 0) return;

const chatId = activeChat;

const formattingData = {
bold: formatting.bold,
italic: formatting.italic,
underline: formatting.underline,
strikethrough: formatting.strikethrough
};

if (editingMessage) {
sendWsMessage({
type: 'edit_message',
chatId,
messageId: editingMessage.id,
text: inputMessage,
formatting: formattingData
});
setEditingMessage(null);
} else {
if (inputMessage.trim()) {
sendWsMessage({
type: 'message',
chatId,
text: inputMessage,
messageType: 'text',
replyTo: replyingTo?.id,
formatting: formattingData
});
}

selectedFiles.forEach(file => {
sendWsMessage({
type: 'message',
chatId,
messageType: file.type,
fileData: file.data,
fileName: file.name
});
});
}

setInputMessage('');
setSelectedFiles([]);
setReplyingTo(null);
setFormatting({ bold: false, italic: false, underline: false, strikethrough: false });
sendTyping(false);

// Mark as read
sendWsMessage({ type: 'mark_read', chatId });
};

const sendTyping = (isTyping) => {
sendWsMessage({ type: 'typing', chatId: activeChat, isTyping });
};

const handleInputChange = (e) => {
setInputMessage(e.target.value);
if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
sendTyping(true);
typingTimeoutRef.current = setTimeout(() => sendTyping(false), 2000);
};

const addReaction = (messageId, emoji) => {
sendWsMessage({ type: 'reaction', chatId: activeChat, messageId, emoji });
};

const deleteMessage = (messageId) => {
sendWsMessage({ type: 'delete_message', chatId: activeChat, messageId });
setContextMenu(null);
};

const startEditMessage = (message) => {
setEditingMessage(message);
setInputMessage(message.text);
if (message.formatting) {
setFormatting(message.formatting);
}
setContextMenu(null);
};

const startReply = (message) => {
setReplyingTo(message);
setContextMenu(null);
};

const copyMessageText = (text) => {
navigator.clipboard.writeText(text);
setContextMenu(null);
};

const createChannel = () => {
if (!channelForm.name || !channelForm.username) {
alert('Заполните все поля');
return;
}
sendWsMessage({
type: 'create_channel',
name: channelForm.name,
username: channelForm.username,
description: channelForm.description
});
setChannelForm({ name: '', username: '', description: '' });
setShowCreateModal(null);
};

const createGroup = () => {
if (!groupForm.name) {
alert('Введите название группы');
return;
}
sendWsMessage({
type: 'create_group',
name: groupForm.name,
description: groupForm.description,
members: groupForm.members
});
setGroupForm({ name: '', description: '', members: [] });
setShowCreateModal(null);
};

const searchUsers = () => {
if (searchQuery) {
sendWsMessage({ type: 'search_users', query: searchQuery });
setShowSearchUsers(true);
}
};

const generateInviteLink = () => {
const current = activeChatType === 'channel' ?
channels.find(ch => ch.id === activeChat) :
activeChatType === 'group' ?
groups.find(gr => gr.id === activeChat) : null;

if (current && current.inviteLink) {
setInviteLink(current.inviteLink);
} else {
const code = Math.random().toString(36).substring(2, 10);
setInviteLink(`http://${serverHost}/invite/${code}`);
}
setShowInviteLink(true);
};

const toggleDeveloperMode = (enabled) => {
sendWsMessage({ type: 'toggle_developer_mode', enabled });
};

const adminAction = (targetUserId, action) => {
sendWsMessage({ type: 'admin_action', targetUserId, action });
};

const logout = () => {
ws?.close();
setCurrentUser(null);
setView('login');
};

const handleContextMenu = (e, message) => {
e.preventDefault();
setContextMenu({ x: e.clientX, y: e.clientY, message });
};

const formatText = (type) => {
setFormatting(prev => ({ ...prev, [type]: !prev[type] }));
};

const applyFormatting = (text, fmt) => {
if (!fmt) return text;
let result = text;
if (fmt.bold) result = <strong>{result}</strong>;
if (fmt.italic) result = <em>{result}</em>;
if (fmt.underline) result = <u>{result}</u>;
if (fmt.strikethrough) result = <s>{result}</s>;
return result;
};

const chatMessages = activeChat && messages[activeChat] ? messages[activeChat] : [];
const isTyping = typingUsers[activeChat];

// Login View
if (view === 'login') {
return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
<div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md border border-gray-700/50">
<div className="text-center mb-8">
<div className="text-7xl mb-4">⬡</div>
<h1 className="text-4xl font-bold text-white mb-2">Nexus</h1>
<p className="text-gray-400 text-sm">Secure Messaging Platform</p>
</div>

{!isRegistering ? (
<div className="space-y-4">
<input type="text" placeholder="Username" value={loginForm.username}
onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
className="w-full px-5 py-3.5 bg-gray-800/80 text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
<input type="password" placeholder="Password" value={loginForm.password}
onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
className="w-full px-5 py-3.5 bg-gray-800/80 text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none"
onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
<button onClick={handleLogin}
className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg">
Sign In
</button>
<button onClick={() => setIsRegistering(true)}
className="w-full py-3.5 bg-gray-800/80 text-white rounded-xl font-semibold hover:bg-gray-700/80 border border-gray-700">
Create Account
</button>
<p className="text-xs text-gray-500 text-center mt-4">
Demo: Mimimitya / nexus2026
</p>
</div>
) : (
<div className="space-y-4">
<input type="text" placeholder="Username" value={registerForm.username}
onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
className="w-full px-5 py-3.5 bg-gray-800/80 text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none" />
<input type="password" placeholder="Password" value={registerForm.password}
onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
className="w-full px-5 py-3.5 bg-gray-800/80 text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none" />
<input type="password" placeholder="Confirm Password" value={registerForm.confirmPassword}
onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
className="w-full px-5 py-3.5 bg-gray-800/80 text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none" />
<button onClick={handleRegister}
className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 shadow-lg">
Register
</button>
<button onClick={() => setIsRegistering(false)}
className="w-full py-3.5 bg-gray-800/80 text-white rounded-xl font-semibold hover:bg-gray-700/80 border border-gray-700">
Back
</button>
</div>
)}
</div>
</div>
);
}

// Main Messenger
return (
<div className={`h-screen flex ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
{/* Sidebar */}
<div className={`w-80 flex flex-col ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r`}>
<div className={`p-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
<div className="flex items-center justify-between mb-3">
<h2 className="text-xl font-bold flex items-center gap-2">
<span className="text-2xl">⬡</span> Nexus
{currentUser?.isPremium && <Icons.Crown />}
</h2>
<div className="flex gap-2">
<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 hover:bg-gray-700/50 rounded-lg">
{theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
</button>
<button onClick={() => setShowSettings(!showSettings)} className="p-2 hover:bg-gray-700/50 rounded-lg">
<Icons.Settings />
</button>
</div>
</div>
<div className="relative">
<div className="absolute left-3 top-2.5"><Icons.Search /></div>
<input type="text" placeholder="Search..." value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
className={`w-full pl-10 pr-4 py-2 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`} />
</div>
</div>

<div className={`flex ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50'} border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
<button onClick={() => setSidebarView('chats')}
className={`flex-1 py-3 text-sm font-medium ${sidebarView === 'chats' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-500'}`}>
Chats
</button>
<button onClick={() => setSidebarView('groups')}
className={`flex-1 py-3 text-sm font-medium ${sidebarView === 'groups' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-500'}`}>
Groups
</button>
<button onClick={() => setSidebarView('channels')}
className={`flex-1 py-3 text-sm font-medium ${sidebarView === 'channels' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-500'}`}>
Channels
</button>
</div>

<div className="flex-1 overflow-y-auto custom-scrollbar">
{sidebarView === 'chats' && Object.values(users).filter(u => u.id !== currentUser?.id && !u.isBot).map(user => (
<div key={user.id} onClick={() => { setActiveChat([currentUser.id, user.id].sort().join('_')); setActiveChatType('chat'); }}
className={`p-4 cursor-pointer ${activeChat === [currentUser.id, user.id].sort().join('_') ? 'bg-purple-600/20' : 'hover:bg-gray-800/30'} border-b border-gray-800`}>
<div className="flex items-center gap-3">
<div className="relative">
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">{user.avatar}</div>
{onlineUsers.has(user.id) && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900"></div>}
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center gap-1.5">
<span className="font-semibold truncate">{user.username}</span>
{user.verified && <span className="text-blue-400 text-sm">✓</span>}
{user.isPremium && <Icons.Crown />}
</div>
<p className="text-sm text-gray-500 truncate">{user.status}</p>
</div>
{unreadCounts[[currentUser.id, user.id].sort().join('_')] > 0 && (
<div className="unread-badge bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
{unreadCounts[[currentUser.id, user.id].sort().join('_')]}
</div>
)}
</div>
</div>
))}

{sidebarView === 'groups' && (
<>
<button onClick={() => setShowCreateModal('group')}
className="w-full p-4 flex items-center gap-3 hover:bg-gray-800/30 border-b border-gray-800">
<div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center"><Icons.Plus /></div>
<span className="font-semibold">Create Group</span>
</button>
{groups.map(group => (
<div key={group.id} onClick={() => { setActiveChat(group.id); setActiveChatType('group'); }}
className={`p-4 cursor-pointer ${activeChat === group.id ? 'bg-purple-600/20' : 'hover:bg-gray-800/30'} border-b border-gray-800`}>
<div className="flex items-center gap-3">
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">{group.avatar || '👥'}</div>
<div className="flex-1 min-w-0">
<div className="font-semibold truncate">{group.name}</div>
<p className="text-sm text-gray-500 truncate">{group.members?.length} members</p>
</div>
{unreadCounts[group.id] > 0 && (
<div className="unread-badge bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
{unreadCounts[group.id]}
</div>
)}
</div>
</div>
))}
</>
)}

{sidebarView === 'channels' && (
<>
<button onClick={() => setShowCreateModal('channel')}
className="w-full p-4 flex items-center gap-3 hover:bg-gray-800/30 border-b border-gray-800">
<div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center"><Icons.Plus /></div>
<span className="font-semibold">Create Channel</span>
</button>
{channels.map(channel => (
<div key={channel.id} onClick={() => { setActiveChat(channel.id); setActiveChatType('channel'); }}
className={`p-4 cursor-pointer ${activeChat === channel.id ? 'bg-purple-600/20' : 'hover:bg-gray-800/30'} border-b border-gray-800`}>
<div className="flex items-center gap-3">
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"><Icons.Hash /></div>
<div className="flex-1 min-w-0">
<div className="font-semibold truncate">{channel.name}</div>
<p className="text-sm text-gray-500 truncate">@{channel.username}</p>
</div>
{unreadCounts[channel.id] > 0 && (
<div className="unread-badge bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
{unreadCounts[channel.id]}
</div>
)}
</div>
</div>
))}
</>
)}
</div>

<div className={`p-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} border-t border-gray-800`}>
<div className="flex items-center gap-3">
<div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl">{currentUser?.avatar}</div>
<div className="flex-1 min-w-0">
<div className="flex items-center gap-1.5">
<span className="font-semibold truncate text-sm">{currentUser?.username}</span>
{currentUser?.verified && <span className="text-blue-400 text-xs">✓</span>}
{currentUser?.isSuperAdmin && <Icons.Shield />}
</div>
<p className="text-xs text-gray-500">{currentUser?.isPremium ? 'Premium' : 'Free'}</p>
</div>
<button onClick={logout} className="p-2 hover:bg-gray-700/50 rounded-lg"><Icons.LogOut /></button>
</div>
</div>
</div>

{/* Main Chat Area */}
<div className="flex-1 flex flex-col">
{activeChat ? (
<>
{/* Chat Header */}
<div className={`p-4 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b flex items-center justify-between`}>
<div className="flex items-center gap-3">
{activeChatType === 'chat' ? (
<>
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl">
{users[activeChat.split('_').find(id => id !== currentUser.id)]?.avatar}
</div>
<div>
<div className="flex items-center gap-1.5">
<span className="font-semibold">{users[activeChat.split('_').find(id => id !== currentUser.id)]?.username}</span>
{users[activeChat.split('_').find(id => id !== currentUser.id)]?.verified && <span className="text-blue-400 text-sm">✓</span>}
</div>
<p className="text-sm text-gray-500">{users[activeChat.split('_').find(id => id !== currentUser.id)]?.status}</p>
</div>
</>
) : activeChatType === 'group' ? (
<>
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
{groups.find(gr => gr.id === activeChat)?.avatar || '👥'}
</div>
<div>
<div className="font-semibold">{groups.find(gr => gr.id === activeChat)?.name}</div>
<p className="text-sm text-gray-500">{groups.find(gr => gr.id === activeChat)?.members?.length} members</p>
</div>
</>
) : (
<>
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"><Icons.Hash /></div>
<div>
<div className="font-semibold">{channels.find(ch => ch.id === activeChat)?.name}</div>
<p className="text-sm text-gray-500">{channels.find(ch => ch.id === activeChat)?.subscribers?.length} subscribers</p>
</div>
</>
)}
</div>

<div className="flex gap-2">
<button className="p-2.5 hover:bg-gray-700/50 rounded-lg"><Icons.Phone /></button>
<button className="p-2.5 hover:bg-gray-700/50 rounded-lg"><Icons.Video /></button>
<button onClick={generateInviteLink} className="p-2.5 hover:bg-gray-700/50 rounded-lg"><Icons.Users /></button>
{currentUser?.isSuperAdmin && (
<button onClick={() => setShowAdminPanel(!showAdminPanel)} className="p-2.5 hover:bg-gray-700/50 rounded-lg"><Icons.Shield /></button>
)}
</div>
</div>

{/* Messages */}
<div className={`flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
{chatMessages.map((msg, idx) => {
const isOwn = msg.sender === currentUser?.id;
const sender = users[msg.sender];
const replyMsg = msg.replyTo ? chatMessages.find(m => m.id === msg.replyTo) : null;

return (
<div key={idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} message-animation`}>
<div className={`max-w-md ${isOwn ? 'bg-purple-600' : theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-3 shadow-lg`}
onContextMenu={(e) => handleContextMenu(e, msg)}>
{!isOwn && (
<div className="flex items-center gap-2 mb-2">
<span className="text-xs font-semibold text-purple-400">{sender?.username}</span>
</div>
)}

{replyMsg && (
<div className="mb-2 p-2 bg-gray-700/30 rounded-lg border-l-2 border-purple-500">
<p className="text-xs text-gray-400">{users[replyMsg.sender]?.username}</p>
<p className="text-sm truncate">{replyMsg.text}</p>
</div>
)}

{msg.type === 'text' && <p className="break-words">{applyFormatting(msg.text, msg.formatting)}</p>}
{msg.type === 'image' && <img src={msg.fileData} alt={msg.fileName} className="rounded-lg max-w-full" />}
{msg.type === 'file' && (
<div className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg">
<Icons.File />
<span className="text-sm">{msg.fileName}</span>
</div>
)}

<div className="flex items-center justify-between mt-1">
<p className="text-xs text-gray-400">
{new Date(msg.timestamp).toLocaleTimeString()}
{msg.edited && ' (edited)'}
</p>
</div>

{msg.reactions && Object.keys(msg.reactions).length > 0 && (
<div className="flex gap-1 mt-2 flex-wrap">
{Object.entries(msg.reactions).map(([emoji, userIds]) => (
userIds.length > 0 && (
<button key={emoji} onClick={() => addReaction(msg.id, emoji)}
className="px-2 py-1 bg-gray-700/30 rounded-full text-xs hover:bg-gray-600/50">
{emoji} {userIds.length}
</button>
)
))}
</div>
)}

<div className="flex gap-1 mt-2">
{['❤️', '👍', '😂', '😮', '😢', '🔥'].map(emoji => (
<button key={emoji} onClick={() => addReaction(msg.id, emoji)}
className="hover:scale-125 transition-transform text-xs opacity-50 hover:opacity-100">{emoji}</button>
))}
</div>
</div>
</div>
);
})}

{isTyping && Object.values(isTyping).some(Boolean) && (
<div className="flex justify-start">
<div className="bg-gray-800 rounded-2xl px-4 py-3">
<div className="typing-indicator flex gap-1">
<span className="w-2 h-2 bg-gray-400 rounded-full"></span>
<span className="w-2 h-2 bg-gray-400 rounded-full"></span>
<span className="w-2 h-2 bg-gray-400 rounded-full"></span>
</div>
</div>
</div>
)}

<div ref={messagesEndRef} />
</div>

{/* Reply Preview */}
{replyingTo && (
<div className={`px-4 py-2 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} border-t border-gray-800 flex items-center justify-between`}>
<div className="flex-1">
<p className="text-xs text-purple-400">Replying to {users[replyingTo.sender]?.username}</p>
<p className="text-sm truncate">{replyingTo.text}</p>
</div>
<button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-gray-700/50 rounded"><Icons.X /></button>
</div>
)}

{/* Selected Files */}
{selectedFiles.length > 0 && (
<div className={`p-2 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} border-t border-gray-800`}>
<div className="flex gap-2 overflow-x-auto">
{selectedFiles.map((file, idx) => (
<div key={idx} className="relative flex-shrink-0">
{file.type === 'image' ? (
<img src={file.data} alt="" className="w-20 h-20 object-cover rounded-lg" />
) : (
<div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center"><Icons.File /></div>
)}
<button onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
<Icons.X />
</button>
</div>
))}
</div>
</div>
)}

{/* Input */}
<div className={`p-4 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t`}>
<div className="flex gap-2 mb-2">
<button onClick={() => formatText('bold')} className={`format-btn p-2 rounded ${formatting.bold ? 'active' : ''}`}><strong>B</strong></button>
<button onClick={() => formatText('italic')} className={`format-btn p-2 rounded ${formatting.italic ? 'active'  : ''}`}><em>I</em></button>
<button onClick={() => formatText('underline')} className={`format-btn p-2 rounded ${formatting.underline ? 'active' : ''}`}><u>U</u></button>
<button onClick={() => formatText('strikethrough')} className={`format-btn p-2 rounded ${formatting.strikethrough ? 'active' : ''}`}><s>S</s></button>
</div>
<div className="flex items-center gap-2">
<input type="file" ref={imageInputRef} accept="image/*" onChange={(e) => handleFileSelect(e, 'image')} className="hidden" multiple />
<input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e, 'file')} className="hidden" multiple />

<button onClick={() => imageInputRef.current?.click()} className="p-2.5 hover:bg-gray-700/50 rounded-lg"><Icons.Image /></button>
<button onClick={() => fileInputRef.current?.click()} className="p-2.5 hover:bg-gray-700/50 rounded-lg"><Icons.File /></button>

<input type="text" placeholder={editingMessage ? "Edit..." : "Type..."} value={inputMessage}
onChange={handleInputChange}
onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
className={`flex-1 px-4 py-2.5 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500`} />

{editingMessage && (
<button onClick={() => { setEditingMessage(null); setInputMessage(''); }}
className="p-2.5 hover:bg-gray-700/50 rounded-lg text-red-500"><Icons.X /></button>
)}

<button onClick={sendMessage} className="send-animation p-2.5 bg-purple-600 hover:bg-purple-700 rounded-full"><Icons.Send /></button>
</div>
</div>
</>
) : (
<div className="flex-1 flex items-center justify-center text-gray-500">
<div className="text-center">
<div className="text-7xl mb-4">⬡</div>
<h3 className="text-2xl font-semibold mb-2">Select a chat</h3>
<p className="text-gray-400">Choose a conversation to start messaging</p>
</div>
</div>
)}
</div>

{/* Context Menu */}
{contextMenu && (
<div className="fixed context-menu bg-gray-800 rounded-xl py-2 z-50 min-w-[180px] border border-gray-700 shadow-2xl"
style={{ left: contextMenu.x, top: contextMenu.y }}>
{contextMenu.message.sender === currentUser?.id && (
<>
<button onClick={() => startEditMessage(contextMenu.message)}
className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-3"><Icons.Edit /> Edit</button>
<button onClick={() => deleteMessage(contextMenu.message.id)}
className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-3 text-red-400"><Icons.Trash /> Delete</button>
</>
)}
<button onClick={() => startReply(contextMenu.message)}
className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-3"><Icons.Reply /> Reply</button>
<button onClick={() => copyMessageText(contextMenu.message.text)}
className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-3"><Icons.Copy /> Copy</button>
</div>
)}

{/* Modals */}
{showCreateModal === 'channel' && (
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
<div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-800">
<div className="flex items-center justify-between mb-6">
<h2 className="text-2xl font-bold">Create Channel</h2>
<button onClick={() => setShowCreateModal(null)} className="p-2 hover:bg-gray-700/50 rounded-lg"><Icons.X /></button>
</div>
<div className="space-y-4">
<input type="text" placeholder="Channel Name" value={channelForm.name}
onChange={(e) => setChannelForm({...channelForm, name: e.target.value})}
className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none" />
<input type="text" placeholder="Username" value={channelForm.username}
onChange={(e) => setChannelForm({...channelForm, username: e.target.value})}
className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none" />
<textarea placeholder="Description" value={channelForm.description}
onChange={(e) => setChannelForm({...channelForm, description: e.target.value})}
className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none resize-none" rows="3" />
<button onClick={createChannel}
className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700">
Create
</button>
</div>
</div>
</div>
)}

{showCreateModal === 'group' && (
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
<div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-800">
<div className="flex items-center justify-between mb-6">
<h2 className="text-2xl font-bold">Create Group</h2>
<button onClick={() => setShowCreateModal(null)} className="p-2 hover:bg-gray-700/50 rounded-lg"><Icons.X /></button>
</div>
<div className="space-y-4">
<input type="text" placeholder="Group Name" value={groupForm.name}
onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none" />
<textarea placeholder="Description" value={groupForm.description}
onChange={(e) => setGroupForm({...groupForm, description: e.target.value})}
className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none resize-none" rows="3" />
<button onClick={createGroup}
className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700">
Create
</button>
</div>
</div>
</div>
)}

{showInviteLink && (
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
<div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-800">
<div className="flex items-center justify-between mb-6">
<h2 className="text-2xl font-bold">Invite Link</h2>
<button onClick={() => setShowInviteLink(false)} className="p-2 hover:bg-gray-700/50 rounded-lg"><Icons.X /></button>
</div>
<div className="space-y-4">
<div className="p-4 bg-gray-800 rounded-xl">
<code className="text-sm break-all">{inviteLink}</code>
</div>
<button onClick={() => navigator.clipboard.writeText(inviteLink)}
className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
<Icons.Copy /> Copy Link
</button>
</div>
</div>
</div>
)}

{showSettings && (
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
<div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl border border-gray-800">
<div className="flex items-center justify-between mb-6">
<h2 className="text-2xl font-bold">Settings</h2>
<button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-700/50 rounded-lg"><Icons.X /></button>
</div>
<div className="space-y-6">
<div>
<h3 className="text-lg font-semibold mb-3">Profile</h3>
<div className="space-y-3">
<div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
<span>Username</span>
<span className="font-semibold">{currentUser?.username}</span>
</div>
<div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
<span>Status</span>
<span className={`px-3 py-1 rounded-full text-sm ${currentUser?.isPremium ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700'}`}>
{currentUser?.isPremium ? 'Premium ⭐' : 'Free'}
</span>
</div>
</div>
</div>

<div>
<h3 className="text-lg font-semibold mb-3">Developer</h3>
<div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
<div className="flex items-center gap-2"><Icons.Code /><span>Developer Mode</span></div>
<button onClick={() => toggleDeveloperMode(!currentUser?.developerMode)}
className={`w-12 h-6 rounded-full ${currentUser?.developerMode ? 'bg-purple-600' : 'bg-gray-700'}`}>
<div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${currentUser?.developerMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
</button>
</div>
{currentUser?.developerMode && apiKey && (
<div className="p-3 bg-gray-800/50 rounded-lg mt-3">
<div className="flex items-center justify-between mb-2">
<span className="text-sm text-gray-400">API Key</span>
<button onClick={() => navigator.clipboard.writeText(apiKey)} className="text-purple-400 text-sm flex items-center gap-1">
<Icons.Copy /> Copy
</button>
</div>
<code className="text-xs bg-gray-900 p-2 rounded block overflow-x-auto">{apiKey}</code>
</div>
)}
</div>
</div>
</div>
</div>
)}

{showAdminPanel && currentUser?.isSuperAdmin && (
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
<div className="bg-gray-900 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl border border-gray-800">
<div className="flex items-center justify-between mb-6">
<h2 className="text-2xl font-bold flex items-center gap-2"><Icons.Shield /> Admin Panel</h2>
<button onClick={() => setShowAdminPanel(false)} className="p-2 hover:bg-gray-700/50 rounded-lg"><Icons.X /></button>
</div>
<div className="space-y-4">
{Object.values(users).filter(u => !u.isBot).map(user => (
<div key={user.id} className="p-4 bg-gray-800/50 rounded-xl">
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-3">
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">{user.avatar}</div>
<div>
<div className="flex items-center gap-2">
<span className="font-semibold">{user.username}</span>
{user.verified && <span className="text-blue-400">✓</span>}
{user.isPremium && <Icons.Crown />}
{user.isSuperAdmin && <Icons.Shield />}
</div>
<p className="text-sm text-gray-400">ID: {user.id}</p>
</div>
</div>
</div>
<div className="flex gap-2 flex-wrap">
<button onClick={() => adminAction(user.id, 'toggle_premium')}
className={`px-3 py-1.5 rounded-lg text-sm font-medium ${user.isPremium ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700'}`}>
{user.isPremium ? '− Premium' : '+ Premium'}
</button>
<button onClick={() => adminAction(user.id, 'toggle_verified')}
className={`px-3 py-1.5 rounded-lg text-sm font-medium ${user.verified ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700'}`}>
{user.verified ? '− Verified' : '+ Verified'}
</button>
<button onClick={() => adminAction(user.id, 'toggle_ban')}
className={`px-3 py-1.5 rounded-lg text-sm font-medium ${user.banned ? 'bg-red-500/20 text-red-400' : 'bg-gray-700'}`}>
{user.banned ? 'Unban' : 'Ban'}
</button>
<button onClick={() => adminAction(user.id, 'toggle_mute')}
className={`px-3 py-1.5 rounded-lg text-sm font-medium ${user.muted ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-700'}`}>
{user.muted ? 'Unmute' : 'Mute'}
</button>
</div>
</div>
))}
</div>
</div>
</div>
)}
</div>
);
}

ReactDOM.render(<NexusApp />, document.getElementById('root'));
</script>
</body>
</html>
