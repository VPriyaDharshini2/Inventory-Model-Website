// index.js
const SUPABASE_URL = 'https://yjvgdixcrzratbzkmgty.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdmdkaXhjcnpyYXRiemttZ3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjcyMzMsImV4cCI6MjA2NjQwMzIzM30.iMsJ0bFZvy2SFNg49AdtXr8RvwJaLepNeTCMGgi1vns';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadProducts() {
  const container = document.getElementById('products-container');
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

  const { data: existingItem, error: fetchError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error("Error checking cart item:", fetchError.message);
    return;
  }

  if (existingItem) {
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + 1 })
      .eq('id', existingItem.id);

    if (updateError) {
      console.error("Error updating cart:", updateError.message);
      alert("Failed to update cart.");
      return;
    }
  } else {
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert([{ user_id: userId, product_id: productId, quantity: 1 }]);

    if (insertError) {
      console.error('Error adding to cart:', insertError.message);
      alert("Error adding to cart.");
      return;
    }
  }

  alert(" Product added to cart!");
  updateCartSummary();
}

async function updateCartSummary() {
  const cartDetails = document.getElementById('cart-details');
  const viewCartBtn = document.getElementById('view-cart-btn');
  const userId = localStorage.getItem('user_id');

  if (!userId) {
    cartDetails.textContent = "No items in cart";
    viewCartBtn.disabled = true;
    return;
  }

  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('user_id', userId);

  if (error || !data) {
    cartDetails.textContent = "Failed to load cart";
    viewCartBtn.disabled = true;
    return;
  }

  const itemCount = data.reduce((sum, item) => sum + item.quantity, 0);

  if (itemCount > 0) {
    cartDetails.textContent = `${itemCount} item${itemCount > 1 ? 's' : ''} in cart`;
    viewCartBtn.disabled = false;
  } else {
    cartDetails.textContent = "No items in cart";
    viewCartBtn.disabled = true;
  }

  viewCartBtn.addEventListener('click', () => {
    window.location.href = 'cart.html';
  });
}

loadProducts();
updateCartSummary();
