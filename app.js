// =============================================================================
// A.A Academy - Core Client Application (JavaScript)
// Features:
// 1. Smart IP Geolocation Pricing (Egypt EGP / Abroad USD)
// 2. Student Portal Gate & Classroom (Passcode Protected)
// 3. Interactive Lecture Quiz System (امتحانات المحاضرات والشهادة المعتمدة)
// 4. VBA Genius Pro Showcase & Interactive Sandbox (محاكي البرنامج والتحميل الحي)
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmartPricing();
  initStudentPortal();
  initSmoothScroll();
  initVbaGeniusShowcase();
  initQuizModals();
});

// -----------------------------------------------------------------------------
// 1. القائمة المتجاوبة للموبايل (Mobile Navigation)
// -----------------------------------------------------------------------------
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.classList.toggle('active', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', false);
        document.body.classList.remove('nav-open');
      });
    });

    // Close when tapping outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
        navLinks.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', false);
        document.body.classList.remove('nav-open');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', false);
        document.body.classList.remove('nav-open');
      }
    });
  }
}

// -----------------------------------------------------------------------------
// 2. نظام الأسعار الذكي وكشف الدولة التلقائي بالـ IP (Geo-Detection)
// -----------------------------------------------------------------------------
const PRICING_DATA = {
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
  ABROAD: {
    regionKey: "ABROAD",
    currency: "$ دولار",
    beginner: {
      individual: "70$",
      oldIndividual: "115$",
      group: "55$",
      subNote: ""
    },
    pro: {
      individual: "90$",
      oldIndividual: "150$",
      group: "75$",
      subNote: ""
    },
    bundle: {
      individual: "145$",
      oldIndividual: "260$",
      group: "125$",
      subNote: ""
    },
    paymentMethods: [
      "تحويل بنكي دولي (IBAN)",
      "ويسترن يونيون (Western Union)",
      "بطاقات الدفع والتحويلات الدولية"
    ]
  }
};

let currentActiveRegion = 'EG';

async function initSmartPricing() {
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
    const response = await fetch('https://ipapi.co/json/', { timeout: 3500 });
    if (response.ok) {
      const data = await response.json();
      if (data && data.country_code) {
        if (data.country_code.toUpperCase() === 'EG') {
          setPricingRegion('EG');
        } else {
          setPricingRegion('ABROAD');
        }
      } else {
        setPricingRegion('EG');
      }
    } else {
      setPricingRegion('EG');
    }
  } catch (err) {
    setPricingRegion('EG');
  }

  const toggleButtons = document.querySelectorAll('[data-set-region]');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetRegion = btn.getAttribute('data-set-region');
      setPricingRegion(targetRegion);
    });
  });
}

function setPricingRegion(regionKey) {
  currentActiveRegion = regionKey.toUpperCase() === 'EG' ? 'EG' : 'ABROAD';
  const data = currentActiveRegion === 'EG' ? PRICING_DATA.EGYPT : PRICING_DATA.ABROAD;

  document.querySelectorAll('.currency-label').forEach(el => {
    el.textContent = data.currency;
  });

  updatePriceElement('price-beginner-indiv', data.beginner.individual);
  updatePriceElement('price-beginner-old', data.beginner.oldIndividual);
  updatePriceElement('price-beginner-group', data.beginner.group);

  updatePriceElement('price-pro-indiv', data.pro.individual);
  updatePriceElement('price-pro-old', data.pro.oldIndividual);
  updatePriceElement('price-pro-group', data.pro.group);

  updatePriceElement('price-bundle-indiv', data.bundle.individual);
  updatePriceElement('price-bundle-old', data.bundle.oldIndividual);
  updatePriceElement('price-bundle-group', data.bundle.group);

  updatePaymentBadges(data.paymentMethods);

  document.querySelectorAll('[data-set-region]').forEach(btn => {
    if (btn.getAttribute('data-set-region').toUpperCase() === currentActiveRegion) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function updatePriceElement(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function updatePaymentBadges(methods) {
  const container = document.getElementById('paymentMethodsContainer');
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
// 3. بوابة الطلاب وقاعة المحاضرات (Passcode Protection & Lectures List)
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

  const config = window.PORTAL_CONFIG || {
    CURRENT_PASSCODE: "AA2026",
    CURRENT_BATCH_NAME: "الدفعة الحالية - كورس إكسيل الاحترافي",
    NOTICE_TEXT: "تنبيه: التسجيلات والملفات متاحة للتحميل طوال فترة الدورة ولمدة 48 ساعة بعد انتهائها كمرجع دائم لك على جهازك.",
    LECTURES: []
  };

  if (batchNameEl) batchNameEl.textContent = config.CURRENT_BATCH_NAME;
  if (noticeEl) noticeEl.textContent = config.NOTICE_TEXT;

  const isUnlocked = sessionStorage.getItem('AA_PORTAL_UNLOCKED') === 'true';
  if (isUnlocked) {
    unlockClassroom(config);
  }

  if (passcodeForm) {
    passcodeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPass = passcodeInput.value.trim().toUpperCase();
      const result = detectStudentPackage(enteredPass, config);

      if (result.isValid) {
        sessionStorage.setItem('AA_PORTAL_UNLOCKED', 'true');
        sessionStorage.setItem('AA_ACTIVE_PASSCODE', enteredPass);
        sessionStorage.setItem('AA_STUDENT_ROLE', result.role);
        if (result.studentName) {
          sessionStorage.setItem('AA_STUDENT_NAME', result.studentName);
        }
        unlockClassroom(config);
        const welcome = (result.studentName) ?
          `مرحباً بك يا ${result.studentName} في ${result.pkg ? result.pkg.title : 'قاعة المحاضرات'}! 🎉` :
          `تم تسجيل دخولك بنجاح في ${result.pkg ? result.pkg.title : 'قاعة المحاضرات'} 🎉`;
        showToast(welcome);
        if (errorMsg) errorMsg.style.display = 'none';
      } else {
        if (errorMsg) {
          errorMsg.style.display = 'block';
          errorMsg.textContent = 'كود الدخول أو كلمة السر غير صحيحة، يرجى التأكد من باقتك ومراجعة أستاذ أحمد علاء للحصول على كودك المعتمد.';
        }
        passcodeInput.classList.add('error');
        setTimeout(() => passcodeInput.classList.remove('error'), 600);
      }
    });
  }

  if (lockPortalBtn) {
    lockPortalBtn.addEventListener('click', () => {
      sessionStorage.removeItem('AA_PORTAL_UNLOCKED');
      sessionStorage.removeItem('AA_ACTIVE_PASSCODE');
      sessionStorage.removeItem('AA_STUDENT_ROLE');
      sessionStorage.removeItem('AA_STUDENT_NAME');
      lockView.style.display = 'block';
      classroomView.style.display = 'none';
      if (passcodeInput) passcodeInput.value = '';
      showToast("تم قفل قاعة المحاضرات وتسجيل الخروج بنجاح");
    });
  }
}

function detectStudentPackage(enteredPass, config) {
  const pass = (enteredPass || '').trim().toUpperCase();
  if (!config) return { isValid: false, role: 'bundle', pkg: null };

  const master = (config.MASTER_PASSCODE || 'AA2026').toUpperCase();
  const pkgs = config.PACKAGES || {};

  // Master pass unlocks bundle (all 20 lectures)
  if (pass === master) {
    return { isValid: true, role: 'bundle', pkg: pkgs.BUNDLE, isMaster: true };
  }

  // 1. Beginner package check
  if (pkgs.BEGINNER) {
    const bDef = (pkgs.BEGINNER.defaultPasscode || 'BEG2026').toUpperCase();
    const bCodes = (pkgs.BEGINNER.authorizedCodes || []).map(c => c.toUpperCase());
    if (pass === bDef || bCodes.includes(pass) || pass.startsWith('BEG') || pass.startsWith('AA-BEG')) {
      return { isValid: true, role: 'beginner', pkg: pkgs.BEGINNER };
    }
  }

  // 2. Pro package check
  if (pkgs.PRO) {
    const pDef = (pkgs.PRO.defaultPasscode || 'PRO2026').toUpperCase();
    const pCodes = (pkgs.PRO.authorizedCodes || []).map(c => c.toUpperCase());
    if (pass === pDef || pCodes.includes(pass) || pass.startsWith('PRO') || pass.startsWith('AA-PRO')) {
      return { isValid: true, role: 'pro', pkg: pkgs.PRO };
    }
  }

  // 3. Bundle package check
  if (pkgs.BUNDLE) {
    const allDef = (pkgs.BUNDLE.defaultPasscode || 'ALL2026').toUpperCase();
    const allCodes = (pkgs.BUNDLE.authorizedCodes || []).map(c => c.toUpperCase());
    if (pass === allDef || allCodes.includes(pass) || pass.startsWith('ALL') || pass.startsWith('AA-ALL')) {
      return { isValid: true, role: 'bundle', pkg: pkgs.BUNDLE };
    }
  }

  // Fallback: check legacy STUDENT_PASSCODES array
  if (Array.isArray(config.STUDENT_PASSCODES)) {
    const matched = config.STUDENT_PASSCODES.find(item => {
      if (typeof item === 'string') return item.toUpperCase() === pass;
      if (item && item.code) return item.code.toUpperCase() === pass;
      return false;
    });
    if (matched) {
      let role = 'bundle';
      if (pass.includes('BEG')) role = 'beginner';
      else if (pass.includes('PRO')) role = 'pro';
      return {
        isValid: true,
        role: role,
        pkg: (role === 'beginner') ? pkgs.BEGINNER : (role === 'pro') ? pkgs.PRO : pkgs.BUNDLE,
        studentName: matched.studentName
      };
    }
  }

  // Fallback: CURRENT_PASSCODE
  if (config.CURRENT_PASSCODE && pass === config.CURRENT_PASSCODE.toUpperCase()) {
    return { isValid: true, role: 'bundle', pkg: pkgs.BUNDLE };
  }

  return { isValid: false, role: null, pkg: null };
}

function unlockClassroom(config) {
  const lockView = document.getElementById('portalLockView');
  const classroomView = document.getElementById('portalClassroomView');
  const batchNameEl = document.getElementById('portalBatchName');
  const titleEl = document.querySelector('.classroom-title h3');

  if (lockView) lockView.style.display = 'none';
  if (classroomView) classroomView.style.display = 'block';

  // 1. تحديد باقة الطالب: beginner / pro / bundle
  const role = sessionStorage.getItem('AA_STUDENT_ROLE') || 'bundle';
  const pkgs = config.PACKAGES || {};
  const currentPkg = (role === 'beginner') ? pkgs.BEGINNER :
                     (role === 'pro') ? pkgs.PRO :
                     pkgs.BUNDLE;

  if (currentPkg) {
    if (batchNameEl) batchNameEl.textContent = currentPkg.batchName;
    if (titleEl) titleEl.textContent = currentPkg.title;
  }

  // 2. تصفية المحاضرات بدقة حسب باقة المشترك:
  // - مبتدئين: المحاضرات من 1 إلى 10 فقط
  // - محترفين: المحاضرات من 11 إلى 20 فقط
  // - باقة شاملة: جميع المحاضرات الـ 20
  let assignedLectures = [];
  if (config.LECTURES && config.LECTURES.length > 0) {
    if (role === 'beginner') {
      assignedLectures = config.LECTURES.filter(l => l.level === 'beginner' || l.id <= 10);
    } else if (role === 'pro') {
      assignedLectures = config.LECTURES.filter(l => l.level === 'pro' || l.id > 10);
    } else {
      assignedLectures = [...config.LECTURES];
    }
  }

  // 3. رسم كارت التقدم التدريبي الخاص بباقته
  renderStudentProgressCard(classroomView, assignedLectures, currentPkg);

  // 4. للباقة الشاملة: رسم أزرار التصفية السريعة
  renderPortalFilterBar(classroomView, role, (filterKey) => {
    let filtered = assignedLectures;
    if (filterKey === 'beginner') {
      filtered = assignedLectures.filter(l => l.level === 'beginner' || l.id <= 10);
    } else if (filterKey === 'pro') {
      filtered = assignedLectures.filter(l => l.level === 'pro' || l.id > 10);
    }
    renderLecturesCards(filtered);
  });

  // 5. رسم كروت المحاضرات
  renderLecturesCards(assignedLectures);
}

function renderPortalFilterBar(parent, role, onFilterChange) {
  let existing = document.getElementById('portalFilterBar');
  if (existing) existing.remove();

  // يظهر شريط التصفية السريع فقط لأصحاب الباقة الشاملة
  if (role !== 'bundle') return;

  const bar = document.createElement('div');
  bar.className = 'portal-filter-bar';
  bar.id = 'portalFilterBar';
  bar.innerHTML = `
    <span class="portal-filter-label">🎯 تصفية العرض:</span>
    <button class="portal-filter-pill active" data-filter="all">عرض الـ 20 محاضرة معاً 👑</button>
    <button class="portal-filter-pill" data-filter="beginner">كورس المبتدئين فقط (10) 🟢</button>
    <button class="portal-filter-pill" data-filter="pro">كورس المحترفين فقط (10) 🚀</button>
  `;

  const buttons = bar.querySelectorAll('.portal-filter-pill');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterKey = btn.getAttribute('data-filter');
      if (typeof onFilterChange === 'function') onFilterChange(filterKey);
    });
  });

  const progressCard = document.getElementById('studentProgressCard');
  if (progressCard && progressCard.parentNode) {
    progressCard.parentNode.insertBefore(bar, progressCard.nextSibling);
  } else {
    const banner = document.getElementById('portalNoticeBanner');
    if (banner && banner.parentNode) {
      banner.parentNode.insertBefore(bar, banner.nextSibling);
    }
  }
}

