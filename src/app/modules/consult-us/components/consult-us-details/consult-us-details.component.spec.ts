import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultUsDetailsComponent } from './consult-us-details.component';

describe('ConsultUsDetailsComponent', () => {
  let component: ConsultUsDetailsComponent;
  let fixture: ComponentFixture<ConsultUsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultUsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultUsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
