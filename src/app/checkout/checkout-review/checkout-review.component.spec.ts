import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutReviewComponent } from './checkout-review.component';

describe('CheckoutReview', () => {
  let component: CheckoutReviewComponent;
  let fixture: ComponentFixture<CheckoutReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
