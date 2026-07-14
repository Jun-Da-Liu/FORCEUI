import { STORAGE_KEYS } from "@/constants";
import { appConfig } from "@/settings";
import { AuthStorage, redirectToLogin } from "@/utils/auth";
import { Storage } from "@/utils/storage";
import i18n from "@/lang";

const ACTIVITY_EVENTS = ["pointerdown", "mousemove", "keydown", "scroll", "touchstart"];
const ACTIVITY_WRITE_INTERVAL = 1000;
const idleTimeoutMs = appConfig.idleTimeoutMinutes * 60 * 1000;

let timeoutId;
let lastActivityWrite = 0;
let isStarted = false;
let isSigningOut = false;

function clearTimer() {
  if (timeoutId) {
    window.clearTimeout(timeoutId);
    timeoutId = undefined;
  }
}

function getLastActivity() {
  return Number(Storage.get(STORAGE_KEYS.LAST_ACTIVITY, 0));
}

function scheduleTimeout() {
  clearTimer();
  if (!AuthStorage.getAccessToken() || isSigningOut) return;

  const lastActivity = getLastActivity() || Date.now();
  const remaining = idleTimeoutMs - (Date.now() - lastActivity);

  if (remaining <= 0) {
    void signOutDueToInactivity();
    return;
  }

  timeoutId = window.setTimeout(() => {
    const elapsed = Date.now() - getLastActivity();
    if (elapsed >= idleTimeoutMs) {
      void signOutDueToInactivity();
    } else {
      scheduleTimeout();
    }
  }, remaining);
}

function recordActivity() {
  if (!AuthStorage.getAccessToken() || isSigningOut) return;

  const now = Date.now();
  if (now - lastActivityWrite < ACTIVITY_WRITE_INTERVAL) return;

  lastActivityWrite = now;
  Storage.set(STORAGE_KEYS.LAST_ACTIVITY, now);
  scheduleTimeout();
}

async function signOutDueToInactivity() {
  if (isSigningOut || !AuthStorage.getAccessToken()) return;

  isSigningOut = true;
  clearTimer();
  await redirectToLogin(
    i18n.global.t("session.idleExpired", { minutes: appConfig.idleTimeoutMinutes })
  );
  isSigningOut = false;
}

function handleVisibilityChange() {
  if (document.visibilityState !== "visible" || !AuthStorage.getAccessToken()) return;

  if (Date.now() - getLastActivity() >= idleTimeoutMs) {
    void signOutDueToInactivity();
  } else {
    recordActivity();
  }
}

function handleStorageChange(event) {
  if (
    event.key === STORAGE_KEYS.LAST_ACTIVITY ||
    event.key === STORAGE_KEYS.ACCESS_TOKEN ||
    event.key === STORAGE_KEYS.REMEMBER_ME
  ) {
    scheduleTimeout();
  }
}

export function setupSessionTimeout() {
  if (isStarted || typeof window === "undefined") return;
  isStarted = true;

  ACTIVITY_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, recordActivity, { passive: true });
  });
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("storage", handleStorageChange);
  window.addEventListener("auth-session-changed", scheduleTimeout);

  if (AuthStorage.getAccessToken()) {
    if (!getLastActivity()) Storage.set(STORAGE_KEYS.LAST_ACTIVITY, Date.now());
    scheduleTimeout();
  }
}
