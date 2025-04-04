document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const loginMessage = document.getElementById('login-message');
  
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple client-side validation
    if (!username || !password) {
      showMessage('Vul alstublieft alle velden in.', 'error');
      return;
    }
    
    // Create FormData object
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    // Send login request
    fetch('../../../back-end/database/login.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showMessage('Inloggen succesvol! U wordt doorgestuurd...', 'success');
        // Redirect after successful login
        setTimeout(() => {
          window.location.href = '../homepage/index.html';
        }, 1500);
      } else {
        showMessage(data.message || 'Inloggen mislukt. Controleer uw gegevens.', 'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showMessage('Er is een fout opgetreden. Probeer het later opnieuw.', 'error');
    });
  });
  
  // Function to show messages
  function showMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className = type;
    loginMessage.style.display = 'block';
  }
});
