// Trade Tower Welcome DID 예약 시스템 - Google Apps Script

const RESERVATIONS_SHEET = '예약';
const CONFIG_SHEET = '설정';

// 아래에 Google Sheets ID를 입력하세요
// URL: https://docs.google.com/spreadsheets/d/1enKjEpZ5cTDUYnMDLFxI8EYM5qAzAUti8xTiHHnTobE/edit
const SPREADSHEET_ID = '1enKjEpZ5cTDUYnMDLFxI8EYM5qAzAUti8xTiHHnTobE';

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Welcome DID 예약 시스템')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getPageData(date) {
  var config = _getConfig();
  var bookedSlots = date ? _getBookedSlots(date) : [];
  return { config: config, bookedSlots: bookedSlots };
}

function getBookedSlots(date) {
  return _getBookedSlots(date);
}

function submitReservation(formData) {
  try {
    var ss = _getSpreadsheet();
    var sheet = _getOrCreateSheet(ss, RESERVATIONS_SHEET, [
      'ID', '신청일시', '예약날짜', '시간슬롯', '입주사명', '휴대폰번호', '이메일',
      '방문자직위', '방문자성함(국문)', '방문자성함(영문)', '언어', '멘트', '상태'
    ]);

    var required = ['date', 'slot', 'company', 'phone', 'email', 'position', 'language', 'message'];
    for (var i = 0; i < required.length; i++) {
      var field = required[i];
      if (!formData[field] || String(formData[field]).trim() === '') {
        return { success: false, message: '모든 필수 항목을 입력해 주세요.' };
      }
    }

    // 언어에 따라 해당 이름만 필수
    if (formData.language === '국문') {
      if (!formData.nameKr || String(formData.nameKr).trim() === '') {
        return { success: false, message: '방문자 성함(국문)을 입력해 주세요.' };
      }
      formData.nameEn = formData.nameEn || '';
    } else {
      if (!formData.nameEn || String(formData.nameEn).trim() === '') {
        return { success: false, message: '방문자 성함(영문)을 입력해 주세요.' };
      }
      formData.nameKr = formData.nameKr || '';
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { success: false, message: '올바른 이메일 주소를 입력해 주세요.' };
    }

    if (!_isValidDate(formData.date)) {
      return { success: false, message: '유효하지 않은 날짜입니다.' };
    }
    if (!_isValidSlot(formData.slot)) {
      return { success: false, message: '유효하지 않은 시간입니다.' };
    }

    var bookedSlots = _getBookedSlots(formData.date);
    if (bookedSlots.indexOf(formData.slot) !== -1) {
      return { success: false, message: '선택하신 시간대는 이미 예약되었습니다. 다른 시간을 선택해 주세요.' };
    }

    var id = _generateId();
    sheet.appendRow([
      id, new Date(), formData.date, formData.slot,
      formData.company.trim(), formData.phone.trim(), formData.email.trim(),
      formData.position.trim(), formData.nameKr.trim(), formData.nameEn.trim(),
      formData.language, formData.message.trim(), 'PENDING'
    ]);

    return { success: true, id: id, message: '신청이 완료되었습니다. 검토 후 이메일로 승인 안내를 드립니다.' };

  } catch (e) {
    Logger.log('submitReservation error: ' + e.message);
    return { success: false, message: '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('DID 예약 관리')
    .addItem('선택 행 승인', 'approveSelectedRow')
    .addItem('선택 행 반려', 'rejectSelectedRow')
    .addSeparator()
    .addItem('시트 초기화', 'setupSheets')
    .addToUi();
}

function approveSelectedRow() {
  var ss = _getSpreadsheet();
  var sheet = ss.getSheetByName(RESERVATIONS_SHEET);
  if (!sheet) {
    SpreadsheetApp.getUi().alert('예약 시트를 찾을 수 없습니다.');
    return;
  }

  var row = sheet.getActiveRange().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert('헤더 행은 처리할 수 없습니다.');
    return;
  }

  var data = sheet.getRange(row, 1, 1, 13).getValues()[0];
  if (data[12] === 'APPROVED') {
    SpreadsheetApp.getUi().alert('이미 승인된 예약입니다.');
    return;
  }

  sheet.getRange(row, 13).setValue('APPROVED');

  var reservation = {
    id: data[0], date: data[2], slot: data[3], company: data[4],
    phone: data[5], email: data[6], position: data[7],
    nameKr: data[8], nameEn: data[9], language: data[10], message: data[11]
  };

  try {
    _sendApprovalEmail(reservation);
    SpreadsheetApp.getUi().alert('승인 완료 및 이메일이 발송되었습니다.\n받는 사람: ' + reservation.email);
  } catch (e) {
    SpreadsheetApp.getUi().alert('승인 완료되었으나 이메일 발송 실패.\n오류: ' + e.message);
  }
}

function rejectSelectedRow() {
  var ss = _getSpreadsheet();
  var sheet = ss.getSheetByName(RESERVATIONS_SHEET);
  if (!sheet) return;

  var ui = SpreadsheetApp.getUi();
  var row = sheet.getActiveRange().getRow();
  if (row <= 1) {
    ui.alert('헤더 행은 처리할 수 없습니다.');
    return;
  }

  var data = sheet.getRange(row, 1, 1, 13).getValues()[0];
  if (data[12] === 'REJECTED') {
    ui.alert('이미 반려된 예약입니다.');
    return;
  }

  var response = ui.alert('반려 확인', '이 예약을 반려하시겠습니까?', ui.ButtonSet.YES_NO);
  if (response === ui.Button.YES) {
    sheet.getRange(row, 13).setValue('REJECTED');
    ui.alert('반려 처리되었습니다.');
  }
}

function setupSheets() {
  var ss = _getSpreadsheet();

  var reservationSheet = _getOrCreateSheet(ss, RESERVATIONS_SHEET, [
    'ID', '신청일시', '예약날짜', '시간슬롯', '입주사명', '휴대폰번호', '이메일',
    '방문자직위', '방문자성함(국문)', '방문자성함(영문)', '언어', '멘트', '상태'
  ]);
  reservationSheet.getRange(1, 1, 1, 13).setBackground('#2563EB').setFontColor('#FFFFFF').setFontWeight('bold');
  reservationSheet.setColumnWidth(1, 100);
  reservationSheet.setColumnWidth(2, 160);
  reservationSheet.setColumnWidth(3, 110);
  reservationSheet.setColumnWidth(4, 80);
  reservationSheet.setColumnWidth(5, 150);
  reservationSheet.setColumnWidth(6, 130);
  reservationSheet.setColumnWidth(7, 200);
  reservationSheet.setColumnWidth(11, 60);
  reservationSheet.setColumnWidth(12, 300);
  reservationSheet.setColumnWidth(13, 90);

  var configSheet = _getOrCreateSheet(ss, CONFIG_SHEET, ['키', '값', '설명']);
  if (configSheet.getDataRange().getValues().length <= 1) {
    configSheet.appendRow(['notice', '안녕하세요! Welcome DID 예약 신청 페이지입니다.\n예약 접수는 매주 월~수요일(10:00~16:00)에 가능합니다.', '상단 공지 문구']);
    configSheet.appendRow(['template_kr', '안녕하세요!\n[방문자직위] [방문자성함] 님의 방문을 진심으로 환영합니다.', '국문 예시 멘트']);
    configSheet.appendRow(['template_en', 'Hello!\nWe warmly welcome [Visitor Position] [Visitor Name].', '영문 예시 멘트']);
    configSheet.appendRow(['closed_dates', '[]', '휴일/닫힘일 (JSON 배열, 예: ["2026-01-01"])']);
    configSheet.appendRow(['accept_from_day', '1', '접수 시작 요일 (1=월, 2=화, 3=수, 4=목, 5=금)']);
    configSheet.appendRow(['accept_until_day', '3', '접수 종료 요일 (1=월, 2=화, 3=수, 4=목, 5=금)']);
    configSheet.getRange(1, 1, 1, 3).setBackground('#2563EB').setFontColor('#FFFFFF').setFontWeight('bold');
    configSheet.setColumnWidth(1, 150);
    configSheet.setColumnWidth(2, 400);
    configSheet.setColumnWidth(3, 300);
  }

  Logger.log('설정 완료: ' + ss.getUrl());
}

function _getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID !== '여기에_스프레드시트_ID_입력') {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  var active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  throw new Error('SPREADSHEET_ID를 설정해 주세요. Code.gs 상단 const SPREADSHEET_ID 에 Google Sheet ID를 입력하세요.');
}

