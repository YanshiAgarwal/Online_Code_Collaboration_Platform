# 💻 Online Code Collaboration Platform (Live Editor)

A real-time collaborative coding platform where multiple users can **write, edit, and execute code together instantly** — similar to Google Docs but for programming.

---

## 🚀 Features

* 👥 Real-time multi-user code collaboration
* 📝 Live code editor with syntax highlighting (CodeMirror with Dracula theme)
* 🔗 Create & join coding rooms via shareable Room ID
* 🔄 Instant code synchronization across all users in a room
* 💻 Code execution supporting 16 programming languages
* 📋 One-click Room ID copy to clipboard
* 🔔 Toast notifications for user join/leave events
* 🎨 Auto-generated user avatars

---

## 🏗️ Tech Stack

### Frontend

* React.js 18
* CodeMirror 5 (Dracula theme)
* Socket.IO Client
* Bootstrap 5
* React Router v6
* React Hot Toast
* React Avatar

### Backend

* Node.js
* Express.js 5
* Socket.IO
* Axios

### Code Execution

* Wandbox API (free, no API key required)

---

## 💻 Supported Languages

| Language | Language | Language | Language |
|----------|----------|----------|----------|
| Python 3 | Java | C++ | C |
| Node.js | Ruby | Go | Rust |
| PHP | Swift | C# | Scala |
| Bash | SQL | Pascal | R |

---

## 🧠 Project Architecture

```
Client (React + CodeMirror)
        │
        │ WebSocket (Socket.IO) + HTTP (Axios)
        ▼
Backend (Node.js + Express)
        │
        ├── Socket.IO ──→ Real-time code sync, user join/leave
        │
        ├── POST /compile ──→ Wandbox API (Code Execution)
        │
        └── Static file serving (React build for deployment)
```

---

## 📁 Project Structure

```
Online_Code_Collaboration_Platform/
│
├── client/                          # React frontend
│   ├── public/
│   │   └── images/                  # Logo assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js              # Landing page (create/join room)
│   │   │   ├── EditorPage.js        # Main collaboration page
│   │   │   ├── Editor.js            # CodeMirror editor wrapper
│   │   │   └── Client.js            # User avatar component
│   │   ├── App.js                   # Route definitions
│   │   ├── Socket.js                # Socket.IO connection setup
│   │   ├── Actions.js               # Socket event constants
│   │   └── index.js                 # Entry point
│   └── .env                         # REACT_APP_BACKEND_URL
│
├── server/                          # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   │   └── compilerController.js  # Code execution via Wandbox API
│   │   ├── routes/
│   │   │   └── compilerRoutes.js      # POST /compile route
│   │   ├── socket/
│   │   │   └── socketHandler.js       # Real-time event handling
│   │   └── utils/
│   │       └── action.js             # Socket event constants
│   ├── server.js                    # Main server entry point
│   └── .env                         # PORT=5000
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/YanshiAgarwal/Online_Code_Collaboration_Platform.git
cd Online-Code-Collaboration-Platform
```

### 2️⃣ Setup Backend

```bash
cd server
npm install
npm start
```

You should see: `Server is running on port 5000`

### 3️⃣ Setup Frontend

Open a **new terminal**:

```bash
cd client
npm install
npm start
```

The app will open at `http://localhost:3000`

---

## 🔌 Environment Variables

### Client (`client/.env`)

```
# For local development:
REACT_APP_BACKEND_URL=http://localhost:5000

# For ngrok deployment (leave empty):
REACT_APP_BACKEND_URL=
```

### Server (`server/.env`)

```
PORT=5000
```

---

## 📡 Socket Events

| Event | Direction | Purpose |
|-------|-----------|---------|
| `join` | Client → Server | User wants to join a room |
| `joined` | Server → Client | Notify all users that someone joined (includes client list) |
| `code-change` | Both ways | Sync code changes in real-time |
| `sync-code` | Client → Server | New user requests current code from existing users |
| `disconnected` | Server → Client | Notify all users that someone left |

---

## 🔄 User Flow

```
1. User visits the home page (/)
2. Enters a username
3. Either pastes an existing Room ID or clicks "New Room" to generate one
4. Clicks JOIN → navigated to /editor/:roomId
5. Socket connects → joins the room → all users notified
6. Code typed by any user syncs to all others in real-time
7. Users can run code via the compiler panel (16 languages supported)
8. Users can copy Room ID to share with others
9. On leaving or closing the tab, all users are notified
```

---

## 🌐 Deployment with ngrok

For quick sharing without deploying to a cloud service:

1. Set `client/.env` → `REACT_APP_BACKEND_URL=` (empty)
2. Build the frontend: `cd client && npm run build`
3. Start the server: `cd server && npm start`
4. Run ngrok: `ngrok http 5000`
5. Share the ngrok URL — everything runs on one port!

---

## 📌 Future Improvements

* 💬 Real-time chat system
* 🔐 User authentication (login/signup)
* 💾 Save & load projects with MongoDB
* 🌙 Dark/light theme toggle
* 🎥 Video/voice collaboration
* 🤖 AI code suggestions
* 📜 Version history (like Git)
* 📁 File sharing support

---