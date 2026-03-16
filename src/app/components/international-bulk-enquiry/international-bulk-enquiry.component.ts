import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CrossIconComponent } from '../../my-svg/cross-icon/cross-icon.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-international-bulk-enquiry',
  standalone: true,
  imports: [CrossIconComponent, FormsModule, CommonModule],
  templateUrl: './international-bulk-enquiry.component.html',
  styleUrl: './international-bulk-enquiry.component.scss',
})
export class InternationalBulkEnquiryComponent {
  @Output('close') onClose = new EventEmitter();
  @Output('success') onSuccess = new EventEmitter();
  @Input() product?: any;

  name = '';
  mobile = '';
  email = '';
  enquiry = '';
  otp: string = '';
  selectedType: '';
  selectedTypeLabel = 'Weight (Kg)';
  submitting: boolean = false;
  emailValidated: boolean = false;
  otpSent: boolean = false;
  otpResending: boolean = false;
  isOtpScreen: boolean = false;
  token: string = '';
  quantity: number = 0;
  errors: Partial<{
    email: string;
    enquiry: string;
    quantity: string;
    name: string;
  }> = {};
  isError: boolean = false;
  loading: boolean = false;
  existingEmail: boolean = false;

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private productService: ProductService,
    private toaster: ToastrService,
    private router: Router
  ) {}

  closeVerificationModal() {
    this.onClose.emit();
  }

  validation() {
    this.isError = false;
    this.errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || this.email == '') {
      this.isError = true;
      this.errors['email'] = 'Please enter your email.';
    } else if (!emailRegex.test(this.email)) {
      this.isError = true;
      this.errors['email'] = 'Please enter a valid email.';
    }
    if (this.quantity == 0 || !this.quantity) {
      this.isError = true;
      this.errors['quantity'] = 'Please enter a quantity more than 0.';
    }
    if (this.name == '' || !this.name) {
      this.isError = true;
      this.errors['name'] = 'Please enter your name';
    }
  }

  sendOtp() {
    this.loading = true;
    if (!this.email) {
      this.isError = true;
      this.errors['email'] = 'Please enter your email';
    } else {
      const formData = {
        email: this.email,
      };
      this.isOtpScreen = true;
      this.authService.getEmailOtp(formData).subscribe(
        (res: any) => {
          const { data } = res;
          this.token = data.token;
        },
        (error) => {
          if (error.status === 409) {
            this.loading = false;
            this.isOtpScreen = false;
            this.emailValidated = true;
            this.existingEmail = true;
          }
        }
      );
    }
  }

  resendOtp() {
    this.otpResending = true;
    setTimeout(() => {
      this.otpResending = false;
    }, 5000);
  }

  submitOtp() {
    const formData = {
      token: this.token,
      otp: parseInt(this.otp),
      email: this.email,
    };
    this.submitting = true;
    this.authService.verifyEmailOtp(formData).subscribe((res: any) => {
      if (res.success) {
        this.submitting = false;
        this.isOtpScreen = false;
        this.existingEmail = true;
        this.emailValidated = true;
      }
    });
  }

  // selectType(type: 'kg' | 'tonne' | '') {
  //   this.selectedType = type;
  //   this.selectedTypeLabel = type;
  // }

  sendEnquiry() {
    this.validation();
    if (!this.isError) {
      let formData: any = {
        name: this.name,
        email: this.email,
        comment: this.enquiry,
        productId: this.product?._id,
        productName: this.product?.name,
        weight: this.selectedType,
        quantity: this.quantity,
      };

      this.productService
        .internationalEnquiry(formData)
        .subscribe((res: any) => {
          if (res.success) {
            this.closeVerificationModal();
            this.router.navigate(['/international-enquiry-success'], {
              queryParams: { refId: res.data.enquiryId },
            });
          }
        });
    }
  }

  clearError(field: keyof typeof this.errors) {
    if (this.errors[field]) {
      delete this.errors[field];
    }
  }
}
