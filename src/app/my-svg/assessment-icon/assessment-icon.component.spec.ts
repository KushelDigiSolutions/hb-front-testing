import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentIconComponent } from './assessment-icon.component';

describe('AssessmentIconComponent', () => {
  let component: AssessmentIconComponent;
  let fixture: ComponentFixture<AssessmentIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessmentIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
