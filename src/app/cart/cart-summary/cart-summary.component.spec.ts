import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartSummaryComponent } from './cart-summary.component';

describe('CartSummary', () => {
  let component: CartSummaryComponent;
  let fixture: ComponentFixture<CartSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSummaryComponent],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartSummaryComponent);
    component = fixture.componentInstance;
    
    // Spy on component template methods before detectChanges
    spyOn(component, 'getTotalItems').and.returnValue(0);
    spyOn(component, 'getSubtotal').and.returnValue(0);
    spyOn(component, 'getShippingCost').and.returnValue(0);
    spyOn(component, 'getDiscount').and.returnValue(0);
    spyOn(component, 'getTotal').and.returnValue(0);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
