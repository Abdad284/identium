const BACKEND_URL = 'https://identium-backend.onrender.com';
let verifyLink = '';

async function submitForm() {
  const full_name = document.getElementById('full_name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const date_of_birth = document.getElementById('dob').value;
  const nationality = document.getElementById('nationality').value;
  const errorMsg = document.getElementById('error-msg');
  const btn = document.getElementById('submit-btn');

  errorMsg.style.display = 'none';

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

  btn.disabled = true;
  btn.textContent = '⏳ Securing on blockchain...';

  try {
    const response = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, phone, date_of_birth, nationality })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Registration failed');

    verifyLink = data.verification_link;
    document.getElementById('verify-link-display').textContent = verifyLink;

    // Generate QR code
    generateQRCode(verifyLink);

    document.getElementById('form-section').style.display = 'none';
    document.getElementById('success-box').style.display = 'block';

  } catch (err) {
    errorMsg.textContent = err.message || 'Something went wrong. Please try again.';
    errorMsg.style.display = 'block';
    btn.disabled = false;
    btn.textContent = '🔐 Create My Digital Identity';
  }
}

function generateQRCode(link) {
  const qrContainer = document.getElementById('qr-code');
  if (!qrContainer) return;

  // Use QR code API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}&bgcolor=141414&color=c9a84c&margin=10`;
  qrContainer.innerHTML = `<img src="${qrUrl}" alt="QR Code" style="border-radius:8px;border:1px solid rgba(201,168,76,0.3);"/>`;
}

function copyLink() {
  navigator.clipboard.writeText(verifyLink).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
}
