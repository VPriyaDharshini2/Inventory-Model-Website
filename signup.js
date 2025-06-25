// Supabase client setup
const SUPABASE_URL = 'https://yjvgdixcrzratbzkmgty.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdmdkaXhjcnpyYXRiemttZ3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjcyMzMsImV4cCI6MjA2NjQwMzIzM30.iMsJ0bFZvy2SFNg49AdtXr8RvwJaLepNeTCMGgi1vns';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Signup form
const form = document.getElementById('signup-form');
const errorMsg = document.getElementById('error-message');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Signing up...';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // ✅ Basic Validation
  if (!email || !password) {
    errorMsg.textContent = "Email and password are required.";
    resetButton();
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorMsg.textContent = "Please enter a valid email address.";
    resetButton();
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "Password must be at least 6 characters.";
    resetButton();
    return;
  }

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password
    });

    if (error) {
      errorMsg.textContent = error.message;
    } else {
      alert("✅ Signup successful! Please verify your email.");
      window.location.href = "login.html";
    }
  } catch (err) {
    console.error("Signup error:", err);
    errorMsg.textContent = "Something went wrong. Please try again.";
  } finally {
    resetButton();
  }
});

function resetButton() {
  submitBtn.disabled = false;
  submitBtn.textContent = 'Sign Up';
}