import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentErrorBoxComponent } from './payment-error-box.component';

describe('PaymentErrorBoxComponent', () => {
  let component: PaymentErrorBoxComponent;
  let fixture: ComponentFixture<PaymentErrorBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentErrorBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentErrorBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