function renderLecturesCards(lectures) {
  const lecturesList = document.getElementById('lecturesList');
  if (!lecturesList) return;

  lecturesList.innerHTML = '';
  if (!lectures || lectures.length === 0) {
    lecturesList.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #94a3b8; background: rgba(30, 41, 59, 0.4); border-radius: 12px; border: 1px dashed rgba(255, 255, 255, 0.1);">
        لا توجد محاضرات في هذا القسم حالياً.
      </div>
    `;
    return;
  }

  const rawRole = (sessionStorage.getItem('AA_STUDENT_ROLE') || 'bundle').toLowerCase();

  lectures.forEach(lec => {
    const hasQuiz = Array.isArray(lec.quiz) && lec.quiz.length > 0;
    const isPassed = hasQuiz && (localStorage.getItem(`AA_QUIZ_PASSED_${lec.id}`) === 'true');
    const isPro = lec.level === 'pro' || lec.id > 10;
    const levelBadge = isPro ?
      `<span style="background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); font-size: 0.75rem; padding: 2px 8px; border-radius: 20px; margin-right: 6px;">🚀 كورس المحترفين</span>` :
      `<span style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); font-size: 0.75rem; padding: 2px 8px; border-radius: 20px; margin-right: 6px;">🟢 كورس المبتدئين</span>`;

    // نظام الفتح التسلسلي الصارم لاختبارات المحاضرات:
    // المحاضرة الأولى فقط هي المفتوحة (المحاضرة 1 للمبتدئين والشامل، أو المحاضرة 11 لكورس المحترفين).
    // أي محاضرة تالية: لا يظهر زر اختبارها نهائياً إلا بعد أن يمتحن ويجتاز اختبار المحاضرة السابقة بنجاح!
    let isQuizUnlocked = false;
    let prevLecId = null;

    if (hasQuiz) {
      if (lec.id === 1 || (rawRole === 'pro' && lec.id === 11)) {
        isQuizUnlocked = true;
      } else {
        prevLecId = lec.id - 1;
        isQuizUnlocked = (localStorage.getItem(`AA_QUIZ_PASSED_${prevLecId}`) === 'true');
      }
    }

    // تجهيز شارة الاختبار وزر الاختبار وفقاً لحالة القفل والاجتياز:
    let quizBadgeHtml = '';
    let quizButtonHtml = '';

    if (hasQuiz) {
      if (isPassed) {
        // تم اجتيازه بنجاح
        quizBadgeHtml = `
          <div style="margin-top: 8px;">
            <span class="lecture-quiz-badge passed">✓ تم اجتياز اختبار المحاضرة</span>
          </div>
        `;
        quizButtonHtml = `
          <button class="btn btn-quiz btn-sm" onclick="startQuizForLecture(${lec.id})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            إعادة الاختبار 🔄
          </button>
        `;
      } else if (isQuizUnlocked) {
        // مفتوح ومتاح لخوضه الآن
        quizBadgeHtml = `
          <div style="margin-top: 8px;">
            <span class="lecture-quiz-badge">📝 متاح اختبار تطبيقي</span>
          </div>
        `;
        quizButtonHtml = `
          <button class="btn btn-quiz btn-sm pulse-btn" onclick="startQuizForLecture(${lec.id})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            اختبار المحاضرة 📝
          </button>
        `;
      } else {
        // مغلق: لا يظهر زر الاختبار إطلاقاً حتى يجتاز المحاضرة السابقة
        quizBadgeHtml = `
          <div style="margin-top: 8px;">
            <span class="lecture-quiz-badge" style="background: rgba(100, 116, 139, 0.12); color: #94a3b8; border: 1px dashed rgba(100, 116, 139, 0.35);">
              🔒 مقفول (يظهر بعد اجتياز اختبار المحاضرة ${prevLecId})
            </span>
          </div>
        `;
        quizButtonHtml = ''; // لا يظهر الزر مطلقاً
      }
    }

    const card = document.createElement('div');
    card.className = 'lecture-card';
    card.innerHTML = `
      <div class="lecture-info">
        <div class="lecture-num-badge">${lec.id}</div>
        <div class="lecture-details">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <h4>${lec.title}</h4>
            ${levelBadge}
          </div>
          <p>${lec.description}</p>
          ${quizBadgeHtml}
        </div>
      </div>
      <div class="lecture-actions">
        ${quizButtonHtml}
        <a href="${lec.videoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          تحميل الفيديو
        </a>
        <a href="${lec.sheetUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          تحميل الشيت
        </a>
      </div>
    `;
    lecturesList.appendChild(card);
  });
}

