// Mock Data
const MY_USER = {
    id: 'u0',
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?img=11'
};

const FRIENDS = [
    { id: 'ai1', name: 'AI Assistant', avatar: 'https://i.pravatar.cc/150?img=60', isOnline: true },
    { id: 'u1', name: 'Sarah Parker', avatar: 'https://i.pravatar.cc/150?img=5', isOnline: true },
    { id: 'u2', name: 'Mike Ross', avatar: 'https://i.pravatar.cc/150?img=12', isOnline: true },
    { id: 'u3', name: 'Emily Chen', avatar: 'https://i.pravatar.cc/150?img=20', isOnline: false },
    { id: 'u4', name: 'David Smith', avatar: 'https://i.pravatar.cc/150?img=33', isOnline: true },
    { id: 'u5', name: 'Jessica Alba', avatar: 'https://i.pravatar.cc/150?img=41', isOnline: true },
    { id: 'u6', name: 'Tom Hardy', avatar: 'https://i.pravatar.cc/150?img=53', isOnline: false },
];

let POSTS = [
    {
        id: 'p1',
        authorId: 'u1',
        content: 'Just had the most amazing coffee at the new roastery downtown! ☕✨ Highly recommend it to everyone.',
        image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        timestamp: '2 hours ago',
        likes: 124,
        comments: 18
    },
    {
        id: 'p2',
        authorId: 'u2',
        content: 'Finished setting up my new workstation. Working from home just got an upgrade! 💻🚀',
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        timestamp: '5 hours ago',
        likes: 89,
        comments: 5
    },
    {
        id: 'p3',
        authorId: 'u4',
        content: 'Beautiful sunset today at the beach. Nature is incredible.',
        image: null,
        timestamp: '8 hours ago',
        likes: 45,
        comments: 2
    }
];

let MESSAGES = {
    'ai1': [
        { senderId: 'ai1', text: 'Hello! I am your AI Assistant. How can I help you today?', time: '10:00 AM' }
    ],
    'u1': [
        { senderId: 'u1', text: 'Hey Alex! Are we still on for lunch tomorrow?', time: '10:30 AM' },
        { senderId: 'u0', text: 'Yes! Definitely. Same place?', time: '10:35 AM' },
        { senderId: 'u1', text: 'Perfect. See you at 12:30!', time: '10:38 AM' }
    ],
    'u2': [
        { senderId: 'u2', text: 'Did you check out that new repository I sent you?', time: 'Yesterday' }
    ]
};

let activeChatFriendId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderRightSidebar();
    renderStories();
    renderPosts();
    renderChatSidebar();
});

// View Navigation
function switchView(viewName) {
    document.getElementById('feed-view').style.display = viewName === 'feed' ? 'block' : 'none';
    document.getElementById('chat-view').style.display = viewName === 'chat' ? 'block' : 'none';

    // Update active state in nav
    document.querySelectorAll('.nav-center .nav-link').forEach(link => link.classList.remove('active'));
    if (viewName === 'feed') {
        document.getElementById('nav-home').classList.add('active');
    }
}

function openChatWithFriend(friendId) {
    switchView('chat');
    loadChatWindow(friendId);
}

// Rendering Functions
function getUser(id) {
    if (id === MY_USER.id) return MY_USER;
    return FRIENDS.find(f => f.id === id);
}

function renderRightSidebar() {
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = FRIENDS.map(friend => `
        <div class="contact-item" onclick="openChatWithFriend('${friend.id}')">
            <div class="contact-avatar">
                <img src="${friend.avatar}" alt="${friend.name}">
                ${friend.isOnline ? '<div class="online-indicator"></div>' : ''}
            </div>
            <span>${friend.name}</span>
        </div>
    `).join('');
}

function renderStories() {
    const list = document.getElementById('stories-list');
    // Just a few mock stories for visual appeal
    const storyHtml = FRIENDS.slice(0, 4).map((f, i) => `
        <div class="story" style="background-image: url('https://picsum.photos/seed/${f.id}/200/300')">
            <img src="${f.avatar}" class="story-user-icon" alt="${f.name}">
            <span class="author">${f.name.split(' ')[0]}</span>
        </div>
    `).join('');
    list.innerHTML += storyHtml;
}

