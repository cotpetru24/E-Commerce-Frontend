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
  let adminProductApiService: jasmine.SpyObj<AdminProductApiService>;

  beforeEach(async () => {
    adminProductApiService = jasmine.createSpyObj('AdminProductApiService', [
      'createProduct',
      'getProductBrands',
    ]);
    adminProductApiService.getProductBrands.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AddProductComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: NgbModal,
          useValue: jasmine.createSpyObj('NgbModal', ['open']),
        },
        { provide: AdminProductApiService, useValue: adminProductApiService },
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
