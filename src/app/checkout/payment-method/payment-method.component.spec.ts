import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodComponent } from './payment-method.component';

describe('PaymentMethod', () => {
  let component: PaymentMethodComponent;
  let fixture: ComponentFixture<PaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