function renderPosts() {
    const feed = document.getElementById('posts-feed');
    feed.innerHTML = POSTS.map(post => {
        const author = getUser(post.authorId);
        return `
            <div class="post">
                <div class="post-header">
                    <div class="post-user">
                        <img src="${author.avatar}" alt="${author.name}">
                        <div class="post-info">
                            <h5>${author.name}</h5>
                            <small>${post.timestamp} <i class="fa-solid fa-earth-americas" style="margin-left:4px"></i></small>
                        </div>
                    </div>
                    <div class="icon-btn" style="background:transparent"><i class="fa-solid fa-ellipsis"></i></div>
                </div>
                <div class="post-content">
                    <p>${post.content}</p>
                </div>
                ${post.image ? `<img src="${post.image}" class="post-img" alt="Post content">` : ''}
                <div class="post-stats">
                    <span><i class="fa-solid fa-thumbs-up text-blue"></i> ${post.likes}</span>
                    <span>${post.comments} comments</span>
                </div>
                <div class="post-actions">
                    <div class="action-btn">
                        <i class="fa-regular fa-thumbs-up"></i>
                        <span>Like</span>
                    </div>
                    <div class="action-btn">
                        <i class="fa-regular fa-comment"></i>
                        <span>Comment</span>
                    </div>
                    <div class="action-btn">
                        <i class="fa-solid fa-share"></i>
                        <span>Share</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function createPost() {
    const input = document.getElementById('post-input');
    const content = input.value.trim();
    if (!content) return;

    const newPost = {
        id: 'p' + Date.now(),
        authorId: MY_USER.id,
        content: content,
        image: null,
        timestamp: 'Just now',
        likes: 0,
        comments: 0
    };

    POSTS.unshift(newPost);
    renderPosts();
    input.value = '';
}

// Chat Functions
function renderChatSidebar() {
    const list = document.getElementById('chat-list');
    list.innerHTML = FRIENDS.map(friend => {
        const chatLog = MESSAGES[friend.id];
        const lastMessage = chatLog ? chatLog[chatLog.length - 1].text : 'Start a conversation';
        return `
            <div class="chat-list-item ${activeChatFriendId === friend.id ? 'active' : ''}" onclick="loadChatWindow('${friend.id}')">
                <div class="contact-avatar">
                    <img src="${friend.avatar}" alt="${friend.name}">
                    ${friend.isOnline ? '<div class="online-indicator"></div>' : ''}
                </div>
                <div class="chat-list-info">
                    <h4>${friend.name}</h4>
                    <p>${lastMessage}</p>
                </div>
            </div>
        `;
    }).join('');
}

function loadChatWindow(friendId) {
    activeChatFriendId = friendId;
    renderChatSidebar(); // update active state

    // Switch responsive class
    document.getElementById('chat-view').classList.add('chat-active');

    const friend = getUser(friendId);
    const window = document.getElementById('chat-window');

    if (!MESSAGES[friendId]) MESSAGES[friendId] = [];
    const msgs = MESSAGES[friendId];

    window.innerHTML = `
        <div class="active-chat-header">
            <div class="user-info">
                <i class="fa-solid fa-arrow-left" style="display:none" onclick="document.getElementById('chat-view').classList.remove('chat-active')" id="chat-back-btn"></i>
                <div class="contact-avatar">
                    <img src="${friend.avatar}" alt="${friend.name}">
                    ${friend.isOnline ? '<div class="online-indicator"></div>' : ''}
                </div>
                <div>
                    <h4>${friend.name}</h4>
                    <small>${friend.isOnline ? 'Active now' : 'Offline'}</small>
                </div>
            </div>
            <div class="chat-actions">
                <div class="icon-btn" style="background:transparent; color: var(--accent-color)"><i class="fa-solid fa-phone"></i></div>
                <div class="icon-btn" style="background:transparent; color: var(--accent-color)"><i class="fa-solid fa-video"></i></div>
                <div class="icon-btn" style="background:transparent; color: var(--accent-color)"><i class="fa-solid fa-circle-info"></i></div>
            </div>
        </div>
        <div class="chat-messages" id="chat-messages">
            ${msgs.map(m => `
                <div class="message-wrapper ${m.senderId === MY_USER.id ? 'sent' : 'received'}">
                    ${m.senderId !== MY_USER.id ? `<img src="${friend.avatar}" class="msg-avatar">` : ''}
                    <div class="message">${m.text}</div>
                </div>
            `).join('')}
        </div>
        <div class="chat-input-area">
            <div class="chat-input-actions">
                <i class="fa-solid fa-circle-plus"></i>
                <i class="fa-solid fa-image"></i>
                <i class="fa-solid fa-face-smile"></i>
            </div>
            <div class="chat-input-wrapper">
                <input type="text" id="chat-type-input" placeholder="Aa" onkeypress="if(event.key === 'Enter') sendMessage('${friendId}')">
            </div>
            <div class="chat-send-btn" onclick="sendMessage('${friendId}')">
                <i class="fa-solid fa-paper-plane"></i>
            </div>
        </div>
    `;

    // Only show back button on mobile
    if (window.innerWidth <= 700) {
        document.getElementById('chat-back-btn').style.display = 'block';
    }

    scrollToBottom();
}

function sendMessage(friendId) {
    const input = document.getElementById('chat-type-input');
    const text = input.value.trim();
    if (!text) return;

    if (!MESSAGES[friendId]) MESSAGES[friendId] = [];

    MESSAGES[friendId].push({
        senderId: MY_USER.id,
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    input.value = '';
    loadChatWindow(friendId);

    // AI Assistant Toy Model Logic
    if (friendId === 'ai1') {
        setTimeout(async () => {
            let aiText = `I heard: "${text}". I am a toy AI model!`;
            MESSAGES[friendId].push({
                senderId: 'ai1',
                text: "...", // Temporary typing indicator
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            if (activeChatFriendId === friendId) loadChatWindow(friendId);

            try {
                // Call the local Python backend parsing the response
                const res = await fetch('http://localhost:8000/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: text })
                });
                const data = await res.json();
                aiText = data.reply || data.error || aiText;
            } catch (err) {
                console.error("Backend fetch error:", err);
                aiText = "[Error] Could not reach the Python backend at http://localhost:8000. Please ensure it is running.";
            }

            // Remove the typing indicator and add real message
            MESSAGES[friendId].pop();
            MESSAGES[friendId].push({
                senderId: 'ai1',
                text: aiText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });

            // Refresh window if user is still looking at this chat
            if (activeChatFriendId === friendId) {
                loadChatWindow(friendId);
            }
        }, 500);
    }
}

function scrollToBottom() {
    const msgsContainer = document.getElementById('chat-messages');
    if (msgsContainer) {
        msgsContainer.scrollTop = msgsContainer.scrollHeight;
    }
}
