import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { LandingPageComponent } from './landing-page.component';
import { CartService } from '../services/cart.service';
import { ToastService } from '../services/toast.service';
import { ProductApiService } from '../services/api';
import { CmsApiService } from '../services/api/cms-api.service';
import { CmsLandingPageDto } from '../models/cms.dto';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let productApiService: jasmine.SpyObj<ProductApiService>;
  let cmsApiService: jasmine.SpyObj<CmsApiService>;

  beforeEach(async () => {
    productApiService = jasmine.createSpyObj('ProductApiService', ['getFeaturedProducts']);
    productApiService.getFeaturedProducts.and.returnValue(of({ products: [], brands: [] }));

    cmsApiService = jasmine.createSpyObj('CmsApiService', ['getCmsLandingPageAsync']);
    cmsApiService.getCmsLandingPageAsync.and.returnValue(of({} as CmsLandingPageDto));

    await TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: CartService, useValue: jasmine.createSpyObj('CartService', ['addToCart']) },
        { provide: ToastService, useValue: jasmine.createSpyObj('ToastService', ['error', 'success', 'info']) },
        { provide: ProductApiService, useValue: productApiService },
        { provide: CmsApiService, useValue: cmsApiService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
