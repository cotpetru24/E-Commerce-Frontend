import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AdminDashboardApiService } from '../../services/api';
import { ToastService } from '../../services/toast.service';
import { Utils } from '../../shared/utils';
import { DashboardStatsDto } from '@dtos/dashboard.dto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  dashboardStats: DashboardStatsDto | null = null;
  isLoadingStats = false;

  private subscriptions = new Subscription();

  constructor(
    private adminDashboardApiService: AdminDashboardApiService,
    private toastService: ToastService,
    private router: Router,
    public utils: Utils,
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
      this.adminDashboardApiService
        .getDashboardStats()
        .pipe(finalize(() => (this.isLoadingStats = false)))
        .subscribe({
          next: (stats) => {
            this.dashboardStats = stats;
          },
          error: () => {
            this.toastService.error('Failed to load dashboard statistics');
          },
        }),
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

  viewActivity(activity: any): void {
    this.utils.scrollToTop();
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
      'View all Activities - this feature is out of scope!',
    );
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }
}
