// Login JS
const SUPABASE_URL = 'https://yjvgdixcrzratbzkmgty.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdmdkaXhjcnpyYXRiemttZ3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjcyMzMsImV4cCI6MjA2NjQwMzIzM30.iMsJ0bFZvy2SFNg49AdtXr8RvwJaLepNeTCMGgi1vns';
const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('login-form');
const errorMsg = document.getElementById('error-message');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in...';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    errorMsg.textContent = "Email and password are required.";
    resetButton();
    return;
  }

  try {
    const { data: users, error } = await client
      .from('users')
      .select('id, email, password, role')
      .eq('email', email)
      .limit(1);

    if (error) throw error;

    if (users.length === 0) {
      errorMsg.textContent = "No account found with this email.";
      resetButton();
      return;
    }

    const user = users[0];

    if (user.password !== password) {
      errorMsg.textContent = "Incorrect password.";
      resetButton();
      return;
    }

    localStorage.setItem('user_id', user.id);
    localStorage.setItem('user_email', user.email);
    localStorage.setItem('user_role', user.role);

    alert(` Logged in as ${user.role}`);

    if (user.role === 'admin') {
      window.location.href = "admin-dashboard.html"; 
    } else {
      window.location.href = "index.html"; 
    }

  } catch (err) {
    console.error("Login error:", err);
    errorMsg.textContent = "Something went wrong. Please try again.";
  } finally {
    resetButton();
  }
});

function resetButton() {
  submitBtn.disabled = false;
  submitBtn.textContent = 'Log In';
}