function renderStudentProgressCard(parent, targetLectures, currentPkg) {
  let existingProgress = document.getElementById('studentProgressCard');
  if (existingProgress) existingProgress.remove();

  let existingExamCard = document.getElementById('comprehensiveExamCard');
  if (existingExamCard) existingExamCard.remove();

  const config = window.PORTAL_CONFIG || {};
  const lectures = (targetLectures && targetLectures.length > 0) ? targetLectures : (config.LECTURES || []);
  const rawRole = (sessionStorage.getItem('AA_STUDENT_ROLE') || 'bundle').toLowerCase();
  const role = rawRole.toUpperCase();

  // فقط المحاضرات التي تحتوي على اختبارات (المحاضرات من 1 إلى 13)
  const quizLectures = lectures.filter(l => Array.isArray(l.quiz) && l.quiz.length > 0);
  const totalQuizLecs = quizLectures.length;
  let passedLecCount = 0;
  quizLectures.forEach(lec => {
    if (localStorage.getItem(`AA_QUIZ_PASSED_${lec.id}`) === 'true') passedLecCount++;
  });

  const lecPercent = totalQuizLecs > 0 ? Math.min(100, Math.round((passedLecCount / totalQuizLecs) * 100)) : 100;
  const pkgTitle = currentPkg ? currentPkg.batchName : "الكورس التدريبي";

  // فحص اكتمال محاضرات المبتدئين (1 إلى 10)
  let begPassedCount = 0;
  for (let i = 1; i <= 10; i++) {
    if (localStorage.getItem(`AA_QUIZ_PASSED_${i}`) === 'true') begPassedCount++;
  }
  const isBegLecturesFinished = (begPassedCount >= 10);

  // فحص اكتمال محاضرات المحترفين (11 إلى 13)
  let proPassedCount = 0;
  for (let i = 11; i <= 13; i++) {
    if (localStorage.getItem(`AA_QUIZ_PASSED_${i}`) === 'true') proPassedCount++;
  }
  const isProLecturesFinished = (proPassedCount >= 3);

  // فحص حالة اجتياز الامتحانات الكبرى
  const isPassedBeg = localStorage.getItem('AA_FINAL_EXAM_PASSED_BEGINNER') === 'true';
  const dataBegRaw = localStorage.getItem('AA_FINAL_EXAM_DATA_BEGINNER');
  const dataBeg = dataBegRaw ? JSON.parse(dataBegRaw) : null;

  const isPassedPro = localStorage.getItem('AA_FINAL_EXAM_PASSED_PRO') === 'true';
  const dataProRaw = localStorage.getItem('AA_FINAL_EXAM_DATA_PRO');
  const dataPro = dataProRaw ? JSON.parse(dataProRaw) : null;

  const isPassedBundle = localStorage.getItem('AA_FINAL_EXAM_PASSED_BUNDLE') === 'true';
  const dataBundleRaw = localStorage.getItem('AA_FINAL_EXAM_DATA_BUNDLE');
  const dataBundle = dataBundleRaw ? JSON.parse(dataBundleRaw) : null;

  // 1. كارت شريط تقدم اختبارات المحاضرات الفردية
  const progressCard = document.createElement('div');
  progressCard.className = 'student-progress-card';
  progressCard.id = 'studentProgressCard';
  progressCard.innerHTML = `
    <div class="prog-info">
      <h4>🎓 تقدمك في المحاضرات: ${totalQuizLecs > 0 ? `${passedLecCount} من ${totalQuizLecs} اختبارات مكتملة` : 'المحاضرات مكتملة'}</h4>
      <p>خاص بباقة: <strong style="color: var(--gold-light);">${pkgTitle}</strong>. أنجز اختبارات المحاضرات بالتسلسل لفتح الامتحانات العامة والشهادات المعتمدة!</p>
    </div>
    <div class="prog-bar-container">
      <div class="prog-bar-bg">
        <div class="prog-bar-fill" style="width: ${lecPercent}%;"></div>
      </div>
      <div class="prog-bar-text">${totalQuizLecs > 0 ? `إنجاز اختبارات المحاضرات: ${lecPercent}%` : 'المحاضرات مكتملة'}</div>
    </div>
    <button class="btn-cert-claim" onclick="openCertificateModal()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
      استعراض الشهادة 📜
    </button>
  `;

  // توليد كارت امتحان المبتدئين
  function getBegCardHtml() {
    let buttonBegHtml = '';
    let statusBegHtml = '';

    if (isPassedBeg) {
      statusBegHtml = `
        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 8px; padding: 8px 14px; margin-bottom: 10px; color: #34d399; font-size: 0.86rem; font-weight: 700;">
          <span>✓ تم اجتياز الامتحان بنجاح</span>
          <span>النتيجة: ${dataBeg ? dataBeg.score + '%' : 'ناجح'}</span>
        </div>
      `;
      buttonBegHtml = `
        <button class="btn btn-secondary btn-sm" onclick="startComprehensiveExam('BEGINNER')" style="width: 100%;">
          🔄 إعادة امتحان كورس المبتدئين
        </button>
      `;
    } else if (isBegLecturesFinished) {
      // فتح الامتحان بعد إتمام المحاضرات 1 إلى 10
      statusBegHtml = `<div style="color: #34d399; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">🔓 متاح الآن بعد إتمام اختبارات المحاضرات العشرة (درجة النجاح: 70%)</div>`;
      buttonBegHtml = `
        <button class="btn btn-primary btn-sm pulse-btn" onclick="startComprehensiveExam('BEGINNER')" style="width: 100%; font-weight: 800; padding: 10px 16px;">
          ⚡ بدء امتحان كورس المبتدئين (30 سؤالاً) 📝
        </button>
      `;
    } else {
      // مقفول حتى إتمام اختبارات المحاضرات من 1 إلى 10
      statusBegHtml = `<div style="color: #94a3b8; font-size: 0.8rem; margin-bottom: 8px;">🔒 مقفول (يتطلب إتمام اختبارات المحاضرات 1 إلى 10 أولاً: ${begPassedCount} / 10)</div>`;
      buttonBegHtml = `
        <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.6; cursor: not-allowed; width: 100%;">
          🔒 مقفول (أكمل اختبارات المحاضرات أولاً)
        </button>
      `;
    }

    return `
      <div class="major-exam-card" style="background: rgba(16, 24, 40, 0.88); border: 1.5px solid rgba(16, 185, 129, 0.35); border-radius: 16px; padding: 22px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px;">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <span style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); font-size: 0.78rem; font-weight: 700; padding: 3px 10px; border-radius: 20px;">
              🟢 كورس المبتدئين (المحاضرات 1 - 10)
            </span>
            <span style="color: #94a3b8; font-size: 0.82rem; font-weight: 600;">30 سؤالاً</span>
          </div>
          <h4 style="color: #fff; font-size: 1.1rem; font-weight: 800; margin: 0 0 6px;">
            امتحان كورس الإكسيل للمبتدئين
          </h4>
          <p style="color: #cbd5e1; font-size: 0.86rem; line-height: 1.55; margin: 0;">
            امتحان شامل لكافة موضوعات الكورس الأول: التنسيقات، DATEDIF، نصوص Text to Columns، شروط IF، التحقق من البيانات، دوال VLOOKUP و Pivot Tables.
          </p>
        </div>
        <div>
          ${statusBegHtml}
          ${buttonBegHtml}
        </div>
      </div>
    `;
  }

  // توليد كارت امتحان المحترفين
  function getProCardHtml() {
    let buttonProHtml = '';
    let statusProHtml = '';

    if (isPassedPro) {
      statusProHtml = `
        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 8px; padding: 8px 14px; margin-bottom: 10px; color: #34d399; font-size: 0.86rem; font-weight: 700;">
          <span>✓ تم اجتياز الامتحان بنجاح</span>
          <span>النتيجة: ${dataPro ? dataPro.score + '%' : 'ناجح'}</span>
        </div>
      `;
      buttonProHtml = `
        <button class="btn btn-secondary btn-sm" onclick="startComprehensiveExam('PRO')" style="width: 100%;">
          🔄 إعادة امتحان كورس المحترفين
        </button>
      `;
    } else if (isProLecturesFinished) {
      statusProHtml = `<div style="color: #c084fc; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px;">🔓 متاح الآن بعد إتمام اختبارات المحاضرات (درجة النجاح: 70%)</div>`;
      buttonProHtml = `
        <button class="btn btn-secondary btn-sm pulse-btn" onclick="startComprehensiveExam('PRO')" style="width: 100%; border-color: #a855f7; color: #c084fc; font-weight: 800; padding: 10px 16px;">
          ⚡ بدء امتحان كورس المحترفين (30 سؤالاً) 📝
        </button>
      `;
    } else {
      statusProHtml = `<div style="color: #94a3b8; font-size: 0.8rem; margin-bottom: 8px;">🔒 مقفول (أكمل اختبارات محاضرات المحترفين أولاً: ${proPassedCount} / 3)</div>`;
      buttonProHtml = `
        <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.6; cursor: not-allowed; width: 100%;">
          🔒 مقفول (أكمل اختبارات المحاضرات أولاً)
        </button>
      `;
    }

    return `
      <div class="major-exam-card" style="background: rgba(16, 24, 40, 0.88); border: 1.5px solid rgba(168, 85, 247, 0.4); border-radius: 16px; padding: 22px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px;">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <span style="background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4); font-size: 0.78rem; font-weight: 700; padding: 3px 10px; border-radius: 20px;">
              🚀 كورس المحترفين (المحاضرات 11 - 20)
            </span>
            <span style="color: #94a3b8; font-size: 0.82rem; font-weight: 600;">30 سؤالاً</span>
          </div>
          <h4 style="color: #fff; font-size: 1.1rem; font-weight: 800; margin: 0 0 6px;">
            امتحان كورس الإكسيل للمحترفين
          </h4>
          <p style="color: #cbd5e1; font-size: 0.86rem; line-height: 1.55; margin: 0;">
            امتحان متقدم لموضوعات الكورس الثاني: SUMPRODUCT، النمذجة المالية PMT، دوال TAKE و DROP، حسابات الذمم AR، الباور كويري، والداشبورد التنفيذي.
          </p>
        </div>
        <div>
          ${statusProHtml}
          ${buttonProHtml}
        </div>
      </div>
    `;
  }

  // توليد كارت الامتحان العام الشامل
  function getBundleCardHtml() {
    return `
      <div class="major-exam-card" style="background: linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%); border: 2px solid #f59e0b; border-radius: 16px; padding: 22px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px; box-shadow: 0 0 25px rgba(245, 158, 11, 0.15);">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <span style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.5); font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">
              👑 الامتحان العام الشامل (20 محاضرة)
            </span>
            <span style="color: #fbbf24; font-size: 0.82rem; font-weight: 700;">40 سؤالاً</span>
          </div>
          <h4 style="color: #fff; font-size: 1.1rem; font-weight: 800; margin: 0 0 6px;">
            الامتحان العام الشامل لدبلومة الإكسيل
          </h4>
          <p style="color: #cbd5e1; font-size: 0.86rem; line-height: 1.55; margin: 0;">
            الامتحان التقييمي الأكبر الشامل لكافة مهارات وأدوات الكورسين معاً لاعتماد دبلومة ماستري الإكسيل وتحليل البيانات التامة وإصدار الشهادة المعتمدة.
          </p>
        </div>
        <div>
          ${isPassedBundle ? `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 8px; padding: 8px 14px; margin-bottom: 10px; color: #34d399; font-size: 0.86rem; font-weight: 700;">
              <span>✓ تم اجتياز الامتحان الشامل بنجاح</span>
              <span>النتيجة: ${dataBundle ? dataBundle.score + '%' : 'ناجح'}</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="startComprehensiveExam('BUNDLE')" style="width: 100%;">
              🔄 إعادة الامتحان العام الشامل
            </button>
          ` : `
            <div style="color: #fbbf24; font-size: 0.8rem; margin-bottom: 8px;">درجة النجاح: 70% (28 سؤالاً صحيحاً من 40)</div>
            <button class="btn btn-gold btn-sm pulse-btn" onclick="startComprehensiveExam('BUNDLE')" style="width: 100%; font-weight: 800; padding: 10px 14px;">
              ⚡ خوض الامتحان العام الشامل (40 سؤالاً) 📝
            </button>
          `}
        </div>
      </div>
    `;
  }

  // تحديد ما يظهر للطالب بدقة حسب باقته وكوده وبالتسلسل المطلوب:
  // - مبتدئين فقط: يظهر امتحان كورس المبتدئين فقط
  // - محترفين فقط: يظهر امتحان كورس المحترفين فقط
  // - الباقة الشاملة: تسلسل صارم ومحكم:
  //   1) يظهر الامتحان الأول فقط (كورس المبتدئين).
  //   2) لا يظهر الامتحان الثاني (كورس المحترفين) إلا بعد أن يمتحن ويجتاز الأول بنجاح!
  //   3) ولا يظهر ويفتح الامتحان الأخير (الامتحان العام الشامل) إلا بعد اجتياز الأول والثاني!
  let sectionTitle = '';
  let sectionSubtitle = '';
  let roadmapHtml = '';
  let cardsHtml = '';

  if (rawRole === 'beginner') {
    sectionTitle = '🏆 الامتحان العام المعتمد لكورس الإكسيل للمبتدئين';
    sectionSubtitle = 'امتحان تقييمي معتمد وشامل لمحتوى كورس المبتدئين بالكامل (المحاضرات 1 إلى 10) لاعتماد شهادتك الرسمية:';
    cardsHtml = getBegCardHtml();
  } else if (rawRole === 'pro') {
    sectionTitle = '🏆 الامتحان العام المعتمد لكورس الإكسيل للمحترفين';
    sectionSubtitle = 'امتحان تقييمي متقدم ومعتمد لمحتوى كورس المحترفين بالكامل (المحاضرات 11 إلى 20) لاعتماد شهادتك الرسمية:';
    cardsHtml = getProCardHtml();
  } else {
    // الباقة الشاملة (Bundle) - المسار التسلسلي الصارم
    if (!isPassedBeg) {
      // المرحلة 1: لم يجتز الامتحان الأول بعد -> يظهر الامتحان الأول فقط
      sectionTitle = '🏆 مسار الامتحانات المعتمدة (المرحلة 1 من 3: امتحان الكورس الأول)';
      sectionSubtitle = 'أنجز اختبارات المحاضرات أولاً، ثم اجتز امتحان الكورس الأول ليظهر ويُفتح لك امتحان الكورس الثاني تلقائياً:';
      roadmapHtml = `
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; padding: 10px 14px; background: rgba(255,255,255,0.04); border-radius: 10px; font-size: 0.82rem;">
          <span style="color: #34d399; font-weight: 700;">🟢 المرحلة 1: امتحان المبتدئين (نشط حالياً)</span>
          <span style="color: #64748b;">⬅️</span>
          <span style="color: #64748b;">🔒 المرحلة 2: امتحان المحترفين (يظهر بعد اجتياز الأول)</span>
          <span style="color: #64748b;">⬅️</span>
          <span style="color: #64748b;">🔒 المرحلة 3: الامتحان العام الشامل (يفتح في النهاية)</span>
        </div>
      `;
      cardsHtml = getBegCardHtml();
    } else if (isPassedBeg && !isPassedPro) {
      // المرحلة 2: اجتاز الأول ولم يجتز الثاني بعد -> يظهر الأول (مكتملاً) ويظهر الثاني ليخوضه
      sectionTitle = '🏆 مسار الامتحانات المعتمدة (المرحلة 2 من 3: تم فتح امتحان الكورس الثاني 🚀)';
      sectionSubtitle = 'تهانينا لاجتياز الكورس الأول! متاح لك الآن امتحان الكورس الثاني، واجتيازه سيفتح لك الامتحان العام الشامل النهائي:';
      roadmapHtml = `
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; padding: 10px 14px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 10px; font-size: 0.82rem;">
          <span style="color: #34d399; font-weight: 700;">✓ تم اجتياز امتحان المبتدئين (${dataBeg ? dataBeg.score + '%' : ''})</span>
          <span style="color: #34d399;">⬅️</span>
          <span style="color: #c084fc; font-weight: 700;">🚀 المرحلة 2: امتحان المحترفين (متاح الآن)</span>
          <span style="color: #64748b;">⬅️</span>
          <span style="color: #64748b;">🔒 المرحلة 3: الامتحان العام الشامل (يفتح فور اجتياز المحترفين)</span>
        </div>
      `;
      cardsHtml = `
        ${getBegCardHtml()}
        ${getProCardHtml()}
      `;
    } else {
      // المرحلة 3: اجتاز الأول والثاني بنجاح -> يفتح ويظهر الامتحان العام الشامل النهائي!
      sectionTitle = '🏆 مسار الامتحانات المعتمدة (المرحلة 3 والأخيرة: تم فتح الامتحان العام الشامل 👑)';
      sectionSubtitle = 'مبارك إتمام الكورسين بنجاح! تم فتح الامتحان العام الشامل لدبلومة الإكسيل المتكاملة لاعتماد تخرجك النهائي:';
      roadmapHtml = `
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; padding: 10px 14px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 10px; font-size: 0.82rem;">
          <span style="color: #34d399; font-weight: 700;">✓ امتحان المبتدئين</span>
          <span style="color: #34d399;">⬅️</span>
          <span style="color: #34d399; font-weight: 700;">✓ امتحان المحترفين</span>
          <span style="color: #f59e0b;">⬅️</span>
          <span style="color: #fbbf24; font-weight: 800;">👑 الامتحان العام الشامل لدبلومة الإكسيل (مفتوح ومتاح الآن!)</span>
        </div>
      `;
      cardsHtml = `
        ${getBegCardHtml()}
        ${getProCardHtml()}
        ${getBundleCardHtml()}
      `;
    }
  }

  // 2. سكشن الامتحانات العامة المعتمدة
  const examContainer = document.createElement('div');
  examContainer.className = 'major-exams-container';
  examContainer.id = 'comprehensiveExamCard';
  examContainer.style.cssText = 'background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.75) 100%); border: 2px solid rgba(245, 158, 11, 0.45); border-radius: 20px; padding: 24px; margin-bottom: 28px; box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(245, 158, 11, 0.15);';

  examContainer.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; margin-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 14px;">
      <div>
        <h3 style="color: #fff; font-size: 1.25rem; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 8px;">
          <span>🏆</span> ${sectionTitle}
        </h3>
        <p style="color: #cbd5e1; font-size: 0.88rem; margin: 4px 0 0;">
          ${sectionSubtitle}
        </p>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="openCertificateModal()" style="border-color: #f59e0b; color: #fbbf24;">
        📜 استعراض الشهادة المعتمدة
      </button>
    </div>

    ${roadmapHtml}

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 18px;">
      ${cardsHtml}
    </div>
  `;

  const banner = document.getElementById('portalNoticeBanner');
  if (banner && banner.parentNode) {
    banner.parentNode.insertBefore(progressCard, banner.nextSibling);
    banner.parentNode.insertBefore(examContainer, progressCard.nextSibling);
  }
}

// -----------------------------------------------------------------------------
// 4. محرك الامتحانات التفاعلي (Interactive Exam Engine)
// -----------------------------------------------------------------------------
let activeQuizState = {
  isComprehensive: false,
  role: 'BUNDLE',
  examTitle: '',
  passingGrade: 70,
  lectureId: null,
  lectureTitle: "",
  questions: [],
  currentIndex: 0,
  score: 0
};

function initQuizModals() {
  // إنشاء نافذة الاختبار التفاعلية إذا لم تكن موجودة
  if (!document.getElementById('quizModalBackdrop')) {
    const quizBackdrop = document.createElement('div');
    quizBackdrop.className = 'quiz-modal-backdrop';
    quizBackdrop.id = 'quizModalBackdrop';
    quizBackdrop.innerHTML = `
      <div class="quiz-modal-box">
        <div class="quiz-modal-header">
          <h3 id="quizModalTitle">📝 اختبار تدريبي معتمد</h3>
          <span class="quiz-step-indicator" id="quizStepIndicator">السؤال 1 من 3</span>
        </div>
        <div class="quiz-modal-body" id="quizModalBody">
          <!-- محتوى السؤال والخيارات -->
        </div>
        <div class="quiz-modal-footer">
          <button class="btn btn-secondary btn-sm" onclick="closeQuizModal()">إلغاء وإغلاق</button>
          <button class="btn btn-primary btn-sm" id="quizNextBtn" style="display:none;" onclick="nextQuizQuestion()">السؤال التالي ⬅️</button>
        </div>
      </div>
    `;
    document.body.appendChild(quizBackdrop);
  }

  // إنشاء نافذة معاينة الكود البرمجي (VBA Code Modal)
  if (!document.getElementById('vbaCodeModal')) {
    const codeModal = document.createElement('div');
    codeModal.className = 'vba-code-modal';
    codeModal.id = 'vbaCodeModal';
    codeModal.innerHTML = `
      <div class="vba-code-window">
        <div class="vba-code-header">
          <h4 id="vbaModalTitle">معاينة الكود البرمجي</h4>
          <button class="vba-code-close" onclick="closeVbaCodeModal()">&times;</button>
        </div>
        <pre class="vba-code-body" id="vbaModalCode"></pre>
        <div class="vba-code-footer">
          <button class="vba-btn-sub primary" id="vbaModalCopyBtn">📋 نسخ الكود</button>
          <button class="vba-btn-sub" id="vbaModalDownloadBtn">💾 تحميل ملف .bas</button>
          <button class="vba-btn-sub" onclick="closeVbaCodeModal()">إغلاق</button>
        </div>
      </div>
    `;
    document.body.appendChild(codeModal);
  }

  // إنشاء نافذة شهادة التخرج (Certificate Modal)
  if (!document.getElementById('certModalBackdrop')) {
    const certBackdrop = document.createElement('div');
    certBackdrop.className = 'quiz-modal-backdrop';
    certBackdrop.id = 'certModalBackdrop';
    certBackdrop.innerHTML = `
      <div class="cert-modal-box">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
          <h3 style="color:#fff; margin:0; font-size:1.2rem;">🎓 شهادة إتمام الدورة الرسمية</h3>
          <button class="vba-code-close" onclick="closeCertModal()">&times;</button>
        </div>
        <div style="margin-bottom:15px; display:flex; gap:10px; align-items:center;">
          <input type="text" id="certStudentNameInput" class="vba-search-input" placeholder="اكتب اسمك الثلاثي الكامل ليظهر بالشهادة..." value="المهندس / أحمد علاء">
          <button class="btn btn-gold btn-sm" onclick="updateCertName()">تحديث الاسم بالشهادة</button>
          <button class="btn btn-primary btn-sm" onclick="window.print()">طباعة / حفظ PDF 🖨️</button>
        </div>
        <div class="cert-paper" id="certPrintArea">
          <img src="Logo.png" alt="A.A Academy" class="cert-logo">
          <div class="cert-title">A.A ACADEMY OF EXCEL MASTERY</div>
          <div class="cert-subtitle" id="certCourseSubtitle">شهادة إتمام واجتياز كورس مايكروسوفت إكسيل وتحليل البيانات الاحترافي</div>
          <p style="color:#94a3b8; margin-top:15px;">يشهد الأستاذ أحمد علاء بأن المتدرب:</p>
          <div class="cert-student-name" id="certDisplayStudentName">المهندس / أحمد علاء</div>
          <p class="cert-text">
            قد أتم بنجاح كافة المحاضرات التدريبية واجتاز الاختبارات العملية والتطبيقية والامتحانات العامة الشاملة في تصميم الشيتات المتقدمة، دوال XLOOKUP، الجداول المحورية (Pivot Tables)، الباور كويري (Power Query)، وبناء لوحات التحكم التفاعلية (Dashboards).
          </p>
          <div class="cert-signatures">
            <div class="cert-sig">
              <h5>المدرب المشرف</h5>
              <p>م/ أحمد علاء (Ahmed Alaa)</p>
            </div>
            <div class="cert-sig">
              <h5>كود الاعتماد</h5>
              <p id="certCodeDisplay">AA-CERT-2026-994</p>
            </div>
            <div class="cert-sig">
              <h5>الحالة</h5>
              <p id="certStatusDisplay">معتمد وموثق 100% ✓</p>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(certBackdrop);
  }
}

