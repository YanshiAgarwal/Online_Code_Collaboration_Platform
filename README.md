

# 💻 Online Code Collaboration Platform (Live Editor)

A real-time collaborative coding platform where multiple users can **write, edit, and execute code together instantly** — similar to Google Docs but for programming.

---

## 🚀 Features

### 🌟 Core Features

* 👥 Real-time multi-user code collaboration
* 📝 Live code editor (VS Code-like experience)
* 🔗 Create & join coding rooms via shareable links
* 🔄 Instant code synchronization across users

### ⚡ Advanced Features (Planned / In Progress)

* 💬 Real-time chat system
* 💻 Code execution (multi-language support)
* 🔐 User authentication (login/signup)
* 💾 Save & load projects
* 🌙 Dark/light theme support

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Monaco Editor
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO

### Database

* MongoDB

### Code Execution

* Judge0 API

---

## 🧠 Project Architecture

```
Client (React + Monaco Editor)
        │
        │ WebSocket + HTTP
        ▼
Backend (Node.js + Express)
        │
        ├── Socket.IO (Real-time updates)
        │
        ├── REST APIs
        │
        ▼
MongoDB Database
        │
        ▼
Judge0 API (Code Execution)
```

---

## 📁 Project Structure

```
live-code-collaboration
│
├── client        # React frontend
├── server        # Node.js backend
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/YanshiAgarwal/Online-Code-Collaboration-Platform.git
cd live-code-collaboration
```

---

### 2️⃣ Setup Frontend

```bash
cd client
npm install
npm start
```

---

### 3️⃣ Setup Backend

```bash
cd server
npm install
node server.js
```

---

## 🔌 Environment Variables

Create a `.env` file in the server folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## 📡 Socket Events

```
JOIN_ROOM
CODE_CHANGE
CODE_UPDATE
USER_JOINED
USER_LEFT
SEND_MESSAGE
RECEIVE_MESSAGE
```

---

## 🎯 Minimum Viable Product (MVP)

* Room creation & joining
* Live code editor
* Real-time collaboration

---

## 🚀 Deployment (Planned)

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 📌 Future Improvements

* Video/voice collaboration
* AI code suggestions
* Version history (like Git)
* File sharing support

---




