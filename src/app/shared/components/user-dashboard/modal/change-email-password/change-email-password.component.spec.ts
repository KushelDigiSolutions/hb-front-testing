import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeEmailPasswordComponent } from './change-email-password.component';

describe('ChangeEmailPasswordComponent', () => {
  let component: ChangeEmailPasswordComponent;
  let fixture: ComponentFixture<ChangeEmailPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeEmailPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeEmailPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
