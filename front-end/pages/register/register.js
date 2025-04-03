document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('register-form');
  const registerMessage = document.getElementById('register-message');
  
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form inputs
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    
    // Simple client-side validation
    if (!username || !email || !password || !confirmPassword) {
      showMessage('Vul alstublieft alle verplichte velden in.', 'error');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Vul een geldig e-mailadres in.', 'error');
      return;
    }
    
    // Check password length
    if (password.length < 6) {
      showMessage('Wachtwoord moet minimaal 6 tekens bevatten.', 'error');
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      showMessage('Wachtwoorden komen niet overeen.', 'error');
      return;
    }
    
    // Create FormData object
    const formData = new FormData(registerForm);
    
    // Send registration request
    fetch('../../../back-end/database/register.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showMessage('Registratie succesvol! U wordt doorgestuurd...', 'success');
        // Redirect after successful registration
        setTimeout(() => {
          window.location.href = '../homepage/index.html';
        }, 1500);
      } else {
        showMessage(data.message || 'Registratie mislukt. Probeer het opnieuw.', 'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showMessage('Er is een fout opgetreden. Probeer het later opnieuw.', 'error');
    });
  });
  
  // Function to show messages
  function showMessage(message, type) {
    registerMessage.textContent = message;
    registerMessage.className = type;
    registerMessage.style.display = 'block';
  }
});
