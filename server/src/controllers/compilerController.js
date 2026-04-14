const axios = require('axios');

const compileCode = async (req, res) => {
    const { language, code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    try {
        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
            language: language || 'python',
            version: '*',
            files: [
                {
                    content: code,
                },
            ],
        });

        const { run } = response.data;
        res.json({
            output: run.output,
            stderr: run.stderr,
            stdout: run.stdout,
        });
    } catch (error) {
        console.error('Compiler error:', error.message);
        res.status(500).json({ error: 'Failed to compile code' });
    }
};

module.exports = { compileCode };
