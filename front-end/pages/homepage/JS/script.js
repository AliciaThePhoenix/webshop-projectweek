// Function to detect if input is a product search
function isProductSearch(text) {
    const productKeywords = [
        'medicijn', 'medicine', 'pil', 'pill', 'tablet', 'capsule',
        'vitamine', 'vitamin', 'supplement', 'medicatie', 'medication',
        'pijnstiller', 'painkiller', 'paracetamol', 'ibuprofen', 'aspirin',
        'zalf', 'creme', 'spray', 'druppels', 'drops', 'gel', 'lotion',
        'hoest', 'cough', 'griep', 'flu', 'verkoudheid', 'cold',
        'allergie', 'allergy', 'maag', 'stomach', 'darm', 'intestinal',
        'oog', 'eye', 'oor', 'ear', 'neus', 'nose', 'keel', 'throat'
    ];
    
    const lowercaseText = text.toLowerCase();
    return productKeywords.some(keyword => lowercaseText.includes(keyword));
}

// Function to show invalid search message
function showInvalidSearchMessage(searchText) {
    const container = createAnswerContainer();
    container.innerHTML = `
        <div class="qa-box">
            <div class="question-box" style="background: linear-gradient(135deg, #dc3545, #c82333);">
                Ongeldige zoekopdracht
            </div>
            <div class="answer-box" style="border-left: 4px solid #dc3545;">
                <p>"${searchText}" lijkt niet gerelateerd aan medicijnen of gezondheidsproducten.</p>
                <p>U kunt zoeken naar:</p>
                <ul style="margin-top: 10px; margin-bottom: 15px;">
                    <li>Medicijnen (bijv. paracetamol, ibuprofen)</li>
                    <li>Vitamines en supplementen</li>
                    <li>Gezondheidsproducten</li>
                    <li>Symptomen of klachten</li>
                </ul>
                <p>Of stel een gezondheidsgerelateerde vraag.</p>
            </div>
            <div class="answer-actions">
                <button class="action-btn clear-answer">Wissen</button>
            </div>
        </div>
    `;
    container.classList.add('visible');

    // Add event listener for clear button
    container.querySelector('.clear-answer').addEventListener('click', () => {
        container.innerHTML = '';
        container.classList.remove('visible');
    });
}

// Function to detect if the input is a question
function isQuestion(text) {
    // First, check if it ends with a question mark
    if (text.trim().endsWith('?')) {
        return true;
    }

    // Then check for question words if no question mark
    const questionWords = [
        'wat', 'waar', 'wanneer', 'wie', 'waarom', 'hoe', 'welke',
        'kan', 'kunt', 'zou', 'zouden', 'is', 'zijn', 'heeft', 'hebben',
        'what', 'where', 'when', 'why', 'how', 'which', 'can', 'could'
    ];
    const firstWord = text.toLowerCase().trim().split(' ')[0];
    return questionWords.includes(firstWord);
}

// Function to check if search is health-related
function isHealthRelated(text) {
    const healthKeywords = [
        // Medicines and supplements
        'medicijn', 'medicine', 'pil', 'pill', 'tablet', 'capsule',
        'vitamine', 'vitamin', 'supplement', 'medicatie', 'medication',
        'pijnstiller', 'painkiller', 'paracetamol', 'ibuprofen', 'aspirin',
        'zalf', 'creme', 'spray', 'druppels', 'drops', 'gel', 'lotion',
        
        // Symptoms and conditions
        'hoest', 'cough', 'griep', 'flu', 'verkoudheid', 'cold',
        'allergie', 'allergy', 'maag', 'stomach', 'darm', 'intestinal',
        'pijn', 'pain', 'koorts', 'fever', 'hoofdpijn', 'headache',
        'misselijk', 'nausea', 'duizelig', 'dizzy', 'moe', 'tired',
        'gezondheid', 'health', 'ziekte', 'illness', 'symptoom', 'symptom',
        
        // Body parts
        'oog', 'eye', 'oor', 'ear', 'neus', 'nose', 'keel', 'throat',
        'hart', 'heart', 'long', 'lung', 'lever', 'liver', 'nier', 'kidney',
        'spier', 'muscle', 'gewricht', 'joint', 'huid', 'skin',
        
        // General health terms
        'apotheek', 'pharmacy', 'dokter', 'doctor', 'arts', 'physician',
        'behandeling', 'treatment', 'advies', 'advice', 'bijwerking', 'side effect',
        'dosis', 'dosage', 'gebruik', 'usage', 'innemen', 'take'
    ];

    const lowercaseText = text.toLowerCase();
    return healthKeywords.some(keyword => lowercaseText.includes(keyword));
}

