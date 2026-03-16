import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import { FileUploadResponse } from "../../../../services/cart.service";
// import { FileUploadResponse } from "../modules/user-dashboard/user-dashboard.service";
// import { ApiService } from "../services/api.service";

@Injectable({
  providedIn: "root",
})
export class ModalsService {
  constructor(
    private http: HttpClient,
  ) { }

  /** File Upload API */
  fileUpload(files: File[], folder: string) {
    let fd = new FormData();
    for (let file of files) {
      fd.append("file", file);
    }
    fd.append("folder", folder);
    return this.http.post<FileUploadResponse>(
      `${environment.apiUrl}upload`,
      fd
    );
  }

  /**Coupon Related API */
  // getCouponList(data: any) {
  //   return this.http.post(`${environment.apiUrl}coupons/list`, data);
  // }
  // applyCoupon(data: any) {
  //   return this.http.post(`${environment.apiUrl}coupons/applycoupon`, data);
  // }

  // verifyCouponOtp(otp: string) {
  //   return this.api.post('coupons/verifyotp', { otp })
  // }

  // /**Edit Profile Related API */
  getOTP(data: any) {
    return this.http.post(`${environment.apiUrl}users/getotp`, data);
  }
  getOTPForChangePassword(data: any) {
    return this.http.post(
      `${environment.apiUrl}users/getotpforchangepassword`,
      data
    );
  }
  changeNumber(data: any) {
    return this.http.put(`${environment.apiUrl}users/changephone`, data);
  }
  changeEmail(data: any) {
    return this.http.put(`${environment.apiUrl}users/changeemail`, data);
  }
  // changePassword(data: any) {
  //   return this.http.put(`${environment.apiUrl}users/changepassword`, data);
  // }
  // forgotPassword(data: any) {
  //   return this.http.post(`${environment.apiUrl}auth/forgotPassword`, data);
  // }
  // resetPassword(data: any) {
  //   return this.http.post(`${environment.apiUrl}auth/resetPassword`, data);
  // }
  // /**Gift Related API */
  // addGift(data) {
  //   return this.http.post(`${environment.apiUrl}carts/addgift`, data);
  // }

  // /**Order Related API */
  // cancelOrder(data) {
  //   return this.http.post(`${environment.apiUrl}orders/cancel`, data);
  // }
}
