import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifestyleTipsDetailsComponent } from './lifestyle-tips-details.component';

describe('LifestyleTipsDetailsComponent', () => {
  let component: LifestyleTipsDetailsComponent;
  let fixture: ComponentFixture<LifestyleTipsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifestyleTipsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LifestyleTipsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
