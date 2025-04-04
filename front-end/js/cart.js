/**
 * Shopping Cart functionality
 */

// Initialize cart from localStorage or create empty cart
function initCart() {
    let cart = localStorage.getItem('apothecare_cart');
    if (cart) {
        return JSON.parse(cart);
    } else {
        return [];
    }
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('apothecare_cart', JSON.stringify(cart));
    updateCartCount();
}

// Add a product to the cart
function addToCart(product) {
    let cart = initCart();
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id == product.id);
    
    if (existingItem) {
        // Increment quantity if already in cart
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        // Add new product to cart with quantity 1
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url || '../images/placeholder.jpg',
            quantity: 1
        });
    }
    
    saveCart(cart);
    return cart;
}

// Remove a product from the cart
function removeFromCart(productId) {
    let cart = initCart();
    cart = cart.filter(item => item.id != productId);
    saveCart(cart);
    return cart;
}

// Update quantity of a product in the cart
function updateCartItemQuantity(productId, quantity) {
    let cart = initCart();
    const item = cart.find(item => item.id == productId);
    
    if (item) {
        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            return removeFromCart(productId);
        } else {
            item.quantity = quantity;
        }
    }
    
    saveCart(cart);
    return cart;
}

// Get the total number of items in the cart
function getCartItemCount() {
    const cart = initCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

// Get the total price of all items in the cart
function getCartTotal() {
    const cart = initCart();
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
}

// Update the cart count display in the header
function updateCartCount() {
    const count = getCartItemCount();
    const countElements = document.querySelectorAll('.cart-count');
    
    countElements.forEach(element => {
        element.textContent = count;
        
        // Add visual emphasis if items in cart
        if (count > 0) {
            element.style.fontWeight = 'bold';
        } else {
            element.style.fontWeight = 'normal';
        }
    });
}

// Clear the entire cart
function clearCart() {
    localStorage.removeItem('apothecare_cart');
    updateCartCount();
    return [];
}

// Update cart count when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});
