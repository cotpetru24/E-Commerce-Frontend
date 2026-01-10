import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CartViewComponent } from './cart-view.component';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { AuthApiService } from '../../services/auth-api.service';

describe('CartView', () => {
  let component: CartViewComponent;
  let fixture: ComponentFixture<CartViewComponent>;

  beforeEach(async () => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', [
      'removeFromCart',
      'updateQuantity',
      'clearCart',
      'getCartItemCount',
      'getSubtotal',
      'getShippingCost',
      'getDiscount',
      'getTotal',
    ]);
    cartServiceSpy.cartItems$ = of([]);
    cartServiceSpy.getCartItemCount.and.returnValue(0);
    cartServiceSpy.getSubtotal.and.returnValue(0);
    cartServiceSpy.getShippingCost.and.returnValue(0);
    cartServiceSpy.getDiscount.and.returnValue(0);
    cartServiceSpy.getTotal.and.returnValue(0);

    await TestBed.configureTestingModule({
      imports: [CartViewComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: CartService, useValue: cartServiceSpy },
        {
          provide: ToastService,
          useValue: jasmine.createSpyObj('ToastService', [
            'error',
            'success',
            'info',
          ]),
        },
        {
          provide: AuthApiService,
          useValue: jasmine.createSpyObj('AuthApiService', ['isAuthenticated']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartViewComponent);
    component = fixture.componentInstance;

    spyOn(component, 'getItemTotal').and.returnValue(0);
    spyOn(component, 'getTotalItems').and.returnValue(0);
    spyOn(component, 'getSubtotal').and.returnValue(0);
    spyOn(component, 'getShippingCost').and.returnValue(0);
    spyOn(component, 'getDiscount').and.returnValue(0);
    spyOn(component, 'getTotal').and.returnValue(0);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
