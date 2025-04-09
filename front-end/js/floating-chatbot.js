document.addEventListener('DOMContentLoaded', function() {
    // Create floating chatbot elements
    const floatingChatbot = document.createElement('div');
    floatingChatbot.className = 'floating-chatbot';
    
    const chatbotButton = document.createElement('button');
    chatbotButton.className = 'chatbot-button';
    chatbotButton.innerHTML = '<img src="../../images/chatbot-icon.svg" alt="Chatbot">';
    
    const miniChatbot = document.createElement('div');
    miniChatbot.className = 'mini-chatbot';
    miniChatbot.innerHTML = `
        <div class="mini-chatbot-header">
            <h3>Gezondheidsadviseur</h3>
            <p>Uw persoonlijke apotheek assistent</p>
        </div>
        <div class="mini-chatbot-messages">
            <div class="welcome-message">
                Hallo! Ik ben uw virtuele gezondheidsadviseur. 
                Hoe kan ik u vandaag helpen met uw vragen over gezondheid en medicijnen?
            </div>
        </div>
        <div class="mini-chatbot-input">
            <input type="text" placeholder="Stel uw vraag hier...">
            <button>Versturen</button>
        </div>
    `;
    
    floatingChatbot.appendChild(chatbotButton);
    floatingChatbot.appendChild(miniChatbot);
    document.body.appendChild(floatingChatbot);
    
    // Toggle mini chatbot visibility
    chatbotButton.addEventListener('click', function() {
        miniChatbot.classList.toggle('active');
        if (miniChatbot.classList.contains('active')) {
            miniChatbot.querySelector('input').focus();
        }
    });
    
    // Handle sending messages
    const input = miniChatbot.querySelector('input');
    const sendButton = miniChatbot.querySelector('button');
    const messagesContainer = miniChatbot.querySelector('.mini-chatbot-messages');
    
    async function sendMessage() {
        const message = input.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            input.value = '';
            
            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.innerHTML = '<span></span><span></span><span></span>';
            messagesContainer.appendChild(typingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            try {
                // Call Mistral API
                const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer vHrsX9bWGF3AW7fR0hblwIQzSekJQHa1'
                    },
                    body: JSON.stringify({
                        model: "mistral-tiny",
                        messages: [
                            {
                                role: "system",
                                content: "Je bent een gezondheidsadviseur voor een apotheek. Geef korte, duidelijke antwoorden over gezondheid en medicijnen. Als je iets niet zeker weet, zeg dat dan."
                            },
                            {
                                role: "user",
                                content: message
                            }
                        ]
                    })
                });
                
                const data = await response.json();
                
                // Add slight delay to make the typing indicator more visible
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Remove typing indicator
                typingIndicator.remove();
                
                // Add bot response
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    addMessage(data.choices[0].message.content, 'bot');
                } else {
                    addMessage('Sorry, ik kon geen antwoord genereren. Probeer het later opnieuw.', 'bot');
                }
            } catch (error) {
                // Remove typing indicator
                typingIndicator.remove();
                
                // Add error message
                addMessage('Er is een fout opgetreden bij het verwerken van uw vraag. Probeer het later opnieuw.', 'bot');
                console.error('Error:', error);
            }
        }
    }
    
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `mini-message ${type}-mini-message`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}); 