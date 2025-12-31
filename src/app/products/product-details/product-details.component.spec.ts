import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProductDetailsComponent } from './product-details.component';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ProductApiService } from '../../services/api';

describe('ProductDetails', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let productApiService: jasmine.SpyObj<ProductApiService>;

  beforeEach(async () => {
    productApiService = jasmine.createSpyObj('ProductApiService', ['getProductById']);
    productApiService.getProductById.and.returnValue(of({ product: null, relatedProducts: [] }));

    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
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
            params: of({ id: '1' }),
            queryParams: of({})
          }
        },
        { provide: CartService, useValue: jasmine.createSpyObj('CartService', ['addToCart']) },
        { provide: ToastService, useValue: jasmine.createSpyObj('ToastService', ['error', 'success', 'info']) },
        { provide: ProductApiService, useValue: productApiService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    
    // Spy on component template methods before detectChanges
    spyOn(component, 'getDiscountPercentage').and.returnValue(0);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
