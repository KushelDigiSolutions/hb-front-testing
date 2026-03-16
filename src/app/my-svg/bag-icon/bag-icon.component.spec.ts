import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagIconComponent } from './bag-icon.component';

describe('BagIconComponent', () => {
  let component: BagIconComponent;
  let fixture: ComponentFixture<BagIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BagIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
