// Controleert de inlogstatus wanneer het document is geladen
document.addEventListener('DOMContentLoaded', function() {
  // Roept de functie aan om de inlogstatus te controleren
  checkLoginStatus();
});

// Functie om te controleren of de gebruiker is ingelogd
function checkLoginStatus() {
  // Gebruikt een absoluut pad vanaf de serverroot om te zorgen dat het werkt vanaf elke pagina
  fetch('/Hakathon/webshop-projectweek/back-end/database/check_login.php')
    .then(response => response.json())
    .then(data => {
      // Werk de UI bij op basis van de inlogstatus
      updateUI(data);
    })
    .catch(error => {
      // Log eventuele fouten naar de console
      console.error('Error checking login status:', error);
    });
}

// Update de UI op basis van de inlogstatus
function updateUI(data) {
  // Haalt het profielmenu en de gebruikersgroet op
  const profileMenu = document.querySelector('.profile-menu ul');
  const userGreeting = document.getElementById('user-greeting');
  
  if (data.loggedin) {
    // Gebruiker is ingelogd
    profileMenu.innerHTML = `
      <li><span>Welkom, ${data.username}</span></li>
      <li><a href="/Hakathon/webshop-projectweek/front-end/pages/account/account.html">Mijn account</a></li>
      <li><a href="/Hakathon/webshop-projectweek/back-end/database/logout.php">Uitloggen</a></li>
    `;
    
    // Update begroetingstekst als deze bestaat
    if (userGreeting) {
      userGreeting.textContent = `Welkom, ${data.username}!`;
      userGreeting.style.display = 'block';
    }
    
    // Voeg een 'logged-in' klasse toe aan body voor extra styling indien nodig
    document.body.classList.add('logged-in');
    
    // Toon admin-opties als de gebruiker admin is
    if (data.is_admin) {
      // Voeg admin-specifieke menu-items toe
      profileMenu.innerHTML += `<li><a href="#">Admin Panel</a></li>`;
      document.body.classList.add('admin-user');
    }
  } else {
    // Gebruiker is niet ingelogd
    profileMenu.innerHTML = `
      <li><a href="/Hakathon/webshop-projectweek/front-end/pages/login/login.html">Log in</a></li>
      <li><a href="/Hakathon/webshop-projectweek/front-end/pages/register/register.html">Registratie</a></li>
    `;
    
    // Verberg begroetingstekst als deze bestaat
    if (userGreeting) {
      userGreeting.style.display = 'none';
    }
    
    // Verwijder 'logged-in' en 'admin-user' klassen van body
    document.body.classList.remove('logged-in');
    document.body.classList.remove('admin-user');
  }
}
