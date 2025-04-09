//async function betekent waiting//
async function submitPrompt() {
    const prompt = document.getElementById('prompt').value;
    const responseDiv = document.getElementById('response');
    
    responseDiv.textContent = 'Generating response...';

    try {
        //pakt data op van local host 3001//
        const response = await fetch('http://localhost:3001/api/query', {
            //stuurt data naar local host 3001//
            method: 'POST',
            //als json format//
            headers: {
                'Content-Type': 'application/json'
            },
            //hier is de text die gestuurt wordt en veranderd wordt naar json//
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        //wacht response data in json formaat//
        const data = await response.json();
        responseDiv.textContent = data.response;
    } catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = 'Error fetching response.';
    }
}
