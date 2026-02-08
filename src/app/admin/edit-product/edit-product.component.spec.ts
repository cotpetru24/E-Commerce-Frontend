import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProductComponent } from './edit-product.component';
import { ToastService } from '../../services/toast.service';
import { AdminProductApiService } from '../../services/api';
import { AdminProductDto } from '@dtos/product.dto';

describe('EditProduct', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let adminProductApiService: jasmine.SpyObj<AdminProductApiService>;

  const mockProduct: AdminProductDto = {
    id: 1,
    name: 'Test Product',
    description: 'Test',
    price: 100,
    originalPrice: null,
    totalStock: 0,
    brandId: 1,
    brandName: 'Test Brand',
    audience: null,
    rating: null,
    reviewCount: null,
    productSizes: [],
    productFeatures: [],
    productImages: [],
    isNew: false,
    discountPercentage: 0,
    selected: false,
    isActive: true,
    createdAt: null,
    updatedAt: null,
  };

  beforeEach(async () => {
    adminProductApiService = jasmine.createSpyObj('AdminProductApiService', [
      'getProductById',
      'updateProduct',
      'getProductBrands',
    ]);
    adminProductApiService.getProductBrands.and.returnValue(of([]));
    adminProductApiService.getProductById.and.returnValue(of(mockProduct));

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
                get: jasmine.createSpy().and.returnValue('1'),
              },
            },
            params: of({}),
            queryParams: of({}),
          },
        },
        {
          provide: NgbModal,
          useValue: jasmine.createSpyObj('NgbModal', ['open']),
        },
        {
          provide: ToastService,
          useValue: jasmine.createSpyObj('ToastService', [
            'error',
            'success',
            'info',
          ]),
        },
        { provide: AdminProductApiService, useValue: adminProductApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
