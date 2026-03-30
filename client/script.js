const socket = io("http://localhost:5000");

// Monaco setup
require.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.34.1/min/vs",
  },
});

require(["vs/editor/editor.main"], function () {

  const editor = monaco.editor.create(document.getElementById("editor"), {
    value: "// start coding...",
    language: "javascript",
    theme: "vs-dark",
    automaticLayout: true
  });

  // Send changes
  editor.onDidChangeModelContent(() => {
    socket.emit("code-change", editor.getValue());
  });

  // Receive updates
  socket.on("code-update", (code) => {
    if (editor.getValue() !== code) {
      editor.setValue(code);
    }
  });

});