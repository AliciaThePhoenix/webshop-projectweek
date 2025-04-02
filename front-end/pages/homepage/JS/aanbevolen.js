document.addEventListener('DOMContentLoaded', function() {
    // Placeholder data: replace these values with real data when linked to your database/API.
    const recommendedData = [
      {
        image: "../images/placeholder.png",
        title: "Medicijn Titel 1",
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
      // You can add more items as needed.
    ];
  
    const container = document.getElementById('recommended-container');
  
    // Dynamically create and append recommended items.
    recommendedData.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'recommended-item';
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="Medicijn afbeelding">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      `;
      container.appendChild(itemDiv);
    });
  });  