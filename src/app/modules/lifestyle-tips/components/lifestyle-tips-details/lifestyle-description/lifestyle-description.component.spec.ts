import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifestyleDescriptionComponent } from './lifestyle-description.component';

describe('LifestyleDescriptionComponent', () => {
  let component: LifestyleDescriptionComponent;
  let fixture: ComponentFixture<LifestyleDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifestyleDescriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LifestyleDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
