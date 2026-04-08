import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescribedProductsComponent } from './prescribed-products.component';

describe('PrescribedProductsComponent', () => {
  let component: PrescribedProductsComponent;
  let fixture: ComponentFixture<PrescribedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescribedProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrescribedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
