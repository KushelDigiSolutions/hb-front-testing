import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultUsCategoriesComponent } from './consult-us-categories.component';

describe('ConsultUsCategoriesComponent', () => {
  let component: ConsultUsCategoriesComponent;
  let fixture: ComponentFixture<ConsultUsCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultUsCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultUsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
