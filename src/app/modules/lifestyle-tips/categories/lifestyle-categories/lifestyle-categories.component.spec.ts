import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifestyleCategoriesComponent } from './lifestyle-categories.component';

describe('LifestyleCategoriesComponent', () => {
  let component: LifestyleCategoriesComponent;
  let fixture: ComponentFixture<LifestyleCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifestyleCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LifestyleCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
