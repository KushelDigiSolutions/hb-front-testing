import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarRatingComponentComponent } from './star-rating-component.component';

describe('StarRatingComponentComponent', () => {
  let component: StarRatingComponentComponent;
  let fixture: ComponentFixture<StarRatingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarRatingComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StarRatingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
