// =============================================================================
// A.A Academy - Core Client Application (JavaScript)
// Features: Smart IP Geolocation Pricing, Student Portal Gate, WhatsApp Routing
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmartPricing();
  initStudentPortal();
  initSmoothScroll();
});

// -----------------------------------------------------------------------------
// 1. القائمة المتجاوبة للموبايل (Mobile Navigation)
// -----------------------------------------------------------------------------
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // إغلاق القائمة عند الضغط على أي رابط
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

// -----------------------------------------------------------------------------
// 2. نظام الأسعار الذكي وكشف الدولة التلقائي بالـ IP (Geo-Detection)
// -----------------------------------------------------------------------------
const PRICING_DATA = {
  // أسعار مصر بالجنيه 🇪🇬
  EGYPT: {
    regionKey: "EG",
    currency: "جنيه",
    beginner: {
      individual: "2,500",
      oldIndividual: "4,150",
      group: "2,000",
      subNote: ""
    },
    pro: {
      individual: "3,000",
      oldIndividual: "5,000",
      group: "2,500",
      subNote: ""
    },
    bundle: {
      individual: "5,000",
      oldIndividual: "9,150",
      group: "4,000",
      subNote: ""
    },
    paymentMethods: [
      "إنستاباي (InstaPay)",
      "فودافون كاش",
      "وي باي (WE Pay)",
      "تحويل بنكي مباشر"
    ]
  },
  // أسعار السعودية والخارج بالدولار الأمريكي 🌍
  ABROAD: {
    regionKey: "ABROAD",
    currency: "$ دولار",
    beginner: {
      individual: "70$",
      oldIndividual: "115$",
      group: "55$",
      subNote: "(أو ما يعادله 3,300 جنيه مصري)"
    },
    pro: {
      individual: "90$",
      oldIndividual: "150$",
      group: "75$",
      subNote: "(أو ما يعادله 4,300 جنيه مصري)"
    },
    bundle: {
      individual: "145$",
      oldIndividual: "260$",
      group: "125$",
      subNote: "(أو ما يعادله 7,100 جنيه مصري)"
    },
    paymentMethods: [
      "تحويل بنكي دولي",
      "ويسترن يونيون (Western Union)",
      "الدفع بما يعادله بالدولار وقت التحويل"
    ]
  }
};

let currentActiveRegion = 'EG';

async function initSmartPricing() {
  // فحص إذا كان هناك طلب لمعاينة عملة معينة مثل ?region=usd في الرابط
  const urlParams = new URLSearchParams(window.location.search);
  const paramRegion = urlParams.get('region');
  if (paramRegion === 'usd' || paramRegion === 'abroad') {
    setPricingRegion('ABROAD');
    return;
  }
  if (paramRegion === 'eg' || paramRegion === 'egypt') {
    setPricingRegion('EG');
    return;
  }

  try {
    // فحص دولة الزائر في الخلفية تلقائياً
    const response = await fetch('https://ipapi.co/json/', { timeout: 3500 });
    if (response.ok) {
      const data = await response.json();
      if (data && data.country_code) {
        if (data.country_code.toUpperCase() === 'EG') {
          setPricingRegion('EG');
        } else {
          // أي زائر من خارج مصر يظهر له السعر بالدولار تلقائياً
          setPricingRegion('ABROAD');
        }
        return;
      }
    }
  } catch (err) {
    console.log('IP Location fallback active');
  }

  // الافتراضي لزوار مصر
  setPricingRegion('EG');
}

function initCurrencyToggle() {
  const buttons = document.querySelectorAll('#currencyToggle .curr-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const region = btn.getAttribute('data-region');
      setPricingRegion(region);
    });
  });
}

function setPricingRegion(region) {
  currentActiveRegion = region;
  const activePricing = (region === 'ABROAD') ? PRICING_DATA.ABROAD : PRICING_DATA.EGYPT;

  // تحديث حالة الأزرار
  const buttons = document.querySelectorAll('#currencyToggle .curr-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-region') === region) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // تحديث أسعار كورس المبتدئين
  updateCardPricing('beginner', activePricing.beginner, activePricing.currency);
  
  // تحديث أسعار كورس المحترفين
  updateCardPricing('pro', activePricing.pro, activePricing.currency);
  
  // تحديث أسعار الباقة الشاملة
  updateCardPricing('bundle', activePricing.bundle, activePricing.currency);

  // تحديث شريط طرق الدفع
  updatePaymentMethods(activePricing.paymentMethods);
}

function updateCardPricing(tier, data, currency) {
  const priceEl = document.getElementById(`price-${tier}`);
  const oldPriceEl = document.getElementById(`old-price-${tier}`);
  const groupPriceEl = document.getElementById(`group-price-${tier}`);
  const currencyEls = document.querySelectorAll(`.currency-${tier}`);
  const subNoteEl = document.getElementById(`subnote-${tier}`);

  if (priceEl) priceEl.textContent = data.individual;
  if (oldPriceEl) oldPriceEl.textContent = data.oldIndividual;
  if (groupPriceEl) groupPriceEl.textContent = data.group;
  currencyEls.forEach(el => el.textContent = currency);

  if (subNoteEl) {
    if (data.subNote) {
      subNoteEl.textContent = data.subNote;
      subNoteEl.style.display = 'block';
    } else {
      subNoteEl.textContent = '';
      subNoteEl.style.display = 'none';
    }
  }
}