function _getConfig() {
  try {
    var ss = _getSpreadsheet();
    var sheet = ss.getSheetByName(CONFIG_SHEET);
    if (!sheet) return _defaultConfig();

    var data = sheet.getDataRange().getValues();
    var config = {};
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) config[data[i][0]] = data[i][1];
    }

    var closedDates = [];
    try {
      if (config['closed_dates']) closedDates = JSON.parse(config['closed_dates']);
    } catch (e) {}

    return {
      notice: config['notice'] || _defaultConfig().notice,
      template_kr: config['template_kr'] || _defaultConfig().template_kr,
      template_en: config['template_en'] || _defaultConfig().template_en,
      closed_dates: closedDates,
      accept_from_day: config['accept_from_day'] ? parseInt(config['accept_from_day']) : _defaultConfig().accept_from_day,
      accept_until_day: config['accept_until_day'] ? parseInt(config['accept_until_day']) : _defaultConfig().accept_until_day
    };
  } catch (e) {
    return _defaultConfig();
  }
}

function _defaultConfig() {
  return {
    notice: '안녕하세요! Welcome DID 예약 신청 페이지입니다.\n예약 접수는 매주 월~수요일(10:00~16:00)에 가능합니다.',
    template_kr: '안녕하세요!\n[방문자직위] [방문자성함] 님의 방문을 진심으로 환영합니다.',
    template_en: 'Hello!\nWe warmly welcome [Visitor Position] [Visitor Name].',
    closed_dates: [],
    accept_from_day: 1,
    accept_until_day: 3
  };
}

