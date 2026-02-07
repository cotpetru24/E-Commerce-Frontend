import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductManagementComponent } from './product-management.component';
import { ToastService } from '../../services/toast.service';
import { AdminProductApiService } from 'app/services/api';

describe('ProductManagement', () => {
  let component: ProductManagementComponent;
  let fixture: ComponentFixture<ProductManagementComponent>;
  let adminProductApiService: jasmine.SpyObj<AdminProductApiService>;

  beforeEach(async () => {
    adminProductApiService = jasmine.createSpyObj('AdminApiService', [
      'getProducts',
      'deleteProduct',
    ]);
    adminProductApiService.getProducts.and.returnValue(
      of({
        products: [],
        totalQueryCount: 0,
        adminProductsStats: {
          totalProductsCount: 0,
          totalLowStockProductsCount: 0,
          totalOutOfStockProductsCount: 0,
          totalActiveProductsCount: 0,
        },
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        allBrands: [],
      })
    );

    await TestBed.configureTestingModule({
      imports: [ProductManagementComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: NgbModal,
          useValue: jasmine.createSpyObj('NgbModal', ['open']),
        },
        { provide: AdminProductApiService, useValue: adminProductApiService },
        {
          provide: ToastService,
          useValue: jasmine.createSpyObj('ToastService', [
            'error',
            'success',
            'info',
          ]),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
