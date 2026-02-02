import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProductComponent } from './add-product.component';
import { AdminProductApiService } from '../../services/api/';
import { ToastService } from '../../services/toast.service';
import { StorageService } from '../../services/storage.service';

describe('AddProduct', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let adminApiService: jasmine.SpyObj<AdminProductApiService>;

  beforeEach(async () => {
    adminApiService = jasmine.createSpyObj('AdminApiService', [
      'createProduct',
      'getProductBrands',
      'getProductAudience',
    ]);
    adminApiService.getProductBrands.and.returnValue(of([]));
    adminApiService.getProductAudience.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AddProductComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: NgbModal,
          useValue: jasmine.createSpyObj('NgbModal', ['open']),
        },
        { provide: AdminProductApiService, useValue: adminApiService },
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
            'setLocalObject',
            'getLocalObject',
          ]),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
