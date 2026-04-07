// 13-app.js
// App initialization, event listeners and startup logic

/* =========================
   Event Listeners - Mode Buttons
========================= */

modeEditBtn?.addEventListener("click", () => setMode("edit"));
modeReviewBtn?.addEventListener("click", () => setMode("review"));

/* =========================
   Event Listeners - Grand Total Toggle
========================= */

totalsActiveBtn?.addEventListener("click", () => {
  if (appState.grandMode === "active") return;
  appState.grandMode = "active";
  saveState();
  updateGrandToggleUI();
  
  const current = getCurrentMonthKey("active");
  setSavedMonthCursor(current);
  
  render();
  if (appState.uiMode === "review") renderReview();
  renderMonthlyStats();
});

totalsAllBtn?.addEventListener("click", () => {
  if (appState.grandMode === "all") return;
  appState.grandMode = "all";
  saveState();
  updateGrandToggleUI();
  
  const current = getCurrentMonthKey("all");
  setSavedMonthCursor(current);
  
  render();
  if (appState.uiMode === "review") renderReview();
  renderMonthlyStats();
});

/* =========================
   Event Listeners - Group Picker
========================= */

groupPickerBtn?.addEventListener("click", () => {
  openGroupPickerModal();
});

groupPickerClose?.addEventListener("click", closeGroupPickerModal);

groupPickerModal?.addEventListener("click", (e) => {
  if (e.target === groupPickerModal) {
    closeGroupPickerModal();
  }
});

/* =========================
   Event Listeners - Group Management
========================= */

addGroupBtn?.addEventListener("click", addGroup);
renameGroupBtn?.addEventListener("click", renameGroup);
deleteGroupBtn?.addEventListener("click", deleteGroup);

/* =========================
   Event Listeners - Archive Group Button
========================= */

const archiveGroupBtn = document.getElementById("archiveGroupBtn");
archiveGroupBtn?.addEventListener("click", () => {
  const g = appState.groups.find(x => x.id === appState.activeGroupId) || activeGroup();
  if (!g) return;
  const label = g.archived ? "Unarchive" : "Archive";
  askConfirm(
    `${label} group "${g.name}"?`,
    `${label} Group`,
    { type: "primary", okText: label }
  ).then((ok) => {
    if (!ok) return;
    toggleArchiveGroup(g.id);
    render();
    if (appState.uiMode === "review") renderReview();
  });
});

/* =========================
   Event Listeners - Default Rate
========================= */

defaultRateInput?.addEventListener("input", () => {
  const g = activeGroup();
  g.data.defaultRatePercent = clampRate(defaultRateInput.value);
  saveState();
  recalcAndRenderTotals();
  if (appState.uiMode === "review") renderReview();
});

/* =========================
   Event Listeners - Add Period Button
========================= */

addPeriodBtn?.addEventListener("click", () => {
  const g = activeGroup();
  const st = g.data;

  st.periods.forEach((periodItem) => {
    setPeriodCollapsed(periodItem.id, true);
  });

  const newPeriod = {
    id: uuid(),
    from: "",
    to: "",
    rows: [emptyRow()],
  };

  st.periods.push(newPeriod);
  setPeriodCollapsed(newPeriod.id, false);

  saveState();
  render();
  if (appState.uiMode === "review") renderReview();

  setTimeout(() => {
    const newPeriodEl = document.querySelector(`.period[data-period-id="${newPeriod.id}"]`);
    if (!newPeriodEl) return;

    newPeriodEl.classList.remove("is-collapsed");

    newPeriodEl.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    const fromInput = newPeriodEl.querySelector(".fromDate");
    if (fromInput) {
      fromInput.focus();
    }

    updateFloatingAddClientVisibility();
  }, 80);
});

/* =========================
   Event Listeners - Reset Button
========================= */

resetBtn?.addEventListener("click", async () => {
  const g = activeGroup();
  const ok = await askConfirm(
    `Reset group "${g.name}"? This will clear all its data.`,
    "Reset group",
    { type: "danger", okText: "Reset" }
  );
  if (!ok) return;

  g.data = defaultGroupData();
  saveState();
  render();
  if (appState.uiMode === "review") renderReview();
});

/* =========================
   Event Listeners - Scroll to Top
========================= */

function toggleToTop() {
  if (!toTopBtn) return;
  if (window.scrollY > 450) toTopBtn.classList.add("show");
  else toTopBtn.classList.remove("show");
}

window.addEventListener("scroll", toggleToTop);
toggleToTop();

toTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================
   Event Listeners - Floating Add Client
========================= */

fabAddClient?.addEventListener("click", () => {
  if (appState.uiMode !== "edit") return;
  addClientToLastPeriod();
});

/* =========================
   Event Listeners - Status List Modal
========================= */

statusListClose?.addEventListener("click", closeStatusListModal);

statusListModal?.addEventListener("click", (e) => {
  if (e.target === statusListModal) {
    closeStatusListModal();
  }
});

/* =========================
   Keyboard Detection for Mobile
========================= */

(function initKeyboardDetect() {
  let baseH = window.innerHeight;

  window.addEventListener("resize", () => {
    const h = window.innerHeight;
    const opened = h < baseH - 120;

    rootEl.classList.toggle("keyboard-open", opened);

    if (!opened && Math.abs(h - baseH) > 100) {
      baseH = h;
    }
  });
})();

/* =========================
   Android / Browser Back Button
========================= */

window.addEventListener("popstate", () => {
  // confirmBackdrop
  if (confirmBackdrop && confirmBackdrop.style.display === "flex") {
    confirmBackdrop.style.display = "none";
    if (confirmNoBtn) confirmNoBtn.onclick?.();
    return;
  }

  // groupPickerModal
  if (groupPickerModal && groupPickerModal.style.display === "flex") {
    closeGroupPickerModal();
    return;
  }

  // textPromptModal
  if (textPromptModal && textPromptModal.style.display === "flex") {
    textPromptModal.style.display = "none";
    return;
  }

  // statusListModal
  if (statusListModal && statusListModal.style.display === "flex") {
    closeStatusListModal();
    return;
  }
});

/* =========================
   App Initialization
========================= */

initTheme();
initControlsToggle();
initWorkspaceSwitch();
initSummaryPanel();
initTopMenu();
initPinLock();
initStatusBadgeActions();

setMode(appState.uiMode || "review");
render();

setTimeout(() => {
  if (shouldShowBackupReminder()) {
    showBackupReminderPopup();
  }
}, 250);

requestAnimationFrame(() => {
  document.body.classList.remove("booting");
});

/* =========================
   Splash Screen Removal
========================= */

window.addEventListener("load", () => {
  const splash = document.getElementById("splash");

  setTimeout(() => {
    splash?.classList.add("splash-hide");

    document.documentElement.classList.remove("app-preload");
    document.documentElement.classList.add("app-ready");
    document.documentElement.classList.add("ready");

    setTimeout(() => {
      splash?.remove();
    }, 450);
  }, 700);
});

/* =========================
   Service Worker (PWA)
========================= */

if ("serviceWorker" in navigator) {
  let refreshing = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  navigator.serviceWorker.register("service-worker.js").then((reg) => {
    const showUpdateBar = (worker) => {
      const bar = document.getElementById("updateBar");
      const btn = document.getElementById("updateBtn");
      const exportBtn = document.getElementById("updateExportBtn");

      if (bar) bar.style.display = "flex";

      if (exportBtn) {
        exportBtn.onclick = () => {
          handleExportJson();
        };
      }

      if (btn) {
        btn.onclick = () => {
          btn.disabled = true;
          btn.textContent = "Updating...";

          if (worker) {
            worker.postMessage({ action: "skipWaiting" });
          } else {
            window.location.reload();
          }
        };
      }
    };

    if (reg.waiting) {
      showUpdateBar(reg.waiting);
    }

    reg.addEventListener("updatefound", () => {
      const newWorker = reg.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          showUpdateBar(newWorker);
        }
      });
    });
  }).catch((err) => {
    console.error("Service Worker registration failed:", err);
  });
}

/* =========================
   PWA Install Prompt
========================= */

let deferredInstallPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;

  const installBar = document.getElementById("installBar");
  const installBtn = document.getElementById("installBtn");
  const installCloseBtn = document.getElementById("installCloseBtn");

  if (installBar) installBar.style.display = "flex";

  if (installCloseBtn) {
    installCloseBtn.onclick = () => {
      if (installBar) installBar.style.display = "none";
    };
  }

  if (installBtn) {
    installBtn.onclick = async () => {
      if (!deferredInstallPrompt) return;

      deferredInstallPrompt.prompt();
      try {
        await deferredInstallPrompt.userChoice;
      } catch (err) {}

      deferredInstallPrompt = null;
      if (installBar) installBar.style.display = "none";
    };
  }
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;

  const installBar = document.getElementById("installBar");
  if (installBar) installBar.style.display = "none";
});