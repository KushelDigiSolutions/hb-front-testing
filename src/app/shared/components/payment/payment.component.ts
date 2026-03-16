import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { CheckoutService, CheckoutType } from '../checkout/checkout.service';
import { DynamicScriptLoaderService } from '../../../services/dynamic-script-loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PaymentFor } from '../cart/cart.component';
import { AppService } from '../../../app.service';
import { PaymentErrorBoxComponent } from '../payment-error-box/payment-error-box.component';
import { CashfreeService } from '../../../services/cashfree.service';

interface PaymentsOrder {
  id: string,
  orderId: string,
  type: CheckoutType,
}

interface InitiateTransaction {
  orderId?: string,
  appointmentId?: string,
  amount: number
}

interface ProcesTxnDetails {
  txnToken: string,
  appointmentId?: string,
  orderId?: string,
  amount: number
}
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ToastrModule, PaymentErrorBoxComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class PaymentComponent implements OnInit {
  isLoading = false;
  imgUrl: string = environment.imageUrl;
  status: any = {};
  order: PaymentsOrder;
  procesTxnDetails: ProcesTxnDetails = {} as ProcesTxnDetails;
  supportMail: string = 'support@healthybazar.com'
  isScriptLoaded = -1;
  invalidLink = false;
  paymentSessionActive = true;
  paymentOptionsBody: any = {};
  paymentPaymentModes = [];
  paymentMethod: any;
  type: CheckoutType = "order";
  processOrderDetails: any = {
    shortOrderID: "",
    orderId: "",
    txnToken: "",
    amount: null,
  }
  initiateTransactionDetails: any;
  activeIndex: number
  isPaymentOption: boolean = false;
  @Input() orderDeliveryAddress: any;
  data: any;
  paymentFor: PaymentFor;
  payStatus: any = {}
  selectedPaymentMode: any;
  enablePlaceOrder: boolean;
  paymentOption: any;
  activePaymentIndex: number;
  cartOrderDetail: any;

  //////
  paymentProceedText: string = 'Pay Now';
  appointmentDetail: any;
  hideMobileCartShow: boolean = false;
  //////
  constructor(
    private cartService: CartService,
    private dynamicScripts: DynamicScriptLoaderService,
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private toaster: ToastrService,
    private router: Router,
    private appService: AppService,
    private cashfreeService: CashfreeService,
  ) {
    this.paymentFor = this.route.snapshot.queryParams?.['paymentFor'];
    this.route.queryParams.subscribe(queryParams => {
      this.payStatus = { ...queryParams }
    })
    console.log('[payStatus]', this.payStatus);

    this.appService.getMobCartState().subscribe(res => {
      if (res) {
        this.hideMobileCartShow = true;
      }
    });

  }

  ngOnInit(): void {
    // this.loadScripts();
    if (this.paymentFor == 'order') {
      this.paymentMethod = [

        {
          name: "Paytm",
          displayName: "Pay Online",
          active: false,
        },
        {
          name: "cod",
          displayName: "Cash On Delivery",
          active: false,
        },
      ]
    } else {
      this.paymentMethod = [
        {
          name: "Paytm",
          displayName: "Pay Online",
          active: false,
        }
      ]
    }

    if (this.paymentFor !== 'appointment') {
      this.initiateTransactionDetails = localStorage.getItem('initiateTransaction');
      this.initiateTransactionDetails = JSON.parse(this.initiateTransactionDetails)
      this.getOrder(this.initiateTransactionDetails.orderId);
    } else {
      this.initiateTransactionDetails = localStorage.getItem('consultInitiateTransaction');
      this.initiateTransactionDetails = JSON.parse(this.initiateTransactionDetails)
      this.type = 'appointment';
      this.getAppointmentDetail(this.initiateTransactionDetails.appointmentId);
    }


    // console.log('this.initiateTransactionDetails = ', this.initiateTransactionDetails);

    // this.initiateTransaction(this.initiateTransactionDetails.totalPayableAmount,
    //   this.initiateTransactionDetails._id);
    // if (!resultStatus) {

    // if (this.initiateTransactionDetails) {

    // this.data = localStorage.getItem('pdcData');
    // this.data = JSON.parse(this.data)
    // console.log(this.data);


    // }

    // else if (appointmentId) {
    //   this.getAppointment(appointmentId);
    // }
    //  else if (appointmentId) {
    //   // this.getAppointment(appointmentId);
    // } else if (healthPackageBuyId) {
    //   // this.getHealthPackageSubscription(healthPackageBuyId);
    // }


    // } else {
    //   if (resultStatus == 'TXN_SUCCESS') {

    //   } else if (resultStatus == 'TXN_FAILURE' || resultStatus == 'PENDING') {
    //   }
    // }

  }

  // loadScripts() {
  //   this.dynamicScripts.load('paytmjs').then(() => {
  //     this.isScriptLoaded = 1;
  //   }).catch(err => {
  //     this.isScriptLoaded = 0;
  //   })
  // }

  getOrder(_id: string) {
    // this.spinner.show();
    this.isLoading = true
    this.checkoutService.getOrderDetails(_id).subscribe((res: any) => {
      this.isLoading = false
      this.cartOrderDetail = res.data
      console.log('res orders detail = ', this.cartOrderDetail);

      // this.spinner.hide();
      let { data } = res;
      if (data.paymentStatus == 'accepted') return this.invalidLink = true;
      let { phone, email } = data.shippingInfo;

      let paymentFor: Array<any> = [];
      data.products.forEach((product: any) => {
        paymentFor.push(product.productName + ' [Qty: ' + product.quantity + ']');
      });
      this.order = {
        id: data._id,
        orderId: data.orderId,
        type: 'order',
      }

      console.log('this.order details 140 = ', this.order);
      return

    }, (err: HttpErrorResponse) => {
      this.isLoading = false
      // this.spinner.hide();
      if (err.status == 400) {
        // this.router.navigate(['/404'], { replaceUrl: true });
      } else {
        this.toaster.error('Try again later', 'Something went wrong!');
      }
    },
      () => {
        this.isLoading = false
        console.warn('completed')
      });
  }

  getAppointmentDetail(appointmentId: string) {
    this.isLoading = true
    this.checkoutService.getAppointmentDetails(appointmentId).subscribe((res: any) => {
      this.isLoading = false
      this.appointmentDetail = res.data;
      // this.spinner.hide();
      let { data } = res;
      if (data.paymentStatus == 'accepted') {
        const { _id, appointmentId } = data
        if (data.payment?.fee) {
          const { paymentMode } = data.payment
          this.router.navigate(["/cart/checkout/thank-you"], {
            queryParams: { orderId: _id, paymentMethod: paymentMode, shortOrderID: appointmentId, paymentFor: 'Appointment' }, replaceUrl: true
          });
        } else {
          this.router.navigate(["/cart/checkout/thank-you"], {
            queryParams: { orderId: _id, paymentMethod: "N/A", shortOrderID: appointmentId, withoutTxn: true, paymentFor: 'Appointment' }, replaceUrl: true
          });
        }
        return;
      };

      let { phone, email, date, primaryTimeSlot, userId, parentAppointmentId } = data;
      let name = data.firstName + ' ' + data.lastName;
      if (userId) {
        phone = userId.phone;
        email = userId.email;
        name = userId.firstName + ' ' + userId.lastName;
      }

      this.order = {
        id: data._id,
        orderId: data.appointmentId,
        type: 'appointment',
      }
      return
    }, (err: HttpErrorResponse) => {
      // this.spinner.hide();
      this.isLoading = false
      if (err.status == 400) {
        this.router.navigate(['/404'], { replaceUrl: true });
      } else {
        this.toaster.error('Try again later', 'Something went wrong!');
      }
    });
  }


  hideUserInfo(value: string, type: 'phone' | 'email') {
    if (!value) return value;
    if (type == 'phone') {
      value = value.toString();
      value = value.slice(0, 2) + '*****' + value.slice(value.length - 3);
    } else if (type == 'email') {
      let emailArr = value.split('@');
      value = value.slice(0, 2) + '*******' + emailArr[0].slice(emailArr[0].length - 1) + '@' + emailArr[1]
    }
    return value;
  }

  choosePaymentOption(event: any, value: any, index: number) {
    this.isPaymentOption = true;
    this.activeIndex = index
    this.selectedPaymentMode = value;
    if (this.selectedPaymentMode == 'cod') {
      this.paymentProceedText = 'Place Order';
    } else {
      this.paymentProceedText = 'Pay Now';
    }
    this.enablePlaceOrder = false;
    // this.enablePlaceOrder = true;
    if (event.target.checked) {
      this.paymentOption = value;
      this.activePaymentIndex = index;
      switch (value) {
        case "Paytm": {
          if (this.type == 'order') {
            this.updateOrder("cashfree", "prepaid");
          }
          // if (this.paytmBalanceInfo)
          // this.enablePlaceOrder =
          //   this.paytmBalanceInfo.value >= this.processOrderDetails.amount;
          break;
        }
        case "cod": {
          this.enablePlaceOrder = true;
          this.updateOrder("cod", "cash");
          break;
        }
        default: {
          this.enablePlaceOrder = false;
        }
      }
    }
  }

  updateOrder(
    paymentMethod?: "cod" | "cashfree",
    paymentType?: "cash" | "prepaid",
    isPlaced?: boolean
  ) {
    if (this.type == "appointment" || this.type == "diagnostic" || this.type == "healthPackage") {
      return (this.enablePlaceOrder = true);
    }

    let billingInfo = this.getAddress(this.cartOrderDetail?.shippingInfo);
    let order: any = {
      _id: this.cartOrderDetail._id,
      // _id: this.processOrderDetails.orderId,
      billingInfo,
      shippingInfo: billingInfo,
    };
    if (paymentMethod) {
      order.paymentMethod = paymentMethod;
    }
    if (paymentType) {
      order.paymentType = paymentType;
    }

    if (isPlaced) {
      order.isPlaced = true;
    }
    this.isLoading = true
    this.checkoutService.updateOrder(order).subscribe(
      (res: any) => {
        this.isLoading = false
        if (paymentMethod == "cod" && isPlaced) {

          // if (paymentMethod == "cod" && isPlaced) {
          if (this.cartOrderDetail.products.length) {
            this.checkoutService.clearCheckoutData();
            const body = {
              productId: this.cartOrderDetail.products[0].productId,
            };
            this.cartService.removeProductFromCart(body).subscribe(
              (res) => {
                this.navigateToThankyou('order');
              },
              (err) => {
                this.navigateToThankyou('order');
              }
            );
          } else {
            this.checkoutService.deleteCart().subscribe(
              (res) => {
                this.navigateToThankyou('order');
              },
              (err) => {
                this.navigateToThankyou('order');
              }
            );
          }
        } else {
          this.cartOrderDetail.shippingCharges = res.data.shippingCharges
          this.cartOrderDetail.totalPayableAmount = res.data.totalPayableAmount
          let { totalPayableAmount, shippingCharges, totalAmount } = res.data;

          this.processOrderDetails.amount = totalPayableAmount;
        }
      },
      (err) => {
        this.isLoading = false
        // this.spinner.hide();
        this.toaster.error("Try again later", "Something went wrong!");
      },
      () => {
        this.isLoading = false
        console.warn('completed')
      }
    );
    return;
  }

  getAddress(shippingInfo: any) {
    if (!shippingInfo) return null;
    let name = shippingInfo.firstName

    return {
      firstName: name,
      lastName: shippingInfo.lastName == "" ? "" : shippingInfo.lastName,
      email: "",
      countryCode: shippingInfo.countryCode,
      phone: shippingInfo.phone,
      address: {
        country: shippingInfo.address.country,
        line1: shippingInfo.address.line1,
        line2: "",
        landmark: shippingInfo.address.landmark,
        city: shippingInfo.address.city,
        state: shippingInfo.address.state,
        pinCode: shippingInfo.address.pinCode,
        houseNumber: shippingInfo.address.houseNumber,
        type: shippingInfo.address.type,
      },
    };
  }

  reCreateOrder() {
    this.processOrderDetails.orderId = "";
    this.processOrderDetails.txnToken = "";
    this.processOrderDetails.amount = "";
    // this.createOrder();
  }

  onProceedToPay(amt: any) {

    console.log('payment mode = ', this.selectedPaymentMode);
    if (this.selectedPaymentMode == 'cod') {
      this.updateOrder('cod', 'cash', true)
      return;
    }

    const initTxnPayload: any = {}
    switch (this.order.type) {
      case 'order':
        initTxnPayload.orderId = this.order.id
        break;
      case 'appointment':
        initTxnPayload.appointmentId = this.order.id
        break;
      case 'diagnostic':
        initTxnPayload.diagnosticId = this.order.id
        break;
      case 'healthPackage':
        initTxnPayload.healthPackageBuyId = this.order.id
        break;
      default: alert(`Order type "${this.order.type}" is not handled.`)
    }
    this.initiateTransaction(initTxnPayload);

    // } else {
    //   this.router.navigate(['/login'], {
    //     queryParams: {
    //       redirect: this.router.url,
    //       action: 'pay',
    //     }
    //   })
    // }
  }

  // initiateTransaction(data: InitiateTransaction) {
  //   console.log('this.order.type = ', this.order.type);

  //   if (this.selectedPaymentMode == 'Cash On Delivery') {
  //     this.navigateToThankyou('Order');
  //     this.updateOrder("cod", "cash", true)
  //   } else {
  //     if (this.procesTxnDetails.txnToken) {
  //       return this.openPayTMGateway(this.order.id, this.procesTxnDetails.txnToken, this.procesTxnDetails.amount)
  //     }

  //     // this.spinner.show()
  //     this.checkoutService.initiateTransaction(data).subscribe((res: any) => {
  //       // this.spinner.hide()
  //       let { resultInfo } = res.body;
  //       if (resultInfo.resultStatus == "S") {
  //         let { txnToken } = res.body;
  //         this.procesTxnDetails.txnToken = txnToken;
  //         this.procesTxnDetails.amount = data.amount;

  //         this.openPayTMGateway(this.order.id, txnToken, data.amount)
  //       } else if (resultInfo.resultCode == "325") {
  //         this.invalidLink = true;
  //       } else {
  //         this.toaster.error(resultInfo.resultMsg)
  //       }

  //     }, (err: any) => {
  //       // this.spinner.hide()
  //       this.toaster.error('Error on initiateTransaction')
  //       console.log('err = ', err);
  //     })
  //   }
  //   console.log('InitiateTransaction data = ', data);
  // }

  initiateTransaction(data: any) {

    this.checkoutService.createPaymentSessionId(data).subscribe(res => {
      if (res.success) {
        const { payment_session_id, order_id } = res.data
        this.openCashfreeGateway(payment_session_id, order_id)
      }
    })

  }

  openPayTMGateway(orderId: any, txnToken: any, amount: any) {
    var config = {
      "root": "",
      "flow": "DEFAULT",
      "data": {
        "orderId": orderId, /* update order id */
        "token": txnToken, /* update token value */
        "tokenType": "TXN_TOKEN",
        "amount": amount
      },
      "handler": {
        "notifyMerchant": (eventName: any, data: any) => {
          console.log("notifyMerchant handler function called");
          console.log("eventName => ", eventName);
          console.log("data => ", data);
          if (eventName != 'APP_CLOSED') {
            console.log('Try again later', 'Something went wrong!');
            this.toaster.error('Try again later', 'Something went wrong!');
          }
        }
      }
    };
    // @ts-ignore
    if (window['Paytm'] && window['Paytm'].CheckoutJS) {
      // @ts-ignore
      window['Paytm'].CheckoutJS.init(config).then(function onSuccess() {
        // after successfully updating configuration, invoke JS Checkout
        // @ts-ignore
        window['Paytm'].CheckoutJS.invoke();
      }).catch(function onError(error: any) {
        console.log("error => ", error);
        // this.toaster.error('Try again later', 'Something went wrong!');
      });
    }
  }

  openCashfreeGateway(paymentSessionId: string, orderId: string) {
    this.cashfreeService.openGateway({
      paymentSessionId,
      orderId
    }).then((result: any) => {
      console.log('cashfree success', JSON.stringify(result))
      if (result.error) {
        this.payStatus = {
          resultStatus: 'TXN_FAILURE',
          resultMsg: result.error?.message || "Something went wrong! Try again later",
          resultCode: result.error?.code || ''
        }
        // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
        console.log("User has closed the popup or there is some payment error, Check for Payment Status");
        console.log(result.error?.message);
      }
      if (result.redirect) {
        // This will be true when the payment redirection page couldnt be opened in the same window
        // This is an exceptional case only when the page is opened inside an inAppBrowser
        // In this case the customer will be redirected to return url once payment is completed
        console.log("Payment will be redirected");
      }
      if (result.paymentDetails) {
        // This will be called whenever the payment is completed irrespective of transaction status
        console.log("Payment has been completed, Check for Payment Status");
        console.log(result.paymentDetails);
        this.cashfreeService.verifyPayment({ orderId }).subscribe(res => {
          const queryParams = {
            resultStatus: "TXN_SUCCESS",
            orderId: this.order.id,
            shortOrderID: this.order.orderId,
            txnId: res.data?.paymentDetail?.payment_gateway_details?.gateway_payment_id,
            paymentFor: this.paymentFor,
          }

          if (res.data.paymentStatus != "SUCCESS") {
            queryParams.resultStatus = 'TXN_FAILURE'
          }

          this.router.navigate(['/pay-status'], { queryParams })
        }, err => {

        })
      }
    }).catch((error: any) => {
      console.log('cashfree error', JSON.stringify(error))
    })
  }

  closePayStatus() {
    this.payStatus.resultStatus = "";
  }

  navigateToThankyou(paymentFor: PaymentFor) {

    let orderId: string = this.cartOrderDetail._id
    let shortOrderID: string = this.cartOrderDetail.orderId
    this.router.navigate(["/cart/checkout/thank-you"], {
      queryParams: { orderId, paymentMethod: "cod", shortOrderID, withoutTxn: true, paymentFor }, replaceUrl: true
    });
  }
}
