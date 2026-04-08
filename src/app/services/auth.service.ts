import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './api.service';
import { CartService } from './cart.service';
import { CommonService } from './common.service';
// import * as EmailValidator from "email-validator";
// import { CartService } from 'src/app/services/cart.service';
// import { CartCountService } from 'src/app/services/cartCount/cart-count.service';
// import { CommonService } from 'src/app/services/common/common.service';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private api: ApiService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private cartService: CartService // private cartCount: CartCountService,
  ) {}

  //Check User
  checkuser(data: any) {
    return this.api.post(`auth/checkuser`, data);
  }

  //Register User
  registerUser(data: any) {
    return this.api.post(`auth/register`, data);
  }

  //Login User
  loginUser(data: any) {
    return this.api.post(`auth/login`, data);
  }

  //socialLogin
  socialLogin(data: any) {
    return this.api.post(`auth/socialLogin`, data);
  }

  //forgorPassword
  forgotPassword(data: any) {
    return this.api.post(`auth/forgotPassword`, data);
  }

  //resetPassword
  resetPassword(data: any) {
    return this.api.post(`auth/resetPassword`, data);
  }

  //requestOTP
  requestOTP(data: any) {
    return this.api.post(`auth/resendOtp`, data);
  }

  getUsernameType(value: any): 'email' | 'phone' | null {
    alert('Uncomment the code first');
    // let isEmail = EmailValidator.validate(value);
    // let phoneArray = phone(value, "");
    // console.log(value, isEmail, phoneArray);

    // if (isEmail) {
    //   return 'email'
    // } else if (phoneArray?.length) {
    //   return 'phone'
    // }
    return null;
  }

  onLoggedIn(data: any) {
    let userData = this.commonService.filterUserData(data);
    this.commonService.setUser(userData);
    this.commonService.setLoginState(true);
    console.log('Uncomment code onLoggedIn');
    this.cartService.removeGuestCart();
    // this.navigate();
    // this.cartCount.getCartCount();
    // this.cartCount.getWishlistCount();
  }

  navigate() {
    let { redirect, signup, ...queryParams } = this.route.snapshot.queryParams;
    if (redirect) {
      redirect = redirect.split('?');
      if (redirect[1]) {
        redirect[1].split('&').forEach((keyValue: any) => {
          let [key, value] = keyValue.split('=');
          queryParams[key] = value;
        });
      }
    } else {
      redirect = [];
    }

    this.router.navigate([redirect[0] || '/'], {
      replaceUrl: true,
      queryParams,
    });
  }

  getOtp(data: { phone: string }) {
    return this.api.post(`auth/generateotp`, data);
  }

  getEmailOtp(data: { email: string }) {
    return this.api.post(`auth/generateotp`, data);
  }

  verifyOtp(data: { token: string; otp: number; phone: string }) {
    return this.api.post('auth/otpVerification', data);
  }

  verifyEmailOtp(data: { token: string; otp: number; email: string }) {
    return this.api.post(`auth/otpVerification`, data);
  }
}
