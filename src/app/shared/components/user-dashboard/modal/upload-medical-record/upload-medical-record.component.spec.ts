import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMedicalRecordComponent } from './upload-medical-record.component';

describe('UploadMedicalRecordComponent', () => {
  let component: UploadMedicalRecordComponent;
  let fixture: ComponentFixture<UploadMedicalRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadMedicalRecordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadMedicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
