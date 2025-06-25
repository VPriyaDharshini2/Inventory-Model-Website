// index.js
const SUPABASE_URL = 'https://yjvgdixcrzratbzkmgty.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdmdkaXhjcnpyYXRiemttZ3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjcyMzMsImV4cCI6MjA2NjQwMzIzM30.iMsJ0bFZvy2SFNg49AdtXr8RvwJaLepNeTCMGgi1vns';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadProducts() {
const container = document.getElementById('products-container');
  if (!container) {
    console.error("Element with id 'product-container' not found.");
    return;
  }

  container.innerHTML = 'Loading...';

  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Supabase error:', error.message);
    container.textContent = "Failed to load products. " + error.message;
    return;
  }

  if (!data || data.length === 0) {
    container.textContent = "No products available.";
    return;
  }

  container.innerHTML = '';
  data.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button onclick="addToCart('${product.id}')">Add to Cart</button>
    `;
    container.appendChild(div);
  });
}

async function addToCart(productId) {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    alert('Please login first.');
    return;
  }

  const { error } = await supabase
    .from('cart_items')
    .insert([{ user_id: userId, product_id: productId, quantity: 1 }]);

  if (error) {
    console.error('Error adding to cart:', error.message);
    alert("Error adding to cart.");
  } else {
    alert("Product added to cart!");
  }
}

document.addEventListener('DOMContentLoaded', loadProducts);
