// =============================================================================
// VBA Genius Pro - Offline Interactive Simulator Data & Code Engine
// تطوير م/ أحمد علاء (Ahmed Alaa) - A.A Academy
// =============================================================================

window.VBA_GENIUS_DATA = {
  // 📚 مكتبة الأكواد الجاهزة (المطابقة لشاشة البرنامج الرئيسية)
  LIBRARY: [
    {
      id: "whatsapp-bulk",
      title: "إرسال رسائل واتساب جماعية من الإكسيل لعدة أرقام بضغطة زر",
      category: "messaging",
      categoryName: "التصدير والمراسلة",
      description: "يرسل رسائل واتساب مخصصة تلقائياً لقائمة أرقام بالعمود A مع نصوص مخصصة بالعمود B ويكتب حالة الإرسال في العمود C.",
      basFilename: "SendWhatsAppMessages.bas",
      code: `Attribute VB_Name = "Module_WhatsAppBulk"
'===================================================================
' اسم الكود: إرسال رسائل واتساب تلقائية ومخصصة من الإكسيل
' المطور: م/ أحمد علاء (VBA Genius Pro - A.A Academy)
' الشرح: يمر على الجدول ويرسل لكل رقم رسالته الخاصة عبر واتساب ويب
'===================================================================
Sub SendBulkWhatsAppMessages()
    Dim ws As Worksheet
    Dim lastRow As Long, i As Long
    Dim phone As String, msg As String, url As String
    
    Set ws = ActiveSheet
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    If lastRow < 2 Then
        MsgBox "لا توجد بيانات للإرسال في العمود A!", vbExclamation, "تنبيه"
        Exit Sub
    End If
    
    Application.ScreenUpdating = False
    
    For i = 2 To lastRow
        phone = Trim(ws.Cells(i, 1).Value)
        msg = ws.Cells(i, 2).Value
        
        If phone <> "" Then
            ' تنظيف وتجهيز الرابط ورسالة الواتساب
            msg = Replace(msg, vbCrLf, "%0A")
            msg = Replace(msg, " ", "%20")
            url = "https://web.whatsapp.com/send?phone=" & phone & "&text=" & msg
            
            ' فتح الرابط بالمتصفح
            ActiveWorkbook.FollowHyperlink Address:=url
            
            ' مهلة ثواني لإرسال الرسالة
            Application.Wait (Now + TimeValue("0:00:03"))
            ws.Cells(i, 3).Value = "تم الإرسال بنجاح (" & Format(Now, "hh:nn:ss") & ")"
        End If
    Next i
    
    Application.ScreenUpdating = True
    MsgBox "اكتمل إرسال جميع الرسائل بنجاح!", vbInformation, "VBA Genius Pro"
End Sub`
    },
    {
      id: "outlook-emails",
      title: "إرسال إيميلات مخصصة لمجموعة عملاء دفعة واحدة (Outlook)",
      category: "messaging",
      categoryName: "التصدير والمراسلة",
      description: "يمر على جدول العملاء، ويرسل إيميل رسمي منسق باسم كل عميل ومرفق لكل شخص مع تسجيل وقت وتاريخ الإرسال في الشيت.",
      basFilename: "SendOutlookEmails.bas",
      code: `Attribute VB_Name = "Module_OutlookEmails"
'===================================================================
' اسم الكود: إرسال إيميلات Outlook رسمية مخصصة ومرفقات للعملاء
' المطور: م/ أحمد علاء (VBA Genius Pro - A.A Academy)
'===================================================================
Sub SendBulkOutlookEmails()
    Dim OutlookApp As Object, OutlookMail As Object
    Dim ws As Worksheet
    Dim lastRow As Long, i As Long
    Dim recipientEmail As String, clientName As String, attachFile As String
    
    Set ws = ActiveSheet
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    On Error Resume Next
    Set OutlookApp = GetObject(Class:="Outlook.Application")
    If OutlookApp Is Nothing Then
        Set OutlookApp = CreateObject("Outlook.Application")
    End If
    On Error GoTo 0
    
    If OutlookApp Is Nothing Then
        MsgBox "برنامج Microsoft Outlook غير مثبت أو غير مفعل على جهازك!", vbCritical, "خطأ"
        Exit Sub
    End If
    
    For i = 2 To lastRow
        clientName = ws.Cells(i, 1).Value
        recipientEmail = ws.Cells(i, 2).Value
        attachFile = ws.Cells(i, 3).Value
        
        If recipientEmail <> "" Then
            Set OutlookMail = OutlookApp.CreateItem(0)
            With OutlookMail
                .To = recipientEmail
                .Subject = "تقرير الحساب الرسمي - أ/ " & clientName
                .Body = "السلام عليكم ورحمة الله وبركاته،" & vbCrLf & vbCrLf & _
                        "السيد المحترم: " & clientName & "," & vbCrLf & _
                        "نرفق لحضراتكم كشف الحساب الأخير والتقرير المالي المعتمد." & vbCrLf & vbCrLf & _
                        "مع أطيب التحيات،" & vbCrLf & "مكتب أ. أحمد علاء"
                
                If attachFile <> "" And Dir(attachFile) <> "" Then
                    .Attachments.Add attachFile
                End If
                
                .Send ' للإرسال المباشر أو .Display للمعاينة قبل الإرسال
            End With
            ws.Cells(i, 4).Value = "تم الإرسال: " & Format(Now, "yyyy-mm-dd hh:nn")
        End If
    Next i
    
    MsgBox "تم إرسال كافة الإيميلات بنجاح!", vbInformation, "VBA Genius Pro"
End Sub`
    },
    {
      id: "archive-invoice",
      title: "ترحيل الفواتير والبيانات تلقائياً لشيت الأرشيف مع توليد كود تسلسلي وتفريغ النموذج",
      category: "accounting",
      categoryName: "المحاسبة والترحيل",
      description: "أقوى كود يبحث عنه المحاسبون وأصحاب الأعمال: ينقل بيانات شيت الإدخال (الفاتورة) لآخر صف في شيت قاعدة البيانات، وينشئ رقم تسلسلي جديد، ويمسح الخلايا بعد الترحيل، مع رسالة تأكيد.",
      basFilename: "ArchiveInvoiceData.bas",
      code: `Attribute VB_Name = "Module_ArchiveInvoice"
'===================================================================
' اسم الكود: ترحيل الفاتورة لقاعدة البيانات وتفريغ النموذج تلقائياً
' المطور: م/ أحمد علاء (VBA Genius Pro - A.A Academy)
'===================================================================
Sub TransferAndArchiveInvoice()
    Dim wsInput As Worksheet, wsDB As Worksheet
    Dim nextRow As Long
    Dim invNumber As Long
    
    Set wsInput = ThisWorkbook.Sheets("الفاتورة")
    Set wsDB = ThisWorkbook.Sheets("الأرشيف_العام")
    
    ' التحقق من وجود اسم العميل والإجمالي
    If wsInput.Range("C5").Value = "" Then
        MsgBox "يرجى كتابة اسم العميل أولاً قبل الترحيل!", vbExclamation, "بيانات ناقصة"
        Exit Sub
    End If
    
    Application.ScreenUpdating = False
    
    ' إيجاد أول صف فارغ في شيت الأرشيف
    nextRow = wsDB.Cells(wsDB.Rows.Count, "A").End(xlUp).Row + 1
    
    ' رقم الفاتورة التسلسلي
    invNumber = wsInput.Range("E3").Value
    
    ' ترحيل البيانات للأرشيف
    wsDB.Cells(nextRow, 1).Value = invNumber
    wsDB.Cells(nextRow, 2).Value = wsInput.Range("E4").Value ' التاريخ
    wsDB.Cells(nextRow, 3).Value = wsInput.Range("C5").Value ' اسم العميل
    wsDB.Cells(nextRow, 4).Value = wsInput.Range("C6").Value ' رقم الهاتف
    wsDB.Cells(nextRow, 5).Value = wsInput.Range("G20").Value ' إجمالي الفاتورة
    wsDB.Cells(nextRow, 6).Value = Format(Now, "yyyy-mm-dd hh:nn:ss") ' وقت التسجيل
    
    ' زيادة رقم الفاتورة للعملية القادمة
    wsInput.Range("E3").Value = invNumber + 1
    
    ' تفريغ خلايا الإدخال فقط مع الحفاظ على المعادلات
    wsInput.Range("C5:C6").ClearContents
    wsInput.Range("B10:E19").ClearContents
    
    Application.ScreenUpdating = True
    
    MsgBox "تم ترحيل الفاتورة رقم (" & invNumber & ") بنجاح وتجهيز النموذج للفاتورة التالية!", vbInformation, "نجاح الترحيل"
End Sub`
    },
    {
      id: "export-pdf",
      title: "تصدير الشيت أو الفاتورة كملف PDF وحفظها تلقائياً باسم العميل والتاريخ",
      category: "messaging",
      categoryName: "التصدير والمراسلة",
      description: "يحفظ ورقة العمل الحالية كملف PDF عالي الجودة باسم العميل ورقم الفاتورة في مجلد مخصص، وينشئ المجلد تلقائياً ويفتح ملف الـ PDF مباشرة للمعاينة.",
      basFilename: "ExportSheetToPDF.bas",
      code: `Attribute VB_Name = "Module_ExportPDF"
'===================================================================
' اسم الكود: تصدير ورقة العمل أو الفاتورة لـ PDF عالي الجودة
' المطور: م/ أحمد علاء (VBA Genius Pro - A.A Academy)
'===================================================================
Sub ExportCurrentSheetToPDF()
    Dim ws As Worksheet
    Dim folderPath As String, clientName As String, fileName As String
    Dim fullPath As String
    
    Set ws = ActiveSheet
    
    ' تحديد مسار مجلد الحفظ في نفس مسار ملف الإكسيل
    folderPath = ThisWorkbook.Path & "\\فواتير_PDF\\"
    
    ' إنشاء المجلد تلقائياً إذا لم يكن موجوداً
    If Dir(folderPath, vbDirectory) = "" Then
        MkDir folderPath
    End If
    
    clientName = ws.Range("C5").Value
    If clientName = "" Then clientName = "عميل_عام"
    
    ' تجهيز اسم الملف بالعميل والتاريخ والوقت لمنع تكرار الأسماء
    fileName = "فاتورة_" & clientName & "_" & Format(Now, "yyyy-mm-dd_hh-nn") & ".pdf"
    fullPath = folderPath & fileName
    
    ' التصدير بجودة عالية
    ws.ExportAsFixedFormat _
        Type:=xlTypePDF, _
        Filename:=fullPath, _
        Quality:=xlQualityStandard, _
        IncludeDocProperties:=True, _
        IgnorePrintAreas:=False, _
        OpenAfterPublish:=True
        
    MsgBox "تم تصدير ملف PDF بنجاح وحفظه في:" & vbCrLf & fullPath, vbInformation, "VBA Genius Pro"
End Sub`
    },
    {
      id: "merge-sheets",
      title: "دمج جميع أوراق العمل في ورقة واحدة",
      category: "sheets",
      categoryName: "أوراق العمل (Sheets)",
      description: "ينسخ البيانات من كل الشيتات ويجمعها تلقائياً أسفل بعضها في شيت رئيسي اسمه 'المجمع_الرئيسي' مع الحفاظ على رأس الجدول.",
      basFilename: "MergeAllSheetsIntoOne.bas",
      code: `Attribute VB_Name = "Module_MergeSheets"
'===================================================================
' اسم الكود: دمج كافة أوراق العمل في شيت رئيسي موحد
' المطور: م/ أحمد علاء (VBA Genius Pro - A.A Academy)
'===================================================================
Sub MergeAllWorksheetsData()
    Dim wsMaster As Worksheet, ws As Worksheet
    Dim lastRowSource As Long, lastColSource As Long
    Dim lastRowDest As Long
    Dim isFirstSheet As Boolean
    
    Application.ScreenUpdating = False
    Application.DisplayAlerts = False
    
    ' التحقق من وجود الشيت المجمع أو حذفه وإنشائه من جديد
    On Error Resume Next
    Sheets("المجمع_الرئيسي").Delete
    On Error GoTo 0
    
    Set wsMaster = ThisWorkbook.Sheets.Add(Before:=ThisWorkbook.Sheets(1))
    wsMaster.Name = "المجمع_الرئيسي"
    
    isFirstSheet = True
    
    For Each ws In ThisWorkbook.Worksheets
        If ws.Name <> wsMaster.Name Then
            lastRowSource = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
            lastColSource = ws.Cells(1, ws.Columns.Count).End(xlToLeft).Column
            
            If lastRowSource >= 2 Then
                If isFirstSheet Then
                    ' نسخ العناوين مع البيانات لأول شيت
                    ws.Range(ws.Cells(1, 1), ws.Cells(lastRowSource, lastColSource)).Copy wsMaster.Cells(1, 1)
                    isFirstSheet = False
                Else
                    ' نسخ البيانات فقط للشيتات التالية بدون تكرار العناوين
                    lastRowDest = wsMaster.Cells(wsMaster.Rows.Count, 1).End(xlUp).Row + 1
                    ws.Range(ws.Cells(2, 1), ws.Cells(lastRowSource, lastColSource)).Copy wsMaster.Cells(lastRowDest, 1)
                End If
            End If
        End If
    Next ws
    
    wsMaster.Columns.AutoFit
    Application.ScreenUpdating = True
    Application.DisplayAlerts = True
    
    MsgBox "تم دمج كافة أوراق العمل بنجاح داخل شيت 'المجمع_الرئيسي'!", vbInformation, "VBA Genius Pro"
End Sub`
    },
    {
      id: "delete-empty-rows",
      title: "حذف جميع الصفوف الفارغة فائق السرعة",
      category: "cleaning",
      categoryName: "تنظيف البيانات",
      description: "يحذف كافة الصفوف الفارغة في الورقة النشطة بلمح البصر دون التأثير على البيانات وبدون تكرار بطيء.",
      basFilename: "DeleteBlankRowsUltraFast.bas",
      code: `Attribute VB_Name = "Module_DeleteBlankRows"
'===================================================================
' اسم الكود: حذف جميع الصفوف الفارغة في الورقة بسرعة فائقة
' المطور: م/ أحمد علاء (VBA Genius Pro - A.A Academy)
'===================================================================
Sub DeleteBlankRowsSuperFast()
    Dim ws As Worksheet
    Dim rng As Range
    
    Set ws = ActiveSheet
    
    On Error Resume Next
    ' تحديد الخلايا الفارغة في نطاق البيانات المستخدم
    Set rng = ws.UsedRange.SpecialCells(xlCellTypeBlanks)
    On Error GoTo 0
    
    If rng Is Nothing Then
        MsgBox "لا توجد أي صفوف فارغة في هذه الورقة!", vbInformation, "تنبيه"
        Exit Sub
    End If
    
    ' تسريع الإكسيل بإيقاف تحديث الشاشة والحسابات مؤقتاً
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationManual
    
    ' حذف الصفوف بالكامل بضغطة واحدة
    rng.EntireRow.Delete
    
    ' إعادة تفعيل إعدادات الإكسيل
    Application.Calculation = xlCalculationAutomatic
    Application.ScreenUpdating = True
    
    MsgBox "تم تنظيف الشيت وحذف كافة الصفوف الفارغة بنجاح فائق السرعة!", vbInformation, "VBA Genius Pro"
End Sub`
    }
  ],

  // ⚡ نماذج التوليد الذكي (AI Generator Simulator)
  PRESET_GENERATIONS: {
    "فاتورة": {
      title: "كود ترحيل الفواتير لشيت الأرشيف تلقائياً مع توليد رقم تسلسلي",
      description: "ينقل بيانات العميل والأصناف لصف جديد في شيت الأرشيف ويزيد رقم الفاتورة.",
      code: `Sub TransferInvoiceToDatabase()
    Dim wsInvoice As Worksheet, wsDB As Worksheet
    Dim nextRow As Long
    
    Set wsInvoice = Sheets("الفاتورة")
    Set wsDB = Sheets("الأرشيف")
    
    nextRow = wsDB.Cells(wsDB.Rows.Count, "A").End(xlUp).Row + 1
    
    wsDB.Cells(nextRow, 1).Value = wsInvoice.Range("E3").Value ' رقم الفاتورة
    wsDB.Cells(nextRow, 2).Value = wsInvoice.Range("C5").Value ' اسم العميل
    wsDB.Cells(nextRow, 3).Value = wsInvoice.Range("G20").Value ' الإجمالي
    wsDB.Cells(nextRow, 4).Value = Now ' وقت الترحيل
    
    ' زيادة رقم الفاتورة
    wsInvoice.Range("E3").Value = wsInvoice.Range("E3").Value + 1
    wsInvoice.Range("C5").ClearContents
    
    MsgBox "تم حفظ الفاتورة بنجاح في قاعدة البيانات!", vbInformation, "VBA Genius Pro"
End Sub`
    },
    "واتساب": {
      title: "كود إرسال رسائل واتساب مع نص مخصص من خلايا الإكسيل",
      description: "يقوم بقراءة الأرقام من العمود A والرسالة من العمود B وإرسالها عبر WhatsApp Web.",
      code: `Sub SendWhatsAppDirect()
    Dim i As Long, lastRow As Long
    Dim phone As String, msg As String
    
    lastRow = Cells(Rows.Count, "A").End(xlUp).Row
    For i = 2 To lastRow
        phone = Cells(i, 1).Value
        msg = Replace(Cells(i, 2).Value, " ", "%20")
        ActiveWorkbook.FollowHyperlink "https://web.whatsapp.com/send?phone=" & phone & "&text=" & msg
        Application.Wait (Now + TimeValue("0:00:03"))
    Next i
    MsgBox "تم إرسال كافة رسائل الواتساب بنجاح!", vbInformation, "VBA Genius Pro"
End Sub`
    },
    "دمج": {
      title: "كود دمج جميع أوراق العمل النشطة في شيت واحد تلقائياً",
      description: "يجمع بيانات كل شيتات الملف في شيت رئيسي تحت بعضها بضغطة زر.",
      code: `Sub MergeAllSheets()
    Dim ws As Worksheet, wsTarget As Worksheet
    Dim lastRowSrc As Long, lastRowDst As Long
    
    Set wsTarget = Sheets.Add(Before:=Sheets(1))
    wsTarget.Name = "البيانات_المجمعة"
    
    For Each ws In Worksheets
        If ws.Name <> wsTarget.Name Then
            lastRowSrc = ws.Cells(Rows.Count, 1).End(xlUp).Row
            lastRowDst = wsTarget.Cells(Rows.Count, 1).End(xlUp).Row + 1
            ws.Range("A2:Z" & lastRowSrc).Copy wsTarget.Cells(lastRowDst, 1)
        End If
    Next ws
    MsgBox "تم دمج جميع الشيتات بنجاح!", vbInformation, "VBA Genius Pro"
End Sub`
    },
    "حماية": {
      title: "كود قفل وحماية جميع الشيتات بكلمة سر موحدة بضغطة زر",
      description: "يقفل كافة أوراق العمل ويمنع التعديل إلا بكلمة السر المحددة.",
      code: `Sub ProtectAllSheetsSecure()
    Dim ws As Worksheet
    Dim pass As String
    pass = "AA2026" ' كلمة السر
    
    For Each ws In Worksheets
        ws.Protect Password:=pass, UserInterfaceOnly:=True
    Next ws
    MsgBox "تم قفل جميع أوراق العمل بنجاح وحمايتها بكلمة السر!", vbInformation, "VBA Genius Pro"
End Sub`
    }
  },

  // 🛠️ نماذج فحص وتصليح الأخطاء (Error Fixer Simulator)
  ERROR_FIXER_SAMPLE: {
    brokenCode: `Sub CalculateBonus()
    Dim i As Long
    For i = 2 To 100
        If Cells(i, 2).Value > 50000 Then
            Cells(i, 3).Value = Cells(i, 2).Value * 0.1
    Next i
End Sub`,
    fixedCode: `Sub CalculateBonus()
    Dim i As Long
    For i = 2 To 100
        If Cells(i, 2).Value > 50000 Then
            Cells(i, 3).Value = Cells(i, 2).Value * 0.1
        End If ' ✅ تم إصلاح الخطأ: كان ينقصك إغلاق جملة الشرط End If قبل Next i
    Next i
    MsgBox "تم حساب المكافآت بنجاح لجميع الموظفين!", vbInformation, "VBA Genius Pro"
End Sub`,
    analysis: "تم اكتشاف خطأ برمجي شهير: جملة الشرط (If ... Then) غير مغلقة بـ (End If) مما يسبب خطأ تجميعي (Compile Error: Block If without End If). تم تصحيح الكود بالكامل ليصبح جاهزاً للتشغيل المباشر."
  }
};
