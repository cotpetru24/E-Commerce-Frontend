import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminDashboardApiService } from '../../services/api';
import { ToastService } from '../../services/toast.service';
import { Utils } from '../../shared/utils';
import { DashboardStatsDto } from '@dtos/dashboard.dto';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let adminDashboardApiService: jasmine.SpyObj<AdminDashboardApiService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let utils: jasmine.SpyObj<Pick<Utils, 'formatCurrency' | 'formatTimeAgo' | 'scrollToTop'>>;

  const mockAdminStats: DashboardStatsDto = {
    totalOrders: 100,
    newOrdersToday: 5,
    totalRevenue: 15000,
    todayRevenue: 500,
    totalUsers: 50,
    newUsersToday: 2,
    totalProducts: 200,
    lowStockProducts: 10,
    outOfStockProducts: 3,
    cancelledOrders: 65,
    deliveredOrders: 555,
    newUsersThisMonth: 65,
    processingOrders: 897,
    returnedOrders: 456,
    shippedOrders: 987,
    thisMonthRevenue: 897,
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
    adminDashboardApiService = jasmine.createSpyObj('AdminDashboardApiService', [
      'getDashboardStats',
    ]);
    toastService = jasmine.createSpyObj('ToastService', [
      'error',
      'success',
      'info',
    ]);
    utils = jasmine.createSpyObj('Utils', [
      'formatCurrency',
      'formatTimeAgo',
      'scrollToTop',
    ]);

    adminDashboardApiService.getDashboardStats.and.returnValue(
      of(mockAdminStats),
    );
    utils.formatCurrency.and.callFake(
      (amount: number) => `£${amount.toFixed(2)}`,
    );
    utils.formatTimeAgo.and.returnValue('just now');
    utils.scrollToTop.and.stub();

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: AdminDashboardApiService,
          useValue: adminDashboardApiService,
        },
        { provide: ToastService, useValue: toastService },
        { provide: Utils, useValue: utils },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    spyOn(component, 'getActivityIcon').and.returnValue('bi-info-circle');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loadDashboardData_ShouldCallGetDashboardStats_WhenComponentInitializes', () => {
    expect(adminDashboardApiService.getDashboardStats).toHaveBeenCalled();
  });

  it('loadDashboardData_ShouldSetDashboardStats_WhenApiCallSucceeds', () => {
    expect(component.dashboardStats).toEqual(mockAdminStats);
    expect(component.isLoadingStats).toBeFalse();
  });

  it('loadDashboardData_ShouldShowError_WhenApiCallFails', () => {
    adminDashboardApiService.getDashboardStats.and.returnValue(
      throwError(() => new Error('API Error')),
    );

    component.loadDashboardData();

    expect(toastService.error).toHaveBeenCalledWith(
      'Failed to load dashboard statistics',
    );
  });
});