// تشغيل اختبار المحاضرة الفردية (للمحاضرات 1 إلى 13 فقط)
window.startQuizForLecture = function(lectureId) {
  const config = window.PORTAL_CONFIG;
  if (!config || !config.LECTURES) return;

  const lec = config.LECTURES.find(l => l.id === lectureId);
  if (!lec || !lec.quiz || lec.quiz.length === 0) {
    showToast("لا توجد أسئلة مضافة لهذه المحاضرة حالياً.");
    return;
  }

  activeQuizState = {
    isComprehensive: false,
    lectureId: lec.id,
    lectureTitle: lec.title,
    questions: lec.quiz,
    currentIndex: 0,
    score: 0
  };

  const backdrop = document.getElementById('quizModalBackdrop');
  if (backdrop) backdrop.classList.add('open');
  renderCurrentQuestion();
};

// تشغيل أحد الامتحانات الثلاثة الرئيسية (الكورس الأول أو الكورس الثاني أو الامتحان العام الشامل)
window.startComprehensiveExam = function(examTarget) {
  const config = window.PORTAL_CONFIG;
  if (!config || !config.FINAL_EXAMS) {
    showToast("جاري تحميل أسئلة الامتحان العام...");
    return;
  }

  const targetKey = (examTarget || 'BUNDLE').toUpperCase();
  const exam = config.FINAL_EXAMS[targetKey] || config.FINAL_EXAMS.BUNDLE;

  if (!exam || !exam.questions || exam.questions.length === 0) {
    showToast("عفواً، بنك أسئلة هذا الامتحان غير متاح حالياً.");
    return;
  }

  activeQuizState = {
    isComprehensive: true,
    role: targetKey,
    examTitle: exam.title,
    passingGrade: exam.passingGrade || 70,
    questions: exam.questions,
    currentIndex: 0,
    score: 0
  };

  const backdrop = document.getElementById('quizModalBackdrop');
  if (backdrop) backdrop.classList.add('open');
  renderCurrentQuestion();
};

