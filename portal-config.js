// =============================================================================
// إعدادات بوابة الطلاب - A.A Academy (أكاديمية أحمد علاء للإكسيل)
// =============================================================================
// أستاذ أحمد: يمكنك تعديل الباسورد وروابط المحاضرات من هذا الملف بكل بساطة في أي وقت!
// بعد نهاية كل دورة بيومين، فقط قم بتغيير "CURRENT_PASSCODE" إلى أي كلمة سر جديدة.
// =============================================================================

window.PORTAL_CONFIG = {
  // 🔐 كلمة السر الحالية لدخول قاعة المحاضرات (يمكنك تغييرها لأي دفعة جديدة)
  CURRENT_PASSCODE: "AA2026",

  // 🏷️ اسم الدفعة الحالية المعروض للطلاب
  CURRENT_BATCH_NAME: "الدفعة الحالية - كورس إكسيل الاحترافي",

  // 📢 تنبيه للطلاب
  NOTICE_TEXT: "تنبيه: التسجيلات وملفات العمل متاحة للتحميل طوال فترة الدورة ولمدة 48 ساعة بعد انتهائها كمرجع دائم لك على جهازك.",

  // 📚 قائمة الـ 10 محاضرات (ضع روابط Google Drive الخاصة بكل محاضرة وشيت العمل)
  LECTURES: [
    {
      id: 1,
      title: "المحاضرة 1: واجهة الإكسيل وتنسيق الجداول الاحترافية",
      description: "التعرف على أدوات البرنامج، ضبط الواجهة، تصميم وتنسيق الجداول والقوائم المنسدلة (Data Validation) وتثبيت الرؤوس.",
      videoUrl: "https://drive.google.com", // ضع هنا رابط تسجيل الفيديو على Google Drive
      sheetUrl: "https://drive.google.com", // ضع هنا رابط شيت الإكسيل العملي
      isAvailable: true
    },
    {
      id: 2,
      title: "المحاضرة 2: مدخل إلى الدوال وأنواعها والعمليات الأساسية",
      description: "فهم تركيبة الدوال، العمليات الحسابية، وتطبيق دوال الإحصاء والجمع الأساسية (SUM, AVERAGE, MIN, MAX, COUNT, COUNTA).",
      videoUrl: "https://drive.google.com",
      sheetUrl: "https://drive.google.com",
      isAvailable: true
    },
    {
      id: 3,
      title: "المحاضرة 3: الدوال الشرطية وصناعة القرارات (IF Family)",
      description: "احتراف الدالة الشرطية IF البسيطة والمركبة، ودوال العد والجمع الشرطي (COUNTIF, COUNTIFS, SUMIF, SUMIFS, AVERAGEIFS).",
      videoUrl: "https://drive.google.com",
      sheetUrl: "https://drive.google.com",
      isAvailable: true
    },
    {
      id: 4,
      title: "المحاضرة 4: ثورة دوال البحث والربط (VLOOKUP & XLOOKUP)",
      description: "شرح شامل لدوال البحث الرأسي والأفقي، وتطبيقات عملية متقدمة على أقوى دالة حديثة في الإكسيل XLOOKUP وطرق معالجة الأخطاء.",
      videoUrl: "https://drive.google.com",
      sheetUrl: "https://drive.google.com",
      isAvailable: true
    },
    {
      id: 5,
      title: "المحاضرة 5: دوال النصوص والتواريخ ومعالجة البيانات",
      description: "دوال دمج النصوص وتجزئتها (TEXTSPLIT, CONCAT, TRIM, LEFT, RIGHT) ودوال التواريخ والأوقات وحساب مدد العمل والمستحقات.",
      videoUrl: "https://drive.google.com",
      sheetUrl: "https://drive.google.com",
      isAvailable: true
    },
    {
      id: 6,
      title: "المحاضرة 6: التنسيق الشرطي المتقدم (Conditional Formatting)",
      description: "تمييز البيانات آلياً، إنشاء أشرطة التقدم وأيقونات التقييم، وتلوين الصفوف تلقائياً بناءً على شروط ومعادلات معقدة.",
      videoUrl: "https://drive.google.com",
      sheetUrl: "https://drive.google.com",
      isAvailable: true
    },
    {
      id: 7,
      title: "المحاضرة 7: الرسوم البيانية التفاعلية (Data Visualization)",
      description: "تصميم جميع أنواع الـ Charts باحترافية، اختيار الرسم البياني المناسب لكل نوع بيانات، وتنسيق المخططات للعروض التقديمية.",
      videoUrl: "https://drive.google.com",
      sheetUrl: "https://drive.google.com",
      isAvailable: true
    },
    {
      id: 8,
      title: "المحاضرة 8: الجداول المحورية السريعة (Pivot Tables)",
      description: "تحليل آلاف الصفوف في ثوانٍ، تجميع البيانات، حساب النسب، واستخدام الـ Slicers و Timelines لفلترة التقارير بشكل لحظي.",
      videoUrl: "https://drive.google.com",
      sheetUrl: "https://drive.google.com",
      isAvailable: true
    },
    {
      id: 9,
      title: "المحاضرة 9: مقدمة الباور كويري (Power Query) وأتمتة الشغل",
      description: "استيراد البيانات من مصادر متعددة، تنظيف الداتا المشوهة بضغطة زر واحدة وتحديث الشيتات والتقارير آلياً.",
      videoUrl: "https://drive.google.com",
      sheetUrl: "https://drive.google.com",
      isAvailable: true
    },
    {
      id: 10,
      title: "المحاضرة 10: المشروع العملي الشامل وبناء لوحة تحكم (Dashboard)",
      description: "ربط كل ما تعلمناه طوال الدورة في مشروع تخرّج متكامل، وتصميم داشبورد تفاعلية جاهزة للعرض على المديرين وأصحاب العمل.",
      videoUrl: "https://drive.google.com",
      sheetUrl: "https://drive.google.com",
      isAvailable: true
    }
  ]
};
