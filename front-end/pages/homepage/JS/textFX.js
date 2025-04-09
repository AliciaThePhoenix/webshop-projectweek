// Deze code wordt uitgevoerd zodra de DOM volledig is geladen (alle HTML-elementen zijn beschikbaar)
document.addEventListener('DOMContentLoaded', () => {
    // Initialiseert de Splitting.js bibliotheek
    // Deze splitst text op in individuele letters op basis van het data-splitting attribuut
    Splitting();
    
    // Selecteert alle individuele tekens die door Splitting.js zijn gegenereerd
    const chars = document.querySelectorAll('.animated-text .char');
    
    // Voor elk teken voeren we de volgende acties uit
    chars.forEach((char, index) => {
      // Genereert een willekeurige offset tussen -5px en 5px voor de x-as
      // toFixed(2) rondt af op 2 decimalen voor betere prestaties
      const offsetX = (Math.random() * 10 - 5).toFixed(2) + 'px';
      
      // Genereert een willekeurige offset tussen -5px en 5px voor de y-as
      const offsetY = (Math.random() * 10 - 5).toFixed(2) + 'px';
      
      // Stelt CSS-variabelen in die in de CSS-animatie worden gebruikt
      char.style.setProperty('--offset-x', offsetX);
      char.style.setProperty('--offset-y', offsetY);
      
      // Stelt een vertraagde start in voor elk teken (50ms per teken)
      // Dit zorgt voor het getrapte animatie-effect
      char.style.animationDelay = `${index * 0.05}s`;
    });
});