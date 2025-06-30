// checkout.js
const { createClient } = window.supabase;
const supabaseUrl = 'https://yjvgdixcrzratbzkmgty.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdmdkaXhjcnpyYXRiemttZ3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjcyMzMsImV4cCI6MjA2NjQwMzIzM30.iMsJ0bFZvy2SFNg49AdtXr8RvwJaLepNeTCMGgi1vns';
const supabase = createClient(supabaseUrl, supabaseKey);

const userId = localStorage.getItem('user_id');

if (!userId) {
  alert("You're not logged in. Please login first.");
  window.location.href = "login.html";
}

const cartContainer = document.getElementById('cart-items');
const checkoutForm = document.getElementById('checkout-form');

let cartItems = [];
let totalAmount = 0;

async function loadCart() {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('user_id', userId);

  if (error) return console.error('Error loading cart:', error);

  cartItems = data;
  totalAmount = 0;

  cartContainer.innerHTML = `
    <table>
      <tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
      ${cartItems.map(item => {
        const subtotal = item.quantity * item.products.price;
        totalAmount += subtotal;
        return `
          <tr>
            <td>${item.products.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.products.price}</td>
            <td>₹${subtotal}</td>
          </tr>
        `;
      }).join('')}
      <tr><td colspan="3"><strong>Total</strong></td><td>₹${totalAmount}</td></tr>
    </table>
  `;
  document.getElementById('total-amount').textContent = totalAmount;
}

checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const contact = document.getElementById('contact').value;

  const { error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      name,
      address,
      contact,
      total: totalAmount,
      items: cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products.price,
      })),
    });

  if (orderError) {
    console.error('Order failed:', orderError);
    alert('Order failed. Try again.');
    return;
  }

  alert('Order has been placed successfully!');

  await supabase.from('cart_items').delete().eq('user_id', userId);
  window.location.href = 'order_success.html';
});

loadCart();
