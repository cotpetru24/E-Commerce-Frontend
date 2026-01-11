import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ShippingAddressComponent } from './shipping-address.component';
import { CartService } from '../../services/cart.service';
import { ShippingAddressApiService } from '../../services/api/shipping-address-api.service';
import { ToastService } from '../../services/toast.service';
import { StorageService } from '../../services/storage.service';

describe('AddressForm', () => {
  let component: ShippingAddressComponent;
  let fixture: ComponentFixture<ShippingAddressComponent>;
  let cartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    cartService = jasmine.createSpyObj('CartService', [
      'getCartItems',
      'getSubtotal',
      'getDiscount',
      'getTotal',
    ]);
    cartService.getCartItems.and.returnValue([]);
    cartService.getSubtotal.and.returnValue(0);
    cartService.getDiscount.and.returnValue(0);
    cartService.getTotal.and.returnValue(0);

    const shippingAddressApiService = jasmine.createSpyObj(
      'ShippingAddressApiService',
      ['createShippingAddress', 'getShippingAddresses']
    );
    shippingAddressApiService.getShippingAddresses.and.returnValue(of([]));

    const storageService = jasmine.createSpyObj('StorageService', [
      'getLocalObject',
      'setLocalObject',
      'getSessionItem',
    ]);
    storageService.getSessionItem.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [ShippingAddressComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: CartService, useValue: cartService },
        {
          provide: ShippingAddressApiService,
          useValue: shippingAddressApiService,
        },
        {
          provide: ToastService,
          useValue: jasmine.createSpyObj('ToastService', [
            'error',
            'success',
            'info',
          ]),
        },
        { provide: StorageService, useValue: storageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
