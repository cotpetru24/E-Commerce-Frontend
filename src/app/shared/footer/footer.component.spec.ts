import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FooterComponent } from './footer.component';
import { ToastService } from '../../services/toast.service';
import { CmsStateService } from '../../services/cmsStateService';

describe('Footer', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let cmsStateService: jasmine.SpyObj<CmsStateService>;

  beforeEach(async () => {
    cmsStateService = jasmine.createSpyObj('CmsStateService', ['getCmsProfile', 'setProfile']);
    cmsStateService.cmsProfile$ = of({} as any);

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        provideRouter([]),
        { provide: ToastService, useValue: jasmine.createSpyObj('ToastService', ['error', 'success', 'info']) },
        { provide: CmsStateService, useValue: cmsStateService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
