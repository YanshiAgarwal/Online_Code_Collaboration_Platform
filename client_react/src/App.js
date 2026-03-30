import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import CodeEditor from "./CodeEditor";

const socket = io("http://localhost:5000");

function App() {
  const [code, setCode] = useState("");

  useEffect(() => {
    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("code-update");
    };
  }, []);

  return (
    <div>
      <h2>Live Code Editor</h2>
      <CodeEditor socket={socket} code={code} setCode={setCode} />
    </div>
  );
}

export default App;