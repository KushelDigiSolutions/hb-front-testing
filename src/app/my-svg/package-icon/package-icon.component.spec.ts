import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageIconComponent } from './package-icon.component';

describe('PackageIconComponent', () => {
  let component: PackageIconComponent;
  let fixture: ComponentFixture<PackageIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
