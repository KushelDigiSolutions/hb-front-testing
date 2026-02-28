import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHealthStatsComponent } from './user-health-stats.component';

describe('UserHealthStatsComponent', () => {
  let component: UserHealthStatsComponent;
  let fixture: ComponentFixture<UserHealthStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHealthStatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserHealthStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
