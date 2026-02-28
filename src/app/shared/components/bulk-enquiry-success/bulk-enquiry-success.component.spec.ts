import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkEnquirySuccessComponent } from './bulk-enquiry-success.component';

describe('BulkEnquirySuccessComponent', () => {
  let component: BulkEnquirySuccessComponent;
  let fixture: ComponentFixture<BulkEnquirySuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkEnquirySuccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkEnquirySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
