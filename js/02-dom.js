// 02-dom.js
// DOM references and element selectors

const rootEl = document.documentElement;

// Main UI
const modeEditBtn = document.getElementById("modeEditBtn");
const modeReviewBtn = document.getElementById("modeReviewBtn");
const workspaceActiveBtn = document.getElementById("workspaceActiveBtn");
const workspaceArchiveBtn = document.getElementById("workspaceArchiveBtn");
const editView = document.getElementById("editView");
const reviewView = document.getElementById("reviewView");
const elPeriods = document.getElementById("periods");
const tplPeriod = document.getElementById("periodTpl");
const tplRow = document.getElementById("rowTpl");

const defaultRateInput = document.getElementById("defaultRate");
const addPeriodBtn = document.getElementById("addPeriodBtn");
const resetBtn = document.getElementById("resetBtn");

const grandGrossEl = document.getElementById("grandGross");
const grandNetEl = document.getElementById("grandNet");
const grandMyEl = document.getElementById("grandMy");

// Summary + Monthly stats
const summaryCollapseBtn = document.getElementById("summaryCollapseBtn");
const monthPrevBtn = document.getElementById("monthPrevBtn");
const monthNextBtn = document.getElementById("monthNextBtn");
const monthLabel = document.getElementById("monthLabel");
const monthGrossEl = document.getElementById("monthGross");
const monthNetEl = document.getElementById("monthNet");
const monthMyEl = document.getElementById("monthMy");
const overviewDateRangeEl = document.getElementById("overviewDateRange");
const overviewDurationEl = document.getElementById("overviewDuration");

// Groups UI
const groupPickerBtn = document.getElementById("groupPickerBtn");
const groupPickerBtnText = document.getElementById("groupPickerBtnText");
const addGroupBtn = document.getElementById("addGroupBtn");
const renameGroupBtn = document.getElementById("renameGroupBtn");
const deleteGroupBtn = document.getElementById("deleteGroupBtn");

// Group Picker Modal
const groupPickerModal = document.getElementById("groupPickerModal");
const groupPickerList = document.getElementById("groupPickerList");
const groupPickerClose = document.getElementById("groupPickerClose");

// Grand Total toggle
const totalsActiveBtn = document.getElementById("totalsActiveBtn");
const totalsAllBtn = document.getElementById("totalsAllBtn");

// Export/Import ALL groups
const topMenuBtn = document.getElementById("topMenuBtn");
const topMenuBackdrop = document.getElementById("topMenuBackdrop");
const topMenuPanel = document.getElementById("topMenuPanel");

const menuExportJsonBtn = document.getElementById("menuExportJsonBtn");
const menuImportJsonInput = document.getElementById("menuImportJsonInput");
const menuPdfBtn = document.getElementById("menuPdfBtn");

const menuExportExcelBtn = document.getElementById("menuExportExcelBtn");
const menuImportExcelInput = document.getElementById("menuImportExcelInput");

// Action groups for edit/review modes
const editActions = document.querySelector('.edit-actions');
const reviewActions = document.querySelector('.review-actions');

// Scroll-to-top
const toTopBtn = document.getElementById("toTopBtn");

// Controls collapse
const controlsToggle = document.getElementById("controlsToggle");

// Floating add client
const fabAddClient = document.getElementById("fabAddClient");

// Confirm modal
const confirmBackdrop = document.getElementById("confirmModal");
const confirmTitleEl = document.getElementById("confirmTitle");
const confirmTextEl = document.getElementById("confirmText");
const confirmNoBtn = document.getElementById("confirmNo");
const confirmYesBtn = document.getElementById("confirmYes");

// Status list modal
const statusListModal = document.getElementById("statusListModal");
const statusListTitle = document.getElementById("statusListTitle");
const statusListBody = document.getElementById("statusListBody");
const statusListClose = document.getElementById("statusListClose");

// Theme controls
const themeSwitch = document.getElementById("themeSwitch");

// Text prompt modal
const textPromptModal = document.getElementById("textPromptModal");
const textPromptTitle = document.getElementById("textPromptTitle");
const textPromptText = document.getElementById("textPromptText");
const textPromptInput = document.getElementById("textPromptInput");
const textPromptCancel = document.getElementById("textPromptCancel");
const textPromptOk = document.getElementById("textPromptOk");

// Pin lock modal
const pinLockModal = document.getElementById("pinLockModal");
const pinLockInput = document.getElementById("pinLockInput");
const pinUnlockBtn = document.getElementById("pinUnlockBtn");
const pinLockError = document.getElementById("pinLockError");

// Additional variables
let bodyOverflowBeforePinLock = "";