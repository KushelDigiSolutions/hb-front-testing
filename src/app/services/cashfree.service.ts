import { Injectable } from "@angular/core";
//@ts-ignore
import { load } from '@cashfreepayments/cashfree-js';
import { CashfreeVerifyPaymentResponse } from "../shared/types/xhr.types";
import { ApiService } from "./api.service";
import { CommonService } from "./common.service";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CashfreeService {

  cashfree: any;

  constructor(
    private commomService: CommonService,
    private api: ApiService,
  ) {
    if (commomService.isBrowser) {
      this.loadCashfree()
    }
  }

  async loadCashfree() {
    try {
      this.cashfree = await load({
        mode: environment.production ? "production" : "sandbox"
      });
      // console.log('[cashfree version]', this.cashfree.version())

    } catch (e) {
      console.warn('Unable to load cashfree')
    }
  }

  openGateway(data: { paymentSessionId: string, orderId: string, }): Promise<any> {
    let options = {
      paymentSessionId: data.paymentSessionId,
      returnUrl: environment.appHost + 'pay-status?myorder=' + data.orderId,
      redirectTarget: '_modal'
    }
    return this.cashfree.checkout(options)
  }

  verifyPayment(data: { orderId: string }) {
    return this.api.post<CashfreeVerifyPaymentResponse>('payments/cashfree-payment-verify', data)
  }
}