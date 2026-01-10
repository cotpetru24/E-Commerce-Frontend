import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ProductApiService } from '../../services/api';

describe('ProductList', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    const productApiService = jasmine.createSpyObj('ProductApiService', [
      'getProducts',
      'getFeaturedProducts',
    ]);
    productApiService.getProducts.and.returnValue(
      of({ products: [], brands: [] })
    );

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
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
          provide: CartService,
          useValue: jasmine.createSpyObj('CartService', [
            'addToCart',
            'getCartItems',
          ]),
        },
        {
          provide: ToastService,
          useValue: jasmine.createSpyObj('ToastService', [
            'error',
            'success',
            'info',
          ]),
        },
        { provide: ProductApiService, useValue: productApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
