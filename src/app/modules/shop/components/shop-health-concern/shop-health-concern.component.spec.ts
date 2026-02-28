import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopHealthConcernComponent } from './shop-health-concern.component';

describe('ShopHealthConcernComponent', () => {
  let component: ShopHealthConcernComponent;
  let fixture: ComponentFixture<ShopHealthConcernComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopHealthConcernComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShopHealthConcernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
