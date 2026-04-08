import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountStripComponent } from './discount-strip.component';

describe('DiscountStripComponent', () => {
  let component: DiscountStripComponent;
  let fixture: ComponentFixture<DiscountStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountStripComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscountStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
