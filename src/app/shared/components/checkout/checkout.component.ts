import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutData, CheckoutType } from './checkout.service';
import { environment } from '../../../../environments/environment';
export interface CreateOrderProduct {
  productId: string;
  label?: string[];
  // variationId: string,
  quantity: number;
  weight: number | string;
}
export interface CreateOrderAddress {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: number;
  address: {
    country: string;
    line1: string;
    line2: string;
    landmark: string;
    city: string;
    state: string;
    pinCode: number;
    houseNumber: string;
  };
}
export interface CreateOrderData {
  paymentType?: string;
  paymentMethod?: string;
  couponCode?: string | any;
  couponOtp?: string | any;
  couponDiscount?: number;
  products: Array<CreateOrderProduct>;
  billingInfo: CreateOrderAddress;
  shippingInfo: CreateOrderAddress;
  giftOptions?: {
    message: string;
    from: string;
    to: string;
  };
  paymentCallbackUrl: string;
}
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  // @ViewChild(PriceDetailContainerComponent)
  // priceDetailRef: PriceDetailContainerComponent;

  type: CheckoutType = "order";
  isQuickCheckout = false;
  payStatus: any = {};
  checkoutData: CheckoutData;
  imgUrl = environment.imageUrl;
  showContinue = true;
  showSignInButton = false;
  showPasswordField = false;
  showPassword = false;
  otpRequested = false;
  showSignUpButton = false;
  activeSection = 1;
  addAddress = false;
  activeAddressIndex = -1;
  savedAddress = false;

  paymentOption = "";
  activePaymentIndex = null;
  otherBank = "";
  bankSelected = true;
  netBankingRadioButton = null;
  bankChannelCode = "";
  user: any;

  // pdcData: PriceDetailContainerData;

  lastSearchedPincode: number;
  userAddress = [];
  deliveryAddress: any;
  userAddressType = [
    {
      addressType: "home",
      checked: true,
    },
    {
      addressType: "work",
      checked: false,
    },
  ];
  paymentMethod = [
    {
      name: "Credit/Debit/ATM Card",
      displayName: "Debit Card",
      paymentMode: "DEBIT_CARD",
      active: false,
    },
    {
      name: "Net Banking",
      displayName: "Net Banking",
      paymentMode: "NET_BANKING",
      active: false,
    },
    {
      name: "Paytm",
      displayName: "Paytm Balance",
      paymentMode: "BALANCE",
      active: false,
    },
    {
      name: "UPI",
      displayName: "BHIM UPI",
      paymentMode: "UPI",
      active: false,
    },
    {
      name: "Cash On Delivery",
      displayName: "",
      paymentMode: "",
      active: false,
    },
  ];

  country: any;
  states: any;
  country_code: any;
  cities: any;

  creditCardForm: FormGroup;

  productData: any;
  userInputEmailMobileLogin: any;
  emailLogin: any;
  phoneLogin: any;
  emailDisabled = false;

  disableCoupon: boolean = false;
  step: string = "";
  proceedPaymentSubmitted = false;
  enablePlaceOrder = false;
  couponCode: string = "";
  couponOtp: string = "";

  cardIconPath = "https://staticgw3.paytm.in/33.1.1/images/web/merchant4/";
  savedCards = [
    // {
    //   cardStart: '4111',
    //   cardEnd: '1111',
    //   cardholderName: 'Satinderpal Singh',
    //   expiry: '03/24',
    //   channelCode: 'VISA'
    // },
    // {
    //   cardStart: '4572',
    //   cardEnd: '7000',
    //   cardholderName: 'Harat',
    //   expiry: '03/22',
    //   channelCode: 'MASTER'
    // }
  ];
  paymentSessionActive = true;
  cvv = "";
  selectedCard = 0;
  newCard = true;
  paytmLoginOtpSent: boolean = false;
  paytmLogin: boolean = false;
  // paytmBalanceInfo: { currency: string; value: string } = null;
  processOrderDetails = {
    shortOrderID: "",
    orderId: "",
    txnToken: "",
    amount: null,
  };

  paymentOptionsBody: any = {};
  paymentPaymentModes = [];
  // subscriptionsArray: Subscription[] = [];
  UPIVerified: string;

  cardBin: any = {};

  // pdcConfig: PriceDetailContainerConfig = {
  //   type: "checkout",
  //   continueText: "Continue",
  //   showDeliveryCharges: true,
  // };

  userProfile: any;
  showPendingDetailSection = false;

  userDetailGroup: FormGroup;

  gender = [
    {
      name: "Male",
      value: "male",
    },
    {
      name: "Female",
      value: "female",
    },
    {
      name: "Other",
      value: "other",
    },
  ];

  // set subscriptions(subscription: Subscription) {
  //   this.subscriptionsArray.push(subscription);
  // }
}
