/**
 * MeliOh Bistro — Reservation backend (Google Apps Script + Google Sheets).
 *
 * This script turns a Google Sheet into a tiny database + API for the website.
 * Customers submit the form on index.html  -> a new row is appended here.
 * The admin panel (admin.html) reads / updates / deletes rows through this API.
 *
 * Deploy it as a Web App ("Anyone" access). Full step-by-step in SETUP.md.
 *
 * The admin password is stored in Script Properties (server-side), NEVER in the
 * website source. Set it once with setAdminPassword() — see bottom of file.
 */

var SHEET_NAME = 'Reservations';
var HEADERS = ['id', 'name', 'phone', 'date', 'time', 'guests',
               'occasion', 'message', 'status', 'source', 'receivedAt'];
var VALID_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled', 'noshow'];

/* ------------------------------------------------------------------ */
/* Public endpoints                                                    */
/* ------------------------------------------------------------------ */

// Customer form posts here (action:add). Admin posts update/delete here too.
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    var action = body.action || 'add';

    if (action === 'add') {
      return addBooking(body.booking || body);
    }

    // update / delete require the admin password.
    if (!checkKey(body.key)) {
      return json({ ok: false, error: 'unauthorized' });
    }
    if (action === 'update') return updateBooking(body.id, body.status);
    if (action === 'delete') return deleteBooking(body.id);

    return json({ ok: false, error: 'unknown action' });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// Admin panel reads the list here:  ?action=list&key=PASSWORD
function doGet(e) {
  var params = (e && e.parameter) || {};
  if (params.action === 'list') {
    if (!checkKey(params.key)) {
      return json({ ok: false, error: 'unauthorized' });
    }
    return json({ ok: true, bookings: readAll() });
  }
  return json({ ok: true, message: 'MeliOh reservation API is running.' });
}

/* ------------------------------------------------------------------ */
/* Operations                                                          */
/* ------------------------------------------------------------------ */

function addBooking(b) {
  var sheet = getSheet();
  var id = (b.id) ? String(b.id)
                  : (Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36));
  // Clamp lengths so a malicious/buggy POST cannot bloat the sheet.
  var row = [
    id,
    cap(b.name, 120), cap(b.phone, 30), cap(b.date, 10), cap(b.time, 5), cap(b.guests, 4),
    cap(b.occasion, 40), cap(b.message, 1000),
    (VALID_STATUSES.indexOf(b.status) !== -1 ? b.status : 'pending'),
    cap(b.source, 20) || 'website',
    cap(b.receivedAt, 40) || new Date().toISOString()
  ];
  sheet.appendRow(row);
  return json({ ok: true, id: id });
}

function cap(v, n) { return str(v).slice(0, n); }

function updateBooking(id, status) {
  if (VALID_STATUSES.indexOf(status) === -1) {
    return json({ ok: false, error: 'invalid status' });
  }
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.getRange(i + 1, HEADERS.indexOf('status') + 1).setValue(status);
      return json({ ok: true });
    }
  }
  return json({ ok: false, error: 'not found' });
}

function deleteBooking(id) {
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return json({ ok: true });
    }
  }
  return json({ ok: false, error: 'not found' });
}

function readAll() {
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  var tz = 'Asia/Ho_Chi_Minh';
  var out = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var c = 0; c < HEADERS.length; c++) {
      var val = data[i][c];
      var col = HEADERS[c];
      if (val instanceof Date) {
        if (col === 'date') {
          val = Utilities.formatDate(val, tz, 'yyyy-MM-dd');
        } else if (col === 'time') {
          val = Utilities.formatDate(val, tz, 'HH:mm');
        } else if (col === 'receivedAt') {
          val = Utilities.formatDate(val, tz, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        } else {
          val = String(val);
        }
      }
      obj[col] = val;
    }
    out.push(obj);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function checkKey(key) {
  var stored = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
  return stored && key && String(key) === String(stored);
}

function str(v) { return (v === undefined || v === null) ? '' : String(v); }

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------ */
/* Run ONCE to set the admin password (then delete the password here). */
/* In the Apps Script editor: edit the value, Run -> setAdminPassword.  */
/* ------------------------------------------------------------------ */
function setAdminPassword() {
  PropertiesService.getScriptProperties()
    .setProperty('ADMIN_PASSWORD', 'CHANGE_ME_to_a_strong_password');
  Logger.log('Admin password saved to Script Properties.');
}
