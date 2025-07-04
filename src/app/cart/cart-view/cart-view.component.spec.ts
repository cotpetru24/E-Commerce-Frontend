import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartViewComponent } from './cart-view.component';

describe('CartView', () => {
  let component: CartViewComponent;
  let fixture: ComponentFixture<CartViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
