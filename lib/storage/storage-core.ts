export function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function readStorageValue(storageKey: string): string | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  return window.localStorage.getItem(storageKey);
}

export function writeStorageValue(storageKey: string, value: string): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(storageKey, value);
}

export function removeStorageValue(storageKey: string): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(storageKey);
}

export function readSessionStorageValue(storageKey: string): string | null {
  if (!canUseSessionStorage()) {
    return null;
  }

  return window.sessionStorage.getItem(storageKey);
}

export function writeSessionStorageValue(storageKey: string, value: string): void {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.setItem(storageKey, value);
}

export function removeSessionStorageValue(storageKey: string): void {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(storageKey);
}
