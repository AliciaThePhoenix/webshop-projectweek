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
