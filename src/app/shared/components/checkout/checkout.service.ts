import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
// import { CommonService } from 'src/app/services/common/common.service';
import { environment } from '../../../../environments/environment';
import { CreateOrderData } from './checkout.component';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { CreatePaymentSessionIdResponse } from '../../types/xhr.types';


export interface CreateAppointmentData {
  consultantId: string;
  consultantSlug?: string;
  date: string;
  primaryTimeSlot: string;
  fee: number;
  startTime12?: string,
  endTime12?: string,
  appointmentMode?: 'audio' | 'video' | 'chat',
  healthPackageBuyId?: string,
}
export const LS_CHECKOUT = 'checkoutdata_v1'
export const LS_CONSULTCHECKOUT = 'consultcheckoutdata_v1'

export type CheckoutType = "order" | 'appointment' | 'diagnostic' | 'healthPackage';
export interface CheckoutProduct {
  checkoutFor: CheckoutType,
  productId?: string,
  quantity?: number,
  weight?: number | string,
  /** upper params are required for products */
  slug?: string,
  label?: string,
  /** appointment related params */
  // consultantId?: string,
  // primaryTimeSlot?: string,
  // date?: string,
  // apptFee?: number,
  // startTime12?: string,
  // endTime12?: string,
  // appointmentMode?: 'audio' | 'video' | 'chat',
  appointment?: CreateAppointmentData,
  /** diagnostic related params */
  diagnostic?: {
    testsId: string[],
    Pincode: string,
    OrderBy: string,
    Email: string,
    Mobile: string,
    Age: string,
    Gender: string,
    Address: string,
    ApptDate: string,
    mrp: number,
    sellingPrice: number,
    discount?: number,
    healthPackageBuyId?: string,
  }
  /** health package related params */
  healthPackage?: {
    _id: string,
    slug: string,
    name: string,
    mrp: number,
    sellingPrice: number,
    discount: number
    consultant: string,
    Pincode?: string,
    variationId?: string,
    testsId?: string[],
  }
}

export interface CheckoutData {
  coupon?: string,
  products: Array<CheckoutProduct>
}

