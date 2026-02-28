import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as CryptoJS from 'crypto-js';

import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from './cart.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { BannersType } from '../shared/types/index.types';
import { GetBannersResponse, UserProfile } from '../shared/types/xhr.types';


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

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  headers: any = new HttpHeaders({
    'apikey': environment.apikey,
  });

  private loginState$ = new BehaviorSubject<boolean>(false);
  private userProfileDetails$ = new BehaviorSubject<UserProfile | null>(null);
  private locationState$ = new BehaviorSubject<boolean>(false);


  tokenFromUI: string = environment.cryptographyToken;

  constructor(
    private cookie: CookieService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: any,
    private api: ApiService,
    private http: HttpClient
  ) { }

  get isBrowser() {
    return isPlatformBrowser(this.platformId)
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

  setLoginState(state: boolean) {
    this.loginState$.next(state);
  }

  setLocationState(state: boolean) {
    this.locationState$.next(state);
  }


  getLoginState() {
    return this.loginState$.asObservable();
  }

  getLocationState() {
    return this.locationState$.asObservable();
  }

  getUser(): User | null | any {
    let data = this.cookie.get('hbUserV2');
    let user = null;
    if (data && data != "undefined") {
      user = this.decryptUsingAES256(data)
    }
    return user;
  }

  setUser(data: User) {
    let date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    this.cookie.set("hbUserV2", this.encryptUsingAES256(data), { expires: date, path: '/' });
  }

  setUserProfileDetails(data: UserProfile | null) {
    this.userProfileDetails$.next(data)
  }

  getUserProfileDetails() {
    return this.userProfileDetails$.asObservable()
  }

  removeUser() {
    localStorage.removeItem('userData');
    this.cookie.delete('hbUserV2');
    this.cookie.delete('hbUserV2', '/');
    if (isPlatformBrowser(this.platformId)) {
      this.cartService.removeGuestCart();
    };
    this.setLoginState(false);
  }

  filterUserData(data: { token: string, user: any }): User {
    let { token, user } = data;
    let { countryCode, phone, email, firstName, lastName, profilePhoto, weight, DOB, role, _id } = user;
    let userData: User = {
      token,
      user: {
        firstName,
        lastName,
        countryCode,
        email,
        phone,
        weight,
        DOB,
        profilePhoto: profilePhoto || null,
        role,
        _id: _id,
      }
    };
    return userData;
  }

  addUserCurrentLocation(locationData: any) {
    // /api/v2/users/currentLocation ; send city and pincode id in the body
    return this.http.post(`${environment.apiUrl}users/currentLocation`, locationData, {
      'headers': this.headers,
    });
  }
  getUserCurrentLocation() {
    // api/v2/users/currentLocation
    return this.http.get(`${environment.apiUrl}users/currentLocation`, {
      'headers': this.headers,
    });
  }

  subscriptionToNewsletter(email: Object) {
    // api/v2/newsletters
    return this.http.post(`${environment.apiUrl}newsletters`, email, {
      'headers': this.headers,
    });
  }

  getBanners(type: BannersType) {
    return this.api.get<GetBannersResponse>('banners', { params: { type } })
  }

  // get Promotinal banner for all Home pages
  getPromotionBanners(payload: any) {
    // /api/v2/promotionBanner/getPromotionBanner?type=Homepage-Category Product
    let params = new HttpParams();
    let tempPayload: any = {
      'cardType': payload.cardType,
      'active': payload.active,
      'type': payload.type,
    };

    Object.keys(payload).forEach(
      (key: string) => {
        params = params.append(key, tempPayload[key])
      }
    )
    return this.http.get(`${environment.apiUrl}promotionBanner/getPromotionBanner`, {
      params: params
    });
  }
}
