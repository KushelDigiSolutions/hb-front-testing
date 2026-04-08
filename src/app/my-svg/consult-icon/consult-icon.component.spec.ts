import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultIconComponent } from './consult-icon.component';

describe('ConsultIconComponent', () => {
  let component: ConsultIconComponent;
  let fixture: ComponentFixture<ConsultIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
