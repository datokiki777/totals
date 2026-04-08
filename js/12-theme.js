// 12-theme.js
// Theme, UI mode, workspace and collapse functions

/* =========================
   Theme Functions
========================= */

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function setTheme(theme) {
  const t = theme === "light" ? "light" : "dark";
  rootEl.setAttribute("data-theme", t);

  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {}

  if (themeSwitch && "checked" in themeSwitch) {
    themeSwitch.checked = t === "light";
  }
}

function toggleTheme() {
  const cur = rootEl.getAttribute("data-theme") === "light" ? "light" : "dark";
  setTheme(cur === "light" ? "dark" : "light");
}

function initTheme() {
  const t = getSavedTheme() || "dark";
  setTheme(t);

  const themeColorMeta = document.getElementById("themeColorMeta");
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", t === "light" ? "#c6d0dc" : "#0b1220");
  }

  themeSwitch?.addEventListener("change", () => {
    const nextTheme = themeSwitch.checked ? "light" : "dark";
    setTheme(nextTheme);

    const themeColorMeta = document.getElementById("themeColorMeta");
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", nextTheme === "light" ? "#c6d0dc" : "#0b1220");
    }

    render();
    if (appState.uiMode === "review") renderReview();
  });
}

/* =========================
   Collapse Functions
========================= */

function setControlsCollapsed(v) {
  rootEl.classList.toggle("controls-collapsed", !!v);
  try {
    localStorage.setItem(CONTROLS_KEY, v ? "1" : "0");
  } catch {}
}

function initControlsToggle() {
  controlsToggle?.addEventListener("click", () => {
    const next = !rootEl.classList.contains("controls-collapsed");
    setControlsCollapsed(next);
  });
}

function initWorkspaceSwitch() {
  workspaceActiveBtn?.addEventListener("click", () => {
    setWorkspaceMode("active");
  });

  workspaceArchiveBtn?.addEventListener("click", () => {
    setWorkspaceMode("archive");
  });
}

function initSummaryPanel() {
  setSummaryCollapsed(getSavedSummaryCollapsed());

  summaryCollapseBtn?.addEventListener("click", () => {
    const next = !rootEl.classList.contains("summary-collapsed");
    setSummaryCollapsed(next);
  });

  monthPrevBtn?.addEventListener("click", () => shiftMonthCursor(-1));
  monthNextBtn?.addEventListener("click", () => shiftMonthCursor(1));
}

/* =========================
   UI Mode Functions
========================= */

function syncRootModeClass(mode = appState.uiMode) {
  rootEl.classList.toggle("is-edit", mode === "edit");
}

function updateWorkspaceSwitchUI() {
  const groups = Array.isArray(appState?.groups) ? appState.groups : [];

  const activeCount = groups.reduce((count, g) => {
    return count + (g?.archived === true ? 0 : 1);
  }, 0);

  const archiveCount = groups.reduce((count, g) => {
    return count + (g?.archived === true ? 1 : 0);
  }, 0);

  const renderWorkspaceLabel = (label, count) => {
    if (count > 0) {
      return `${label} <span class="ws-badge">${count}</span>`;
    }
    return label;
  };

  if (workspaceActiveBtn) {
    workspaceActiveBtn.classList.toggle("active", appState.workspaceMode !== "archive");
    workspaceActiveBtn.innerHTML = renderWorkspaceLabel("Active", activeCount);
  }

  if (workspaceArchiveBtn) {
    workspaceArchiveBtn.classList.toggle("active", appState.workspaceMode === "archive");
    workspaceArchiveBtn.innerHTML = renderWorkspaceLabel("Archive", archiveCount);
  }
}

function setWorkspaceMode(mode) {
  const next = mode === "archive" ? "archive" : "active";
  if (appState.workspaceMode === next) return;

  const currentGroup = activeGroup();

  if (appState.workspaceMode === "active") {
    appState.lastActiveGroupIdActive = currentGroup?.id || appState.lastActiveGroupIdActive || "";
  } else {
    appState.lastActiveGroupIdArchive = currentGroup?.id || appState.lastActiveGroupIdArchive || "";
  }

  appState.workspaceMode = next;

  const rememberedId =
    next === "archive"
      ? appState.lastActiveGroupIdArchive
      : appState.lastActiveGroupIdActive;

  const rememberedGroup = appState.groups.find((g) =>
    g.id === rememberedId &&
    (next === "archive" ? g.archived === true : g.archived !== true)
  );

  const firstInWorkspace = appState.groups.find((g) =>
    next === "archive" ? g.archived === true : g.archived !== true
  );

  if (rememberedGroup) {
    appState.activeGroupId = rememberedGroup.id;
  } else if (firstInWorkspace) {
    appState.activeGroupId = firstInWorkspace.id;
  }

  if (appState.uiMode === "edit") {
  appState.grandMode = "active";
} else {
  appState.grandMode = appState.lastReviewGrandMode === "all" ? "all" : "active";
}

  saveState();
  updateWorkspaceSwitchUI();
  render();

  if (appState.uiMode === "review") {
    renderReview();
  }
}

