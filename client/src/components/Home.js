import React, { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState(sessionStorage.getItem("username") || "");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const navigate = useNavigate();

  const helperText = useMemo(() => {
    return roomId ? "Join an existing room with your teammate." : "Create a room and start collaborating instantly.";
  }, [roomId]);

  const createRoom = async () => {
    setIsCreatingRoom(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/rooms`);
      setRoomId(response.data.roomId);
      toast.success("New room created");
    } catch (error) {
      console.error(error);
      toast.error("Unable to create a room right now");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const joinRoom = () => {
    if (!username.trim() || !roomId.trim()) {
      toast.error("Username and room ID are required");
      return;
    }

    sessionStorage.setItem("username", username.trim());

    navigate(`/editor/${roomId.trim()}`, {
      state: {
        username: username.trim(),
      },
    });
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="home-shell">
      <div className="home-card">
        <div className="brand-block">
          <p className="eyebrow">MERN + Socket.IO</p>
          <h1>Online Code Collaboration Platform</h1>
          <p className="subtitle">
            Create a secure room, invite collaborators, code together in real time, and run code from the same workspace.
          </p>
        </div>

        <div className="form-panel">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            placeholder="Enter your name"
            onChange={(event) => setUsername(event.target.value)}
            onKeyDown={handleEnter}
          />

          <label htmlFor="roomId">Room ID</label>
          <input
            id="roomId"
            type="text"
            value={roomId}
            placeholder="Paste a room ID or create one"
            onChange={(event) => setRoomId(event.target.value)}
            onKeyDown={handleEnter}
          />

          <p className="helper-text">{helperText}</p>

          <div className="action-row">
            <button className="primary-button" onClick={joinRoom}>Join Room</button>
            <button className="secondary-button" onClick={createRoom} disabled={isCreatingRoom}>
              {isCreatingRoom ? "Creating..." : "Create Room"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
