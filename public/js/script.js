// JavaScript to toggle between User and Business registration forms
document.addEventListener('DOMContentLoaded', function () {
    const userOption = document.getElementById('user-option');
    const businessOption = document.getElementById('business-option');
    const businessFields = document.getElementById('business-fields');

    // Function to toggle visibility of business fields
    function toggleBusinessFields() {
        if (businessOption && businessFields) {
            businessFields.style.display = businessOption.checked ? 'block' : 'none';
        }
    }

    // Event listeners for option change
    userOption.addEventListener('change', toggleBusinessFields);
    businessOption.addEventListener('change', toggleBusinessFields);

    // Initialize the form based on the default checked option (user)
    toggleBusinessFields();
});

// Quantity adjustment functionality
const quantityElement = document.getElementById('quantity');
if (quantityElement) {
    document.getElementById('plus').addEventListener('click', function () {
        quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
    });

    document.getElementById('minus').addEventListener('click', function () {
        if (parseInt(quantityElement.textContent) > 1) {
            quantityElement.textContent = parseInt(quantityElement.textContent) - 1;
        }
    });
}

// Function to handle redirection to checkout
function goToCheckout() {
    // Determine the correct path based on current location
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/shop/')) {
        window.location.href = 'checkout.html'; // Same directory
    } else {
        window.location.href = 'pages/shop/checkout.html'; // From root
    }
}

// Function to add product to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        // If the product is already in the cart, increase the quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // If not, add the product to the cart with initial quantity of 1
        cart.push({ ...product, quantity: 1 });
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} has been added to your cart.`);
}

// Event listener for "Add to Cart" buttons
document.querySelectorAll('.index-add-to-cart, .add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const productElement = this.parentElement;
        const imgElement = productElement.querySelector('img');
        const product = {
            id: productElement.dataset.id,
            name: productElement.dataset.name,
            price: parseFloat(productElement.dataset.price), // Ensure price is a number
            image: imgElement ? imgElement.src : productElement.dataset.image || '' // Get image from img src or data attribute
        };

        addToCart(product);
    });
});

// Login form submission handling
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting by default

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Password validation regex: 1 capital letter, 1 number, 1 special character, and at least 8 characters long
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // Check if the password matches the requirements
    if (!passwordRegex.test(password)) {
        errorMessage.textContent = 'Password must contain at least 1 capital letter, 1 number, 1 special character, and be at least 8 characters long.';
        return;
    } else {
        errorMessage.textContent = ''; // Clear error message
    }

    // Simulate saving email and password to a database (this is just a placeholder for now)
    const loginDetails = {
        email: email,
        password: password
    };

    // For now, simulate saving to database by logging details to console
    console.log('Saving to database...', loginDetails);

    // Show success message or redirect to a new page
    alert('Login successful');
    // You can redirect to another page with window.location.href = "dashboard.html";
});

// Example functionality for product image interaction
document.querySelectorAll('.index-product img, .product img').forEach(img => {
    img.addEventListener('click', function() {
        // Example functionality to switch images (need to implement actual image switching)
        alert('Feature to view the item from a different angle will be implemented here!');
    });
});

// Call this function to display cart items when needed on the cart page
function displayCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');

    // Clear existing cart items
    cartList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    <p>Price: £${item.price} x ${item.quantity}</p>
                    <button class="remove-btn" data-id="${index}">Remove</button>
                </div>
            `;
            cartList.appendChild(itemElement);
            total += item.price * item.quantity;
        });
        cartTotal.innerHTML = `<h3>Total: £${total.toFixed(2)}</h3>`;

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productIndex = parseInt(button.dataset.id, 10);
                removeFromCart(productIndex);
            });
        });
    }
}

// Function to remove item from cart by index
function removeFromCart(productIndex) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(productIndex, 1); // Remove the item at the specified index
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    displayCart(); // Refresh the cart display
}

// Call displayCart function when the cart page is loaded
if (document.body.id === 'cart-page') { // Assuming you add an id to your body in cart.html
    window.onload = displayCart;
}

// Add brand name to the navigation dropdown when saved
window.onload = function() {
    const brandName = localStorage.getItem('business-name');
    if (brandName) {
        const brandsDropdown = document.querySelector('.dropdown-content'); // Assuming a class for dropdown brands
        const brandLink = document.createElement('a');
        brandLink.href = `${brandName.toLowerCase().replace(/\s+/g, '-')}.html`; // Example URL structure
        brandLink.innerText = brandName;
        brandsDropdown.appendChild(brandLink);
    }
};

// JavaScript function to display cart items on the checkout page
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    // Clear the container in case of reload
    cartContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 100px; height: auto;">
                <div>
                    <h3>${item.name}</h3>
                    <p>Price: £${item.price}</p>
                    <div>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span>Quantity: ${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <p>Total: £${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            `;
            cartContainer.appendChild(itemDiv);

            total += item.price * item.quantity; // Update cart total
        });

        // Display the total cost
        cartTotalElement.innerHTML = `<h3>Cart Total: £${total.toFixed(2)}</h3>`;
    }
}

// Function to update quantity in the cart
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity += change;

    // Remove item if quantity is zero or less
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1); // Remove the item from the cart
    }

    // Save the updated cart and refresh display
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems(); // Reload cart items to reflect the updated quantity
}

// Call loadCartItems function when the checkout page is loaded
if (document.body.id === 'checkout-page') { // Assuming an id on the body in checkout.html
    window.onload = loadCartItems;
}

if (document.body.id === 'checkout-page') { // Assuming you add an id to your body in checkout.html
    window.onload = loadCartItems;
}

document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
});

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalContainer.innerHTML = '';
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            // Create HTML structure for each item
            const itemElement = document.createElement('div');
            itemElement.className = 'product-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: auto;">
                <div class="product-info">
                    <p>${item.name}</p>
                    <p>Price: £${item.price}</p>
                    <p>Quantity: 
                        <button class="minus-btn" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="plus-btn" data-index="${index}">+</button>
                    </p>
                    <p>Item Total: £${itemTotal.toFixed(2)}</p>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Display the total price
        cartTotalContainer.innerHTML = `<h3>Total: £${total.toFixed(2)}</h3>`;

        // Attach event listeners to the plus and minus buttons
        document.querySelectorAll('.minus-btn').forEach(button => {
            button.addEventListener('click', function() {
                adjustQuantity(this.dataset.index, -1);
            });
        });
        document.querySelectorAll('.plus-btn').forEach(button => {
            button.addEventListener('click', function() {
                adjustQuantity(this.dataset.index, 1);
            });
        });
    }
}

// Function to adjust quantity and update cart
function adjustQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity += change;

    // Remove item if quantity is less than 1
    if (cart[index].quantity < 1) {
        cart.splice(index, 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems(); // Refresh cart display
}

