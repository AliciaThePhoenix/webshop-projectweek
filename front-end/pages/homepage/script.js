async function submitPrompt() {
    // Haalt de tekst op uit het tekstveld met id="prompt"
    const prompt = document.getElementById('prompt').value;
    // Haalt het element op waar de respons zal worden getoond
    const responseDiv = document.getElementById('response');
    
    // Toont een laadmelding terwijl we wachten op het antwoord van de AI
    responseDiv.textContent = 'Generating response...';

    try {
        const response = await fetch('http://localhost:3001/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        // Controleert of het verzoek succesvol was; zo niet, gooit een foutmelding
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        // Toont de respons van de AI in het responseDiv element
        responseDiv.textContent = data.response;
    } catch (error) {
        // Logt eventuele fouten in de console voor ontwikkelaars
        console.error('Error:', error);
        // Toont een foutmelding aan de gebruiker
        responseDiv.textContent = 'Error fetching response.';
    }
}

// Function to detect if the input is a question
function isQuestion(text) {
    // List of question words in Dutch and English
    const questionWords = ['wat', 'waar', 'wanneer', 'wie', 'waarom', 'hoe', 'welke', 'kan', 'kunt', 'zou', 'zouden', 'is', 'zijn', 'heeft', 'hebben', 'what', 'where', 'when', 'why', 'how'];
    const words = text.toLowerCase().trim().split(' ');
    
    // Check if the text ends with a question mark or starts with a question word
    return text.endsWith('?') || questionWords.some(word => words[0] === word);
}

// Function to handle the search/question input
async function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.querySelector('.search-container input');
    const searchText = searchInput.value.trim();

    if (!searchText) return; // Don't do anything if the input is empty

    if (isQuestion(searchText)) {
        // If it's a question about medicine or health, handle it directly
        if (searchText.toLowerCase().includes('medicine') || 
            searchText.toLowerCase().includes('headache') || 
            searchText.toLowerCase().includes('pain') ||
            searchText.toLowerCase().includes('medicijn') || 
            searchText.toLowerCase().includes('hoofdpijn') || 
            searchText.toLowerCase().includes('pijn')) {
            
            try {
                // Show loading state
                searchInput.disabled = true;
                const loadingDot = document.createElement('div');
                loadingDot.className = 'loading-dots';
                loadingDot.innerHTML = 'Searching<span>.</span><span>.</span><span>.</span>';
                searchInput.parentNode.appendChild(loadingDot);

                // Make API call to chatbot
                const response = await fetch('http://localhost:3001/api/query', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prompt: searchText })
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                
                // Remove loading state
                searchInput.disabled = false;
                if (loadingDot) loadingDot.remove();

                // Create and show the answer modal
                showAnswerModal(searchText, data.response);
            } catch (error) {
                console.error('Error:', error);
                // Redirect to chatbot page with the question if API fails
                sessionStorage.setItem('pendingQuestion', searchText);
                window.location.href = '../../HTML/chatbot.html';
            }
        } else {
            // For other types of questions, redirect to chatbot
            sessionStorage.setItem('pendingQuestion', searchText);
            window.location.href = '../../HTML/chatbot.html';
        }
    } else {
        // If it's not a question, search for products
        sessionStorage.setItem('searchTerm', searchText);
        window.location.href = '../../HTML/producten.html';
    }
}

// Function to create and show the answer modal
function showAnswerModal(question, answer) {
    // Remove any existing modal
    const existingModal = document.querySelector('.answer-modal');
    if (existingModal) existingModal.remove();

    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'answer-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Antwoord op uw vraag</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p class="question"><strong>Vraag:</strong> ${question}</p>
                <p class="answer"><strong>Antwoord:</strong> ${answer}</p>
            </div>
            <div class="modal-footer">
                <button class="chat-more-btn">Chat verder</button>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.appendChild(modal);

    // Add event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const chatMoreBtn = modal.querySelector('.chat-more-btn');

    closeBtn.addEventListener('click', () => modal.remove());
    chatMoreBtn.addEventListener('click', () => {
        sessionStorage.setItem('pendingQuestion', question);
        window.location.href = '../../HTML/chatbot.html';
    });

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .answer-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
            background: white;
            border-radius: 15px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h3 {
            margin: 0;
            color: #333;
        }

        .close-modal {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }

        .modal-body {
            padding: 20px;
        }

        .question, .answer {
            margin-bottom: 15px;
            line-height: 1.5;
        }

        .modal-footer {
            padding: 20px;
            border-top: 1px solid #eee;
            text-align: right;
        }

        .chat-more-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .chat-more-btn:hover {
            background: #45a049;
            transform: translateY(-2px);
        }

        .loading-dots {
            position: absolute;
            right: 60px;
            top: 50%;
            transform: translateY(-50%);
            color: #666;
        }

        .loading-dots span {
            animation: dots 1.5s infinite;
            opacity: 0;
        }

        .loading-dots span:nth-child(2) { animation-delay: 0.5s; }
        .loading-dots span:nth-child(3) { animation-delay: 1s; }

        @keyframes dots {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-container');
    const searchInput = searchForm.querySelector('input');
    const searchButton = searchForm.querySelector('.search-btn');

    // Handle form submission
    searchForm.addEventListener('submit', handleSearch);

    // Handle search button click
    searchButton.addEventListener('click', handleSearch);

    // Handle enter key press
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleSearch(event);
        }
    });
});
