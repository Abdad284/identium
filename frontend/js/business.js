const BACKEND_URL = 'https://identium-backend.onrender.com';

function extractCode(input) {
  input = input.trim();
  // If it's a full URL, extract the code parameter
  if (input.includes('?code=')) {
    return input.split('?code=')[1].split('&')[0];
  }
  // If it's just a code
  return input;
}

async function verifyIdentity() {
  const input = document.getElementById('verify-input').value.trim();
  const errorMsg = document.getElementById('error-msg');
  const btn = document.getElementById('verify-btn');

  errorMsg.style.display = 'none';

  if (!input) {
    errorMsg.textContent = 'Please paste a verification link or code.';
    errorMsg.style.display = 'block';
    return;
  }

  const code = extractCode(input);

  btn.disabled = true;
  btn.textContent = '⏳ Verifying...';

  document.getElementById('verify-form').style.display = 'none';
  document.getElementById('loading-card').style.display = 'block';
  document.getElementById('verified-card').style.display = 'none';
  document.getElementById('notfound-card').style.display = 'none';

  try {
    const res = await fetch(`${BACKEND_URL}/verify/${code}`);
    const data = await res.json();

    document.getElementById('loading-card').style.display = 'none';

    if (!res.ok || !data.verified) throw new Error('Not found');

    // Populate verified card
    document.getElementById('result-name').textContent = data.name;
    document.getElementById('result-nationality').textContent = data.nationality;
    document.getElementById('result-meta').textContent = `${data.nationality} · Verified Identity`;
    document.getElementById('result-date').textContent = new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    document.getElementById('result-hash').textContent =
      `Blockchain Reference: ${code} · XION Network · Tamper-proof & Immutable`;

    document.getElementById('verified-card').style.display = 'block';

  } catch (e) {
    document.getElementById('loading-card').style.display = 'none';
    document.getElementById('notfound-card').style.display = 'block';
  }

  btn.disabled = false;
  btn.textContent = '🔍 Verify Now';
}

function resetForm() {
  document.getElementById('verify-input').value = '';
  document.getElementById('verify-form').style.display = 'block';
  document.getElementById('verified-card').style.display = 'none';
  document.getElementById('notfound-card').style.display = 'none';
  document.getElementById('error-msg').style.display = 'none';
}

// Allow Enter key
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('verify-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifyIdentity();
  });
});