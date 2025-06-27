// admin.js
const SUPABASE_URL = 'https://yjvgdixcrzratbzkmgty.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdmdkaXhjcnpyYXRiemttZ3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjcyMzMsImV4cCI6MjA2NjQwMzIzM30.iMsJ0bFZvy2SFNg49AdtXr8RvwJaLepNeTCMGgi1vns';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const container = document.getElementById('admin-products');

async function fetchProducts() {
  const { data: products, error } = await client.from('products').select('*');

  if (error) {
    container.innerHTML = `<p>Error loading products.</p>`;
    console.error(error);
    return;
  }

  renderProducts(products);
}

function renderProducts(products) {
  container.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <h3>${product.name}</h3>
      <p><strong>Stock:</strong> <span style="color: ${product.stock < 5 ? 'red' : 'black'}">${product.stock}</span></p>
      ${product.stock < 5
        ? `<button onclick="requestSellers('${product.name}')">Request Sellers</button>`
        : `<p style="color:green">Stock OK</p>`
      }
    `;

    container.appendChild(card);
  });
}

function requestSellers(productName) {
  alert(`Request sent to sellers for "${productName}".`);
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

fetchProducts();
