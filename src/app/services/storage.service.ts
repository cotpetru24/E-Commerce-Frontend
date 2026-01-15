import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class StorageService {
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
    } catch (error) {}
  }

  removeSessionItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch {}
  }

  clearSessionStorage(): void {
    try {
      sessionStorage.clear();
    } catch {}
  }

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
    } catch (error) {}
  }

  removeLocalItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {}
  }

  clearLocalStorage(): void {
    try {
      localStorage.clear();
    } catch {}
  }

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
    } catch {}
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
    } catch {}
  }
}
