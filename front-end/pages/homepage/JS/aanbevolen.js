// Deze code wordt uitgevoerd zodra de DOM volledig is geladen
document.addEventListener('DOMContentLoaded', function() {
    // Tijdelijke data die later vervangen kan worden door echte data uit een database/API
    const recommendedData = [
      {
        // URL naar de afbeelding van het product
        image: "../images/placeholder.png",
        // Titel van het aanbevolen product
        title: "Medicijn Titel 1",
        // Korte beschrijving van het product
        description: "Helpt bij hoofdpijn"
      },
      {
        image: "../images/placeholder.png",
        title: "Medicijn Titel 2",
        description: "Verlicht spierpijn"
      },
      {
        image: "../images/placeholder.png",
        title: "Medicijn Titel 3",
        description: "Ondersteunt de immuniteit"
      }
      // Je kunt hier meer items toevoegen indien nodig
    ];
  
    // Haalt de container op waar de aanbevolen items in komen
    const container = document.getElementById('recommended-container');
  
    // Voor elk item in de recommendedData array maken we een HTML-element
    recommendedData.forEach(item => {
      // Maakt een nieuw div-element aan
      const itemDiv = document.createElement('div');
      // Voegt de CSS-klasse 'recommended-item' toe aan het element
      itemDiv.className = 'recommended-item';
      
      // Vult het element met HTML-inhoud gebaseerd op de item-gegevens
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="Medicijn afbeelding">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      `;
      
      // Voegt het nieuwe element toe aan de container
      container.appendChild(itemDiv);
    });
});