// 01-config.js
// Storage keys, PIN constants, and configuration values

/* =========================
   Storage Keys
========================= */

const STORAGE_KEY = "client_totals_groups_v1";
const CONTROLS_KEY = "ct_controls_collapsed";
const THEME_KEY = "ct_theme_v1";
const SUMMARY_COLLAPSED_KEY = "ct_summary_collapsed";
const MONTH_CURSOR_KEY = "ct_month_cursor";
const PERIODS_COLLAPSED_KEY = "ct_periods_collapsed";
const BACKUP_REMINDER_DIRTY_KEY = "ct_backup_reminder_dirty";
const BACKUP_REMINDER_LAST_CHANGE_KEY = "ct_backup_reminder_last_change";
const BACKUP_REMINDER_LAST_SHOWN_KEY = "ct_backup_reminder_last_shown_week";

/* =========================
   PIN Constants
========================= */

// NOTE:
// This PIN is only a casual lock for convenience.
// It is NOT real security, because client-side source code can be inspected.
const APP_PIN = "369700";
const PIN_VERIFIED_KEY = "ct_pin_verified_v1";