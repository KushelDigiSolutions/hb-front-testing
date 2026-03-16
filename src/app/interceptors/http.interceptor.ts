import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';

import { catchError, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonService } from '../services/common.service';
import { CartService } from '../services/cart.service';
@Injectable()

export class UniversalIntercerptor implements HttpInterceptor {

  tokenFromUI: string = environment.cryptographyToken;
  decrypted: any;
  shownSessionExpireMsg = false;
  internetError = false;

  constructor(
    private commonService: CommonService,
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let serverReq: HttpRequest<any> = req;
    let user = this.commonService.getUser();
    let token: any = user ? user.token : '';

    let headers: any = {
      url: serverReq.url,
      apikey: environment.apikey,
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    serverReq = serverReq.clone({
      setHeaders: headers
    });
    // console.log('serverReq.url', serverReq.url, user);

    return next.handle(serverReq)
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 0 && typeof window !== 'undefined' && !window.navigator.onLine) {
              if (!this.internetError) {
                this.internetError = true;
                this.toastr.error('Check your connection.', 'You\'re offline!');
                setTimeout(() => {
                  this.internetError = false;
                }, 500);
              }
              return EMPTY
            } else if (err.status === 401) {
              this.internetError = false;
              if (token) {
                // ***
                this.cartService.setCartData({ shop: null, consult: null })
                this.commonService.setLoginState(false);
                this.commonService.removeUser();
                this.showSessionExpire();
                return EMPTY
              }
            } else if (err.status === 500 && typeof err.error?.message == 'object') {
              err.error.statusCode == err.error.message.statusCode;
              err.error.message = 'Something went wrong';
            } else {
              this.internetError = false;
            }
          }
          return throwError(err)
        }),
        finalize(
          () => {
            //to hide the loader after completion
            //finalize will also get invoked if api call fails
          }
        )
      );


    // throw new Error('Method not implemented.');
  }

  /**
   * just for preventing to show multiple msgs of session expired.
  * */
  showSessionExpire() {
    if (!this.shownSessionExpireMsg) {
      this.shownSessionExpireMsg = true;
      if (isPlatformBrowser(this.platformId))
        this.toastr.error('Session expired. Please login again.');
      setTimeout(() => {
        this.shownSessionExpireMsg = false;
      }, 300)
    }
  }
}