function renderCurrentQuestion() {
  const q = activeQuizState.questions[activeQuizState.currentIndex];
  const titleEl = document.getElementById('quizModalTitle');
  const indicatorEl = document.getElementById('quizStepIndicator');
  const bodyEl = document.getElementById('quizModalBody');
  const nextBtn = document.getElementById('quizNextBtn');

  if (activeQuizState.isComprehensive) {
    if (titleEl) titleEl.textContent = `🏆 ${activeQuizState.examTitle || 'الامتحان العام'}`;
    if (indicatorEl) indicatorEl.textContent = `سؤال ${activeQuizState.currentIndex + 1} من ${activeQuizState.questions.length} (درجة النجاح: ${activeQuizState.passingGrade}%)`;
  } else {
    if (titleEl) titleEl.textContent = `📝 ${activeQuizState.lectureTitle}`;
    if (indicatorEl) indicatorEl.textContent = `السؤال ${activeQuizState.currentIndex + 1} من ${activeQuizState.questions.length}`;
  }

  if (nextBtn) nextBtn.style.display = 'none';

  let optionsHtml = '';
  q.options.forEach((opt, idx) => {
    optionsHtml += `
      <button class="quiz-option-btn" onclick="selectQuizAnswer(${idx})">
        <span>${opt}</span>
        <span class="quiz-opt-icon">⭕</span>
      </button>
    `;
  });

  const progressPercent = Math.round(((activeQuizState.currentIndex) / activeQuizState.questions.length) * 100);

  bodyEl.innerHTML = `
    <div style="background: rgba(255,255,255,0.06); height: 6px; border-radius: 6px; overflow: hidden; margin-bottom: 16px;">
      <div style="background: linear-gradient(90deg, #f59e0b, #10b981); height: 100%; width: ${progressPercent}%; transition: width 0.3s ease;"></div>
    </div>
    <div class="quiz-question-text">${q.question}</div>
    <div class="quiz-options-list" id="quizOptionsList">
      ${optionsHtml}
    </div>
    <div class="quiz-feedback-box" id="quizFeedbackBox"></div>
  `;
}

