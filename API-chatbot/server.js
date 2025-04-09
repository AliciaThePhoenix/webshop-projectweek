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
        
        // Basic validation
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Invalid message format. Please provide a text message.' });
        }

        // Verify API key is configured
        if (!process.env.MISTRAL_API_KEY) {
            console.error('Mistral API key is missing in environment variables');
            return res.status(500).json({ error: 'API configuration error. Please check server configuration.' });
        }

        console.log('Sending request to Mistral API with message:', message.substring(0, 50) + '...');
        console.log('Using API key:', process.env.MISTRAL_API_KEY.substring(0, 5) + '...');
        
        // Debug the request payload
        const requestPayload = {
            model: "mistral-tiny",
            messages: [
                { role: "user", content: message }
            ]
        };
        console.log('Request payload:', JSON.stringify(requestPayload, null, 2));
        
        const response = await axios.post('https://api.mistral.ai/v1/chat/completions', requestPayload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
            },
            timeout: 30000 // 30 second timeout
        });
        
        // Validate response format before sending
        if (!response.data || !response.data.choices || !response.data.choices[0]) {
            console.error('Unexpected API response format:', JSON.stringify(response.data));
            return res.status(500).json({ error: 'Invalid response from Mistral API' });
        }
        
        console.log('Received valid response from Mistral API');
        res.json(response.data);
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            status: error.response?.status,
            responseData: error.response?.data,
            stack: error.stack
        });
        
        // More specific error messages based on error type
        if (error.response?.status === 401) {
            return res.status(500).json({ error: 'Authentication failed with Mistral API. Check your API key.' });
        } else if (error.response?.status === 429) {
            return res.status(500).json({ error: 'Rate limit exceeded with Mistral API.' });
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            return res.status(500).json({ error: 'Could not connect to Mistral API. Network issue or service may be down.' });
        }
        
        res.status(500).json({ 
            error: 'Failed to fetch from Mistral API',
            details: error.response?.data?.error?.message || error.message
        });
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
