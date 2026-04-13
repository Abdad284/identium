const BACKEND_URL = 'https://identium-backend.onrender.com';

let currentVerifyLink = '';

async function lookupIdentity() {
  const email = document.getElementById('lookup-email').value.trim();
  const errorMsg = document.getElementById('lookup-error');
  const btn = document.getElementById('lookup-btn');

  errorMsg.style.display = 'none';

  if (!email || !email.includes('@')) {
    errorMsg.textContent = 'Please enter a valid email address.';
    errorMsg.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ Looking up your identity...';

  try {
    const res = await fetch(`${BACKEND_URL}/lookup?email=${encodeURIComponent(email)}`);
    const data = await res.json();

    if (!res.ok || !data.user) throw new Error(data.error || 'Identity not found');

    populateDashboard(data);
    document.getElementById('lookup-page').style.display = 'none';
    document.getElementById('dashboard-page').style.display = 'grid';

  } catch (err) {
    errorMsg.textContent = err.message || 'No identity found with this email. Please register first.';
    errorMsg.style.display = 'block';
    btn.disabled = false;
    btn.textContent = '🔍 Find My Identity';
  }
}

function populateDashboard(data) {
  const { user, verification } = data;
  const verifyLink = `https://identium.onrender.com/verify.html?code=${verification.verification_code}`;
  currentVerifyLink = verifyLink;

  const date = new Date(user.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  // Header
  document.getElementById('dash-name').textContent = user.full_name;

  // Stats
  document.getElementById('dash-nationality').textContent = user.nationality;
  document.getElementById('dash-date').textContent = date;

  // ID Card
  document.getElementById('card-name').textContent = user.full_name;
  document.getElementById('card-nationality').textContent = user.nationality;
  document.getElementById('card-dob').textContent = user.date_of_birth || '—';
  document.getElementById('card-hash').textContent =
    `Secured on XION Blockchain · ${verification.verification_code.substring(0, 16)}...`;

  // Verify link
  document.getElementById('dash-verify-link').textContent = verifyLink;

  // Activity date
  document.getElementById('activity-date').textContent = date;
}

function copyLink() {
  navigator.clipboard.writeText(currentVerifyLink).then(() => {
    const btn = document.querySelector('.share-btn.primary');
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = '📋 Copy Link', 2000);
  });
}

function shareWhatsApp() {
  const msg = `Here is my verified digital identity from IDentium: ${currentVerifyLink}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

// Allow Enter key on email input
document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('lookup-email');
  if (emailInput) {
    emailInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') lookupIdentity();
    });
  }
})
