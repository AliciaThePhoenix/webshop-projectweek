document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // API endpoint
    const apiEndpoint = '../../back-end/api/chat-proxy.php';
    
    // Update cart count when page loads (reusing existing function)
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    
    // Function to add a message to the chat
    function addMessage(message, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = message;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot-message', 'loading');
        loadingDiv.id = 'typing-indicator';
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content', 'typing-indicator');
        
        // Create dots
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            contentDiv.appendChild(dot);
        }
        
        loadingDiv.appendChild(contentDiv);
        chatMessages.appendChild(loadingDiv);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            chatMessages.removeChild(indicator);
        }
    }
    
    // Function to send message to API
    async function sendMessageToAPI(message) {
        try {
            // Show typing indicator while waiting for response
            showTypingIndicator();
            
            // Disable input and button while waiting
            userInput.disabled = true;
            sendButton.disabled = true;
            
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });
            
            // Re-enable input and button
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
            
            // Remove typing indicator
            removeTypingIndicator();
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                addMessage('Sorry, er is een fout opgetreden. Probeer het later nog eens.', false);
                return;
            }
            
            const data = await response.json();
            
            if (data && data.choices && data.choices.length > 0 && data.choices[0].message) {
                // Extract and display the bot's response
                const botResponse = data.choices[0].message.content;
                addMessage(botResponse, false);
            } else {
                console.error('Unexpected API response:', data);
                addMessage('Sorry, ik heb een onverwacht antwoord ontvangen. Probeer het nog eens.', false);
            }
        } catch (error) {
            console.error('Error:', error);
            removeTypingIndicator();
            userInput.disabled = false;
            sendButton.disabled = false;
            addMessage('Sorry, er is een fout opgetreden bij het verwerken van je vraag. Probeer het later nog eens.', false);
        }
    }
    
    // Event listener for form submission
    chatForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const message = userInput.value.trim();
        if (message) {
            // Add user message to chat
            addMessage(message, true);
            
            // Clear input field
            userInput.value = '';
            
            // Send message to API
            sendMessageToAPI(message);
        }
    });
    
    // Focus input field when page loads
    userInput.focus();
});
