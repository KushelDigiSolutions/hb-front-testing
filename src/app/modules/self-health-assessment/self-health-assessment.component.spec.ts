import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfHealthAssessmentComponent } from './self-health-assessment.component';

describe('SelfHealthAssessmentComponent', () => {
  let component: SelfHealthAssessmentComponent;
  let fixture: ComponentFixture<SelfHealthAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfHealthAssessmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelfHealthAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
