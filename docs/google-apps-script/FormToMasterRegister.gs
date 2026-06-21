/**
 * Google Apps Script — FormToMasterRegister.gs
 *
 * ไฟล์นี้มี 2 ส่วน:
 *
 * ส่วนที่ 1 — buildSaOnTourRegistrationForm()
 *   รันครั้งเดียวเพื่อสร้างคำถามใน Google Form อัตโนมัติ
 *   วิธีใช้: เปิด Apps Script จาก Google Form โดยตรง → Run → buildSaOnTourRegistrationForm
 *
 * ส่วนที่ 2 — onFormSubmit Trigger + CONFIG
 *   ติดตั้งใน Apps Script ของ Google Sheet ที่รับคำตอบ
 *   วิธีติดตั้ง:
 *   1. เปิด Google Sheet ที่รับคำตอบ Google Form
 *   2. เมนู Extensions → Apps Script
 *   3. วางโค้ดนี้ แล้วกด Save
 *   4. กำหนดค่า CONFIG ด้านล่าง (API_KEY)
 *   5. เมนู Triggers → Add Trigger → onFormSubmit (Event type: On form submit)
 *   6. ครั้งแรกจะขอ permission → อนุญาต
 */

// ══════════════════════════════════════════════════════════════════════════════
// ส่วนที่ 1: สร้าง Google Form
// ══════════════════════════════════════════════════════════════════════════════

