    // Replace these with your own project values from Supabase dashboard
    const SUPABASE_URL = 'https://yjvgdixcrzratbzkmgty.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdmdkaXhjcnpyYXRiemttZ3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjcyMzMsImV4cCI6MjA2NjQwMzIzM30.iMsJ0bFZvy2SFNg49AdtXr8RvwJaLepNeTCMGgi1vns';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


    // Local cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fetch products from Supabase
    async function fetchProducts() {
    console.log("Fetching products from Supabase...");
    const { data: products, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error.message);
        document.getElementById('products-container').innerHTML =
        '<p style="color: red;">Failed to load products. Check console.</p>';
        return;
    }

    console.log("Products fetched:", products);
    displayProducts(products);
    }


    // Display product cards
    function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>₹${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
            Add to Cart
        </button>
        `;

        container.appendChild(card);
    });
    }

    // Add to cart
    function addToCart(productId, name, price) {
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId, name, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartSummary();
    }

    // Update cart summary
    function updateCartSummary() {
    const cartDetails = document.getElementById('cart-details');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        cartDetails.textContent = 'No items in cart';
        checkoutBtn.disabled = true;
        return;
    }

    const itemsText = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
    cartDetails.textContent = itemsText;
    checkoutBtn.disabled = false;
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartSummary();
    });

