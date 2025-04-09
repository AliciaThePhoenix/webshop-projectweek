require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7860;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the chatbot page
app.get('/chatbot', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chatbot.html'));
});

// API endpoint for chatbot
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
            model: "mistral-tiny",
            messages: [
                { role: "user", content: message }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch from Mistral API' });
    }
});

// Add a test endpoint to check if the server is working
app.get('/status', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Chatbot page available at: http://localhost:${PORT}/chatbot`);
});
