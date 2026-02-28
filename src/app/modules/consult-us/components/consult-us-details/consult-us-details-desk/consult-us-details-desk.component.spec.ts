import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultUsDetailsDeskComponent } from './consult-us-details-desk.component';

describe('ConsultUsDetailsDeskComponent', () => {
  let component: ConsultUsDetailsDeskComponent;
  let fixture: ComponentFixture<ConsultUsDetailsDeskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultUsDetailsDeskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultUsDetailsDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
