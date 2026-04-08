import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDotIconComponent } from './three-dot-icon.component';

describe('ThreeDotIconComponent', () => {
  let component: ThreeDotIconComponent;
  let fixture: ComponentFixture<ThreeDotIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreeDotIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThreeDotIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
