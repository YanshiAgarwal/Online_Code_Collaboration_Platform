const axios = require("axios");

// We use the Wandbox API (free, no API key needed) to run code
// Wandbox docs: https://github.com/melpon/wandbox/blob/master/kennel2/API.md

// Map frontend language names → Wandbox compiler names
const LANGUAGE_MAP = {
    python3: "cpython-3.12.7",
    java: "openjdk-jdk-22+36",
    cpp: "gcc-head",
    c: "gcc-head-c",
    nodejs: "nodejs-20.17.0",
    ruby: "ruby-4.0.2",
    go: "go-1.23.2",
    bash: "bash",
    php: "php-8.3.12",
    rust: "rust-1.82.0",
    swift: "swift-6.0.1",
    csharp: "mono-6.12.0.199",
    r: "r-4.4.1",
    scala: "scala-3.5.1",
    pascal: "fpc-3.2.2",
    sql: "sqlite-3.46.1",
};

const compileCode = async (req, res) => {
    const { code, language } = req.body;

    // If no code is sent, return an error
    if (!code) {
        return res.status(400).json({ error: "Code is required" });
    }

    // Find the correct Wandbox compiler for this language
    const compiler = LANGUAGE_MAP[language];
    if (!compiler) {
        return res.status(400).json({ error: `Language "${language}" is not supported` });
    }

    try {
        // Send code to Wandbox API
        const response = await axios.post("https://wandbox.org/api/compile.json", {
            code: code,
            compiler: compiler,
        });

        const data = response.data;

        // Check if there was a compilation/runtime error
        if (data.program_error && !data.program_output) {
            res.json({ output: data.program_error });
        } else {
            res.json({ output: data.program_output || "No output" });
        }
    } catch (error) {
        console.error("Compiler error:", error.message);
        res.status(500).json({ error: "Failed to compile code" });
    }
};

module.exports = { compileCode };
