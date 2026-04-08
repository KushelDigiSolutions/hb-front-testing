import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopIconComponent } from './shop-icon.component';

describe('ShopIconComponent', () => {
  let component: ShopIconComponent;
  let fixture: ComponentFixture<ShopIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShopIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
