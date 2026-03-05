// ===========================
// Google Apps Script Web App URL
// ===========================
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwq8EQti0YscYDh2uTRBpcVXiXzyuzqMv1Z87QNZVLRCxouFKSJQ1CVjyVV0KBp8qbI/exec';

// ===========================
// Form Submit Handler
// ===========================
const form = document.getElementById('maForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  submitBtn.disabled = true;
  submitBtn.classList.add('is-loading');
  submitBtn.querySelector('.btn-text').textContent = '送信中';

  const data = {
    timestamp: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
    companyName: getValue('companyName'),
    representativeName: getValue('representativeName'),
    companyUrl: getValue('companyUrl'),
    employees: getValue('employees'),
    shareholders: getValue('shareholders'),
    revenue: getValue('revenue'),
    operatingProfit: getValue('operatingProfit'),
    netAssets: getValue('netAssets'),
    saleReason: getValue('saleReason'),
    desiredPrice: getValue('desiredPrice'),
    saleTimeline: getValue('saleTimeline'),
    email: getValue('email'),
    phone: getValue('phone'),
  };

  try {
    // GETリクエストでデータを送信（no-corsリダイレクト問題を回避）
    const encodedData = encodeURIComponent(JSON.stringify(data));
    const url = GAS_URL + '?data=' + encodedData;

    // imgタグを使ったGETリクエスト（CORSを完全に回避）
    const img = new Image();
    img.src = url;

    // 少し待ってから成功画面を表示
    await new Promise(resolve => setTimeout(resolve, 2000));

    form.style.display = 'none';
    successMessage.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    console.error('送信エラー:', err);
    alert('送信中にエラーが発生しました。しばらくしてから再度お試しください。');
    submitBtn.disabled = false;
    submitBtn.classList.remove('is-loading');
    submitBtn.querySelector('.btn-text').textContent = '送信する';
  }
});

// ===========================
// Helpers
// ===========================
function getValue(id) {
  return document.getElementById(id).value.trim();
}

// ===========================
// Validation
// ===========================
function validateForm() {
  let isValid = true;
  const fields = [
    { id: 'companyName', type: 'text' },
    { id: 'representativeName', type: 'text' },
    { id: 'companyUrl', type: 'text' },
    { id: 'employees', type: 'text' },
    { id: 'shareholders', type: 'text' },
    { id: 'revenue', type: 'text' },
    { id: 'operatingProfit', type: 'text' },
    { id: 'netAssets', type: 'text' },
    { id: 'saleReason', type: 'text' },
    { id: 'desiredPrice', type: 'text' },
    { id: 'saleTimeline', type: 'text' },
    { id: 'email', type: 'email' },
    { id: 'phone', type: 'text' },
  ];

  fields.forEach(({ id, type }) => {
    const el = document.getElementById(id);
    const errEl = document.getElementById('err-' + id);
    const val = el.value.trim();
    let fieldValid = true;

    if (!val) {
      fieldValid = false;
    } else if (type === 'email' && !isValidEmail(val)) {
      fieldValid = false;
    }

    if (!fieldValid) {
      el.classList.add('is-error');
      if (errEl) errEl.classList.add('is-visible');
      isValid = false;
    } else {
      el.classList.remove('is-error');
      if (errEl) errEl.classList.remove('is-visible');
    }
  });

  if (!isValid) {
    const firstError = form.querySelector('.is-error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  return isValid;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===========================
// Real-time validation clear
// ===========================
document.querySelectorAll('.field-input, .field-textarea').forEach(el => {
  el.addEventListener('input', function () {
    this.classList.remove('is-error');
    const errEl = document.getElementById('err-' + this.id);
    if (errEl) errEl.classList.remove('is-visible');
  });
});
