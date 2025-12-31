import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductManagementComponent } from './product-management.component';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';

describe('ProductManagement', () => {
  let component: ProductManagementComponent;
  let fixture: ComponentFixture<ProductManagementComponent>;
  let adminApiService: jasmine.SpyObj<AdminApiService>;

  beforeEach(async () => {
    adminApiService = jasmine.createSpyObj('AdminApiService', ['getAllProducts', 'deleteProduct']);
    adminApiService.getAllProducts.and.returnValue(of({
      products: [],
      totalQueryCount: 0,
      adminProductsStats: {
        totalProductsCount: 0,
        totalLowStockProductsCount: 0,
        totalOutOfStockProductsCount: 0,
        totalActiveProductsCount: 0
      },
      pageNumber: 1,
      pageSize: 10,
      totalPages: 0,
      allBrands: []
    }));

    await TestBed.configureTestingModule({
      imports: [ProductManagementComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: NgbModal, useValue: jasmine.createSpyObj('NgbModal', ['open']) },
        { provide: AdminApiService, useValue: adminApiService },
        { provide: ToastService, useValue: jasmine.createSpyObj('ToastService', ['error', 'success', 'info']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
