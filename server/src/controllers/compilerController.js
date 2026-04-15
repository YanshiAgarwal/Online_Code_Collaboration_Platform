const axios = require("axios");

const LANGUAGE_MAP = {
  javascript: "nodejs-20.17.0",
  python: "cpython-3.12.7",
  java: "openjdk-jdk-22+36",
  cpp: "gcc-head",
  c: "gcc-head-c",
  go: "go-1.23.2",
  rust: "rust-1.82.0",
  php: "php-8.3.12",
};

async function compileCode(req, res) {
  const { code, language } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  const compiler = LANGUAGE_MAP[language];

  if (!compiler) {
    return res.status(400).json({ error: `Language \"${language}\" is not supported` });
  }

  try {
    const response = await axios.post("https://wandbox.org/api/compile.json", {
      code,
      compiler,
    });

    const data = response.data;

    return res.json({
      output: data.program_output || "",
      programError: data.program_error || "",
      compilerError: data.compiler_error || "",
      compilerOutput: data.compiler_output || "",
      status: data.status || 0,
      signal: data.signal || null,
    });
  } catch (error) {
    console.error("Compiler error:", error.message);
    return res.status(500).json({ error: "Failed to compile code" });
  }
}

module.exports = { compileCode, LANGUAGE_MAP };
