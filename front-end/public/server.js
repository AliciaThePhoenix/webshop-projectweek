require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = express(); // ✅ MOVE THIS UP BEFORE USING `app`

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// OpenAI config
const openai = new OpenAI({
    //
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const resp = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: req.body.question }
            ]
        });

        res.status(200).json({ message: resp.choices[0].message.content });
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: e.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});