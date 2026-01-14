import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { AuthApiService } from '../../services/auth-api.service';
import { CmsStateService } from '../../services/cmsStateService';

describe('Navbar', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let cmsStateService: jasmine.SpyObj<CmsStateService>;

  beforeEach(async () => {
    cartService = jasmine.createSpyObj('CartService', [
      'getCartItems',
      'getCartItemCount',
    ]);
    cartService.getCartItems.and.returnValue([]);
    cartService.getCartItemCount.and.returnValue(0);
    cartService.cartItems$ = of([]);

    cmsStateService = jasmine.createSpyObj('CmsStateService', [
      'getCmsProfile',
      'setProfile',
    ]);
    cmsStateService.cmsProfile$ = of({} as any);

    const authApiService = jasmine.createSpyObj('AuthApiService', [
      'logout',
      'isAuthenticated',
      'isLoggedIn',
      'isAdmin',
    ]);
    authApiService.isLoggedIn.and.returnValue(false);
    authApiService.isAdmin.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: CartService, useValue: cartService },
        {
          provide: ToastService,
          useValue: jasmine.createSpyObj('ToastService', [
            'error',
            'success',
            'info',
          ]),
        },
        { provide: AuthApiService, useValue: authApiService },
        { provide: CmsStateService, useValue: cmsStateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;

    spyOn(component, 'isLoggedIn').and.returnValue(false);
    spyOn(component, 'isAdmin').and.returnValue(false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
