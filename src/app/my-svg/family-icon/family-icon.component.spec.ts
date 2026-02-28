import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyIconComponent } from './family-icon.component';

describe('FamilyIconComponent', () => {
  let component: FamilyIconComponent;
  let fixture: ComponentFixture<FamilyIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FamilyIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
