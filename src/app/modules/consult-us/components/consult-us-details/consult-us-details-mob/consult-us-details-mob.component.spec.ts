import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultUsDetailsMobComponent } from './consult-us-details-mob.component';

describe('ConsultUsDetailsMobComponent', () => {
  let component: ConsultUsDetailsMobComponent;
  let fixture: ComponentFixture<ConsultUsDetailsMobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultUsDetailsMobComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultUsDetailsMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
