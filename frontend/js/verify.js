// Get verification code from URL
const pathCode = window.location.pathname.split('/verify/')[1];
const queryCode = new URLSearchParams(window.location.search).get('code');
const code = pathCode || queryCode;

async function verifyCode(verifyCode) {
  document.getElementById('loading-state').style.display = 'block';
  document.getElementById('verified-state').style.display = 'none';
  document.getElementById('notfound-state').style.display = 'none';

  try {
    const res = await fetch(`https://identium-backend.onrender.com/verify/${verifyCode}`);
    const data = await res.json();

    if (!res.ok || !data.verified) throw new Error('Not found');

    // Populate card
    document.getElementById('v-name').textContent = data.name;
    document.getElementById('v-nationality').textContent = data.nationality;
    document.getElementById('v-status').textContent =
      data.status.charAt(0).toUpperCase() + data.status.slice(1);
    document.getElementById('v-date').textContent = new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    document.getElementById('v-hash').textContent =
      `Verification ID: ${verifyCode} · Secured on XION Blockchain · Tamper-proof & Permanent`;

    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('verified-state').style.display = 'block';

  } catch (e) {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('notfound-state').style.display = 'block';
  }
}

function manualVerify() {
  const inputCode = document.getElementById('manual-code').value.trim();
  if (inputCode) verifyCode(inputCode);
}

// Auto-verify if code is in URL
if (code) {
  verifyCode(code);
} else {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('notfound-state').style.display = 'block';
}
