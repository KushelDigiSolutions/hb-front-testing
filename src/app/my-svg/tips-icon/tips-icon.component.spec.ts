import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsIconComponent } from './tips-icon.component';

describe('TipsIconComponent', () => {
  let component: TipsIconComponent;
  let fixture: ComponentFixture<TipsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipsIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
