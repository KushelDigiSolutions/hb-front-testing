import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsDeskComponent } from './product-details-desk.component';

describe('ProductDetailsDeskComponent', () => {
  let component: ProductDetailsDeskComponent;
  let fixture: ComponentFixture<ProductDetailsDeskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsDeskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductDetailsDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
