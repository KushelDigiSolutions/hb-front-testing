import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPageHeadComponent } from './category-page-head.component';

describe('CategoryPageHeadComponent', () => {
  let component: CategoryPageHeadComponent;
  let fixture: ComponentFixture<CategoryPageHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryPageHeadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryPageHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
