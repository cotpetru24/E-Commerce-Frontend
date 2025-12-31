import { Injectable } from '@angular/core';

/**
 * Centralized storage service for localStorage and sessionStorage operations
 * Ensures consistent storage access patterns across the application
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  // ============================================================================
  // SESSION STORAGE METHODS
  // ============================================================================
  
  getSessionItem(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setSessionItem(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      // Silently fail if storage is unavailable
    }
  }

  removeSessionItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Silently fail if storage is unavailable
    }
  }

  clearSessionStorage(): void {
    try {
      sessionStorage.clear();
    } catch {
      // Silently fail if storage is unavailable
    }
  }

  // ============================================================================
  // LOCAL STORAGE METHODS
  // ============================================================================
  
  getLocalItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setLocalItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Silently fail if storage is unavailable
    }
  }

  removeLocalItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail if storage is unavailable
    }
  }

  clearLocalStorage(): void {
    try {
      localStorage.clear();
    } catch {
      // Silently fail if storage is unavailable
    }
  }

  // ============================================================================
  // JSON HELPERS
  // ============================================================================
  
  getSessionObject<T>(key: string): T | null {
    const item = this.getSessionItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  setSessionObject<T>(key: string, value: T): void {
    try {
      this.setSessionItem(key, JSON.stringify(value));
    } catch {
      // Silently fail if storage is unavailable
    }
  }

  getLocalObject<T>(key: string): T | null {
    const item = this.getLocalItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  setLocalObject<T>(key: string, value: T): void {
    try {
      this.setLocalItem(key, JSON.stringify(value));
    } catch {
      // Silently fail if storage is unavailable
    }
  }
}