window.selectQuizAnswer = function(chosenIdx) {
  const q = activeQuizState.questions[activeQuizState.currentIndex];
  const listEl = document.getElementById('quizOptionsList');
  const feedbackEl = document.getElementById('quizFeedbackBox');
  const nextBtn = document.getElementById('quizNextBtn');

  const buttons = listEl.querySelectorAll('.quiz-option-btn');
  buttons.forEach(btn => btn.disabled = true);

  const isCorrect = (chosenIdx === q.correctIndex);
  if (isCorrect) {
    activeQuizState.score++;
    buttons[chosenIdx].classList.add('correct');
    buttons[chosenIdx].querySelector('.quiz-opt-icon').textContent = '✅';
    feedbackEl.className = 'quiz-feedback-box correct';
    feedbackEl.style.display = 'block';
    feedbackEl.innerHTML = `<strong>إجابة صحيحة ممتازة! 🎉</strong><br>${q.explanation}`;
  } else {
    buttons[chosenIdx].classList.add('wrong');
    buttons[chosenIdx].querySelector('.quiz-opt-icon').textContent = '❌';
    buttons[q.correctIndex].classList.add('correct');
    buttons[q.correctIndex].querySelector('.quiz-opt-icon').textContent = '✅';
    feedbackEl.className = 'quiz-feedback-box wrong';
    feedbackEl.style.display = 'block';
    feedbackEl.innerHTML = `<strong>إجابة غير دقيقة!</strong> الإجابة الصحيحة هي: <u>${q.options[q.correctIndex]}</u><br>${q.explanation}`;
  }

  if (nextBtn) {
    nextBtn.style.display = 'inline-block';
    if (activeQuizState.currentIndex + 1 === activeQuizState.questions.length) {
      nextBtn.textContent = activeQuizState.isComprehensive ? 'إنهاء الامتحان وإعلان النتيجة 🏁' : 'إنهاء الاختبار وإعلان النتيجة 🏁';
    } else {
      nextBtn.textContent = 'السؤال التالي ⬅️';
    }
  }
};

window.nextQuizQuestion = function() {
  if (activeQuizState.currentIndex + 1 < activeQuizState.questions.length) {
    activeQuizState.currentIndex++;
    renderCurrentQuestion();
  } else {
    finishLectureQuiz();
  }
};

function finishLectureQuiz() {
  const bodyEl = document.getElementById('quizModalBody');
  const nextBtn = document.getElementById('quizNextBtn');
  const total = activeQuizState.questions.length;
  const score = activeQuizState.score;
  const percent = Math.round((score / total) * 100);

  if (nextBtn) nextBtn.style.display = 'none';

  if (activeQuizState.isComprehensive) {
    const passingGrade = activeQuizState.passingGrade || 70;
    const isPassed = percent >= passingGrade;

    if (isPassed) {
      localStorage.setItem(`AA_FINAL_EXAM_PASSED_${activeQuizState.role}`, 'true');
      localStorage.setItem(`AA_FINAL_EXAM_DATA_${activeQuizState.role}`, JSON.stringify({
        passed: true,
        score: percent,
        correct: score,
        total: total,
        date: new Date().toLocaleDateString('ar-EG')
      }));
      if (activeQuizState.role === 'BEGINNER') {
        showToast(`ألف مبروك! اجتزت امتحان الكورس الأول بنسبة ${percent}%، وفُتح لك الآن امتحان الكورس الثاني! 🚀🎉`);
      } else if (activeQuizState.role === 'PRO') {
        showToast(`ألف مبروك! اجتزت امتحان الكورس الثاني بنسبة ${percent}%، وفُتح لك الآن الامتحان العام الشامل النهائي! 👑🎉`);
      } else {
        showToast(`ألف مبروك! اجتزت الامتحان العام الشامل بنسبة ${percent}% وتم توثيق شهادتك الرسمية 🎓🏆`);
      }
    }

    bodyEl.innerHTML = `
      <div style="text-align: center; padding: 25px 0;">
        <div style="font-size: 4rem; margin-bottom: 12px;">${isPassed ? '🏆' : '📚'}</div>
        <h3 style="color: #fff; font-size: 1.6rem; margin-bottom: 8px;">
          ${isPassed ? 'مبارك! تم اجتياز الامتحان بنجاح باهر' : 'فرصة أخرى للنجاح! راجع المحاضرات وأعد المحاولة'}
        </h3>
        <p style="color: #94a3b8; font-size: 1.05rem; margin-bottom: 8px;">
          نتيجتك في هذا الامتحان: 
          <strong style="color: ${isPassed ? '#34d399' : '#f87171'}; font-size: 1.5rem; display: block; margin: 10px 0;">
            ${score} من ${total} إجابة صحيحة (${percent}%)
          </strong>
        </p>
        <p style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 25px;">
          ${isPassed ? 
            'تم توثيق تخرجك واجتيازك بنجاح من الأكاديمية! يمكنك الآن استعراض وطباعة شهادتك المعتمدة مباشرة.' : 
            `درجة النجاح المطلوبة هي ${passingGrade}% (${Math.ceil(total * passingGrade / 100)} سؤالاً صحيحاً). يمكنك إعادة الامتحان فوراً.`}
        </p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-secondary btn-sm" onclick="closeQuizModal()">العودة لقاعة المحاضرات</button>
          <button class="btn btn-gold btn-sm" onclick="startComprehensiveExam('${activeQuizState.role}')">إعادة الامتحان 🔄</button>
          ${isPassed ? '<button class="btn-cert-claim" onclick="closeQuizModal(); openCertificateModal();">عرض وطباعة شهادتك المعتمدة 📜</button>' : ''}
        </div>
      </div>
    `;
  } else {
    // اختبار المحاضرة الفردية
    const isPassed = percent >= 60;
    if (isPassed) {
      localStorage.setItem(`AA_QUIZ_PASSED_${activeQuizState.lectureId}`, 'true');
      showToast(`تهانينا! اجتزت اختبار المحاضرة بنجاح بنسبة ${percent}% ⭐`);
    }

    bodyEl.innerHTML = `
      <div style="text-align: center; padding: 20px 0;">
        <div style="font-size: 3.5rem; margin-bottom: 10px;">${isPassed ? '🏆' : '📚'}</div>
        <h3 style="color: #fff; font-size: 1.5rem; margin-bottom: 8px;">
          ${isPassed ? 'مبارك! اجتزت اختبار المحاضرة بنجاح' : 'تحتاج للمراجعة وإعادة المحاولة'}
        </h3>
        <p style="color: #94a3b8; font-size: 1rem; margin-bottom: 20px;">
          نتيجتك في هذا الاختبار: <strong style="color: ${isPassed ? '#34d399' : '#f87171'}; font-size: 1.3rem;">${score} من ${total} (${percent}%)</strong>
        </p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" onclick="closeQuizModal()">العودة لقاعة المحاضرات</button>
          <button class="btn btn-secondary btn-sm" onclick="startQuizForLecture(${activeQuizState.lectureId})">إعادة الاختبار مرة أخرى 🔄</button>
        </div>
      </div>
    `;
  }

  // تحديث شريط التقدم والامتحانات وفقاً للبيانات
  const config = window.PORTAL_CONFIG;
  const classroomView = document.getElementById('portalClassroomView');
  if (config && classroomView) {
    const rawRole = sessionStorage.getItem('AA_STUDENT_ROLE') || 'bundle';
    const pkgs = config.PACKAGES || {};
    const currentPkg = (rawRole === 'beginner') ? pkgs.BEGINNER : (rawRole === 'pro') ? pkgs.PRO : pkgs.BUNDLE;
    let assigned = config.LECTURES || [];
    if (rawRole === 'beginner') assigned = assigned.filter(l => l.level === 'beginner' || l.id <= 10);
    else if (rawRole === 'pro') assigned = assigned.filter(l => l.level === 'pro' || l.id > 10);
    renderStudentProgressCard(classroomView, assigned, currentPkg);
    renderLecturesCards(assigned);
  }
}

