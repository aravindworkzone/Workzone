import { useSyncExternalStore } from "react";

/**
 * The browser's "install this app" prompt, exposed to React.
 *
 * Chrome/Edge fire `beforeinstallprompt` once, early — often before React has
 * rendered anything — so the listener is attached when this module is first
 * imported (main.jsx imports it for exactly that reason) and the event is kept
 * in a small module-level store.
 *
 * Safari and Firefox never fire it: there `canInstall` stays false. iPhone and
 * iPad users install through Share → Add to Home Screen instead (see isIos).
 */

let deferred = null;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    // Hide the browser's own mini-infobar; the header button offers it instead.
    e.preventDefault();
    deferred = e;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    emit();
  });
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/**
 * Shows the browser's install prompt. Once shown it can't be shown again, so
 * the event is dropped then — but only then: if the browser refuses to show it
 * (e.g. not triggered by a real tap), the event is kept so the button stays.
 */
export async function promptInstall() {
  const event = deferred;
  if (!event) return false;
  try {
    await event.prompt();
  } catch (err) {
    console.warn("Install prompt could not be shown", err);
    return false;
  }
  deferred = null;
  emit();
  const { outcome } = await event.userChoice;
  return outcome === "accepted";
}

/** Already running as the installed app — nothing left to offer. */
export const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true);

/** iPadOS reports itself as a Mac, hence the touch-point check. */
export const isIos = () =>
  typeof navigator !== "undefined" &&
  (/iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

export default function useInstallPrompt() {
  const canInstall = useSyncExternalStore(subscribe, () => deferred !== null, () => false);
  return { canInstall, promptInstall };
}
