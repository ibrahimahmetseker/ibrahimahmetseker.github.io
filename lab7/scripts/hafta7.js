/**
 * hafta7.js – Etkinlik Kayıt Sayfası | JavaScript Etkileşimleri
 *
 * İçerik:
 *  1. Tema değiştirme  (dark-mode toggle)
 *  2. Form doğrulama + özet kartı üretme  (event.preventDefault)
 */

/* ══════════════════════════════════════════
   1. TEMA DEĞİŞTİRME
   ══════════════════════════════════════════ */

const temaBtn    = document.getElementById('temaBtn');
const temaBtnMob = document.getElementById('temaBtnMob');  // mobil navbar içindeki buton
const body       = document.body;

// Tema durumunu başlatma (localStorage opsiyonel – ödev için basit tutuyoruz)
let darkMode = false;

function toggleTema() {
  darkMode = !darkMode;
  body.classList.toggle('dark-mode', darkMode);

  const label = darkMode ? '☀ Açık Tema' : '◑ Koyu Tema';
  if (temaBtn)    temaBtn.textContent    = label;
  if (temaBtnMob) temaBtnMob.textContent = label;
}

if (temaBtn)    temaBtn.addEventListener('click', toggleTema);
if (temaBtnMob) temaBtnMob.addEventListener('click', toggleTema);


/* ══════════════════════════════════════════
   2. FORM DOĞRULAMA & ÖZET ÜRETME
   ══════════════════════════════════════════ */

const kayitFormu  = document.getElementById('kayitFormu');
const sonucAlani  = document.getElementById('sonucAlani');
const uyariAlani  = document.getElementById('uyariAlani');

/**
 * Yardımcı: Form alanından değer al, boşlukları temizle.
 */
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

/**
 * Yardımcı: Basit e-posta doğrulaması.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Yardımcı: Uyarı göster.
 */
function showUyari(mesaj) {
  uyariAlani.innerHTML = `
    <div class="alert-custom alert-danger-custom p-3 mb-0">
      ⚠ ${mesaj}
    </div>`;
  uyariAlani.classList.remove('d-none');
  sonucAlani.innerHTML = '';
}

/**
 * Yardımcı: Özet kartı oluştur.
 */
function showOzet(data) {
  uyariAlani.classList.add('d-none');

  const satirlar = [
    { key: 'Ad Soyad',      val: data.adSoyad },
    { key: 'E-posta',        val: data.email },
    { key: 'Telefon',        val: data.telefon || '—' },
    { key: 'Seçilen Etkinlik', val: data.etkinlik },
    { key: 'Katılım Türü',   val: data.katilimTuru },
    { key: 'Deneyim',        val: data.deneyim },
    { key: 'Özel Notlar',    val: data.notlar || '—' },
    { key: 'KVKK Onayı',    val: '✔ Onaylandı' },
  ];

  const satirHtml = satirlar.map(s => `
    <div class="ozet-row">
      <span class="ozet-key">${s.key}</span>
      <span class="ozet-val">${s.val}</span>
    </div>`).join('');

  sonucAlani.innerHTML = `
    <div class="ozet-card">
      <div class="ozet-header">
        <h5>✔ Başvurunuz Alındı!</h5>
        <p class="mb-0" style="font-size:.8rem;opacity:.75;">
          Kayıt bilgileriniz aşağıda özetlenmiştir.
        </p>
      </div>
      <div class="ozet-body">${satirHtml}</div>
    </div>`;

  // Sonuç alanına yumuşak kaydır
  sonucAlani.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Form submit olayı
 */
if (kayitFormu) {
  kayitFormu.addEventListener('submit', function (e) {
    e.preventDefault();   // Sayfa yenilenmesini önle

    /* ─ Alan değerlerini topla ─ */
    const adSoyad    = getVal('adSoyad');
    const email      = getVal('email');
    const telefon    = getVal('telefon');
    const etkinlik   = getVal('etkinlik');
    const katilimTuru= getVal('katilimTuru');
    const deneyim    = getVal('deneyim');
    const notlar     = getVal('notlar');
    const kvkk       = document.getElementById('kvkk')?.checked;

    /* ─ Doğrulama ─ */
    if (!adSoyad) {
      showUyari('Lütfen adınızı ve soyadınızı girin.');
      document.getElementById('adSoyad').focus();
      return;
    }
    if (!email) {
      showUyari('Lütfen e-posta adresinizi girin.');
      document.getElementById('email').focus();
      return;
    }
    if (!isValidEmail(email)) {
      showUyari('Lütfen geçerli bir e-posta adresi girin.');
      document.getElementById('email').focus();
      return;
    }
    if (!etkinlik) {
      showUyari('Lütfen bir etkinlik seçin.');
      document.getElementById('etkinlik').focus();
      return;
    }
    if (!katilimTuru) {
      showUyari('Lütfen katılım türünüzü seçin.');
      document.getElementById('katilimTuru').focus();
      return;
    }
    if (!deneyim) {
      showUyari('Lütfen deneyim seviyenizi seçin.');
      document.getElementById('deneyim').focus();
      return;
    }
    if (!kvkk) {
      showUyari('Devam etmek için KVKK metnini onaylamanız gerekiyor.');
      return;
    }

    /* ─ Başarı: Özet üret ─ */
    showOzet({ adSoyad, email, telefon, etkinlik, katilimTuru, deneyim, notlar });

    // Formu sıfırla
    kayitFormu.reset();
  });
}


/* ══════════════════════════════════════════
   3. KAPASITE ÇUBUKLARI – Sayfa Yüklenince
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Capacity bar animasyonu (kısa gecikme ile)
  setTimeout(() => {
    document.querySelectorAll('.capacity-fill[data-width]').forEach(el => {
      el.style.width = el.dataset.width;
    });
  }, 500);
});
