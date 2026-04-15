import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { ACTIONS } from "../Actions";
import { initSocket } from "../Socket";
import Client from "./Client";
import Editor from "./Editor";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const LANGUAGE_OPTIONS = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "C", value: "c" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "PHP", value: "php" },
];

function EditorPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const socketRef = useRef(null);
  const username = location.state?.username || sessionStorage.getItem("username");

  const [clients, setClients] = useState([]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [compileResult, setCompileResult] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let activeSocket = null;

    const handleSocketError = () => {
      toast.error("Socket connection failed. Please try again.");
      navigate("/");
    };

    async function loadRoomAndConnect() {
      try {
        await axios.get(`${API_BASE_URL}/rooms/${roomId}`);
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("Room not found");
          navigate("/");
          return;
        }
      }

      const socket = await initSocket();
      if (!isMounted) {
        socket.disconnect();
        return;
      }

      activeSocket = socket;
      socketRef.current = socket;
      socket.on("connect_error", handleSocketError);
      socket.on("connect_failed", handleSocketError);

      socket.emit(ACTIONS.JOIN, { roomId, username });

      socket.on(ACTIONS.JOINED, ({ clients: roomClients, username: joinedUser, socketId }) => {
        if (!isMounted) {
          return;
        }

        setClients(roomClients);

        if (joinedUser !== username && socketId) {
          toast.success(`${joinedUser} joined the room`);
        }
      });

      socket.on(ACTIONS.ROOM_STATE, ({ code: roomCode, language: roomLanguage }) => {
        if (!isMounted) {
          return;
        }

        setCode(roomCode || "");
        setLanguage(roomLanguage || "javascript");
      });

      socket.on(ACTIONS.CODE_CHANGE, ({ code: incomingCode }) => {
        if (isMounted) {
          setCode(incomingCode || "");
        }
      });

      socket.on(ACTIONS.LANGUAGE_CHANGE, ({ language: incomingLanguage }) => {
        if (isMounted) {
          setLanguage(incomingLanguage || "javascript");
        }
      });

      socket.on(ACTIONS.DISCONNECTED, ({ socketId, username: leftUser }) => {
        if (!isMounted) {
          return;
        }

        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
        toast(`${leftUser} left the room`);
      });
    }

    loadRoomAndConnect();

    return () => {
      isMounted = false;
      if (activeSocket) {
        activeSocket.off("connect_error", handleSocketError);
        activeSocket.off("connect_failed", handleSocketError);
        activeSocket.off(ACTIONS.JOINED);
        activeSocket.off(ACTIONS.ROOM_STATE);
        activeSocket.off(ACTIONS.CODE_CHANGE);
        activeSocket.off(ACTIONS.LANGUAGE_CHANGE);
        activeSocket.off(ACTIONS.DISCONNECTED);
        activeSocket.disconnect();
      }

      if (socketRef.current === activeSocket) {
        socketRef.current = null;
      }
    };
  }, [navigate, roomId, username]);

  const participantSummary = useMemo(() => {
    return `${clients.length} collaborator${clients.length === 1 ? "" : "s"}`;
  }, [clients.length]);

  if (!username) {
    return <Navigate to="/" replace />;
  }

  const handleCodeChange = (nextCode) => {
    setCode(nextCode);
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: nextCode,
    });
  };

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    socketRef.current?.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId,
      language: nextLanguage,
    });
  };

  const runCode = async () => {
    setIsCompiling(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/compile`, {
        code,
        language,
      });
      setCompileResult(response.data);
    } catch (error) {
      setCompileResult({
        output: "",
        compilerOutput: "",
        compilerError: error.response?.data?.error || "Failed to compile code",
        programError: "",
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setIsCopied(true);
      toast.success("Room ID copied");
      setTimeout(() => setIsCopied(false), 1800);
    } catch (error) {
      toast.error("Unable to copy room ID");
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  return (
    <div className="editor-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Active Room</p>
          <h2>{roomId}</h2>
          <p className="sidebar-copy">Logged in as <strong>{username}</strong></p>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-header">
            <span>Participants</span>
            <span>{participantSummary}</span>
          </div>
          <div className="participant-list">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>

        <div className="sidebar-actions">
          <button className="secondary-button" onClick={copyRoomId}>
            {isCopied ? "Copied" : "Copy Room ID"}
          </button>
          <button className="danger-button" onClick={leaveRoom}>Leave Room</button>
        </div>
      </aside>

      <main className="workspace">
        <div className="workspace-toolbar">
          <div>
            <p className="eyebrow">Shared Editor</p>
            <h3>Monaco Editor with real-time sync</h3>
          </div>

          <div className="toolbar-actions">
            <select value={language} onChange={handleLanguageChange}>
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <button className="primary-button" onClick={runCode} disabled={isCompiling}>
              {isCompiling ? "Running..." : "Run Code"}
            </button>
          </div>
        </div>

        <section className="editor-panel">
          <Editor code={code} language={language} onChange={handleCodeChange} />
        </section>

        <section className="output-panel">
          <div className="output-header">
            <h4>Execution Result</h4>
            <span>Live compile feedback</span>
          </div>

          <div className="output-grid">
            <OutputBlock title="Output" content={compileResult?.output} fallback="Run your code to see standard output." />
            <OutputBlock title="Program Errors" content={compileResult?.programError} fallback="Runtime errors will appear here." isError />
            <OutputBlock title="Compiler Errors" content={compileResult?.compilerError} fallback="Compilation issues will appear here." isError />
            <OutputBlock title="Compiler Logs" content={compileResult?.compilerOutput} fallback="Additional compiler logs will appear here." />
          </div>
        </section>
      </main>
    </div>
  );
}

function OutputBlock({ title, content, fallback, isError = false }) {
  return (
    <div className={`output-card ${isError ? "error-card" : ""}`}>
      <h5>{title}</h5>
      <pre>{content || fallback}</pre>
    </div>
  );
}

export default EditorPage;
