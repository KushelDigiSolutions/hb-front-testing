import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CrossIconComponent } from '../../my-svg/cross-icon/cross-icon.component';
import { LastTwoDigitsPipe } from '../../pipes/last-two-digits.pipe';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CommonService } from '../../services/common.service';
import { GuestCartService } from '../../services/guest-cart.service';
import { OneSignal } from 'onesignal-ngx';

@Component({
  selector: 'app-login-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LastTwoDigitsPipe,
    CrossIconComponent,
  ],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.scss'
})
export class LoginPopupComponent implements AfterViewInit {

  @ViewChild('mobileInput') mobileInput: ElementRef<HTMLInputElement>
  @ViewChild('otpInput') otpInput: ElementRef<HTMLInputElement>


  @Output('close') onClose = new EventEmitter()
  @Output('success') onSuccess = new EventEmitter()

  activeForm: 'mobile' | 'otp' | null = 'mobile'
  otpSending = false
  submitting = false
  otpResending = false

  userMobile = ''
  enteredOtp = ''
  otpVerificationTokan = ''
  userDeliverLocation: boolean;
  guestDeliverLocation: any
  firstTimeUser: boolean;

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private toaster: ToastrService,
    private guestCartService: GuestCartService,
    private oneSignal: OneSignal,
  ) { }

  ngAfterViewInit(): void {
    this.mobileInput.nativeElement?.focus()
  }

  getOTPForUserLogin() {
    // Call the API if API response received then open 2nd body to verify the OTP
    let body = {
      "phone": this.userMobile,
      "logintType": "mobileOtpLogin",
      "countryCode": "+91",
    }
    this.otpSending = true
    this.cartService.checkUser(body).subscribe((res: any) => {
      if (this.otpResending) {
        this.toaster.success('OTP resent successfully')
      }
      this.otpSending = false
      this.otpResending = false
      if (res) {
        this.otpVerificationTokan = res.data.confirmationToken;
        this.activeForm = 'otp'
        setTimeout(() => {
          this.otpInput.nativeElement?.focus()
        }, 500)
      }
    }, (e) => {
      this.otpResending = false
      this.otpSending = false
    });

  }

  resendOtp() {
    if (this.otpResending) return;
    this.otpResending = true
    this.getOTPForUserLogin()
  }

  submitOTP() {
    let guestCart = this.guestCartService.getGuestCart();
    let verifyOTPBody = {
      "otp": this.enteredOtp,
      "verificationToken": this.otpVerificationTokan,
      "cartId": guestCart?._id || null
    }
    this.submitting = true
    this.cartService.LoginVerifyOTP(verifyOTPBody).subscribe((res: any) => {
      this.submitting = false
      this.guestCartService.removeGuestCart()
      if (res) {
        this.oneSignal.User.addTag('phone', this.userMobile)
        this.activeForm = null
        this.authService.onLoggedIn(res.data);
        this.firstTimeUser = res.data.firstTimeUserForOrder;
        console.log("User Status >>>>", this.firstTimeUser);
        setTimeout(() => {
          this.closeVerificationModal();
        }, 5000);

        this.commonService.setLoginState(true);
        // let userLoggedIn: any = localStorage.getItem('userData');
        let userLoggedIn: any = this.commonService.getUser();
        if (userLoggedIn) {
          let guestLocation: any = localStorage.getItem('guestUserLocation');
          localStorage.setItem('firstTimeUser', JSON.stringify(this.firstTimeUser));
          guestLocation = JSON.parse(guestLocation)
          if (guestLocation) {
            this.commonService.addUserCurrentLocation(guestLocation).subscribe((res: any) => {
              if (res) {
                localStorage.setItem('userLocation', JSON.stringify(guestLocation));
                this.getDeliverLocation();
              }
              localStorage.removeItem('guestUserLocation');
            });
          }
        }
        this.onSuccess.emit()

      }
    }, error => {
      this.submitting = false
    });
  }

  closeVerificationModal() {
    this.onClose.emit()
  }

  changeMobileNo() {
    this.activeForm = 'mobile'
  }

  getDeliverLocation() {
    let userLoggedIn = this.commonService.getUser();
    if (userLoggedIn) {
      this.commonService.getUserCurrentLocation().subscribe((res: any) => {
        if (res) {
          this.userDeliverLocation = res.location;
          console.log('loggin user location', this.userDeliverLocation);
        }
      }, error => {
        console.log(error);
      })
    } else {
      let guestLocationParse: any = localStorage.getItem('guestUserLocation');
      this.guestDeliverLocation = JSON.parse(guestLocationParse);
    }
  }

}