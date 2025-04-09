/**
 * Winkelwagen functionaliteit
 */

// Initialiseert de winkelwagen uit localStorage of maakt een lege winkelwagen
function initCart() {
    // Probeert de winkelwagengegevens uit localStorage te halen
    let cart = localStorage.getItem('apothecare_cart');
    // Als er gegevens zijn, parse deze dan uit JSON
    if (cart) {
        return JSON.parse(cart);
    } else {
        // Anders geef een lege array terug
        return [];
    }
}

// Slaat de winkelwagen op in localStorage
function saveCart(cart) {
    // Converteert de winkelwagen naar een JSON-string en slaat deze op
    localStorage.setItem('apothecare_cart', JSON.stringify(cart));
    // Update het aantal items in de winkelwagen in de UI
    updateCartCount();
}

// Voegt een product toe aan de winkelwagen
function addToCart(product) {
    // Haalt de huidige winkelwagen op
    let cart = initCart();
    
    // Controleert of het product al in de winkelwagen zit
    const existingItem = cart.find(item => item.id == product.id);
    
    if (existingItem) {
        // Als het product al bestaat, verhoog dan het aantal
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        // Get the absolute path for the image URL
        let imageUrl = product.image_url;
        
        // If it's a relative path, convert it to absolute
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
            // Remove any '../' from the start of the path
            imageUrl = imageUrl.replace(/^\.\.\/+/, '');
            // Ensure the path starts from the root of your project
            imageUrl = '/Hakathon/webshop-projectweek/' + imageUrl;
        }
        
        // Add the new item with the processed image URL
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: imageUrl,
            quantity: 1
        });
    }
    
    // Sla de bijgewerkte winkelwagen op
    saveCart(cart);
    return cart;
}

// Verwijdert een product uit de winkelwagen
function removeFromCart(productId) {
    // Haalt de huidige winkelwagen op
    let cart = initCart();
    // Filtert het item met het gegeven productId eruit
    cart = cart.filter(item => item.id != productId);
    // Slaat de bijgewerkte winkelwagen op
    saveCart(cart);
    return cart;
}

// Update het aantal van een product in de winkelwagen
function updateCartItemQuantity(productId, quantity) {
    // Haalt de huidige winkelwagen op
    let cart = initCart();
    // Zoekt het item in de winkelwagen
    const item = cart.find(item => item.id == productId);
    
    if (item) {
        if (quantity <= 0) {
            // Verwijder het item als de hoeveelheid 0 of minder is
            return removeFromCart(productId);
        } else {
            // Anders update de hoeveelheid
            item.quantity = quantity;
        }
    }
    
    // Slaat de bijgewerkte winkelwagen op
    saveCart(cart);
    return cart;
}

// Haalt het totale aantal items in de winkelwagen op
function getCartItemCount() {
    // Haalt de huidige winkelwagen op
    const cart = initCart();
    // Telt de hoeveelheden van alle items bij elkaar op
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

// Berekent de totale prijs van alle items in de winkelwagen
function getCartTotal() {
    // Haalt de huidige winkelwagen op
    const cart = initCart();
    // Berekent het totaalbedrag door prijs * hoeveelheid voor elk item
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
}

// Update het winkelwagenaantal in de header
function updateCartCount() {
    // Haalt het totaal aantal items op
    const count = getCartItemCount();
    // Selecteert alle elementen met de klasse 'cart-count'
    const countElements = document.querySelectorAll('.cart-count');
    
    // Update elk element met het nieuwe aantal
    countElements.forEach(element => {
        element.textContent = count;
        
        // Voeg visuele nadruk toe als er items in de winkelwagen zitten
        if (count > 0) {
            element.style.fontWeight = 'bold';
        } else {
            element.style.fontWeight = 'normal';
        }
    });
}

// Maakt de hele winkelwagen leeg
function clearCart() {
    // Verwijdert de winkelwagen uit localStorage
    localStorage.removeItem('apothecare_cart');
    // Update het aantal in de UI
    updateCartCount();
    // Geeft een lege array terug
    return [];
}

// Update het winkelwagenaantal wanneer de pagina wordt geladen
document.addEventListener('DOMContentLoaded', function() {
    // Zorgt ervoor dat het aantal items in de winkelwagen correct wordt weergegeven
    updateCartCount();
});

function handleAddToCart(button) {
    const productCard = button.closest('.product-card');
    
    // Get the image source directly from the product card's image element
    const productImage = productCard.querySelector('img');
    const imageUrl = productImage ? productImage.src : null;
    
    // Create the product object with the correct image URL
    const product = {
        id: productCard.dataset.productId,
        name: productCard.dataset.productName,
        price: parseFloat(productCard.dataset.productPrice),
        image_url: imageUrl || '../images/placeholder.jpg',
        quantity: 1
    };

    addToCart(product);

    // Show feedback to user
    const originalText = button.textContent;
    button.textContent = "Toegevoegd!";
    button.classList.add("added");
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("added");
    }, 2000);
}
