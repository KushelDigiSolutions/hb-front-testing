import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalBulkEnquiryComponent } from './international-bulk-enquiry.component';

describe('InternationalBulkEnquiryComponent', () => {
  let component: InternationalBulkEnquiryComponent;
  let fixture: ComponentFixture<InternationalBulkEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternationalBulkEnquiryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InternationalBulkEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
