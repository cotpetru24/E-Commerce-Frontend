import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  AdminApiService,
  AdminStats,
} from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { UtilsService } from '../../services/utils';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})

export class AdminDashboardComponent implements OnInit, OnDestroy {
  dashboardStats: AdminStats | null = null;
  isLoadingStats = false;

  private subscriptions = new Subscription();

  constructor(
    private adminApi: AdminApiService,
    private toastService: ToastService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadDashboardData(): void {
    this.isLoadingStats = true;

    this.subscriptions.add(
      this.adminApi
        .getDashboardStats()
        .pipe(finalize(() => (this.isLoadingStats = false)))
        .subscribe({
          next: (stats) => {
            this.dashboardStats = stats;
          },
          error: () => {
            this.toastService.error('Failed to load dashboard statistics');
          },
        })
    );
  }

  getActivityIcon(source: string): string {
    switch (source.toLowerCase()) {
      case 'user':
        return 'bi-person-plus';
      case 'product':
        return 'bi-box';
      case 'order':
        return 'bi-cart-check';
      case 'payment':
        return 'bi-currency-dollar';
      case 'shipping':
        return 'bi-truck';
      default:
        return 'bi-info-circle';
    }
  }

  formatCurrency(value: number): string {
    return this.utilsService.formatCurrency(value);
  }

  formatTimeAgo(dateString: string): string {
    return this.utilsService.formatTimeAgo(dateString);
  }

  viewActivity(activity: any): void {
    switch (activity.source.toLowerCase()) {
      case 'user':
        if (activity.userGuid) {
          this.router.navigate(['/admin/users', activity.userGuid]);
        } else {
          this.toastService.error('Failed to navidate to activity.');
        }
        break;

      case 'product':
        if (activity.id) {
          this.router.navigate(['/products/details', activity.id], {
            queryParams: { from: 'admin-dashboard' },
          });
        } else {
          this.toastService.error('Failed to navidate to activity.');
        }
        break;

      case 'order':
        if (activity.id) {
          this.router.navigate(['/admin/orders', activity.id], {
            queryParams: { from: 'dashboard' },
          });
        } else {
          this.toastService.error('Failed to navigate to activity.');
        }
        break;

      default:
        this.toastService.error('Unknown activity');
    }
  }

  viewAllActivity(): void {
    this.toastService.info(
      'View all Activities - this feature is out of scope!'
    );
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }
}
