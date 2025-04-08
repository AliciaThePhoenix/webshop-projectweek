const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.post('/api/query', async (req, res) => {
    const { prompt } = req.body;

    try {
        const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
            model: 'deepseek-r1:8b',
            prompt: prompt,
            stream: false
        });

        res.json({ response: ollamaResponse.data.response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error communicating with Ollama model." });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
