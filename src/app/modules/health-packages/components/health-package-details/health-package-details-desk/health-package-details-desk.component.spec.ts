import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthPackageDetailsDeskComponent } from './health-package-details-desk.component';

describe('HealthPackageDetailsDeskComponent', () => {
  let component: HealthPackageDetailsDeskComponent;
  let fixture: ComponentFixture<HealthPackageDetailsDeskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthPackageDetailsDeskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthPackageDetailsDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
