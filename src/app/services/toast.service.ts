import { Injectable } from '@angular/core';

export interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  show(options: ToastOptions): void {
    const toastId = 'toast-' + Date.now();
    const toastElement = this.createToastElement(toastId, options);
    document.body.appendChild(toastElement);

    // Show the toast
    const toast = new (window as any).bootstrap.Toast(toastElement);
    toast.show();

    // Auto remove after duration
    if (options.duration) {
      setTimeout(() => {
        this.hide(toastId);
      }, options.duration);
    }
  }

  success(message: string, duration: number = 3000): void {
    this.show({ message, type: 'success', duration });
  }

  error(message: string, duration: number = 5000): void {
    this.show({ message, type: 'error', duration });
  }

  warning(message: string, duration: number = 4000): void {
    this.show({ message, type: 'warning', duration });
  }

  info(message: string, duration: number = 3000): void {
    this.show({ message, type: 'info', duration });
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

  private createToastElement(id: string, options: ToastOptions): HTMLElement {
    const toastElement = document.createElement('div');
    toastElement.id = id;
    toastElement.className = `toast position-fixed ${this.getPositionClass(options.position)}`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    const bgClass = this.getBackgroundClass(options.type);
    const iconClass = this.getIconClass(options.type);

    toastElement.innerHTML = `
      <div class="toast-header ${bgClass} text-white">
        <i class="bi ${iconClass} me-2"></i>
        <strong class="me-auto">${this.getTitle(options.type)}</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${options.message}
      </div>
    `;

    return toastElement;
  }

  private getPositionClass(position?: string): string {
    switch (position) {
      case 'top-right': return 'top-0 end-0 m-3';
      case 'top-left': return 'top-0 start-0 m-3';
      case 'bottom-right': return 'bottom-0 end-0 m-3';
      case 'bottom-left': return 'bottom-0 start-0 m-3';
      case 'top-center': return 'top-0 start-50 translate-middle-x m-3';
      case 'bottom-center': return 'bottom-0 start-50 translate-middle-x m-3';
      default: return 'top-0 end-0 m-3';
    }
  }

  private getBackgroundClass(type?: string): string {
    switch (type) {
      case 'success': return 'bg-success';
      case 'error': return 'bg-danger';
      case 'warning': return 'bg-warning';
      case 'info': return 'bg-info';
      default: return 'bg-primary';
    }
  }

  private getIconClass(type?: string): string {
    switch (type) {
      case 'success': return 'bi-check-circle';
      case 'error': return 'bi-x-circle';
      case 'warning': return 'bi-exclamation-triangle';
      case 'info': return 'bi-info-circle';
      default: return 'bi-info-circle';
    }
  }

  private getTitle(type?: string): string {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Info';
      default: return 'Notification';
    }
  }
} 