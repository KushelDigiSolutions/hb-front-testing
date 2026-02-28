import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalEnquirySuccessComponent } from './international-enquiry-success.component';

describe('InternationalEnquirySuccessComponent', () => {
  let component: InternationalEnquirySuccessComponent;
  let fixture: ComponentFixture<InternationalEnquirySuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternationalEnquirySuccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InternationalEnquirySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
