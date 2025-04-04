// Check login status when document is loaded
document.addEventListener('DOMContentLoaded', function() {
  checkLoginStatus();
});

// Function to check if user is logged in
function checkLoginStatus() {
  // Using absolute path from server root to ensure it works from any page
  fetch('/Hakathon/webshop-projectweek/back-end/database/check_login.php')
    .then(response => response.json())
    .then(data => {
      updateUI(data);
    })
    .catch(error => {
      console.error('Error checking login status:', error);
    });
}

// Update UI based on login status
function updateUI(data) {
  const profileMenu = document.querySelector('.profile-menu ul');
  const userGreeting = document.getElementById('user-greeting');
  
  if (data.loggedin) {
    // User is logged in
    profileMenu.innerHTML = `
      <li><span>Welkom, ${data.username}</span></li>
      <li><a href="/Hakathon/webshop-projectweek/front-end/pages/account/account.html">Mijn account</a></li>
      <li><a href="/Hakathon/webshop-projectweek/back-end/database/logout.php">Uitloggen</a></li>
    `;
    
    // Update greeting text if it exists
    if (userGreeting) {
      userGreeting.textContent = `Welkom, ${data.username}!`;
      userGreeting.style.display = 'block';
    }
    
    // Add 'logged-in' class to body for additional styling if needed
    document.body.classList.add('logged-in');
    
    // Show admin options if user is admin
    if (data.is_admin) {
      // Add admin-specific menu items
      profileMenu.innerHTML += `<li><a href="#">Admin Panel</a></li>`;
      document.body.classList.add('admin-user');
    }
  } else {
    // User is not logged in
    profileMenu.innerHTML = `
      <li><a href="/Hakathon/webshop-projectweek/front-end/pages/login/login.html">Log in</a></li>
      <li><a href="/Hakathon/webshop-projectweek/front-end/pages/register/register.html">Registratie</a></li>
    `;
    
    // Hide greeting text if it exists
    if (userGreeting) {
      userGreeting.style.display = 'none';
    }
    
    // Remove 'logged-in' class from body
    document.body.classList.remove('logged-in');
    document.body.classList.remove('admin-user');
  }
}