window.closeQuizModal = function() {
  const backdrop = document.getElementById('quizModalBackdrop');
  if (backdrop) backdrop.classList.remove('open');
};

window.openCertificateModal = function() {
  const certModal = document.getElementById('certModalBackdrop');
  if (certModal) certModal.classList.add('open');

  const config = window.PORTAL_CONFIG;
  const rawRole = sessionStorage.getItem('AA_STUDENT_ROLE') || 'bundle';
  const role = rawRole.toUpperCase();
  const pkgs = config && config.PACKAGES ? config.PACKAGES : null;
  const currentPkg = pkgs ? (role === 'BEGINNER' ? pkgs.BEGINNER : role === 'PRO' ? pkgs.PRO : pkgs.BUNDLE) : null;

  const subtitleEl = document.getElementById('certCourseSubtitle');
  if (subtitleEl && currentPkg && currentPkg.certTitle) {
    subtitleEl.textContent = currentPkg.certTitle;
  }

  const storedStudentName = sessionStorage.getItem('AA_STUDENT_NAME');
  const input = document.getElementById('certStudentNameInput');
  const display = document.getElementById('certDisplayStudentName');
  if (storedStudentName && input && display) {
    input.value = storedStudentName;
    display.textContent = storedStudentName;
  }

  // فحص حالة اجتياز أي من الامتحانات الرئيسية
  const isPassedBundle = localStorage.getItem('AA_FINAL_EXAM_PASSED_BUNDLE') === 'true';
  const isPassedPro = localStorage.getItem('AA_FINAL_EXAM_PASSED_PRO') === 'true';
  const isPassedBeg = localStorage.getItem('AA_FINAL_EXAM_PASSED_BEGINNER') === 'true';

  let passSummary = null;
  if (isPassedBundle) {
    const d = JSON.parse(localStorage.getItem('AA_FINAL_EXAM_DATA_BUNDLE') || '{}');
    passSummary = `الامتحان العام الشامل لدبلومة الإكسيل بنسبة ${d.score || 70}%`;
  } else if (isPassedPro && role === 'PRO') {
    const d = JSON.parse(localStorage.getItem('AA_FINAL_EXAM_DATA_PRO') || '{}');
    passSummary = `امتحان كورس المحترفين بنسبة ${d.score || 70}%`;
  } else if (isPassedBeg && role === 'BEGINNER') {
    const d = JSON.parse(localStorage.getItem('AA_FINAL_EXAM_DATA_BEGINNER') || '{}');
    passSummary = `امتحان كورس المبتدئين بنسبة ${d.score || 70}%`;
  } else if (isPassedPro || isPassedBeg) {
    passSummary = `الامتحانات المعتمدة بنجاح`;
  }

  const certCodeDisplay = document.getElementById('certCodeDisplay');
  if (certCodeDisplay) {
    const activePass = sessionStorage.getItem('AA_ACTIVE_PASSCODE') || 'AA2026';
    certCodeDisplay.textContent = `AA-CERT-${activePass}-${role}`;
  }

  const certStatusDisplay = document.getElementById('certStatusDisplay');
  if (certStatusDisplay) {
    if (passSummary) {
      certStatusDisplay.innerHTML = `<span style="color:#10b981; font-weight:800;">معتمد وموثق 100% بنجاح (${passSummary}) ✓</span>`;
    } else {
      certStatusDisplay.innerHTML = `<span style="color:#f59e0b; font-weight:700;">قيد الإنجاز (بانتظار اجتياز الامتحان الشامل)</span>`;
    }
  }
};

window.closeCertModal = function() {
  const certModal = document.getElementById('certModalBackdrop');
  if (certModal) certModal.classList.remove('open');
};

window.updateCertName = function() {
  const input = document.getElementById('certStudentNameInput');
  const display = document.getElementById('certDisplayStudentName');
  if (input && display && input.value.trim() !== '') {
    display.textContent = input.value.trim();
    showToast("تم تحديث اسم الطالب على الشهادة بنجاح!");
  }
};

// -----------------------------------------------------------------------------
// 5. محرك ومحاكي برنامج VBA Genius Pro على الموقع (إدارة التجارب والتفعيل)
// -----------------------------------------------------------------------------
const VBA_VALID_ACTIVATION_KEYS = [
  'AA2026',            // ماستر باسورد الإدارة
  'BEG2026',           // كود كورس المبتدئين
  'PRO2026',           // كود كورس المحترفين
  'ALL2026',           // كود الباقة الشاملة
  'VBA-GENIUS-2026',   // كود تفعيل البرنامج السنوي/الدائم
  'GENIUS-PRO-VIP',    // كود ترخيص VIP
  'AA-VBA-VIP',        // كود ترخيص الأكاديمية
  'GENIUS2026'         // كود تفعيل سريع
];

function isVbaActivated() {
  if (localStorage.getItem('AA_VBA_IS_ACTIVATED') === 'true') return true;
  // إذا كان الطالب قد سجل دخوله بالفعل إلى قاعة المحاضرات
  if (sessionStorage.getItem('AA_STUDENT_AUTHENTICATED') === 'true') return true;
  return false;
}

function getVbaRemainingTrials() {
  if (isVbaActivated()) return 999;
  const stored = localStorage.getItem('AA_VBA_TRIAL_REMAINING');
  if (stored === null) {
    localStorage.setItem('AA_VBA_TRIAL_REMAINING', '5');
    return 5;
  }
  return parseInt(stored, 10);
}

function updateVbaTrialUI() {
  const counterEl = document.getElementById('vbaTrialCounterVal');
  const counterBox = document.getElementById('vbaTrialCounterBox');
  const statusIcon = document.getElementById('vbaTrialStatusIcon');
  const counterLabel = document.getElementById('vbaTrialCounterLabel');
  const unitLabel = document.getElementById('vbaTrialUnitLabel');
  const activateBtn = document.getElementById('vbaOpenActivationModalBtn');

  if (isVbaActivated()) {
    if (counterEl) counterEl.textContent = 'VIP';
    if (statusIcon) statusIcon.textContent = '👑';
    if (counterLabel) counterLabel.textContent = 'مرخص';
    if (unitLabel) unitLabel.textContent = 'غير محدود مدى الحياة';
    if (counterBox) {
      counterBox.style.background = 'rgba(16, 185, 129, 0.2)';
      counterBox.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      counterBox.style.color = '#34d399';
    }
    if (activateBtn) {
      activateBtn.textContent = '✓ مفعل مدى الحياة';
      activateBtn.style.color = '#34d399';
      activateBtn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    }
    return;
  }

  const remaining = getVbaRemainingTrials();
  if (counterEl) counterEl.textContent = remaining;

  if (remaining <= 0) {
    if (statusIcon) statusIcon.textContent = '🔒';
    if (counterLabel) counterLabel.textContent = 'منتهي';
    if (unitLabel) unitLabel.textContent = 'تجارب مجانية';
    if (counterBox) {
      counterBox.style.background = 'rgba(239, 68, 68, 0.2)';
      counterBox.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      counterBox.style.color = '#f87171';
    }
  } else {
    if (statusIcon) statusIcon.textContent = '⚡';
    if (counterLabel) counterLabel.textContent = 'متبقي';
    if (unitLabel) unitLabel.textContent = 'محاولات مجانية';
    if (counterBox) {
      counterBox.style.background = 'rgba(245, 158, 11, 0.15)';
      counterBox.style.borderColor = 'rgba(245, 158, 11, 0.35)';
      counterBox.style.color = '#fbbf24';
    }
  }
}

function consumeVbaTrial() {
  if (isVbaActivated()) return true;

  let remaining = getVbaRemainingTrials();
  if (remaining <= 0) {
    openVbaTrialExpiredModal();
    return false;
  }

  remaining--;
  localStorage.setItem('AA_VBA_TRIAL_REMAINING', remaining.toString());
  updateVbaTrialUI();

  if (remaining === 0) {
    showToast("⚠️ استهلكت آخر تجربة مجانية! للحصول على البرنامج غير محدود، اشترك بأي كورس أو أدخل كود التفعيل.");
  }
  return true;
}

