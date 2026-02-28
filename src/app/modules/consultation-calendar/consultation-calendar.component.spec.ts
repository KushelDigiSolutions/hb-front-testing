import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationCalendarComponent } from './consultation-calendar.component';

describe('ConsultationCalendarComponent', () => {
  let component: ConsultationCalendarComponent;
  let fixture: ComponentFixture<ConsultationCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultationCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
