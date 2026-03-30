import Editor from "@monaco-editor/react";

export default function CodeEditor({ socket, code, setCode }) {

  function handleChange(value) {
    setCode(value);
    socket.emit("code-change", value);
  }

  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      value={code}
      onChange={handleChange}
    />
  );
}