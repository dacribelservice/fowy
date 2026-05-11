/**
 * Utility to access localStorage safely, preventing crashes in environments like
 * Safari's Private Browsing mode (which throws exceptions on quota exceeded or storage disabled)
 * or during Server-Side Rendering (where window and localStorage are undefined).
 * 
 * Implements an in-memory fallback cache so the application remains functional
 * during the user session even if localStorage is completely disabled or blocked.
 */

const memoryStorage: Record<string, string> = {};

let isLocalStorageAvailable = false;
if (typeof window !== "undefined") {
  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    isLocalStorageAvailable = true;
  } catch (e) {
    isLocalStorageAvailable = false;
    console.warn(
      "[safeLocalStorage] localStorage is not available (e.g. Safari Private Browsing). " +
      "Falling back to in-memory session-only storage."
    );
  }
}

export const safeLocalStorage = {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;

    if (isLocalStorageAvailable) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        console.warn(`[safeLocalStorage] Failed to read key "${key}" from localStorage:`, error);
        return memoryStorage[key] || null;
      }
    }

    return memoryStorage[key] || null;
  },

  setItem(key: string, value: string): void {
    if (typeof window === "undefined") return;

    // Always keep memory storage synchronized
    memoryStorage[key] = value;

    if (isLocalStorageAvailable) {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.warn(`[safeLocalStorage] Failed to write key "${key}" to localStorage:`, error);
      }
    }
  },

  removeItem(key: string): void {
    if (typeof window === "undefined") return;

    delete memoryStorage[key];

    if (isLocalStorageAvailable) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn(`[safeLocalStorage] Failed to remove key "${key}" from localStorage:`, error);
      }
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;

    for (const key in memoryStorage) {
      delete memoryStorage[key];
    }

    if (isLocalStorageAvailable) {
      try {
        window.localStorage.clear();
      } catch (error) {
        console.warn("[safeLocalStorage] Failed to clear localStorage:", error);
      }
    }
  }
};