export interface IWishList {
  _id: any,
  userId: any,
  products: any[]
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  headers: any = new HttpHeaders({
    'apikey': environment.apikey,
  });
  private wishlistSubject = new ReplaySubject<IWishList>(1);

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private commonService: CommonService,
  ) { }

  /***Cart Related Api */
  getUserCart(params: { [key: string]: any } = {}) {
    params = new HttpParams({ fromObject: params });
    return this.http.get(`${environment.apiUrl}carts`, { params });
  }

  getOrderDetails(id: string) {
    return this.http.get(`${environment.apiUrl}orders/detail`, {
      'headers': this.headers,
      'params': {
        '_id': id
      }
    });
  }
  getAppointmentDetails(id: string) {
    // api/v2/appointments/detail?_id=6367373
    return this.http.get(`${environment.apiUrl}appointments/detail`, {
      'headers': this.headers,
      'params': {
        '_id': id
      }
    });
  }

  deleteCart() {
    return this.http.delete(`${environment.apiUrl}carts`);
  }

  /**User Related API */
  checkUser(data: any) {
    return this.http.post(`${environment.apiUrl}auth/checkuser`, data);
  }
  loginUser(data: any) {
    return this.http.post(`${environment.apiUrl}auth/login`, data);
  }
  registerUser(data: any) {
    return this.http.post(`${environment.apiUrl}auth/register`, data);
  }
  getUserAddress() {
    return this.http.get(`${environment.apiUrl}users/address`);
  }
  addUserAddress(data: any) {
    return this.http.post(`${environment.apiUrl}users/address`, data);
  }
  getUserAddressArea(code: any) {
    return this.http.get(`${environment.apiUrl}users/getaddress?pincode=${code}`);
  }
  requestOTP(data: any) {
    return this.http.post(`${environment.apiUrl}auth/resendOtp`, data);
  }
  forgotPassword(data: any) {
    return this.http.post(`${environment.apiUrl}auth/forgotPassword`, data);
  }

  /**WishList Related API */
  getProductFromWishlist() {
    return this.http.get(`${environment.apiUrl}wishlists`);
  }
  addToWishlist(data: any) {
    return this.http.post(`${environment.apiUrl}wishlists/addproduct`, data);
  }
  removeProductFromWishlist(data: any) {
    return this.http.post(`${environment.apiUrl}wishlists/removeproduct`, data);
  }

  createOrder(data: CreateOrderData | any) {
    return this.http.post(`${environment.apiUrl}orders`, data, {
      'headers': this.headers
    });
  }

  updateOrder(data: any) {
    return this.http.put(`${environment.apiUrl}orders`, data);
  }

  // createAppintment(data: CreateAppointmentData) {
  //   return this.http.post(`${environment.apiUrl}appointments`, data);
  // }

  initiateTransaction(body: { orderId?: string, appointmentId?: string, diagnosticId?: string, healthPackageBuyId?: string, amount: number }) {
    return this.http.post(`${environment.apiUrl}payments/initiatetransaction`, body, {
      'headers': this.headers
    });
  }

  updateTransaction(orderId: string, txnToken: string, amount: number) {
    let body = {
      orderId,
      txnToken,
      amount,
    }
    return this.http.post(`${environment.apiUrl}payments/updatetransaction`, body);
  }

  fetchPaymentOptions(data: { orderId: string, txnToken: string }) {
    let requestTimestamp = parseInt((new Date().getTime() / 1000).toString()).toString();
    let params = new HttpParams({ fromObject: { ...data, channelId: 'WEB', requestTimestamp } })
    return this.http.get(`${environment.apiUrl}payments/fetchpaymentoptions`, {
      'headers': this.headers,
      'params': params
    });
  }

  fetchBinDetails(data: { orderId: string, txnToken: string, bin: string }) {
    let requestTimestamp = parseInt((new Date().getTime() / 1000).toString()).toString();
    let params = new HttpParams({ fromObject: { ...data, channelId: 'WEB', requestTimestamp } })
    return this.http.get(`${environment.apiUrl}payments/fetchbindetails`, { params })
  }

  fetchNBPaymentChannels(data: { orderId: string, txnToken: string }) {
    let params = new HttpParams({ fromObject: data })
    return this.http.get(`${environment.apiUrl}payments/fetchnbpaymentchannels`, { params })
  }

  sendPaytmOTP(orderId: string, txnToken: any, mobileNumber: string) {
    let data = { orderId, txnToken, mobileNumber };
    return this.http.post(`${environment.apiUrl}payments/sendOTP`, data);
  }

  validatePaytmOTP(orderId: string, txnToken: any, otp: string) {
    let data = { orderId, txnToken, otp };
    return this.http.post(`${environment.apiUrl}payments/validateOTP`, data);
  }

  fetchPaytmBalanceInfo(orderId: string, txnToken: any) {
    let params = new HttpParams({ fromObject: { orderId, txnToken, paymentMode: "BALANCE" } });
    return this.http.get(`${environment.apiUrl}payments/fetchbalance`, { params });
  }

  processPayment(body: any) {
    return this.http.post(`${environment.apiUrl}payments/processpayment`, body);
  }

  processPaymentClientSide(data: any) {
    let { orderId, mid } = data.body;
    return this.http.post(`https://securegw-stage.paytm.in/theia/api/v1/processTransaction?mid=${mid}&orderId=${orderId}`, data);
  }

  validateVPA(orderId: string, txnToken: any, vpa: any) {
    return this.http.post(`${environment.apiUrl}payments/validateVPA`, { orderId, txnToken, vpa })
  }

  pollingUPI(orderId: any, txnToken: any) {
    return this.http.post(`${environment.apiUrl}payments/pollingUPI`, { orderId, txnToken })
  }

  buyNow(product: CheckoutProduct) {
    let data = {
      products: [product]
    }
    localStorage.setItem(LS_CHECKOUT, this.commonService.encryptUsingAES256(data));
  }

  setCheckoutAppointment(appoinments: any) {
    let data = {
      appoinment: [appoinments]
    }
    localStorage.setItem(LS_CONSULTCHECKOUT, this.commonService.encryptUsingAES256(data));
    localStorage.setItem('ConstultationType', 'appointment');
  }

  getCheckoutData(): CheckoutData {
    let data;
    if (typeof localStorage !== 'undefined') {
      data = localStorage.getItem(LS_CHECKOUT)
    }
    let checkoutData: any = { products: [] };
    if (data) {
      // checkoutData = this.commonService.decryptUsingAES256(data);
    }
    return checkoutData;
  }

  // get consultation checkout
  getConsultCheckoutData(): any {
    let data = localStorage.getItem(LS_CONSULTCHECKOUT)
    let checkoutData: any = { appointment: [] };
    if (data) {
      checkoutData = this.commonService.decryptUsingAES256(data);
    }
    return checkoutData;
  }

  clearCheckoutData() {
    localStorage.removeItem(LS_CHECKOUT);
    localStorage.removeItem('initiateTransaction');
  }

  loadWishlist() {
    this.http.get(environment.apiUrl + 'wishlists').subscribe((res: any) => {
      this.setWishlist(res.data[0])
    }, err => {

    })
  }

  setWishlist(data: IWishList) {
    this.wishlistSubject.next(data);
  }

  getWishList(getContinuesStream: Boolean = false): Observable<IWishList> {
    let observable = this.wishlistSubject.asObservable()
    if (getContinuesStream) return observable;
    return observable.pipe(take(1))
  }

  clearWishlistSubject() {
    this.wishlistSubject.next({ _id: null, userId: null, products: [] })
  }

  addTitleInVariations(product: any) {
    if (!(product.variations && product.mainVariations)) return;
    product.variations.forEach((el: any) => {
      el.title = [];
      el.label.forEach((label: any) => {
        product.mainVariations.forEach((mVariation: any) => {
          if (typeof mVariation.variationId != 'object')
            console.error("Custom Error: Cannot read property 'title' of variationId");
          if (mVariation.values.includes(label)) {
            el.title.push(mVariation.variationId.title || "Unknown")
          }
        });
      });
    });
  }
  /**Shipment Related API */
  getShippingPrice(pin: string) {
    return this.http.get(`${environment.apiUrl}shipments/shipcalculator?o_pin=245101&pincode=${pin}`)
  }

  createPaymentSessionId(data: { orderId?: string, appointmentId?: string }) {
    return this.api.post<CreatePaymentSessionIdResponse>('payments/create-cashfree-order', data)
  }
}
