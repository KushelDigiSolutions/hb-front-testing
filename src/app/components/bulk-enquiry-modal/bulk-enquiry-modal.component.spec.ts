import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkEnquiryModalComponent } from './bulk-enquiry-modal.component';

describe('BulkEnquiryModalComponent', () => {
  let component: BulkEnquiryModalComponent;
  let fixture: ComponentFixture<BulkEnquiryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkEnquiryModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkEnquiryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
