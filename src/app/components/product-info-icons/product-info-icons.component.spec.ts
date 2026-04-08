import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInfoIconsComponent } from './product-info-icons.component';

describe('ProductInfoIconsComponent', () => {
  let component: ProductInfoIconsComponent;
  let fixture: ComponentFixture<ProductInfoIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInfoIconsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductInfoIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
