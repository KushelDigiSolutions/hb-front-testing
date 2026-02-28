import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateSlotSelectorComponent } from './date-slot-selector.component';

describe('DateSlotSelectorComponent', () => {
  let component: DateSlotSelectorComponent;
  let fixture: ComponentFixture<DateSlotSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateSlotSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DateSlotSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
