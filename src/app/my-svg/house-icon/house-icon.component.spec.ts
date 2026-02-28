import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseIconComponent } from './house-icon.component';

describe('HouseIconComponent', () => {
  let component: HouseIconComponent;
  let fixture: ComponentFixture<HouseIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HouseIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
