import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthPackageSubscriptionComponent } from './health-package-subscription.component';

describe('HealthPackageSubscriptionComponent', () => {
  let component: HealthPackageSubscriptionComponent;
  let fixture: ComponentFixture<HealthPackageSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthPackageSubscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthPackageSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
