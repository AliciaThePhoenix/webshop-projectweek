document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  checkLoginStatus();
  
  // Load user information and order history
  loadUserInfo();
  loadOrderHistory();
  
  // Event listener for edit profile button
  document.getElementById('edit-profile-btn').addEventListener('click', function() {
    // Redirect to edit profile page
    window.location.href = 'edit-profile.html';
  });
});

// Function to load user information
function loadUserInfo() {
  fetch('../../../back-end/database/get_user_info.php')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        displayUserInfo(data.user);
      } else {
        showError('Gebruikersinformatie kon niet worden geladen. ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showError('Er is een fout opgetreden bij het laden van gebruikersinformatie.');
    })
    .finally(() => {
      document.getElementById('loading-user-info').style.display = 'none';
      document.getElementById('user-info').classList.remove('hidden');
    });
}

// Function to display user information
function displayUserInfo(user) {
  document.getElementById('username-field').textContent = user.username;
  document.getElementById('email-field').textContent = user.email;
  
  // Format name
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || '-';
  document.getElementById('name-field').textContent = fullName;
  
  // Format address
  document.getElementById('address-field').textContent = user.address || '-';
  document.getElementById('postal-code-field').textContent = user.postal_code || '-';
  document.getElementById('city-field').textContent = user.city || '-';
  document.getElementById('phone-field').textContent = user.phone || '-';
}

// Function to load order history
function loadOrderHistory() {
  fetch('../../../back-end/database/get_orders.php')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        displayOrderHistory(data.orders);
        updateOrderStats(data.stats);
      } else {
        showOrderError('Bestelgeschiedenis kon niet worden geladen. ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showOrderError('Er is een fout opgetreden bij het laden van bestelgeschiedenis.');
    })
    .finally(() => {
      document.getElementById('loading-orders').style.display = 'none';
      document.getElementById('orders-container').classList.remove('hidden');
    });
}

// Function to display order history
function displayOrderHistory(orders) {
  const ordersList = document.getElementById('orders-list');
  const noOrdersMessage = document.getElementById('no-orders');
  
  if (orders && orders.length > 0) {
    ordersList.innerHTML = '';
    
    orders.forEach(order => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>#${order.order_id}</td>
        <td>${formatDate(order.date)}</td>
        <td>${getStatusBadge(order.status)}</td>
        <td>${order.product_count}</td>
        <td>€${parseFloat(order.total).toFixed(2)}</td>
        <td><button class="order-detail-btn" data-id="${order.order_id}">Bekijken</button></td>
      `;
      
      ordersList.appendChild(row);
    });
    
    // Add event listeners to detail buttons
    const detailButtons = document.querySelectorAll('.order-detail-btn');
    detailButtons.forEach(button => {
      button.addEventListener('click', function() {
        const orderId = this.getAttribute('data-id');
        window.location.href = `order-detail.html?id=${orderId}`;
      });
    });
    
    noOrdersMessage.classList.add('hidden');
  } else {
    ordersList.innerHTML = '';
    noOrdersMessage.classList.remove('hidden');
  }
}

// Function to update order statistics
function updateOrderStats(stats) {
  document.getElementById('total-orders').textContent = stats.total_orders || '0';
  document.getElementById('total-products').textContent = stats.total_products || '0';
}

// Helper function to format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('nl-NL', options);
}

// Helper function to get status badge HTML
function getStatusBadge(status) {
  let badgeClass = '';
  
  switch(status.toLowerCase()) {
    case 'completed':
    case 'voltooid':
      badgeClass = 'status-completed';
      break;
    case 'processing':
    case 'verwerking':
      badgeClass = 'status-processing';
      break;
    case 'shipped':
    case 'verzonden':
      badgeClass = 'status-shipped';
      break;
    default:
      badgeClass = 'status-pending';
  }
  
  return `<span class="status-badge ${badgeClass}">${status}</span>`;
}

// Function to show error message in user info section
function showError(message) {
  const userInfo = document.getElementById('user-info');
  userInfo.innerHTML = `<div class="error-message">${message}</div>`;
  userInfo.classList.remove('hidden');
}

// Function to show error message in order history section
function showOrderError(message) {
  const ordersContainer = document.getElementById('orders-container');
  ordersContainer.innerHTML = `<div class="error-message">${message}</div>`;
  ordersContainer.classList.remove('hidden');
}
