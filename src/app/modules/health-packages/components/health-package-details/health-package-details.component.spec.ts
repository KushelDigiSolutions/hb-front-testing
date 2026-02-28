import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthPackageDetailsComponent } from './health-package-details.component';

describe('HealthPackageDetailsComponent', () => {
  let component: HealthPackageDetailsComponent;
  let fixture: ComponentFixture<HealthPackageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthPackageDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthPackageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