function _getBookedSlots(date) {
  try {
    var ss = _getSpreadsheet();
    var sheet = ss.getSheetByName(RESERVATIONS_SHEET);
    if (!sheet) return [];
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) return [];

    var data = sheet.getRange(2, 1, lastRow - 1, 13).getValues();
    var booked = [];
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var rowDate = row[2];
      var rowDateStr = rowDate instanceof Date
        ? Utilities.formatDate(rowDate, Session.getScriptTimeZone(), 'yyyy-MM-dd')
        : String(rowDate);
      // REJECTED가 아니면(PENDING 또는 APPROVED) 모두 중복 예약으로 간주
      if (rowDateStr === date && row[12] !== 'REJECTED') {
        // 시간이 Date 객체로 저장된 경우 HH:mm 문자열로 변환
        var slotVal = row[3];
        var slotStr = slotVal instanceof Date
          ? Utilities.formatDate(slotVal, Session.getScriptTimeZone(), 'HH:mm')
          : String(slotVal);
        booked.push(slotStr);
      }
    }
    return booked;
  } catch (e) {
    return [];
  }
}

function _checkMonthlyLimit(sheet, company, targetDate) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;
  var targetMonth = targetDate.substring(0, 7);
  var data = sheet.getRange(2, 1, lastRow - 1, 13).getValues();
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var rowDate = row[2];
    var rowDateStr = rowDate instanceof Date
      ? Utilities.formatDate(rowDate, Session.getScriptTimeZone(), 'yyyy-MM-dd')
      : String(rowDate);
    // PENDING이나 APPROVED 상태 모두 이미 신청한 것으로 간주
    if (rowDateStr.substring(0, 7) === targetMonth && row[4] === company.trim() && row[12] !== 'REJECTED') {
      return true;
    }
  }
  return false;
}

function _isValidDate(dateStr) {
  // 구글 앱스 스크립트 특성상, 날짜 형태의 문자열이 넘어올 때
  // 자동으로 Date 객체로 변환되거나 문자열 타입이 아닐 수 있습니다.
  if (!dateStr) return false;
  return true;
}

function _isValidSlot(slot) {
  var valid = ['10:00','11:00','12:00','13:00','14:00','15:00','16:00'];
  return valid.indexOf(slot) !== -1;
}

function _generateId() {
  return Utilities.getUuid().replace(/-/g, '').substring(0, 8).toUpperCase();
}

function _sendApprovalEmail(reservation) {
  var slotEnd = _addMinutes(reservation.slot, 60);
  var subject = '[Welcome DID] 예약 승인 안내';
  var lines = [
    '안녕하세요, ' + reservation.company + ' 담당자님.',
    '',
    'Welcome DID 예약이 승인되었습니다.',
    '',
    '예약 정보',
    '  - 날짜: ' + _formatKoreanDate(reservation.date),
    '  - 시간: ' + reservation.slot + ' ~ ' + slotEnd,
    '  - 입주사명: ' + reservation.company,
    '  - 방문자: ' + reservation.position + ' ' + reservation.nameKr + ' (' + reservation.nameEn + ')',
    '  - 언어: ' + reservation.language,
    '',
    '송출 멘트',
    '  "' + reservation.message + '"',
    '',
    '예약 ID: ' + reservation.id,
    '',
    '감사합니다.',
    '운영팀'
  ];
  GmailApp.sendEmail(reservation.email, subject, lines.join('\n'));
}

function _formatKoreanDate(dateStr) {
  var d = new Date(dateStr + 'T00:00:00');
  var days = ['일','월','화','수','목','금','토'];
  return d.getFullYear() + '년 ' + (d.getMonth()+1) + '월 ' + d.getDate() + '일 (' + days[d.getDay()] + ')';
}

function _addMinutes(timeStr, minutes) {
  var parts = timeStr.split(':');
  var total = parseInt(parts[0]) * 60 + parseInt(parts[1]) + minutes;
  return String(Math.floor(total/60)).padStart(2,'0') + ':' + String(total%60).padStart(2,'0');
}

function _getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
