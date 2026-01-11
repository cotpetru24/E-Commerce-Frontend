import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AdminDashboardComponent } from './admin-dashboard.component';
import {
  AdminApiService,
  AdminStats,
} from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { UtilsService } from '../../services/utils.service';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let adminApiService: jasmine.SpyObj<AdminApiService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let utilsService: jasmine.SpyObj<
    UtilsService & { getActivityIcon: jasmine.Spy }
  >;

  const mockAdminStats: AdminStats = {
    totalOrders: 100,
    newOrdersToday: 5,
    totalRevenue: 15000,
    todayRevenue: 500,
    totalUsers: 50,
    newUsersToday: 2,
    totalProducts: 200,
    lowStockProducts: 10,
    outOfStockProducts: 3,
    pendingOrders: 8,
    recentActivity: [
      {
        id: 1,
        source: 'Order',
        description: 'Order #123 placed',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        source: 'User',
        description: 'New user registered',
        createdAt: new Date().toISOString(),
      },
    ],
  };

  beforeEach(async () => {
    adminApiService = jasmine.createSpyObj('AdminApiService', [
      'getDashboardStats',
    ]);
    toastService = jasmine.createSpyObj('ToastService', [
      'error',
      'success',
      'info',
    ]);
    utilsService = jasmine.createSpyObj('UtilsService', [
      'formatCurrency',
      'formatTimeAgo',
      'getActivityIcon',
    ]);

    adminApiService.getDashboardStats.and.returnValue(of(mockAdminStats));
    utilsService.formatCurrency.and.callFake(
      (amount: number) => `£${amount.toFixed(2)}`
    );
    utilsService.formatTimeAgo.and.returnValue('just now');
    utilsService.getActivityIcon.and.returnValue('bi-info-circle');

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AdminApiService, useValue: adminApiService },
        { provide: ToastService, useValue: toastService },
        { provide: UtilsService, useValue: utilsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;

    (component as any).formatCurrency = (amount: number) =>
      `£${amount.toFixed(2)}`;
    spyOn(component, 'getActivityIcon').and.returnValue('bi-info-circle');
    spyOn(component, 'formatTimeAgo').and.returnValue('just now');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loadDashboardData_ShouldCallGetDashboardStats_WhenComponentInitializes', () => {
    expect(adminApiService.getDashboardStats).toHaveBeenCalled();
  });

  it('loadDashboardData_ShouldSetDashboardStats_WhenApiCallSucceeds', () => {
    expect(component.dashboardStats).toEqual(mockAdminStats);
    expect(component.isLoadingStats).toBeFalse();
  });

  it('loadDashboardData_ShouldShowError_WhenApiCallFails', () => {
    adminApiService.getDashboardStats.and.returnValue(
      throwError(() => new Error('API Error'))
    );

    component.loadDashboardData();

    expect(toastService.error).toHaveBeenCalledWith(
      'Failed to load dashboard statistics'
    );
  });
});
