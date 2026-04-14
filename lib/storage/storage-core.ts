export function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
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
