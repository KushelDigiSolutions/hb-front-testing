import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { BehaviorSubject, catchError, EMPTY, map, of } from "rxjs";
import { Subject } from 'rxjs';
// import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
import { ApiService } from "./api.service";
import { isPlatformBrowser } from "@angular/common";
import { CommonService } from "./common.service";
import { GuestCartService } from "./guest-cart.service";
import { CartData, CartLoading } from "../shared/types/index.types";
import { ConsultantCartResponse, ShopCartResponse } from "../shared/types/xhr.types";

const LS_CART_KEY = "cartV1";

export interface User {
  token: string,
  user: {
    firstName: string,
    lastName: string,
    countryCode: string,
    email: string,
    phone: string,
    weight: number,
    DOB: any,
    profilePhoto: { savedName: string, _id: string } | null,
    role: string[],
    _id: string,
  }
}

export interface FileUploadResponse {
  success: boolean,
  data: string[]
}

export type VisibleCartType = 'shop' | 'consult';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  // private loginState$ = new Subject<boolean>();
  private cart$ = new BehaviorSubject<CartData>({
    shop: null,
    consult: null
  });
  private cartLoading$ = new BehaviorSubject<CartLoading>({ shop: false, consult: false })
  private cartState$ = new BehaviorSubject<any>(null);
  private visibleCartType$ = new BehaviorSubject<VisibleCartType>('shop');
  private showCart$ = new BehaviorSubject<any>(null);


  headers: any = new HttpHeaders({
    'apikey': environment.apikey,
  });

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private api: ApiService,
    private guestCartService: GuestCartService
  ) { }

  private modalOpenSubject = new Subject<boolean>();

  modalOpen$ = this.modalOpenSubject.asObservable();
  tokenFromUI: string = environment.cryptographyToken;


  setCartState(state: VisibleCartType) {
    this.visibleCartType$.next(state);
  }

  getCartState() {
    return this.visibleCartType$.asObservable();
  }

  getCartStateValue() {
    return this.visibleCartType$.value;
  }

  openDirectCart(state: boolean) {
    this.showCart$.next(state);
  }
  getDirectCart() {
    return this.showCart$.asObservable();
  }

  /////////////////
  openModal() {
    this.modalOpenSubject.next(true);
  }

  closeModal() {
    this.modalOpenSubject.next(false);
  }

  fetchGuestCartItems() {
    // https://api.healthybazar.com/api/v2/carts
    return this.http.get(`${environment.apiUrl}carts`, {

    });
  }

  getUser(): any | null | undefined {
    let user = null;
    if (typeof localStorage !== 'undefined') {
      user = localStorage.getItem('userData');
      return user;
    }
    // let data = this.cookie.get('hbUserV2');
    // if (data && data != "undefined") {
    //   user = this.decryptUsingAES256(data)
    // }
    // 

    return user;
  }

  updateUserProfile(data: any) {
    return this.http.put(`${environment.apiUrl}users`, data, {

    });
  }

  setUser(data: any) {
    let userData = JSON.stringify(data)
    localStorage.setItem('userData', userData);

    let date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    this.cookie.set("hbUserV2", this.encryptUsingAES256(data), { expires: date, path: '/' });
  }

  encryptUsingAES256(value: any) {
    let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(value), _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    let encryptedText = encrypted.toString();
    return encryptedText;
  }

  decryptUsingAES256(value: any) {
    let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);

    let decrypted = CryptoJS.AES.decrypt(
      value, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);

    decrypted = JSON.parse(decrypted);

    return decrypted;
  }

  getCartCount() {
    return this.http.get(`${environment.apiUrl}carts/cartcount`);
  }

  //add products into cart for Login User
  addToCart(data: any) {
    return this.http.post(`${environment.apiUrl}carts/addproduct`, data, {

    }).pipe(map((res: any) => {
      if (res?.success) {
        this.getShopCart().pipe(catchError(err => EMPTY)).subscribe()
      }
      return res
    }));
  }
  // add consultant into cart for Login User
  addToConsultCheckout(data: any) {
    let cartId = localStorage.getItem('guestCheckoutCartId');
    const body = { ...data, consultantCartCartId: cartId || null }
    return this.http.post(`${environment.apiUrl}consultantCart/guestAdd`, body).pipe((res: any) => {
      if (res?.success && res.data?._id)
        this.getGuestConsultCart(res.data._id).pipe(catchError(err => EMPTY)).subscribe()
      return res
    });
    // return this.http.post(`${environment.apiUrl}consultantCart/add`, data, {
    // });
  }

  //get products from cart for Login User
  getShopCart(params?: { pincode?: number }) {
    return this.api.get<ShopCartResponse>(`carts`, { params }).pipe(map(res => {
      this.handleShopCartResponse(res)
      return res;
    }));
  }

  private handleShopCartResponse(res: ShopCartResponse) {
    if (res?.success) {
      this.cartData.shop = res.data
      this.setCartData(this.cartData)
    }
  }

  private handleConsultantCartResponse(res: ConsultantCartResponse) {
    if (res?.success) {
      const clone = { ...this.cartData }
      if (res.data?.cart?.consultant) {
        clone.consult = res.data.cart
      } else {
        clone.consult = null
      }
      this.setCartData(clone)
    }
  }

  // get consult from cart for Login user
  getConsultantCart() {
    let consultantId = localStorage.getItem('guestCheckoutCartId');
    if (!consultantId) return EMPTY;
    return this.http.get<ConsultantCartResponse>(`${environment.apiUrl}consultantCart/guest`, {

      'params': {
        "consultantCartCartId": consultantId
      }
    }).pipe(map(res => {
      if (res.success && res.data.cart) {
        this.handleConsultantCartResponse(res)
      }
      return res
    }));
    // return this.http.get<ConsultantCartResponse>(`${environment.apiUrl}consultantCart`).pipe(map(res => {
    //   if (res.success) {
    //     this.handleConsultantCartResponse(res)
    //   }
    //   return res
    // }));
  }


  // remove product form cart Login User
  // removeProduct(data: any) {
  //   return this.http.post(`${environment.apiUrl}carts/removeproduct`, data);
  // }

  //remove consultant form cart Login User
  removeConsultFromCart() {
    console.log('this.headers = ', this.headers);
    return this.http.delete(`${environment.apiUrl}consultantCart/remove`, {

    });
  }

  // guest cart API's

  //add product into cart for Guest user
  addToCartForGuest(data: any) {
    return this.http.post(`${environment.apiUrl}carts/guestaddproduct`, data, {

    }).pipe(map((res: any) => {
      if (res?.success && res?.data?.cart) {
        this.getGuestCart(res.data?.cart?._id).pipe(catchError(err => EMPTY)).subscribe()
      }
      return res
    }));
  }

  // add consult into cart for Guest user
  addToConsultCartForGuest(data: any) {
    let cartId = localStorage.getItem('guestCheckoutCartId');
    const body = { ...data, consultantCartCartId: cartId || null }
    return this.http.post(`${environment.apiUrl}consultantCart/guestAdd`, body).pipe((res: any) => {
      if (res?.success && res.data?._id)
        this.getGuestConsultCart(res.data._id).pipe(catchError(err => EMPTY)).subscribe()
      return res
    });
  }


  // remove product form cart Guest User
  removeGuestProduct(data: any) {
    return this.http.post(`${environment.apiUrl}carts/removeguestproduct`, data).pipe(map((res: any) => {
      if (res?.success && data._id) {
        this.getGuestCart(data._id).pipe(catchError(err => EMPTY)).subscribe()
      }
      return res
    }));
  }

  // //remove consultant form cart Guest User
  removeGuestConsult(data: any) {
    return this.http.delete(`${environment.apiUrl}consultantCart/guestRemove`, {
      'body': data
    }).pipe(map((res: any) => {
      if (res?.success) {
        this.getGuestConsultCart(data.consultantCartCartId).pipe(catchError(err => EMPTY)).subscribe()
      }
      return res
    }));;

    // return this.http.delete(`${environment.apiUrl}consultantCart/guestRemove `, data, {
    //   ,
    // });
  }

  // get product form cart for Guest user 
  getGuestCart(id: any) {
    // id = "663ba49eef039f56a3f45424";
    return this.http.get<ShopCartResponse>(`${environment.apiUrl}carts/guest?_id=${id}`, {}).pipe(map(res => {
      if (res.success) {
        const clone = { ...this.cartData }
        clone.shop = res.data
        this.setCartData(clone)
      }
      return res
    }));
  }

  // get product form cart for Guest user 
  getGuestConsultCart(id: any) {
    // id = "663ba49eef039f56a3f45424";
    return this.http.get<ConsultantCartResponse>(`${environment.apiUrl}consultantCart/guest`, {

      'params': {
        "consultantCartCartId": id
      }
    }).pipe(map(res => {
      if (res.success && res.data.cart) {
        this.handleConsultantCartResponse(res)
      }
      return res
    }));
  }

  /**User Related API */
  checkUser(data: any) {
    return this.api.post(`auth/checkuser`, data);
  }

  LoginVerifyOTP(data: any) {
    return this.api.post(`auth/verifyOTP`, data);
  }


  // loginUser(data) {
  //   return this.http.post(`${environment.apiUrl}auth/login`, data);
  // }
  // registerUser(data) {
  //   return this.http.post(`${environment.apiUrl}auth/register`, data);
  // }
  getUserAddress() {
    return this.http.get(`${environment.apiUrl}users/address`, {

    });
  }
  addUserAddress(data: any) {
    return this.http.post(`${environment.apiUrl}users/address`, data, {

    });
  }

  applyCouponCode(data: any) {
    return this.http.post(`${environment.apiUrl}coupons/applycoupon`, data, {
    });
  }


  getUserAddressArea(code: any) {
    return this.http.get(`${environment.apiUrl}users/getaddress?pincode=${code}`, {

    });
  }

  updateAddress(data: any) {
    return this.http.post(`${environment.apiUrl}users/updateaddress`, data, {

    });
  }

  removeAddress(data: any) {
    return this.http.request(
      "delete",
      `${environment.apiUrl}users/removeaddress`,
      { body: data, }
    );
  }





  // getUserAddressArea(code) {
  //   return this.http.get(`${environment.apiUrl}users/getaddress?pincode=${code}`);
  // }
  // requestOTP(data) {
  //   return this.http.post(`${environment.apiUrl}auth/resendOtp`, data);
  // }
  // forgotPassword(data) {
  //   return this.http.post(`${environment.apiUrl}auth/forgotPassword`, data);
  // }

  /** File Upload API */
  fileUpload(files: File[], folder: string) {
    let fd = new FormData();
    for (let file of files) {
      fd.append('file', file)
    }
    fd.append('folder', folder);
    return this.http.post<FileUploadResponse>(`${environment.apiUrl}upload`, fd, {

    });
  }


  // ///////////////
  // setLoginState(state: boolean) {
  //   this.loginState$.next(state);
  // }

  removeGuestCart() {
    localStorage.removeItem(LS_CART_KEY);
  }

  getCartSubscripition() {
    return this.cartState$.asObservable();
  }

  setDatatoCartSubscription(data: any) {
    this.cartState$.next(data);
  }

  setCartData(data: CartData) {
    this.cart$.next(data)
  }

  getCartData() {
    return this.cart$.asObservable()
  }

  get cartData() {
    return this.cart$.getValue()
  }

  setCartLoading(data: Partial<CartLoading>) {
    const clone = { ...this.cartLoading, ...data }
    this.cartLoading$.next(clone)
  }

  getCartLoading() {
    return this.cartLoading$.asObservable()
  }

  get cartLoading() {
    return this.cartLoading$.value
  }

  removeProductFromCart(data: any) {
    return this.http.post(`${environment.apiUrl}carts/removeproduct`, data,).pipe(map((res: any) => {
      console.log('[removeProductFromCart]', data, res);
      this.setCartLoading({ shop: false })
      if (res?.success) {
        this.setCartLoading({ shop: true })
        this.getShopCart().pipe(catchError(err => EMPTY)).subscribe()
      }
      return res;
    }));
  }
  removeProductFromGuestCart(data: any) {
    return this.http.post(`${environment.apiUrl}carts/removeguestproduct`, data, {
      'headers': this.headers
    });
  }

}