function updateGrandToggleUI() {
  totalsActiveBtn.classList.toggle("active", appState.grandMode === "active");
  totalsAllBtn.classList.toggle("active", appState.grandMode === "all");
}

function setControlsForMode(mode) {
  const isEdit = mode === "edit";
  syncRootModeClass(mode);

  if (editActions) editActions.style.display = isEdit ? "flex" : "none";
  if (reviewActions) reviewActions.style.display = isEdit ? "none" : "flex";

  const archiveGroupBtn = document.getElementById("archiveGroupBtn");

  const enableAlways = [
    modeEditBtn,
    modeReviewBtn,
    totalsActiveBtn,
    totalsAllBtn,
    controlsToggle,
    topMenuBtn
  ];

  const enableInReview = [
    groupPickerBtn
  ];

  const enableInEdit = [
    groupPickerBtn,
    addGroupBtn,
    renameGroupBtn,
    deleteGroupBtn,
    archiveGroupBtn,
    defaultRateInput,
    addPeriodBtn,
    resetBtn
  ];

  const all = [
    groupPickerBtn,
    addGroupBtn,
    renameGroupBtn,
    deleteGroupBtn,
    archiveGroupBtn,
    defaultRateInput,
    addPeriodBtn,
    resetBtn,
    topMenuBtn
  ];

  const setEl = (el, enabled) => {
    if (!el) return;
    if ("disabled" in el) el.disabled = !enabled;
    el.style.pointerEvents = "";
    el.style.opacity = enabled ? "" : "0.55";
  };

  all.forEach((el) => setEl(el, false));
  enableAlways.forEach((el) => setEl(el, true));
  (isEdit ? enableInEdit : enableInReview).forEach((el) => setEl(el, true));
}

function setMode(mode) {
  const nextMode = mode === "edit" ? "edit" : "review";

  if (nextMode === "edit") {
    // შევინახოთ რა ჰქონდა review-ში ბოლოს არჩეული
    appState.lastReviewGrandMode = appState.grandMode === "all" ? "all" : "active";
    appState.uiMode = "edit";
    appState.grandMode = "active";

    const current = getCurrentMonthKey("active");
    setSavedMonthCursor(current);
  } else {
    appState.uiMode = "review";
    appState.grandMode = appState.lastReviewGrandMode === "all" ? "all" : "active";
  }

  saveState();

  modeEditBtn?.classList.toggle("active", appState.uiMode === "edit");
  modeReviewBtn?.classList.toggle("active", appState.uiMode === "review");

  if (editView && reviewView) {
    const globalSearchCard = document.getElementById("globalSearchCard");

    if (appState.uiMode === "review") {
      editView.hidden = true;
      reviewView.hidden = false;
      if (globalSearchCard) globalSearchCard.hidden = false;
      renderReview();
    } else {
      reviewView.hidden = true;
      reviewView.innerHTML = "";
      if (globalSearchCard) globalSearchCard.hidden = true;
      editView.hidden = false;
    }
  }

  setControlsForMode(appState.uiMode);
  updateGrandToggleUI();
  recalcAndRenderTotals();
  updateFloatingAddClientVisibility();
}

/* =========================
   Month Navigation
========================= */

function shiftMonthCursor(dir) {
  const keys = getAllMonthKeysForMode(appState.grandMode);
  if (!keys.length) return;

  const currentKey = getCurrentMonthKey(appState.grandMode);
  let idx = keys.indexOf(currentKey);
  if (idx === -1) idx = keys.length - 1;

  idx += dir;
  if (idx < 0) idx = 0;
  if (idx > keys.length - 1) idx = keys.length - 1;

  setSavedMonthCursor(keys[idx]);
  renderMonthlyStats();
}