// import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
// import { Subject } from 'rxjs';
// import { environment } from '../../environments/environment';
// import { CartService } from './cart.service';
// import { CookieService } from 'ngx-cookie-service';
// import { isPlatformBrowser } from '@angular/common';
// export interface User {
//   token: string,
//   user: {
//     firstName: string,
//     lastName: string,
//     countryCode: string,
//     email: string,
//     phone: string,
//     weight: number,
//     DOB: any,
//     profilePhoto: { savedName: string, _id: string } | null,
//     role: string[],
//     _id: string,
//   }
// }
// @Injectable({
//   providedIn: 'root'
// })
// export class CartCountServiceTsService {


//   private loginState$ = new Subject<boolean>();

//   tokenFromUI: string = environment.cryptographyToken;

//   constructor(
//     private cookie: CookieService,
//     private cartService: CartService,
//     @Inject(PLATFORM_ID) private platformId: any,
//   ) { }

//   get isBrowser() {
//     return isPlatformBrowser(this.platformId)
//   }

//   encryptUsingAES256(value: any) {
//     let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
//     let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
//     let encrypted = CryptoJS.AES.encrypt(
//       JSON.stringify(value), _key, {
//       keySize: 16,
//       iv: _iv,
//       mode: CryptoJS.mode.ECB,
//       padding: CryptoJS.pad.Pkcs7
//     });
//     let encryptedText = encrypted.toString();
//     return encryptedText;
//   }

//   decryptUsingAES256(value: any) {
//     let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
//     let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);

//     let decrypted = CryptoJS.AES.decrypt(
//       value, _key, {
//       keySize: 16,
//       iv: _iv,
//       mode: CryptoJS.mode.ECB,
//       padding: CryptoJS.pad.Pkcs7
//     }).toString(CryptoJS.enc.Utf8);

//     decrypted = JSON.parse(decrypted);

//     return decrypted;
//   }

//   setLoginState(state: boolean) {
//     this.loginState$.next(state);
//   }

//   getLoginState() {
//     return this.loginState$.asObservable();
//   }

//   getUser(): User | null | any {
//     let data = this.cookie.get('hbUserV2');
//     let user = null;
//     if (data && data != "undefined") {
//       user = this.decryptUsingAES256(data)
//     }
//     return user;
//   }

//   setUser(data: User) {
//     let date = new Date();
//     date.setFullYear(date.getFullYear() + 1);
//     this.cookie.set("hbUserV2", this.encryptUsingAES256(data), { expires: date, domain: environment.webDomain });
//   }

//   removeUser() {
//     this.cookie.delete('hbUserV2');
//     this.cookie.delete('hbUserV2', { domain: environment.webDomain });
//     if (isPlatformBrowser(this.platformId)) {
//       this.cartService.removeGuestCart();
//     };
//     this.setLoginState(false);
//   }

//   filterUserData(data: { token: string, user: any }): User {
//     let { token, user } = data;
//     let { countryCode, phone, email, firstName, lastName, profilePhoto, weight, DOB, role, _id } = user;
//     let userData: User = {
//       token,
//       user: {
//         firstName,
//         lastName,
//         countryCode,
//         email,
//         phone,
//         weight,
//         DOB,
//         profilePhoto: profilePhoto || null,
//         role,
//         _id: _id,
//       }
//     };
//     return userData;
//   }
// }
