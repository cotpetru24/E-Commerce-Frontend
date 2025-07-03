import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutReview } from './checkout-review.component';

describe('CheckoutReview', () => {
  let component: CheckoutReview;
  let fixture: ComponentFixture<CheckoutReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
