import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHealthStatsComponent } from './add-health-stats.component';

describe('AddHealthStatsComponent', () => {
  let component: AddHealthStatsComponent;
  let fixture: ComponentFixture<AddHealthStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHealthStatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddHealthStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
