document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Function to add a message to the chat
    function addMessage(message, isUser) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        
        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to send a message to the server
    async function sendMessage(message) {
        try {
            // Add a loading indicator
            const loadingElement = document.createElement('div');
            loadingElement.classList.add('message', 'bot-message', 'loading');
            loadingElement.innerHTML = 'Thinking<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
            chatMessages.appendChild(loadingElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            // Remove loading indicator
            chatMessages.removeChild(loadingElement);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Check if we have a valid response from Mistral AI
            if (data && data.choices && data.choices.length > 0 && data.choices[0].message) {
                const botResponse = data.choices[0].message.content;
                addMessage(botResponse, false);
            } else if (data && data.error) {
                // Handle specific error from our API
                console.error('API Error:', data.error);
                addMessage(`Error: ${data.error}`, false);
            } else {
                console.error('Unexpected data structure:', data);
                addMessage('Sorry, I received an unexpected response. Please try again.', false);
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, there was an error processing your request. Please try again later.', false);
        }
    }

    // Event listener for send button
    sendButton.addEventListener('click', function() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            sendMessage(message);
        }
    });

    // Event listener for Enter key
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, true);
                userInput.value = '';
                sendMessage(message);
            }
        }
    });

    // Add welcome message
    addMessage('Hello! How can I help you today?', false);
});
