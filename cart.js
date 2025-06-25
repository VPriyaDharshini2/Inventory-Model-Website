// cart.js
const SUPABASE_URL = 'https://yjvgdixcrzratbzkmgty.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdmdkaXhjcnpyYXRiemttZ3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjcyMzMsImV4cCI6MjA2NjQwMzIzM30.iMsJ0bFZvy2SFNg49AdtXr8RvwJaLepNeTCMGgi1vns';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadCart() {
  const cartContainer = document.getElementById('cart-items');
  const totalAmountEl = document.getElementById('total-amount');
  const userId = localStorage.getItem('user_id');

  if (!userId) {
    cartContainer.innerHTML = "<p>Please login to view your cart.</p>";
    totalAmountEl.textContent = '0.00';
    return;
  }

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      products (
        id,
        name,
        price,
        image_url
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error("Error loading cart:", error.message);
    cartContainer.innerHTML = "<p>Error loading cart.</p>";
    totalAmountEl.textContent = '0.00';
    return;
  }

  if (!data || data.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalAmountEl.textContent = '0.00';
    return;
  }

  cartContainer.innerHTML = '';
  let total = 0;

  data.forEach(item => {
    const product = item.products;
    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}" />
      <div>
        <h3>${product.name}</h3>
        <p>Price: ₹${product.price}</p>
        <p>Quantity: ${item.quantity}</p>
        <p>Subtotal: ₹${itemTotal}</p>
        <button onclick="removeFromCart('${item.id}')">Remove</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  totalAmountEl.textContent = total.toFixed(2);
}

async function removeFromCart(cartItemId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  if (error) {
    alert("Failed to remove item.");
  } else {
    loadCart();
  }
}

loadCart();
