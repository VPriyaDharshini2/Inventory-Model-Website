// Supabase client setup
const SUPABASE_URL = 'https://yjvgdixcrzratbzkmgty.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdmdkaXhjcnpyYXRiemttZ3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjcyMzMsImV4cCI6MjA2NjQwMzIzM30.iMsJ0bFZvy2SFNg49AdtXr8RvwJaLepNeTCMGgi1vns';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Signup form
const form = document.getElementById('signup-form');
const errorMsg = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Client-side validation
  if (!email || !password) {
    errorMsg.textContent = "Email and password are required.";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorMsg.textContent = "Please enter a valid email address.";
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "Password must be at least 6 characters.";
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      errorMsg.textContent = error.message;
    } else {
      alert("Signup successful! Please check your email for verification.");
      window.location.href = "login.html";
    }
  } catch (err) {
    console.error("Signup error:", err);
    errorMsg.textContent = "Something went wrong. Try again.";
  }
});
