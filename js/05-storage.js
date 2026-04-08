// 05-storage.js
// Storage functions - localStorage management

function getSavedSummaryCollapsed() {
  try {
    return localStorage.getItem(SUMMARY_COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

function setSummaryCollapsed(v) {
  rootEl.classList.toggle("summary-collapsed", !!v);
  try {
    localStorage.setItem(SUMMARY_COLLAPSED_KEY, v ? "1" : "0");
  } catch {}
}

function getSavedMonthCursor() {
  try {
    return localStorage.getItem(MONTH_CURSOR_KEY) || "";
  } catch {
    return "";
  }
}

function setSavedMonthCursor(v) {
  try {
    localStorage.setItem(MONTH_CURSOR_KEY, v || "");
  } catch {}
}

function markBackupReminderDirty() {
  try {
    localStorage.setItem(BACKUP_REMINDER_DIRTY_KEY, "1");
    localStorage.setItem(BACKUP_REMINDER_LAST_CHANGE_KEY, String(Date.now()));
  } catch {}
}

function getWeekKeyForReminder(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sunday, 1=Monday...
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(d);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(d.getDate() + diffToMonday);

  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, "0");
  const dd = String(monday.getDate()).padStart(2, "0");

  return `${y}-${m}-${dd}`;
}

function isBackupReminderWindow(date = new Date()) {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday
  const hour = date.getHours();

  // Sunday from 19:00
  if (day === 0 && hour >= 19) return true;

  // All Monday
  if (day === 1) return true;

  return false;
}

function shouldShowBackupReminder(now = new Date()) {
  try {
    const dirty = localStorage.getItem(BACKUP_REMINDER_DIRTY_KEY) === "1";
    if (!dirty) return false;

    if (!isBackupReminderWindow(now)) return false;

    const currentWeekKey = getWeekKeyForReminder(now);
    const lastShownWeekKey = localStorage.getItem(BACKUP_REMINDER_LAST_SHOWN_KEY) || "";

    if (lastShownWeekKey === currentWeekKey) return false;

    const lastChangeRaw = localStorage.getItem(BACKUP_REMINDER_LAST_CHANGE_KEY);
    if (!lastChangeRaw) return false;

    const lastChange = new Date(Number(lastChangeRaw));
    if (Number.isNaN(lastChange.getTime())) return false;

    const changeWeekKey = getWeekKeyForReminder(lastChange);

    return changeWeekKey === currentWeekKey;
  } catch {
    return false;
  }
}

function saveState(options = {}) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));

    if (!options.skipBackupReminderDirty) {
      markBackupReminderDirty();
    }
  } catch {}
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAppState();
    return normalizeAppState(JSON.parse(raw));
  } catch {
    return defaultAppState();
  }
}

let collapsedPeriodsCache = null;

function getSavedCollapsedPeriods() {
  if (collapsedPeriodsCache) {
    return collapsedPeriodsCache;
  }

  try {
    collapsedPeriodsCache = JSON.parse(localStorage.getItem(PERIODS_COLLAPSED_KEY) || "{}");
  } catch {
    collapsedPeriodsCache = {};
  }

  return collapsedPeriodsCache;
}

function saveCollapsedPeriods(map) {
  collapsedPeriodsCache = map || {};

  try {
    localStorage.setItem(PERIODS_COLLAPSED_KEY, JSON.stringify(collapsedPeriodsCache));
  } catch {}
}

function isPeriodCollapsed(periodId) {
  const map = getSavedCollapsedPeriods();
  return !!map[periodId];
}

function setPeriodCollapsed(periodId, collapsed) {
  const map = getSavedCollapsedPeriods();
  map[periodId] = !!collapsed;
  saveCollapsedPeriods(map);
}

function isDeviceVerified() {
  try {
    return localStorage.getItem(PIN_VERIFIED_KEY) === "1";
  } catch {
    return false;
  }
}

function setDeviceVerified(v) {
  try {
    localStorage.setItem(PIN_VERIFIED_KEY, v ? "1" : "0");
  } catch {}
}

/* =========================
   Month Cursor Helper
========================= */

function getCurrentMonthKey(mode = appState.grandMode) {
  const keys = getAllMonthKeysForMode(mode);
  if (!keys.length) return "";

  const saved = getSavedMonthCursor();
  if (saved && keys.includes(saved)) return saved;

  return keys[keys.length - 1];
}