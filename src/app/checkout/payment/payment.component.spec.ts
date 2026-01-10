import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { CartService } from '../../services/cart.service';
import { PaymentApiService } from '../../services/api/payment-api.service';
import { OrderApiService } from '../../services/api/order-api.service';
import { ToastService } from '../../services/toast.service';
import { StorageService } from '../../services/storage.service';

describe('PaymentMethod', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;
  let cartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    cartService = jasmine.createSpyObj('CartService', [
      'getCartItems',
      'clearCart',
      'getSubtotal',
      'getDiscount',
      'getTotal',
    ]);
    cartService.getCartItems.and.returnValue([]);
    cartService.getSubtotal.and.returnValue(0);
    cartService.getDiscount.and.returnValue(0);
    cartService.getTotal.and.returnValue(0);

    await TestBed.configureTestingModule({
      imports: [PaymentComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: CartService, useValue: cartService },
        {
          provide: PaymentApiService,
          useValue: jasmine.createSpyObj('PaymentApiService', [
            'createPaymentIntent',
          ]),
        },
        {
          provide: OrderApiService,
          useValue: jasmine.createSpyObj('OrderApiService', ['placeOrder']),
        },
        {
          provide: ToastService,
          useValue: jasmine.createSpyObj('ToastService', [
            'error',
            'success',
            'info',
          ]),
        },
        {
          provide: StorageService,
          useValue: jasmine.createSpyObj('StorageService', [
            'getLocalObject',
            'removeLocalObject',
            'getSessionItem',
          ]),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
