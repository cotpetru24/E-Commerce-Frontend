import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { RegisterComponent } from './register.component';
import { ToastService } from '../../services/toast.service';
import { AuthApiService } from '../../services/auth-api.service';

describe('Register', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ToastService, useValue: jasmine.createSpyObj('ToastService', ['error', 'success', 'info']) },
        { provide: AuthApiService, useValue: jasmine.createSpyObj('AuthApiService', ['register']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