function updatePaymentMethods(methods) {
  const container = document.getElementById('paymentBadgesContainer');
  if (!container) return;

  container.innerHTML = '';
  methods.forEach(method => {
    const badge = document.createElement('span');
    badge.className = 'pay-badge';
    badge.textContent = `✓ ${method}`;
    container.appendChild(badge);
  });
}

// -----------------------------------------------------------------------------
// 3. بوابة الطلاب وقاعة المحاضرات (Passcode Protection)
// -----------------------------------------------------------------------------
function initStudentPortal() {
  const lockView = document.getElementById('portalLockView');
  const classroomView = document.getElementById('portalClassroomView');
  const passcodeForm = document.getElementById('passcodeForm');
  const passcodeInput = document.getElementById('passcodeInput');
  const errorMsg = document.getElementById('passcodeError');
  const batchNameEl = document.getElementById('portalBatchName');
  const noticeEl = document.getElementById('portalNoticeText');
  const lockPortalBtn = document.getElementById('lockPortalBtn');

  // جلب إعدادات المحاضرات من portal-config.js
  const config = window.PORTAL_CONFIG || {
    CURRENT_PASSCODE: "AA2026",
    CURRENT_BATCH_NAME: "الدفعة الحالية - كورس إكسيل",
    NOTICE_TEXT: "المحاضرات متاحة للتحميل طوال فترة الكورس ولمدة 48 ساعة بعد انتهائه.",
    LECTURES: []
  };

  // تعبئة النصوص المبدئية
  if (batchNameEl) batchNameEl.textContent = config.CURRENT_BATCH_NAME;
  if (noticeEl) noticeEl.textContent = config.NOTICE_TEXT;

  // التحقق من حالة فتح القفل المحفوظة في الجلسة الحالية
  const isUnlocked = sessionStorage.getItem('AA_PORTAL_UNLOCKED') === 'true';
  if (isUnlocked) {
    unlockClassroom(config);
  }

  // عند إرسال نموذج كلمة السر
  if (passcodeForm) {
    passcodeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPass = passcodeInput.value.trim();

      // فحص كلمة السر (غير حساسة لحالة الأحرف)
      if (enteredPass.toUpperCase() === config.CURRENT_PASSCODE.toUpperCase()) {
        sessionStorage.setItem('AA_PORTAL_UNLOCKED', 'true');
        unlockClassroom(config);
        showToast("مرحباً بك في قاعة المحاضرات! تم فتح المحاضرات بنجاح 🎉");
        if (errorMsg) errorMsg.style.display = 'none';
      } else {
        if (errorMsg) {
          errorMsg.style.display = 'block';
          errorMsg.textContent = 'كلمة السر غير صحيحة، يرجى مراجعة إدارة الكورس أو أستاذ أحمد.';
        }
        passcodeInput.classList.add('error');
        setTimeout(() => passcodeInput.classList.remove('error'), 600);
      }
    });
  }

  // زر قفل القاعة (للخروج)
  if (lockPortalBtn) {
    lockPortalBtn.addEventListener('click', () => {
      sessionStorage.removeItem('AA_PORTAL_UNLOCKED');
      lockView.style.display = 'block';
      classroomView.style.display = 'none';
      if (passcodeInput) passcodeInput.value = '';
      showToast("تم قفل قاعة المحاضرات بنجاح");
    });
  }
}

function unlockClassroom(config) {
  const lockView = document.getElementById('portalLockView');
  const classroomView = document.getElementById('portalClassroomView');
  const lecturesList = document.getElementById('lecturesList');

  if (lockView) lockView.style.display = 'none';
  if (classroomView) classroomView.style.display = 'block';

  // توليد قائمة الـ 10 محاضرات في القاعة
  if (lecturesList && config.LECTURES && config.LECTURES.length > 0) {
    lecturesList.innerHTML = '';
    config.LECTURES.forEach(lec => {
      const card = document.createElement('div');
      card.className = 'lecture-card';
      card.innerHTML = `
        <div class="lecture-info">
          <div class="lecture-num-badge">${lec.id}</div>
          <div class="lecture-details">
            <h4>${lec.title}</h4>
            <p>${lec.description}</p>
          </div>
        </div>
        <div class="lecture-actions">
          <a href="${lec.videoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            تحميل الفيديو
          </a>
          <a href="${lec.sheetUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            تحميل الشيت العملي
          </a>
        </div>
      `;
      lecturesList.appendChild(card);
    });
  }
}

// -----------------------------------------------------------------------------
// 4. التمرير السلس للروابط (Smooth Scroll)
// -----------------------------------------------------------------------------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// -----------------------------------------------------------------------------
// 5. إشعارات التوست البسيطة (Toast Messages)
// -----------------------------------------------------------------------------
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// إتاحة الدالة عالمياً
window.showToast = showToast;
