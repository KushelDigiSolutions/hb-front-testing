import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeStyleHealthCardComponent } from './life-style-health-card.component';

describe('LifeStyleHealthCardComponent', () => {
  let component: LifeStyleHealthCardComponent;
  let fixture: ComponentFixture<LifeStyleHealthCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifeStyleHealthCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LifeStyleHealthCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
