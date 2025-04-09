document.addEventListener('DOMContentLoaded', function() {
    // Load cart items
    loadCartContents();
    
    // Add event listeners for cart actions
    document.getElementById('clear-cart-btn').addEventListener('click', function() {
        if (confirm('Weet u zeker dat u uw winkelwagen wilt leegmaken?')) {
            clearCart();
            loadCartContents();
        }
    });
    
    document.getElementById('checkout-btn').addEventListener('click', function() {
        // Check if user is logged in before proceeding to checkout
        checkLoginBeforeCheckout();
    });
    
    // Add event listener for the confirm payment button
    document.getElementById('confirm-payment-btn').addEventListener('click', function() {
        // Get selected payment method
        const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        // Close the payment modal
        const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentMethodModal'));
        paymentModal.hide();
        
        // Place the order with the selected payment method
        placeOrder(selectedPaymentMethod);
    });
});

// Check if user is logged in before checkout
function checkLoginBeforeCheckout() {
    fetch('/Hakathon/webshop-projectweek/back-end/database/check_login.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedin) {
                // User is logged in, show payment modal
                const paymentModal = new bootstrap.Modal(document.getElementById('paymentMethodModal'));
                paymentModal.show();
            } else {
                // User is not logged in, show login modal
                const loginModal = new bootstrap.Modal(document.getElementById('loginRequiredModal'));
                loginModal.show();
            }
        })
        .catch(error => {
            console.error('Error checking login status:', error);
            alert('Er is een fout opgetreden. Probeer het later opnieuw.');
        });
}

// Function to place the order
function placeOrder(paymentMethod) {
    // Get cart items and total
    const cartItems = initCart();
    const total = getCartTotal();
    
    // Create order data object
    const orderData = {
        items: cartItems,
        total: total,
        payment_method: paymentMethod
    };
    
    // Check if cart is not empty
    if (cartItems.length === 0) {
        alert('Uw winkelwagen is leeg. Voeg producten toe voordat u afrekent.');
        return;
    }
    
    // Show loading state
    const checkoutBtn = document.getElementById('checkout-btn');
    const originalBtnText = checkoutBtn.innerHTML;
    checkoutBtn.innerHTML = 'Bestelling verwerken...';
    checkoutBtn.disabled = true;
    
    // Send the order to the server
    fetch('/Hakathon/webshop-projectweek/back-end/database/place_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        // Reset button state
        checkoutBtn.innerHTML = originalBtnText;
        checkoutBtn.disabled = false;
        
        if (data.success) {
            // Show success message
            alert('Uw bestelling is succesvol geplaatst! Bestelnummer: ' + data.order_id);
            
            // Clear the cart
            clearCart();
            
            // Refresh cart display
            loadCartContents();
            
            // Redirect to the account page to see the order
            setTimeout(() => {
                window.location.href = '/Hakathon/webshop-projectweek/front-end/pages/account/account.html';
            }, 1500);
        } else {
            // Show error message
            alert('Er is een fout opgetreden: ' + data.message);
        }
    })
    .catch(error => {
        // Reset button state
        checkoutBtn.innerHTML = originalBtnText;
        checkoutBtn.disabled = false;
        
        console.error('Error placing order:', error);
        alert('Er is een fout opgetreden bij het plaatsen van uw bestelling. Probeer het later opnieuw.');
    });
}

// Load and display the cart contents
function loadCartContents() {
    const cartItems = initCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmptyMessage = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartItemsContainer) {
        console.error('Cart items container not found');
        return;
    }
    
    // Clear the container and show loading state
    cartItemsContainer.innerHTML = '<div class="loading">Winkelwagen laden...</div>';
    
    // Short timeout to ensure loading state is visible
    setTimeout(() => {
        cartItemsContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            // Show empty cart message
            cartEmptyMessage.classList.remove('d-none');
            cartSummary.classList.add('d-none');
            return;
        }
        
        // Hide empty cart message and show summary
        cartEmptyMessage.classList.add('d-none');
        cartSummary.classList.remove('d-none');
        
        // Create a container for cart items
        const itemsWrapper = document.createElement('div');
        itemsWrapper.className = 'cart-items-wrapper';
        
        // Render each cart item
        cartItems.forEach(item => {
            try {
                const cartItemElement = createCartItemElement(item);
                itemsWrapper.appendChild(cartItemElement);
            } catch (error) {
                console.error('Error creating cart item:', error, item);
            }
        });
        
        cartItemsContainer.appendChild(itemsWrapper);
        
        // Update the total
        updateCartTotalDisplay();
    }, 100);
}

// Create cart item HTML element
function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.id = item.id;
    
    // Process the image URL
    let imageUrl = item.image_url;
    if (!imageUrl) {
        imageUrl = '/Hakathon/webshop-projectweek/images/placeholder.jpg';
    } else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/') && !imageUrl.startsWith('data:')) {
        imageUrl = '/Hakathon/webshop-projectweek/' + imageUrl;
    }
    
    const subtotal = (item.price * item.quantity).toFixed(2);
    
    cartItem.innerHTML = `
        <img src="${imageUrl}" alt="${item.name}" class="cart-item-image" onerror="this.src='/Hakathon/webshop-projectweek/images/placeholder.jpg'">
        <div class="cart-item-details">
            <h3 class="cart-item-title">${item.name}</h3>
            <p class="cart-item-price">€${item.price.toFixed(2)}</p>
            <div class="cart-item-controls">
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99">
                    <button class="quantity-btn increase">+</button>
                </div>
                <button class="cart-item-remove">Verwijderen</button>
            </div>
        </div>
        <div class="cart-item-subtotal">€${subtotal}</div>
    `;
    
    // Add event listeners
    const quantityInput = cartItem.querySelector('.quantity-input');
    const decreaseBtn = cartItem.querySelector('.decrease');
    const increaseBtn = cartItem.querySelector('.increase');
    const removeBtn = cartItem.querySelector('.cart-item-remove');
    
    // Debug log to check image URL
    console.log('Cart item image URL:', imageUrl);
    
    quantityInput.addEventListener('change', function() {
        const newQuantity = parseInt(this.value);
        if (newQuantity > 0) {
            updateCartItemQuantity(item.id, newQuantity);
            loadCartContents();
        } else {
            this.value = 1;
        }
    });
    
    decreaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            updateCartItemQuantity(item.id, currentValue - 1);
            loadCartContents();
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 99) {
            quantityInput.value = currentValue + 1;
            updateCartItemQuantity(item.id, currentValue + 1);
            loadCartContents();
        }
    });
    
    removeBtn.addEventListener('click', function() {
        removeFromCart(item.id);
        loadCartContents();
    });
    
    return cartItem;
}

// Update the cart total display
function updateCartTotalDisplay() {
    const totalElement = document.getElementById('cart-total');
    const total = getCartTotal().toFixed(2);
    totalElement.textContent = `€${total}`;
}

// Update addToCart function to handle image paths correctly
function addToCart(product) {
    let cart = initCart();
    
    const existingItem = cart.find(item => item.id == product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        // Clean up the image URL path
        let imageUrl = product.image_url;
        if (imageUrl && imageUrl.startsWith('../../')) {
            imageUrl = imageUrl.replace('../../', '');
        }
        
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: imageUrl || 'images/placeholder.jpg',
            quantity: 1
        });
    }
    
    saveCart(cart);
    return cart;
}
