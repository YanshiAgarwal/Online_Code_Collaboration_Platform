import React from "react";
import MonacoEditor from "@monaco-editor/react";

function Editor({ code, language, onChange }) {
  return (
    <MonacoEditor
      height="100%"
      theme="vs-dark"
      language={language}
      value={code}
      onChange={(value) => onChange(value || "")}
      options={{
        minimap: { enabled: false },
        fontSize: 15,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: "on",
      }}
    />
  );
}

export default Editor;
