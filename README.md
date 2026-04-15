# Online Code Collaboration Platform

A full-stack MERN application for collaborative coding in shared rooms. Multiple users can join the same room, edit code together in real time with Socket.IO, and compile code through the Wandbox API.

## Tech Stack

### Frontend
- React.js
- Monaco Editor via `@monaco-editor/react`
- React Router
- Socket.IO Client
- Axios
- React Hot Toast
- React Avatar
- Bootstrap

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB with Mongoose
- Axios
- dotenv
- cors

### Code Execution
- Wandbox API

## Features
- Real-time collaborative coding with Socket.IO
- Create unique rooms from the backend
- Join existing rooms with a room ID
- Monaco Editor for code editing
- Live list of connected users per room
- Shared language selection across collaborators
- Code compilation and execution
- Compiler errors, program errors, and output panels
- MongoDB room persistence for latest code and language state

## Folder Structure

```text
Online_Code_Collaboration_Platform/
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |   |-- Client.js
|   |   |   |-- Editor.js
|   |   |   `-- EditorPage.js
|   |   |-- Actions.js
|   |   |-- App.css
|   |   |-- App.js
|   |   |-- Socket.js
|   |   |-- index.css
|   |   `-- index.js
|   |-- .env.example
|   `-- package.json
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |   `-- db.js
|   |   |-- controllers/
|   |   |   |-- compilerController.js
|   |   |   `-- roomController.js
|   |   |-- models/
|   |   |   `-- Room.js
|   |   |-- routes/
|   |   |   |-- compilerRoutes.js
|   |   |   `-- roomRoutes.js
|   |   |-- services/
|   |   |   `-- roomService.js
|   |   |-- socket/
|   |   |   `-- socketHandler.js
|   |   `-- utils/
|   |       `-- action.js
|   |-- .env.example
|   |-- package.json
|   `-- server.js
`-- README.md
```

## Required Dependencies

### Client dependencies
- `@monaco-editor/react`
- `axios`
- `bootstrap`
- `react`
- `react-avatar`
- `react-dom`
- `react-hot-toast`
- `react-router-dom`
- `react-scripts`
- `socket.io-client`

### Server dependencies
- `axios`
- `cors`
- `dotenv`
- `express`
- `mongoose`
- `socket.io`
- `nodemon` as a dev dependency

## Environment Variables

### `server/.env`

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/codecollab
MONGODB_DB_NAME=codecollab
```

### `client/.env`

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Step-by-Step Setup

1. Clone the repository.

```bash
git clone <your-repository-url>
cd Online_Code_Collaboration_Platform
```

2. Install backend dependencies.

```bash
cd server
npm install
```

3. Create the backend environment file.

```bash
# macOS / Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

4. Make sure MongoDB is running locally, or update `MONGODB_URI` to point to your MongoDB Atlas cluster.

5. Start the backend server.

```bash
npm run dev
```

6. Open a new terminal and install frontend dependencies.

```bash
cd client
npm install
```

7. Create the frontend environment file.

```bash
# macOS / Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

8. Start the React frontend.

```bash
npm start
```

9. Open `http://localhost:3000` in your browser.

## How It Works

1. A user creates a room from the home screen.
2. The backend generates a unique room ID and stores it in MongoDB.
3. Other collaborators join using the same room ID.
4. Socket.IO places every user inside the same room channel.
5. Monaco Editor changes are broadcast to all collaborators in real time.
6. The latest room code and selected language are persisted in MongoDB.
7. Users run code through the compile API, which forwards the request to Wandbox.
8. Output, runtime errors, and compiler errors are displayed in separate panels.

## API Endpoints

### Room APIs
- `POST /api/rooms` creates a unique room
- `GET /api/rooms/:roomId` fetches persisted room state

### Compile API
- `POST /api/compile` compiles and executes code

Request body:

```json
{
  "code": "console.log('Hello, world!')",
  "language": "javascript"
}
```

## Socket Events
- `join`: client joins a room
- `joined`: broadcast when a collaborator joins
- `room-state`: initial room code and language for the joining client
- `code-change`: synchronize editor content
- `language-change`: synchronize selected language
- `disconnected`: notify room members when someone leaves

## Notes
- The backend serves the React build in production.
- Wandbox availability affects compilation responses.
- The current language list includes JavaScript, Python, Java, C++, C, Go, Rust, and PHP.

## Future Improvements
- Authentication and protected rooms
- Chat alongside the editor
- File tree and multi-file projects
- Cursor presence and selection highlights
- Saved execution history
- Judge0 support as an alternative compiler provider
