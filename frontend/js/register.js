let verifyLink = '';

async function submitForm() {
  const full_name = document.getElementById('full_name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const date_of_birth = document.getElementById('dob').value;
  const nationality = document.getElementById('nationality').value;
  const errorMsg = document.getElementById('error-msg');
  const btn = document.getElementById('submit-btn');

  // Reset error
  errorMsg.style.display = 'none';

  // Validate
  if (!full_name || !email || !date_of_birth || !nationality) {
    errorMsg.textContent = 'Please fill in all required fields marked with *.';
    errorMsg.style.display = 'block';
    return;
  }

  if (!email.includes('@')) {
    errorMsg.textContent = 'Please enter a valid email address.';
    errorMsg.style.display = 'block';
    return;
  }

  // Submit
  btn.disabled = true;
  btn.textContent = '⏳ Securing on blockchain...';

  try {
    const response = await fetch('https://identium-backend.onrender.com/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, phone, date_of_birth, nationality })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Registration failed');

    verifyLink = data.verification_link;
    document.getElementById('verify-link-display').textContent = verifyLink;
    document.getElementById('form-section').style.display = 'none';
    document.getElementById('success-box').style.display = 'block';

  } catch (err) {
    errorMsg.textContent = err.message || 'Something went wrong. Please try again.';
    errorMsg.style.display = 'block';
    btn.disabled = false;
    btn.textContent = '🔐 Create My Digital Identity';
  }
}

function copyLink() {
  navigator.clipboard.writeText(verifyLink).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
}