window.openVbaActivationModal = function() {
  const modal = document.getElementById('vbaActivationModal');
  if (modal) {
    modal.classList.add('open');
    const input = document.getElementById('vbaActivationKeyInput');
    const err = document.getElementById('vbaActivationError');
    if (input) { input.value = ''; input.focus(); }
    if (err) err.style.display = 'none';
  }
};

window.closeVbaActivationModal = function() {
  const modal = document.getElementById('vbaActivationModal');
  if (modal) modal.classList.remove('open');
};

window.openVbaTrialExpiredModal = function() {
  const modal = document.getElementById('vbaTrialExpiredModal');
  if (modal) modal.classList.add('open');
};

window.closeVbaTrialExpiredModal = function() {
  const modal = document.getElementById('vbaTrialExpiredModal');
  if (modal) modal.classList.remove('open');
};

window.submitVbaActivationKey = function() {
  const input = document.getElementById('vbaActivationKeyInput');
  const err = document.getElementById('vbaActivationError');
  if (!input) return;

  const key = input.value.trim().toUpperCase();
  if (!key) {
    if (err) { err.textContent = 'يرجى كتابة كود التفعيل أولاً'; err.style.display = 'block'; }
    return;
  }

  // التحقق من صحة الكود (من قائمة الأكواد أو أكواد الطلاب الفردية)
  const isMatch = VBA_VALID_ACTIVATION_KEYS.includes(key) ||
                  key.startsWith('AA-BEG-') ||
                  key.startsWith('AA-PRO-') ||
                  key.startsWith('AA-ALL-');

  if (isMatch) {
    localStorage.setItem('AA_VBA_IS_ACTIVATED', 'true');
    closeVbaActivationModal();
    updateVbaTrialUI();
    showToast("🎉 مبروك! تم تفعيل برنامج VBA Genius Pro بنجاح مدى الحياة بدون أي قيود!");
  } else {
    if (err) {
      err.textContent = '❌ كود تفعيل غير صحيح. تأكد من الكود أو تواصل عبر واتساب لاستلامه.';
      err.style.display = 'block';
    }
  }
};

function initVbaGeniusShowcase() {
  const data = window.VBA_GENIUS_DATA;
  if (!data) return;

  updateVbaTrialUI();
  renderVbaLibraryCards(data.LIBRARY);
  initVbaTabs();
  initVbaSearchAndFilter();
  initVbaGeneratorTab();
  initVbaFixerTab();
}

function renderVbaLibraryCards(items) {
  const container = document.getElementById('vbaCardsGrid');
  if (!container) return;

  container.innerHTML = '';
  if (!items || items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #94a3b8;">
        لا توجد أكواد مطابقة لبحثك في المكتبة. جرب كلمة أخرى!
      </div>
    `;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'vba-card';
    card.innerHTML = `
      <div class="vba-card-category">${item.categoryName}</div>
      <h4 class="vba-card-title">${item.title}</h4>
      <p class="vba-card-desc">${item.description}</p>
      <div class="vba-card-actions">
        <button class="vba-btn-sub primary" onclick="copyVbaCodeById('${item.id}')">
          📋 نسخ الكود
        </button>
        <button class="vba-btn-sub" onclick="previewVbaCodeById('${item.id}')">
          👁️ معاينة الكود
        </button>
        <button class="vba-btn-sub" onclick="downloadVbaBasFile('${item.id}')">
          💾 تحميل .bas
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function initVbaTabs() {
  const tabButtons = document.querySelectorAll('.vba-tab-btn[data-vba-tab]');
  const views = document.querySelectorAll('.vba-view-tab');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute('data-vba-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      views.forEach(v => {
        if (v.id === `vba-view-${targetTab}`) {
          v.classList.add('active');
        } else {
          v.classList.remove('active');
        }
      });
    });
  });
}

function initVbaSearchAndFilter() {
  const searchInput = document.getElementById('vbaSearchInput');
  const filterSelect = document.getElementById('vbaFilterSelect');
  const data = window.VBA_GENIUS_DATA;

  function runFilter() {
    if (!data || !data.LIBRARY) return;
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const cat = filterSelect ? filterSelect.value : 'all';

    const filtered = data.LIBRARY.filter(item => {
      const matchCat = (cat === 'all' || item.category === cat);
      const matchQuery = (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)
      );
      return matchCat && matchQuery;
    });

    renderVbaLibraryCards(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', runFilter);
  if (filterSelect) filterSelect.addEventListener('change', runFilter);
}

window.copyVbaCodeById = function(id) {
  if (!consumeVbaTrial()) return;

  const data = window.VBA_GENIUS_DATA;
  if (!data) return;
  const item = data.LIBRARY.find(i => i.id === id);
  if (!item) return;

  navigator.clipboard.writeText(item.code).then(() => {
    showToast(`تم نسخ كود (${item.title}) إلى الحافظة بنجاح! 📋`);
  }).catch(() => {
    showToast("تم تحديد الكود للنسخ.");
  });
};

window.previewVbaCodeById = function(id) {
  const data = window.VBA_GENIUS_DATA;
  if (!data) return;
  const item = data.LIBRARY.find(i => i.id === id);
  if (!item) return;

  const modal = document.getElementById('vbaCodeModal');
  const title = document.getElementById('vbaModalTitle');
  const codeEl = document.getElementById('vbaModalCode');
  const copyBtn = document.getElementById('vbaModalCopyBtn');
  const downloadBtn = document.getElementById('vbaModalDownloadBtn');

  if (title) title.textContent = `معاينة: ${item.title}`;
  if (codeEl) codeEl.textContent = item.code;
  if (copyBtn) copyBtn.onclick = () => copyVbaCodeById(id);
  if (downloadBtn) downloadBtn.onclick = () => downloadVbaBasFile(id);

  if (modal) modal.classList.add('open');
};

window.closeVbaCodeModal = function() {
  const modal = document.getElementById('vbaCodeModal');
  if (modal) modal.classList.remove('open');
};

window.downloadVbaBasFile = function(id) {
  if (!consumeVbaTrial()) return;

  const data = window.VBA_GENIUS_DATA;
  if (!data) return;
  const item = data.LIBRARY.find(i => i.id === id);
  if (!item) return;

  const blob = new Blob([item.code], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = item.basFilename || 'macro.bas';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`تم بدء تحميل ملف (${item.basFilename}) الجاهز للاستيراد في الإكسيل! 💾`);
};

function initVbaGeneratorTab() {
  const generateBtn = document.getElementById('vbaGenerateBtn');
  const promptInput = document.getElementById('vbaPromptInput');
  const resultBox = document.getElementById('vbaGenResult');
  const resultTitle = document.getElementById('vbaGenTitle');
  const resultCode = document.getElementById('vbaGenCode');
  const chips = document.querySelectorAll('.vba-prompt-chip');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (promptInput) {
        promptInput.value = chip.textContent.replace('💡 مثال: ', '').trim();
      }
    });
  });

  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      const query = promptInput ? promptInput.value.trim() : '';
      if (!query) {
        showToast("يرجى كتابة طلبك أو الضغط على أحد الأمثلة الجاهزة!");
        return;
      }

      if (!consumeVbaTrial()) return;

      generateBtn.disabled = true;
      generateBtn.innerHTML = '⚡ جارٍ استدعاء الذكاء الاصطناعي وتوليد الكود...';

      setTimeout(() => {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '⚡ توليد الكود الآن ✨';

        let presetKey = Object.keys(window.VBA_GENIUS_DATA.PRESET_GENERATIONS).find(k => query.includes(k)) || "فاتورة";
        let preset = window.VBA_GENIUS_DATA.PRESET_GENERATIONS[presetKey];

        if (resultBox) resultBox.style.display = 'block';
        if (resultTitle) resultTitle.textContent = preset.title;
        if (resultCode) resultCode.textContent = preset.code;

        showToast("تم توليد كود VBA فائق الاحترافية بنجاح! 🎉");
      }, 900);
    });
  }
}

function initVbaFixerTab() {
  const fixBtn = document.getElementById('vbaRunFixBtn');
  const resultBox = document.getElementById('vbaFixResult');

  if (fixBtn && resultBox) {
    fixBtn.addEventListener('click', () => {
      if (!consumeVbaTrial()) return;

      fixBtn.disabled = true;
      fixBtn.innerHTML = '🛠️ جارٍ الفحص البرمجي للأخطاء...';

      setTimeout(() => {
        fixBtn.disabled = false;
        fixBtn.innerHTML = 'فحص وتصليح الخطأ المكتشف 🛠️';
        resultBox.style.display = 'block';
        showToast("تم اكتشاف الخطأ وإصلاحه مع الشرح التوضيحي! ✅");
      }, 700);
    });
  }
}

// -----------------------------------------------------------------------------
// 6. التمرير السلس للروابط (Smooth Scroll)
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
// 7. إشعارات التوست البسيطة (Toast Messages)
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

window.showToast = showToast;
