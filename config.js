/* MeliOh Bistro — shared front-end configuration.
   Loaded by both index.html (reservation form) and admin.html.

   HOW TO CONNECT THE REAL BACKEND (Google Apps Script + Google Sheets):
   1. Follow SETUP.md to deploy the Apps Script Web App.
   2. Copy the Web App URL it gives you (ends with /exec).
   3. Paste it into `endpoint` below, commit and push.

   While `endpoint` is empty, the site runs in DEMO MODE:
   the form and admin panel use localStorage only (single device,
   for preview/testing). No customer data leaves the browser.

   SECURITY NOTE: the admin password is NOT stored here. It lives in
   the Apps Script "Script Properties" on Google's servers and is
   checked server-side. This file is safe to be public. */
window.MELIOH_CONFIG = {
  // Paste your Google Apps Script Web App URL here (…/exec). Leave "" for demo mode.
  endpoint: "https://script.google.com/macros/s/AKfycbwNnBbWydmnyS5CUV-506OvdyiYsMMyzOADUV_CBglAn3o1U5FfnHqOkQbb3Pkil5J_/exec",

  // Restaurant phone shown in error messages.
  phone: "+84 0918 204 008"
};