function buildSaOnTourRegistrationForm() {
  var EVENT_NAME = 'สะออนทัวร์ Workshop Agent ไทบ้าน ขอนแก่น';
  var PAYMENT_METHOD = 'โอนผ่านบัญชีธนาคาร';
  var PAYMENT_ACCOUNT = 'เลขบัญชี: 405-3-05346-3';
  var PAYMENT_NAME = 'ชื่อบัญชี: อัจฉรีญา โถนารัตน์';
  var LINE_CONTACT = '@noomnugaom';
  var PHONE_CONTACT = '[ใส่เบอร์โทร]';

  var form = FormApp.getActiveForm();
  if (!form) {
    throw new Error('กรุณาเปิด Apps Script จาก Google Form โดยตรง: เปิดฟอร์ม > จุดสามจุด > Apps Script แล้วค่อยรันสคริปต์นี้');
  }

  // ล้างคำถามเดิมทั้งหมด
  form.getItems().forEach(function(item) {
    form.deleteItem(item);
  });

  form.setTitle('ลงทะเบียนเข้าร่วม ' + EVENT_NAME);
  form.setDescription(
    'Upskill LINE OA & TikTok ด้วย AI Agent ที่ช่วยให้คุณทำงานง่ายขึ้นจริง\n\n' +
    'Workshop ลงมือทำจริง สำหรับเจ้าของธุรกิจ ทีมงาน นักการตลาด และผู้ที่ต้องการใช้ AI ช่วยงาน LINE OA และ TikTok อย่างเป็นระบบ\n\n' +
    'รายละเอียดงาน:\n' +
    '- วันจัดงาน: 28 มิถุนายน 2569\n' +
    '- เวลา: 10.00 - 19.00 น.\n' +
    '- สถานที่: KICE Hall 1-2 ห้องประชุม M4-8 จังหวัดขอนแก่น\n' +
    '- ราคาปกติ: 5,999 บาท\n' +
    '- ราคาพิเศษ: 2,999 บาท\n' +
    '- สิทธิพิเศษ: ลงทะเบียนรับคูปองภายในงาน และเรียนฟรี AI มูลค่า 3,000 บาท\n\n' +
    'วิทยากร:\n' +
    '- ปรเมศวร์ มินศิริ: LINE OA / Digital Media / Content\n' +
    '- โดม เจริญยศ: AI / Tech / Digital Strategy\n' +
    '- หนุ่มนักออม: เพจหนุ่มนักออม สอน AI สร้างคลิป TikTok\n\n' +
    'หลังจากกรอกข้อมูลและแนบหลักฐานการชำระเงิน ทีมงานจะตรวจสอบและยืนยันสิทธิ์การสมัครภายใน 24 ชั่วโมง\n\n' +
    'ช่องทางชำระเงิน:\n' +
    PAYMENT_METHOD + '\n' +
    PAYMENT_ACCOUNT + '\n' +
    PAYMENT_NAME + '\n\n' +
    'ติดต่อสอบถาม:\n' +
    'LINE: ' + LINE_CONTACT + '\n' +
    'โทร: ' + PHONE_CONTACT
  );

  form.setConfirmationMessage(
    'ขอบคุณสำหรับการลงทะเบียนเข้าร่วม ' + EVENT_NAME + '\n\n' +
    'ทีมงานได้รับข้อมูลของคุณแล้ว หากคุณชำระเงินและแนบหลักฐานเรียบร้อย ทีมงานจะตรวจสอบและยืนยันสิทธิ์ภายใน 24 ชั่วโมงทางอีเมลหรือ LINE\n\n' +
    'วันจัดงาน: 28 มิถุนายน 2569 เวลา 10.00 - 19.00 น.\n' +
    'สถานที่: KICE Hall 1-2 ห้องประชุม M4-8 จังหวัดขอนแก่น\n\n' +
    'หากมีคำถามเพิ่มเติม ติดต่อ LINE: ' + LINE_CONTACT + ' หรือโทร ' + PHONE_CONTACT
  );

  // ── ส่วนที่ 1: ข้อมูลผู้สมัคร ─────────────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('ข้อมูลผู้สมัคร')
    .setHelpText('กรุณากรอกข้อมูลให้ตรงกับข้อมูลที่ใช้ติดต่อกลับ');

  form.addTextItem().setTitle('ชื่อ-นามสกุล').setRequired(true);
  form.addTextItem().setTitle('เบอร์โทรศัพท์').setRequired(true);
  form.addTextItem().setTitle('อีเมล').setRequired(true);
  form.addTextItem().setTitle('LINE ID').setRequired(true);
  form.addTextItem().setTitle('จังหวัดที่เดินทางมา').setRequired(true);
  form.addTextItem().setTitle('อาชีพ/ธุรกิจ/หน่วยงาน').setRequired(false);

  // ── ส่วนที่ 2: รายละเอียดการสมัคร ────────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('รายละเอียดการสมัคร')
    .setHelpText('เลือกประเภทบัตร และแจ้งข้อมูลเพิ่มเติมเพื่อให้ทีมงานดูแลได้ถูกต้อง');

  form.addMultipleChoiceItem()
    .setTitle('เลือกประเภทบัตร')
    .setChoiceValues(['ราคาพิเศษ 2,999 บาท', 'ราคาปกติ 5,999 บาท'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('คุณสนใจนำ AI ไปใช้เรื่องใดมากที่สุด')
    .setChoiceValues([
      'สร้าง AI Agent เชื่อมต่อ LINE OA',
      'ตอบแชทลูกค้าและจัดการงานประจำอัตโนมัติ',
      'สร้างคอนเทนต์ TikTok ให้เร็วขึ้น',
      'ลดงานซ้ำซ้อน ประหยัดเวลา เพิ่มประสิทธิภาพธุรกิจ',
      'อื่นๆ'
    ])
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('ต้องการใบเสร็จหรือไม่')
    .setChoiceValues(['ต้องการ', 'ไม่ต้องการ'])
    .setRequired(true);

  form.addTextItem().setTitle('ชื่อ/บริษัท สำหรับออกใบเสร็จ').setRequired(false);
  form.addTextItem().setTitle('เลขประจำตัวผู้เสียภาษี/เลขบัตรประชาชน สำหรับออกใบเสร็จ').setRequired(false);
  form.addParagraphTextItem().setTitle('ที่อยู่สำหรับออกใบเสร็จ').setRequired(false);

  // ── ส่วนที่ 3: การชำระเงิน ────────────────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('การชำระเงิน')
    .setHelpText(
      'กรุณาชำระเงินตามช่องทางด้านล่าง แล้วอัปโหลดหลักฐานการชำระเงิน\n\n' +
      PAYMENT_METHOD + '\n' +
      PAYMENT_ACCOUNT + '\n' +
      PAYMENT_NAME
    );

  form.addMultipleChoiceItem()
    .setTitle('ช่องทางที่ชำระเงิน')
    .setChoiceValues(['โอนผ่านธนาคาร', 'พร้อมเพย์', 'ลิงก์ชำระเงิน', 'อื่นๆ'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('วันที่และเวลาที่ชำระเงิน')
    .setHelpText('เช่น 20/06/2026 เวลา 14:30 น.')
    .setRequired(true);

  form.addTextItem().setTitle('จำนวนเงินที่ชำระ').setRequired(true);

  form.addParagraphTextItem()
    .setTitle('หลักฐานการชำระเงิน')
    .setHelpText('กรุณาใส่ลิงก์รูปสลิป เช่น Google Drive หรือแนบหลักฐานตามช่องทางที่ทีมงานกำหนด หากต้องการใช้คำถามแบบอัปโหลดไฟล์ ให้เพิ่มคำถาม File upload ใน Google Forms ด้วยมือหลังรันสคริปต์')
    .setRequired(true);

  form.addParagraphTextItem().setTitle('หมายเหตุเพิ่มเติม').setRequired(false);

  // ── ส่วนที่ 4: เงื่อนไขและการยืนยัน ──────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('เงื่อนไขและการยืนยัน')
    .setHelpText(
      '1. การสมัครจะสมบูรณ์เมื่อทีมงานตรวจสอบข้อมูลและหลักฐานการชำระเงินเรียบร้อยแล้ว\n' +
      '2. ทีมงานจะยืนยันสิทธิ์ภายใน 24 ชั่วโมงหลังจากได้รับข้อมูลครบถ้วน\n' +
      '3. โปรดเก็บหลักฐานการชำระเงินไว้จนกว่าจะได้รับการยืนยันจากทีมงาน\n' +
      '4. หากต้องการแก้ไขข้อมูล กรุณาติดต่อทีมงานผ่านช่องทางที่ระบุ\n' +
      '5. การยกเลิกหรือคืนเงินเป็นไปตามเงื่อนไขของผู้จัดงาน\n' +
      '6. ข้อมูลส่วนบุคคลจะใช้เพื่อการลงทะเบียน การติดต่อ การยืนยันสิทธิ์ และการออกเอกสารที่เกี่ยวข้องกับงานเท่านั้น'
    );

  form.addCheckboxItem()
    .setTitle('การยอมรับเงื่อนไข')
    .setChoiceValues([
      'ข้าพเจ้ายืนยันว่าข้อมูลที่กรอกถูกต้อง และยอมรับเงื่อนไขการสมัคร การชำระเงิน และนโยบายการคืนเงินของผู้จัดงาน'
    ])
    .setRequired(true);

  Logger.log('สร้างฟอร์มสำเร็จ: ' + form.getTitle() + ' (' + form.getId() + ')');
}

// ══════════════════════════════════════════════════════════════════════════════
// ส่วนที่ 2: ส่งข้อมูลเข้า Master Register เมื่อมีการส่งฟอร์ม
// ══════════════════════════════════════════════════════════════════════════════

// ── CONFIG ───────────────────────────────────────────────────────────────────
const CONFIG = {
  // URL ของ Supabase Edge Function (register-external)
  SUPABASE_FUNCTION_URL:
    "https://jsqzymwzrcvabrgjwbrr.supabase.co/functions/v1/register-external",

  // API Key ที่ตั้งใน Supabase Secrets ชื่อ EXTERNAL_API_KEY
  API_KEY: PropertiesService.getScriptProperties().getProperty("EXTERNAL_API_KEY"),

  // ชื่อคอลัมน์ใน Google Sheet → ตรงกับ field ใน Master Register
  // ชื่อด้านขวาต้องตรงกับหัวคอลัมน์ใน Sheet ทุกตัวอักษร (รวมถึง / และช่องว่าง)
  COLUMN_MAP: {
    full_name:        "ชื่อ-นามสกุล",
    phone:            "เบอร์โทรศัพท์",
    email:            "อีเมล",
    line_id:          "LINE ID",
    province:         "จังหวัดที่เดินทางมา",
    occupation:       "อาชีพ/ธุรกิจ/หน่วยงาน",
    ticket_type:      "เลือกประเภทบัตร",
    interest_topic:   "คุณสนใจนำ AI ไปใช้เรื่องใดมากที่สุด",
    needs_receipt:    "ต้องการใบเสร็จหรือไม่",
    receipt_name:     "ชื่อ/บริษัท สำหรับออกใบเสร็จ",
    receipt_tax_id:   "เลขประจำตัวผู้เสียภาษี/เลขบัตรประชาชน สำหรับออกใบเสร็จ",
    receipt_address:  "ที่อยู่สำหรับออกใบเสร็จ",
    payment_method:   "ช่องทางที่ชำระเงิน",
    payment_datetime: "วันที่และเวลาที่ชำระเงิน",
    payment_amount:   "จำนวนเงินที่ชำระ",
    payment_proof_url:"หลักฐานการชำระเงิน",
    notes:            "หมายเหตุเพิ่มเติม",
  },

  // source_channel ที่จะส่งเข้า Master Register
  SOURCE_CHANNEL: "GOOGLE_FORM_EXPO",

  // ชื่อคอลัมน์ที่จะเขียนรหัสลงทะเบียนกลับ (สร้างคอลัมน์นี้ใน Sheet)
  RESULT_COLUMN: "Registration Code",
};
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Trigger: รัน onFormSubmit ทุกครั้งที่มีคนส่งฟอร์ม
 * @param {GoogleAppsScript.Events.SheetsOnFormSubmit} e
 */
function onFormSubmit(e) {
  try {
    var sheet = e.range.getSheet();
    var row = e.range.getRow();
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var rowData = e.range.getValues()[0];

    // สร้าง object จาก row ตาม headers
    var rowObj = {};
    headers.forEach(function(header, idx) {
      rowObj[header] = rowData[idx] !== undefined ? String(rowData[idx]).trim() : "";
    });

    // Map คอลัมน์ใน Sheet → API fields
    var payload = {
      source_channel: CONFIG.SOURCE_CHANNEL,
    };
    Object.entries(CONFIG.COLUMN_MAP).forEach(function(entry) {
      var field = entry[0];
      var colHeader = entry[1];
      payload[field] = rowObj[colHeader] || "";
    });

    // ส่งข้อมูลไปยัง Master Register
    var result = postToMasterRegister(payload);

    if (result && result.registration_code) {
      // เขียน registration_code กลับไปใน Sheet
      var resultColIdx = headers.indexOf(CONFIG.RESULT_COLUMN);
      if (resultColIdx >= 0) {
        sheet.getRange(row, resultColIdx + 1).setValue(result.registration_code);
      }

      console.log(
        "[SA-ON] Registered:",
        result.registration_code,
        result.duplicate ? "(duplicate — existing)" : "(new)"
      );
    }
  } catch (err) {
    console.error("[SA-ON] onFormSubmit error:", err.message || err);
  }
}

/**
 * ส่งข้อมูลไปยัง Supabase Edge Function
 * @param {Object} payload
 * @returns {{ registration_code: string; duplicate: boolean } | null}
 */
function postToMasterRegister(payload) {
  if (!CONFIG.API_KEY) {
    throw new Error("Missing EXTERNAL_API_KEY in Apps Script Properties");
  }

  var options = {
    method: "POST",
    contentType: "application/json",
    headers: {
      "x-api-key": CONFIG.API_KEY,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  var response = UrlFetchApp.fetch(CONFIG.SUPABASE_FUNCTION_URL, options);
  var code = response.getResponseCode();
  var body = response.getContentText();

  console.log("[SA-ON] API response", code, body);

  if (code === 200 || code === 201) {
    return JSON.parse(body);
  } else {
    console.error("[SA-ON] API error", code, body);
    return null;
  }
}

/**
 * Test function — รันด้วยมือเพื่อทดสอบการเชื่อมต่อ
 * กด Run → testManualPost เพื่อดูว่า API ทำงานได้
 */
function testManualPost() {
  var testPayload = {
    source_channel: CONFIG.SOURCE_CHANNEL,
    full_name: "ทดสอบ ระบบ",
    phone: "0800000001",
    email: "test@example.com",
    province: "ขอนแก่น",
    occupation: "ทดสอบ",
    ticket_type: "ราคาพิเศษ 2,999 บาท",
    interest_topic: "สร้าง AI Agent เชื่อมต่อ LINE OA",
    needs_receipt: "ไม่ต้องการ",
    payment_method: "โอนผ่านธนาคาร",
    payment_datetime: "21/06/2026 เวลา 10:00 น.",
    payment_amount: "2999",
    payment_proof_url: "https://drive.google.com/test",
    notes: "TEST — ลบได้",
  };

  var result = postToMasterRegister(testPayload);
  console.log("[SA-ON TEST] Result:", JSON.stringify(result));
  if (result) {
    SpreadsheetApp.getUi().alert(
      "ทดสอบสำเร็จ!\n\nRegistration Code: " + result.registration_code +
      "\nDuplicate: " + result.duplicate
    );
  } else {
    SpreadsheetApp.getUi().alert("ทดสอบล้มเหลว — ดู Logs ใน Apps Script console");
  }
}
