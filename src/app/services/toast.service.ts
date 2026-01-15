import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class ToastService {
  constructor() {}

  show(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
    duration: number = 3000
  ): void {
    const toastId = 'toast-' + Date.now();
    const toastElement = this.createToastElement(
      toastId,
      message,
      type
    );
    document.body.appendChild(toastElement);
    const toast = new (window as any).bootstrap.Toast(toastElement);
    toast.show();

    if (duration) {
      setTimeout(() => {
        this.hide(toastId);
      }, duration);
    }
  }

  success(message: string, duration: number = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration: number = 5000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration: number = 4000): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration: number = 3000): void {
    this.show(message, 'info', duration);
  }

  hide(toastId: string): void {
    const toastElement = document.getElementById(toastId);
    if (toastElement) {
      const toast = new (window as any).bootstrap.Toast(toastElement);
      toast.hide();
      setTimeout(() => {
        if (toastElement.parentNode) {
          toastElement.parentNode.removeChild(toastElement);
        }
      }, 150);
    }
  }

  private createToastElement(
    id: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
  ): HTMLElement {
    const toastElement = document.createElement('div');
    toastElement.id = id;
    toastElement.className = `toast position-fixed top-0 end-0 m-3`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    const bgClass = this.getBackgroundClass(type);
    const iconClass = this.getIconClass(type);

    toastElement.innerHTML = `
      <div class="toast-header ${bgClass} text-white">
        <i class="bi ${iconClass} me-2"></i>
        <strong class="me-auto">${this.getTitle(type)}</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `;

    return toastElement;
  }

  private getBackgroundClass(type?: string): string {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      case 'warning':
        return 'bg-warning';
      case 'info':
        return 'bg-info';
      default:
        return 'bg-primary';
    }
  }

  private getIconClass(type?: string): string {
    switch (type) {
      case 'success':
        return 'bi-check-circle';
      case 'error':
        return 'bi-x-circle';
      case 'warning':
        return 'bi-exclamation-triangle';
      case 'info':
        return 'bi-info-circle';
      default:
        return 'bi-info-circle';
    }
  }

  private getTitle(type?: string): string {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Info';
      default:
        return 'Notification';
    }
  }
}
