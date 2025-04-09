async function submitPrompt() {
    const prompt = document.getElementById('prompt').value;
    const responseDiv = document.getElementById('response');
    
    responseDiv.textContent = 'Generating response...';

    try {
        const response = await fetch('http://localhost:3001/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        responseDiv.textContent = data.response;
    } catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = 'Error fetching response.';
    }
}
