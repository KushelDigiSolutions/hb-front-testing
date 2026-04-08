import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelIconComponent } from './hotel-icon.component';

describe('HotelIconComponent', () => {
  let component: HotelIconComponent;
  let fixture: ComponentFixture<HotelIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HotelIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
