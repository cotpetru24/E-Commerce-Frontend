import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProductComponent } from './edit-product.component';
import { ToastService } from '../../services/toast.service';
import { AdminApiService } from '../../services/api/admin-api.service';

describe('EditProduct', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let adminApiService: jasmine.SpyObj<AdminApiService>;

  beforeEach(async () => {
    adminApiService = jasmine.createSpyObj('AdminApiService', ['getProductById', 'updateProduct', 'getProductBrands', 'getProductAudience']);
    adminApiService.getProductBrands.and.returnValue(of([]));
    adminApiService.getProductAudience.and.returnValue(of([]));
    adminApiService.getProductById.and.returnValue(of({
      id: 1,
      name: 'Test Product',
      description: 'Test',
      price: 100,
      brandId: 1,
      audienceId: 1,
      productSizes: [],
      productFeatures: [],
      productImages: [],
      isNew: false,
      discountPercentage: 0,
      selected: false,
      isActive: true,
      totalStock: 0
    }));

    await TestBed.configureTestingModule({
      imports: [EditProductComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jasmine.createSpy().and.returnValue('1')
              }
            },
            params: of({}),
            queryParams: of({})
          }
        },
        { provide: NgbModal, useValue: jasmine.createSpyObj('NgbModal', ['open']) },
        { provide: ToastService, useValue: jasmine.createSpyObj('ToastService', ['error', 'success', 'info']) },
        { provide: AdminApiService, useValue: adminApiService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