// Function to create or update the answer container
function createAnswerContainer() {
    let container = document.querySelector('.answer-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'answer-container';
        const heroSection = document.querySelector('.hero-section');
        heroSection.appendChild(container);

        // Add styles for the answer container
        const style = document.createElement('style');
        style.textContent = `
            .answer-container {
                width: 90%;
                max-width: 800px;
                margin: 20px auto;
                opacity: 0;
                transform: translateY(-20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            .answer-container.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .qa-box {
                background: white;
                border-radius: 15px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                margin-bottom: 20px;
                overflow: hidden;
                animation: slideIn 0.3s ease-out;
            }

            .question-box {
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                padding: 15px 20px;
                font-weight: 500;
            }

            .answer-box {
                padding: 20px;
                background: #fff;
                border-left: 4px solid #4CAF50;
                margin: 10px;
                border-radius: 0 10px 10px 0;
            }

            .answer-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 10px 20px;
                background: #f9f9f9;
            }

            .action-btn {
                padding: 8px 15px;
                border-radius: 20px;
                border: none;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 14px;
            }

            .search-related {
                background: #4CAF50;
                color: white;
            }

            .clear-answer {
                background: #f0f0f0;
                color: #666;
            }

            .action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .loading-box {
                background: white;
                border-radius: 15px;
                padding: 20px;
                text-align: center;
                color: #666;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }

            .loading-dots {
                display: inline-block;
            }

            .loading-dots span {
                display: inline-block;
                animation: dots 1.5s infinite;
                opacity: 0;
            }

            .loading-dots span:nth-child(2) { animation-delay: 0.5s; }
            .loading-dots span:nth-child(3) { animation-delay: 1s; }

            @keyframes dots {
                0%, 100% { opacity: 0; }
                50% { opacity: 1; }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    return container;
}

// Function to show loading state
function showLoading() {
    const container = createAnswerContainer();
    container.innerHTML = `
        <div class="loading-box">
            <div class="loading-dots">
                Bezig met zoeken<span>.</span><span>.</span><span>.</span>
            </div>
        </div>
    `;
    container.classList.add('visible');
}

// Function to show the answer
function showAnswer(question, answer) {
    const container = createAnswerContainer();
    container.innerHTML = `
        <div class="qa-box">
            <div class="question-box">
                ${question}
            </div>
            <div class="answer-box">
                ${answer}
            </div>
            <div class="answer-actions">
                <button class="action-btn clear-answer">Wissen</button>
                <button class="action-btn search-related">Zoek gerelateerde producten</button>
            </div>
        </div>
    `;
    container.classList.add('visible');

    // Add event listeners
    container.querySelector('.clear-answer').addEventListener('click', () => {
        container.innerHTML = '';
        container.classList.remove('visible');
    });

    container.querySelector('.search-related').addEventListener('click', () => {
        sessionStorage.setItem('searchTerm', question.replace('?', ''));
        window.location.href = '../../HTML/producten.html';
    });
}

// Function to handle the search/question input
async function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.querySelector('.search-container input');
    const searchText = searchInput.value.trim();

    if (!searchText) return;

    // First check if it's a question (by ? or question words)
    if (isQuestion(searchText)) {
        try {
            // Show loading state
            showLoading();
            searchInput.disabled = true;

            // Make API call to Mistral AI
            const response = await fetch(API_CONFIG.endpoint, {
                method: 'POST',
                headers: API_CONFIG.headers,
                body: JSON.stringify({
                    model: "mistral-tiny",
                    messages: [
                        {
                            role: "system",
                            content: API_CONFIG.systemMessage
                        },
                        {
                            role: "user",
                            content: searchText
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }

            const data = await response.json();
            
            // Enable input and show answer
            searchInput.disabled = false;
            
            // Extract the response from the API result
            let botResponse = "";
            if (data.choices && data.choices[0] && data.choices[0].message) {
                botResponse = data.choices[0].message.content;
            } else {
                botResponse = "Sorry, ik kon geen antwoord genereren. Probeer het later opnieuw.";
            }

            // Format the response text with line breaks
            botResponse = botResponse.replace(/\n/g, '<br>');

            showAnswer(searchText, botResponse);
            
        } catch (error) {
            console.error('Error:', error);
            // Show error message in answer container with more specific instructions
            const container = createAnswerContainer();
            container.innerHTML = `
                <div class="qa-box">
                    <div class="question-box">
                        ${searchText}
                    </div>
                    <div class="answer-box" style="color: #dc3545;">
                        <p>Sorry, er is een fout opgetreden bij het verwerken van uw vraag.</p>
                        <p>Error details: ${error.message}</p>
                        <p>Probeer het volgende:</p>
                        <ul>
                            <li>Ververs de pagina en probeer opnieuw</li>
                            <li>Controleer uw internetverbinding</li>
                            <li>Stel uw vraag op een andere manier</li>
                        </ul>
                    </div>
                    <div class="answer-actions">
                        <button class="action-btn clear-answer">Wissen</button>
                        <button class="action-btn search-related">Zoek gerelateerde producten</button>
                    </div>
                </div>
            `;
            container.classList.add('visible');
            searchInput.disabled = false;
        }
        return; // Exit after handling question
    }

    // Check if the search is health-related
    if (!isHealthRelated(searchText)) {
        showInvalidSearchMessage(searchText);
        return;
    }

    // If it's not a question, check if it's a product search
    if (isProductSearch(searchText)) {
        // If it's a product search, redirect to products page
        sessionStorage.setItem('searchTerm', searchText);
        window.location.href = '../../HTML/producten.html';
        return;
    }

    // If it's not clearly a product, try product search as fallback
    sessionStorage.setItem('searchTerm', searchText);
    window.location.href = '../../HTML/producten.html';
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