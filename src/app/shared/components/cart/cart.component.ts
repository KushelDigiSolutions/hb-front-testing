import { Component, EventEmitter, OnInit, Output, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, Inject, PLATFORM_ID, Input, Renderer2, OnDestroy } from '@angular/core';
import { CartService, VisibleCartType } from '../../../services/cart.service';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { environment } from "../../../../environments/environment";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { Observable, filter } from 'rxjs';
import { ConsultUsService } from '../../../modules/consult-us/services/consult-us.service';
import { ConsultationCalendarComponent, PriceDetailContainerData } from '../../../modules/consultation-calendar/consultation-calendar.component';
import { json } from 'stream/consumers';
import { error, log } from 'console';
import { PaymentComponent } from '../payment/payment.component';
import { CreateOrderData } from '../checkout/checkout.component';
import { CheckoutService, CheckoutType } from '../checkout/checkout.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PayStatusComponent } from '../pay-status/pay-status.component';
import { LastTwoDigitsPipe } from '../../../pipes/last-two-digits.pipe';
import { ToastrService } from 'ngx-toastr';
import { GuestCartService } from '../../../services/guest-cart.service';
import { dateDiff } from '../../../util/date.util';
import { ProductSliderComponent } from '../../../components/product-slider/product-slider.component';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../services/auth.service';
import { CrossIconComponent } from '../../../my-svg/cross-icon/cross-icon.component';
import { BagIconComponent } from '../../../my-svg/bag-icon/bag-icon.component';
import { FamilyIconComponent } from '../../../my-svg/family-icon/family-icon.component';
import { HotelIconComponent } from '../../../my-svg/hotel-icon/hotel-icon.component';
import { HouseIconComponent } from '../../../my-svg/house-icon/house-icon.component';
import { PingIconComponent } from '../../../my-svg/ping-icon/ping-icon.component';
import { ThreeDotIconComponent } from '../../../my-svg/three-dot-icon/three-dot-icon.component';
import { AppService } from '../../../app.service';
import { LoginPopupComponent } from '../../../components/login-popup/login-popup.component';
import { CartProductListItemComponent } from '../../../components/cart/cart-product-list-item/cart-product-list-item.component';
import { CustomInputComponent } from '../../../components/custom-input/custom-input.component';
import { SimpleObject } from '../../../services/api.service';
import { EventTrackingService } from '../../../services/event-tracking.service';
import { HealthConcernProduct } from '../../../modules/shop/model/health-concern-product.model';
//declare var gtag: any;
declare var Tawk_API: any;
declare function gtag(...args: any[]): void; // Declare gtag globally
// 
export interface CreateOrderProduct {
  productId: string;
  label?: string[];
  // variationId: string,
  quantity: number;
  weight: number | string;
}
export type PaymentFor = 'order' | 'appointment' | 'diagnostic';
export interface PriceDetailContainerConfig {
  continueText?: string
  hideContinueButton?: boolean
  type: 'cart' | 'checkout' | 'consultation',
  showDeliveryCharges?: boolean
}
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ConsultationCalendarComponent,
    PaymentComponent,
    PayStatusComponent,
    RouterModule,
    LastTwoDigitsPipe,
    ProductSliderComponent,
    CrossIconComponent,
    BagIconComponent,
    FamilyIconComponent,
    HotelIconComponent,
    HouseIconComponent,
    PingIconComponent,
    ThreeDotIconComponent,
    LoginPopupComponent,
    CartProductListItemComponent,
    CustomInputComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartComponent implements OnInit, OnDestroy {
  @ViewChild('detailsModal') detailsModal: ElementRef;
  isCartSimilarProducts: boolean = false;
  isUser: any;
  modalOpen: boolean = false;
  @Output() onCloseCart = new EventEmitter();
  @Output() onDirectCartOpen = new EventEmitter();
  @ViewChild('filterModal') filterModal: ElementRef;
  cartData: any;
  cartProducts: Array<any> = [];
  checkoutConsultationCart: Array<any> = [];
  isLoadingCart: boolean = true;
  showLoginPopup = false;
  isVerificationModal: boolean = false;
  isGetOTP: boolean = false;
  isVerifyOTP: boolean = false;
  isVerification: boolean = false;
  locationDetected: boolean = false;
  userMobile = '';
  enteredOtp: any = "";
  isSelectedLocation: boolean;
  activeTypeIndex: number = 0;
  // Akash
  productCapacity: number = 1;
  similarproductData: any;
  lastMinuteBuyData: any;
  cloudImgUrl: string = environment.imageUrl;
  swiperBreakpoints: any = {
    // when window width is >= 320px
    320: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 3,
      spaceBetween: 30
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 4,
      spaceBetween: 25
    },
    768: {
      slidesPerView: 4.5,
      spaceBetween: 15
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 8
    }
  }
  slideCount = 4;
  public imgUrl = environment.imageUrl;
  userAddressList: any = [];
  selectedUserAddress?: any;
  isProceedToPay: boolean = false;
  otpVerified: boolean = false;
  showAddressList: boolean = false;
  isReadMore: boolean = true;
  showPaymentOption: boolean = false;
  isCouponCode: boolean = false
  couponCode = '';
  otpVerificationTokan: string = '';
  // razor pay
  rzp1: any;
  cartTitle: string;
  cartCountTitle: string;
  activatedUrl: string;
  isSelectTimeSlot: boolean = false;
  consultantSlugId: string;
  userLoggedInAccessTokan: any;
  processOrderDetails: any = {
    shortOrderID: "",
    orderId: "",
    txnToken: "",
    amount: null,
  }
  selectedSlot: any;
  isPayment: boolean = false;
  couponOtp: string = "";
  productData: any;
  pdcData: PriceDetailContainerData;

  checkoutData: any;
  type: CheckoutType = "order";
  pdcConfig: PriceDetailContainerConfig = {
    type: "checkout",
    continueText: "Continue",
    showDeliveryCharges: true,
  };
  disableCoupon: boolean = false;
  isQuickCheckout = false;
  paymentSessionActive = true;
  paymentOptionsBody: any = {};
  paymentPaymentModes = [];
  isAppliedCouponDiscount: number = 0;
  isShowAddressForm: boolean = false;
  amountDifferenceForFreeShipping: number = 0;
  totalAmountAfterDiscountForFreeShipping: number = 0;
  isPlaceOrder: boolean = false;
  // screen size 
  screenSize: number;
  mobileSize: boolean;
  desktopSize: boolean;
  productDataAdd: any;
  quantity: number = 1;
  isUserLoggin: boolean = false;

  addressType: Array<any> = [
    {
      'name': "Home",
      'value': 'home',
      'icon': 'app-house-icon'
    },
    {
      'name': "Work",
      'value': 'work',
      'icon': 'app-bag-icon'
    },
    // {
    //   'name': "Hotel",
    //   'value': 'hotel',
    //   'icon': 'app-hotel-icon'
    // },
    // {
    //   'name': "Family",
    //   'value': 'family',
    //   'icon': 'app-family-icon'
    // },
  ];

  addressForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    counrtyCode: new FormControl('+91', [Validators.required]),
    phoneNo: new FormControl('', [Validators.required]),
    pinCode: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.pattern(/^[1-9][0-9]{5}$/)]),
    houseNumber: new FormControl('', [Validators.required]),
    line1: new FormControl('', [Validators.required]),
    country: new FormControl('India', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    // completeAddress: new FormControl('', [Validators.required]),
    // floor: new FormControl('', [Validators.required]),
    landmark: new FormControl(''),
  });

  // @ViewChild('selectedType') userSelectedAddType: ElementRef;
  showAppointmentDetails: boolean = false;
  display: any;
  userAddressType: string = 'home';
  tempCartOpenType: VisibleCartType;
  isLoginMob: boolean;
  visibleCartType: VisibleCartType;
  firstTimeUser: boolean;
  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private consultusService: ConsultUsService,
    private checkoutService: CheckoutService,
    @Inject(PLATFORM_ID) private platformId: any,
    private renderer: Renderer2,
    private toaster: ToastrService,
    private guestCartService: GuestCartService,
    private commonService: CommonService,
    private authService: AuthService,
    private appService: AppService,
    private eventTracking: EventTrackingService,

  ) {

    this.getScreenSize();

    if (true) {
      // let cartType: any = this.cartService.getCartState().subscribe(res => {
      //   this.type = 'appointment';
      // });

      // this.checkoutData = checkoutService.getCheckoutData();
      // this.cartService.getCartState().subscribe((res: any) => {
      //   console.log('res = 245 = ', res);
      // });


      // if (this.checkoutData && this.checkoutData.products.length) {
      //   this.type = this.checkoutData.products[0].checkoutFor;
      //   this.pdcConfig = {
      //     ...this.pdcConfig,
      //     showDeliveryCharges: this.type == "order",
      //   };
      //   this.disableCoupon = this.type == "diagnostic";
      // }

      // if (this.type == "order") {
      //   if (this.checkoutData.products.length) {
      //     this.isQuickCheckout = true;
      //   } else {
      //     // this.getCart(pinCode);
      //   }
      // } else if (this.type == "appointment") {

      //   this.checkoutData = this.checkoutService.getConsultCheckoutData()
      //   console.log("checkoutData", this.checkoutData);
      //   let [appt] = this.checkoutData.appoinment;
      //   if (appt) {
      //     this.pdcData = {
      //       discount: 0,
      //       itemsCount: 1,
      //       totalAmount: appt.appointment.fee,
      //       totalPayableAmt: appt.appointment.fee,
      //       consultantId: appt.appointment.consultantId,
      //     };
      //   }
      // } else {
      //   router.navigate(['/'], { replaceUrl: true })
      // }
    }
  }

  ngOnInit(): void {
    this.visibleCartType = this.cartService.getCartStateValue()
    this.commonService.getLoginState().subscribe(res => {
      if (res) {
        this.isLoginMob = true;
        this.getAddressList()
        this.firstTimeUser = localStorage.getItem('firstTimeUser')?.toLowerCase() === "true";
      }
    });
    const visibleCartType = this.cartService.getCartStateValue()
    if (visibleCartType == 'consult') {
      // this.cartService.setCartState('consult')
      this.cartTitle = 'Consultation Booking';
      this.cartCountTitle = 'Checkout Items';
      // this.cartService.getCartSubscripition().subscribe((data) => {
      //   this.handleCartResponse(data);
      // });
    } else {
      // this.cartService.setCartState('shop')
      this.cartTitle = 'My Cart';
      this.cartCountTitle = 'Cart Items';
      this.cartService.getCartSubscripition().subscribe((data) => {
        this.handleCartResponse(data);
      });
    }

    if (this.commonService.isBrowser) {
      //Tawk_API?.hideWidget()
      if(this.router.url.startsWith('/cart')){
        document.body.classList.add('overflow-hidden')
      }
    }

    this.cartService.getCartData().subscribe(data => {
      if (this.isAppliedCouponDiscount) {
        this.removeCoupon()
        this.toaster.warning('Coupon has been removed! Please apply again')
      }
      const visibleCartType = this.cartService.getCartStateValue()
      if (visibleCartType == 'shop') {
        this.cartData = data.shop;
        this.cartProducts = data.shop?.products || [];
        this.pdcData = data.shop as unknown as PriceDetailContainerData
        this.totalAmountAfterDiscountForFreeShipping = this.pdcData.totalAmount - this.pdcData.discount;
        if(this.totalAmountAfterDiscountForFreeShipping<=300){
          this.amountDifferenceForFreeShipping = 300 - this.totalAmountAfterDiscountForFreeShipping ;
        }
      } else if (visibleCartType == 'consult') {
        this.pdcData = data.consult as unknown as PriceDetailContainerData
        this.cartData = data.consult;
        this.checkoutConsultationCart = [data.consult]
        this.consultantSlugId = data.consult?.consultant?._id
      } else {
        console.warn('Cart type not handled.')
      }
    }, e => {
      if (e?.error?.data == null) {

      }
    })


    // this.cartService.getCartState().subscribe(res => {
    //   if (res == 'consult') {
    //     this.cartTitle = 'Consultation Checkout';
    //     this.cartCountTitle = 'Checkout Items';
    //     // this.cartService.getCartSubscripition().subscribe((data) => {
    //     //   this.handleCartResponse(data);
    //     // });
    //   } else {
    //     this.cartTitle = 'My Cart';
    //     this.cartCountTitle = 'Cart Items';
    //     this.cartService.getCartSubscripition().subscribe((data) => {
    //       this.handleCartResponse(data);
    //     });
    //   }
    // });

    // this.cartService.getCartState().subscribe(res => {
    //   if (res == 'shop') {
    //     this.cartService.getCartSubscripition().subscribe((data) => {
    //       this.handleCartResponse(data);
    //     });
    //   }
    // });
    // this.activatedRoute.paramMap.subscribe(paramMap => {
    //   this.activatedUrl = this.router.url;

    //   // console.log('Activated URL:', this.activatedUrl);
    //   if (this.activatedUrl == '/consult-us') {
    //     this.cartTitle = 'Consultation Checkout';
    //     this.cartCountTitle = 'Checkout Items';
    //   } else {
    //     this.cartTitle = 'My Cart';
    //     this.cartCountTitle = 'Cart Items';
    //   }
    // });

    // this.cartService.getCartSubscripition().subscribe((data) => {
    //   this.handleCartResponse(data);
    // });
    // call the API of cart items

    this.getCartItems();
    //console.log("CART DATA: >>>>>>> ", this.cartData);
    this.eventTracking.viewCart()
  }

  ngOnDestroy() {
    if (this.commonService.isBrowser) {
      document.body.classList.remove('overflow-hidden');
      //Tawk_API?.showWidget()
    }
  }

  getScreenSize() {
    if (typeof window !== undefined && isPlatformBrowser(this.platformId)) {
      this.screenSize = window.innerWidth;
      if (this.screenSize <= 768) {
        this.mobileSize = true;

      } else {
        this.desktopSize = true;
      }
    }
  }

  showText() {
    this.isReadMore = !this.isReadMore
  }

  getCartItems() {
    this.isUser = this.commonService.getUser();
    this.isLoadingCart = true;
    let user: any = this.commonService.getUser();
    this.tempCartOpenType = this.cartService.getCartStateValue()

    if (this.tempCartOpenType == 'consult') {
      if (user) {
        //checkout cart
        this.cartService.getConsultantCart().subscribe((res: any) => {
          if (res.data.cart.consultant) {
            this.checkoutConsultationCart = [res.data.cart];
            //console.log('this.checkoutConsultationCart = ', this.checkoutConsultationCart);
          } else {
            this.checkoutConsultationCart = [];
          }
          this.isLoadingCart = false;
        });
      } else {
        let guestCartId = localStorage.getItem('guestCheckoutCartId');
        if (guestCartId) {
          this.cartService.getGuestConsultCart(guestCartId).subscribe((res: any) => {
            if (res.data.cart?.consultant) {
              this.checkoutConsultationCart[res.data.cart];
              console.log('this.checkoutConsultationCart = ', this.checkoutConsultationCart);
            } else {
              this.checkoutConsultationCart = [];
            }
            this.isLoadingCart = false;
            // this.checkoutConsultationCart.push(res.data.cart);
            // console.log('this.checkoutConsultationCart = ', this.checkoutConsultationCart);
            // this.cartData = res.data;
            // this.cartProducts = this.cartData.products;
            // this.isLoadingCart = false;
          });
        }
      }
    } else {
      //console.log('consult us false');
      if (user) {
        let params: any = {}
        if (this.selectedUserAddress?.['pinCode']) {
          params.pincode = this.selectedUserAddress['pinCode']
        }
        this.cartService.getShopCart(params).subscribe((res: any) => {
          this.handleCartResponse(res.data);
          const { cartData } = this.cartService
          cartData.shop = res.data
          this.cartService.setCartData(cartData)
          // this.cartData = res.data;
          // console.log('this.cartData = ', this.cartData);
          // this.cartProducts = this.cartData.products;
          this.isLoadingCart = false;
          this.getSimilarproductData()
          this.getLastMinuteBuyData()
        });
      } else {
        if (typeof localStorage !== 'undefined') {
          let guestCartId = localStorage.getItem('guestCartId');
          let guestCart = this.guestCartService.getGuestCart();

          if (guestCart) {
            // this.loader = true;
            this.cartService.getGuestCart(guestCart._id)
              .toPromise()
              .then((res: any) => {
                this.isLoadingCart = false;
                this.cartService.setDatatoCartSubscription(res.data);
                this.handleCartResponse(res.data)
              })
              .catch((err: HttpErrorResponse) => {
                this.isLoadingCart = false;
                if (err.status == 404) {
                  localStorage.removeItem('cart');
                } else {
                  this.toaster.error(err.error.message);
                }
              });
          } else {
            // this.showUpsell = false;
            this.cartProducts = [];
            this.isLoadingCart = false;
          }
          this.getSimilarproductData();
          this.getLastMinuteBuyData()
          // if (guestCartId) {
          //   this.cartService.getGuestCart(guestCartId).subscribe((res: any) => {
          //     this.cartData = res.data;
          //     this.cartProducts = this.cartData.products;
          //     this.isLoadingCart = false;
          //     this.getSimilarproductData()
          //   });
          // }
        }
      }

    }

  }

  handleCartResponse(data: any) {

    if (!data) {
      return
    }
    this.productData = data;
    let { _id, products, updatedAt } = data;
    let daysDiff = dateDiff("2023-04-09T11:05:08.398Z" || updatedAt, 'days')

    // imp note please removed comment out before go live (remove comment out)
    // if (gtag && daysDiff > 0 && daysDiff < 31) {
    //   gtag('event', 'abandoned_cart_recovery', {
    //     userId: this.cartService.getUser()?.user?._id || null,
    //     cartId: _id,
    //     products: data.products?.map((product: any) => ({
    //       _id: product?.productId?._id,
    //       name: product?.productId?.name,
    //       quantity: product?.quantity,
    //     }))
    //   })
    // }

    this.pdcData = {
      discount: data.discount,
      giftOptions: data.giftOptions,
      isGiftable: data.isGiftable,
      itemsCount: data.products.reduce((total: number, el: any) => total + el.quantity, 0),
      shippingCharge: data.shippingCharge,
      totalAmount: data.totalAmount,
      totalPayableAmt: data.totalPayableAmt,
      products: data.products
    };

    products = products.map((product: any) => {
      product.productId.mainVariations = product.productId.mainVariations.filter((el: any) => !!el.values.length)
      product.productId.variations = product.productId.variations.filter((el: any) => !!el.label.length)
      return product;
    });
    products = products.map((product: any) => {
      if (product.productId.mainVariations.length && product.productId.variations.length) {
        this.checkoutService.addTitleInVariations(product.productId);
        let selectedVariation = product.productId.variations.find((el: any) => el.slug == product.productId.slug);
        product.selectedVariation = selectedVariation;
      }
      return product;
    })

    this.cartProducts = products;
  }

  // get consult cart item
  // getConsultCartItems() {
  //   this.isLoadingCart = true;
  //   let user = this.commonService.getUser();
  //   // let user = this.cartService.getUser();
  //   if (this.activatedUrl == '/consult-us') {
  //     // let userLoggedIn: any = localStorage.getItem('userData');
  //     if (user) {

  //       this.cartService.getConsultantCart().subscribe((res: any) => {
  //         this.checkoutConsultationCart = res.data;
  //         console.log('get checkout cart count user login = ', res);
  //         this.isLoadingCart = false;
  //       });
  //     }
  //     else {
  //       let guestCartId = localStorage.getItem('guestCheckoutCartId');
  //       if (guestCartId) {
  //         this.cartService.getGuestConsultCart(guestCartId).subscribe((res: any) => {
  //           this.checkoutConsultationCart = res.data;
  //           console.log('get checkout cart count user login = ', res);
  //           this.isLoadingCart = false;
  //           // this.cartData = res.data;
  //           // this.cartProducts = this.cartData.products;
  //           // this.isLoadingCart = false;
  //         });
  //       }
  //     }
  //   }
  // }

  openCouponModal() {
    const user = this.commonService.getUser()?.user
    if (user) {
      // this.isVerificationModal = true;
      this.isCouponCode = true;
    } else {
      this.showLoginPopup = true
      // this.isVerificationModal = true;
      // this.isGetOTP = true;
      // this.toaster.error('Please login first to apply coupon');
    }
    // this.commonService.getLoginState().subscribe(res => {
    //   if (res) {
    //     this.isVerificationModal = true;
    //     this.isCouponCode = true;
    //   } else {
    //     this.isVerificationModal = true;
    //     this.isGetOTP = true;
    //     this.toaster.error('Please Login First to Apply Coupon');
    //   }
    // });

  }

  applyCouponCode() {
    //console.log('this.cartData = ', this.pdcData);
    let continueFlag = true;
    let body = {
      'code': this.couponCode.toUpperCase(),
      'totalPayableAmount': this.pdcData.totalPayableAmt
    }
    if(!this.firstTimeUser && this.couponCode.toUpperCase() == "FIRST10"){
      continueFlag = false;
      this.couponCode = '';
    }
    if(continueFlag){
      this.cartService.applyCouponCode(body).subscribe((res: any) => {
        if (res) {
          this.pdcData.totalPayableAmt = res.data.totalPayableAmount
          console.log('after coupon applied= ', this.pdcData.totalPayableAmt);
          this.isAppliedCouponDiscount = res.data.discount
          this.isCouponCode = false;
          this.isVerificationModal = false;
          this.couponCode = '';
        }
      }, e => {
        this.couponCode = '';
        this.toaster.error(e?.error?.message)
      })
    }else{
      this.couponCode = '';
      this.toaster.error("You're not eligible for FIRST10 coupon");
    }
  }

  removeCoupon() {
    this.pdcData.totalPayableAmt = this.pdcData.totalPayableAmt + this.isAppliedCouponDiscount;
    this.isAppliedCouponDiscount = 0;
    console.log('after coupon removed= ', this.pdcData.totalPayableAmt);

  }

  closeCouponModal() {
    this.isCouponCode = false;
    this.isVerificationModal = false;
    this.showAddressList = true;
  }

  getGuestCartItems(id: any) {
    this.isLoadingCart = true;
    this.cartService.getGuestCart(id).subscribe((res: any) => {
      this.cartData = res.data;
      this.cartProducts = this.cartData.products;
      this.isLoadingCart = false;
    });
  }

  hideCart() {
    this.onCloseCart.emit(false);
    if (this.mobileSize) {
      window.history.back();
    }
  }

  openVerificationModal() {

    let user = this.commonService.getUser();
    if (user) {
      this.otpVerified = true;
    } else {
      this.showLoginPopup = true
      return;
    }

    if (this.otpVerified) {
      this.isVerificationModal = true;
      // this.getAddressList();
    }
    if (!this.isProceedToPay) {
      this.isVerificationModal = true;
      if (!user) {
        this.isGetOTP = true;
      } else {
        // this.getAddressList();
      }
    } else {
      this.showPaymentOption = true;
    }
  }

  bookConsultation(id: any) {
    console.log('bookConsultation function calling');
    let user = this.commonService.getUser()?.user;
    if (!user) {
      this.showLoginPopup = true;
      return;
    }

    console.log('bookConsultation function calling');
    this.consultantSlugId = id.consultant.slug
    // this.consultusService.getConsultantDetails(id.consultant.slug).subscribe((res: any) => {
    //   console.log(res.data);
    // });

    // let user = this.cartService.getUser();
    console.log('this.otpVerified = ', this.otpVerified);

    if (!this.selectedSlot) {
      this.isSelectTimeSlot = true;
      return
    }
    if (!this.isProceedToPay) {
      if (!user) {
        this.showLoginPopup = true;
        // this.isGetOTP = true;
      } else {
        // this.getAddressList();
      }
    } else {
      // this.hideCart();
      // this.isProceedToPay = true;
      // this.showPaymentOption = true;
      // alert('Pamyment gateway !');
      this.payWithPayTMForConsultFee();
    }
  }

  closeVerificationModal() {
    this.isVerificationModal = false;
    this.isCouponCode = false;
    this.isSelectTimeSlot = false;
  }

  getOTP() {
    // Call the API if API response received then open 2nd body to verify the OTP
    let body = {
      "countryCode": "+91",
      "phone": this.userMobile,
      "logintType": "mobileOtpLogin",
    }

    this.cartService.checkUser(body).subscribe((res: any) => {
      if (res) {
        this.otpVerificationTokan = res.data.confirmationToken;
        // this.isGetOTP = false;
        this.isVerifyOTP = true;
      }
      this.toaster.success('OTP sent to entered mobile number')
    }, error => {
      this.toaster.error(error);
    });
  }

  // submitOTP() {
  //   this.isVerification = true;
  //   this.isVerifyOTP = false;
  //   setTimeout(() => {
  //     this.commonService.setLoginState(true);
  //     // And any other code that should run only after 5s
  //     this.isVerification = false;
  //     this.isGetOTP = false;
  //     this.closeVerificationModal();
  //     this.getAddressList();

  //     this.otpVerified = true;
  //   }, 2500);
  // }


  // submitOTP() {
  //   let verifyOTPBody = {
  //     "otp": this.enteredOtp,
  //     "verificationToken": this.otpVerificationTokan,
  //     "cartId": ""
  //   }
  //   this.isVerifyOTP = false;
  //   this.cartService.LoginVerifyOTP(verifyOTPBody).subscribe((res: any) => {
  //     if (res) {
  //       this.isVerification = true;
  //       // this.isGetOTP = false;
  //       this.authService.onLoggedIn(res.data);

  //       setTimeout(() => {
  //         // And any other code that should run only after 5s
  //         this.isVerification = false;
  //         this.closeVerificationModal();
  //       }, 2500);

  //       this.otpVerified = true;
  //       let userLoggedIn: any = this.commonService.getUser();
  //       // let userLoggedIn: any = localStorage.getItem('userData');
  //       // userLoggedIn = JSON.parse(userLoggedIn);
  //       if (userLoggedIn) {
  //         let guestLocation: any = localStorage.getItem('guestUserLocation');
  //         guestLocation = JSON.parse(guestLocation)
  //         if (guestLocation) {
  //           this.commonService.addUserCurrentLocation(guestLocation).subscribe((res: any) => {
  //             if (res) {
  //               localStorage.setItem('userLocation', JSON.stringify(guestLocation));
  //               this.isSelectedLocation = false;
  //               // this.getDeliverLocation();
  //             }
  //             localStorage.removeItem('guestUserLocation');
  //           });
  //         }
  //         this.isUserLoggin = true;
  //       }
  //       this.router.navigate([""]);

  //     }
  //   }, error => {
  //     this.isVerifyOTP = true;
  //   });
  //   this.router.navigate([""])
  // }

  changeMobileNo() {
    this.isVerificationModal = true;
    this.isVerifyOTP = false;
    // this.isGetOTP = true;
  }

  submitOTPMob() {
    let verifyOTPBody = {
      "otp": this.enteredOtp,
      "verificationToken": this.otpVerificationTokan,
      "cartId": ""
    }
    this.isVerifyOTP = false;
    this.cartService.LoginVerifyOTP(verifyOTPBody).subscribe((res: any) => {
      if (res) {
        this.isVerification = true;
        // this.isGetOTP = false;
        this.authService.onLoggedIn(res.data);
        this.firstTimeUser = res.data.firstTimeUserForOrder;
        console.log("User Status >>>>", this.firstTimeUser);
        setTimeout(() => {
          // And any other code that should run only after 5s
          this.isVerification = false;
          this.closeVerificationModal();
        }, 2500);

        this.otpVerified = true;
        this.commonService.setLoginState(true);
        let userLoggedIn: any = this.commonService.getUser();
        // let userLoggedIn: any = localStorage.getItem('userData');
        // userLoggedIn = JSON.parse(userLoggedIn);
        if (userLoggedIn) {
          let guestLocation: any = localStorage.getItem('guestUserLocation');
          localStorage.setItem('firstTimeUser', JSON.stringify(this.firstTimeUser));
          guestLocation = JSON.parse(guestLocation)
          if (guestLocation) {
            this.commonService.addUserCurrentLocation(guestLocation).subscribe((res: any) => {
              if (res) {
                localStorage.setItem('userLocation', JSON.stringify(guestLocation));
                this.isSelectedLocation = false;
                // this.getDeliverLocation();
              }
              localStorage.removeItem('guestUserLocation');
            });
          }
          this.isUserLoggin = true;
        }
        console.log("User Login Status >>>>", this.isUserLoggin);
        // this.router.navigate([""]);

      }
    }, error => {
      this.isVerifyOTP = true;
    });


  }


  openModal() {
    this.renderer.addClass(this.detailsModal.nativeElement, 'show');
    this.renderer.setStyle(this.detailsModal.nativeElement, 'display', 'block');
  }

  closeModal() {
    this.renderer.removeClass(this.detailsModal.nativeElement, 'show');
    this.renderer.setStyle(this.detailsModal.nativeElement, 'display', 'none');
    // this.router.navigate([""])
  }

  getSimilarproductData() {
    this.productService.getOurBestSeller().subscribe((res: any) => {
      console.log("Raw response SIMILAR :", res);
      if (res.data) {
        this.similarproductData = res.data.map((item: any) => new HealthConcernProduct(item));
        this.isCartSimilarProducts = true;
      } else {
        console.log('NO PRODUCT FOUND');
      }
    });
  }

  // getLastMinuteBuyData() {
  //   this.productService.getLastMinuteBuyProducts().subscribe((res: any) => {
  //     console.log("Raw response:", res);
  //           res.data.products.map((prod: any) => {
  //       let productDiscount = Math.floor(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
  //       prod.discount = productDiscount;
  //       filterArr.push(prod);
  //     });
  //     if (res.data) {
  //       this.lastMinuteBuyData = res.data.map((item: any) => new HealthConcernProduct(item));
  //       console.log("LAST MINUTE >>>> ", this.lastMinuteBuyData);
  //       this.isCartSimilarProducts = true;
  //     } else {
  //       console.log('NO PRODUCT FOUND');
  //     }
  //   });
  // }


  getLastMinuteBuyData() {
    this.productService.getLastMinuteBuyProducts().subscribe((res: any) => {
      //this.isLoadingSec1 = false
      //this.hideSpinner()
      let filterArr: any[] = [];
      res.data.products.map((prod: any) => {
        let productDiscount = Math.floor(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
        prod.discount = productDiscount;
        console.log("PROD OBJ:", prod);
        filterArr.push(prod);
      });
      this.isCartSimilarProducts = true;
      this.lastMinuteBuyData = filterArr;
      //console.log("SEXUAL WELL DATA::: " ,this.sexualWellnessProducts);
    },);
  }

  addItemToCart(prod: any) {
    console.log('inside Product Added >>>>>>>>>');
    let prodBody = {
      "product": {
        "productId": prod.productId._id,
        "quantity": 1,
        "weight": prod.weight,
        "label": prod.label ? prod.label : prod.variation[0].label,
        "slug": prod.productId.slug
      }
    }

    let user = this.commonService.getUser();
    // let user = this.cartService.getUser();
    if (user) {
      this.cartService.addToCart(prodBody).subscribe((res: any) => {
        this.getCartItems();

      });
    } else { 

      this.cartService.addToCartForGuest(prodBody).subscribe((res: any) => {
        this.getGuestCartItems(res.data.cart._id);
      });
    }
  }

  removeProduct(prod: any) {
    let user = this.commonService.getUser();
    // let user = this.cartService.getUser();

    if (user) {
      let body = {
        "productId": prod.productId._id
      }
      // this.cartService.removeProduct(body).subscribe((res: any) => {
      this.cartService.removeProductFromCart(body).subscribe((res: any) => {
        this.getCartItems();
      });
    } else {
      let guestCartId = localStorage.getItem('guestCartId');
      let body = {
        "productId": prod.productId._id,
        '_id': guestCartId
      }
      this.cartService.removeGuestProduct(body).subscribe((res: any) => {
        this.getCartItems();
      });
    }

  }

  removeConsultFromCart() {
    // let user = this.commonService.getUser();
    // if (user) {
    //   this.cartService.removeConsultFromCart().subscribe((res: any) => {
    //     if (res) {
    //       // this.getConsultCartItems();
    //       this.getCartItems();
    //     }
    //   }, error => {
    //     console.log('error = ', error);
    //   });
    // } else {
    let guestCartId = localStorage.getItem('guestCheckoutCartId');
    //console.log('removed guestCartId = ', guestCartId);

    let body = {
      'consultantCartCartId': guestCartId
    }
    this.cartService.removeGuestConsult(body).subscribe((res: any) => {
      // this.getConsultCartItems();
      this.getCartItems();
    });
    // }

  }

  getAddressList() {
    // this.isGetOTP = false;
    this.cartService.getUserAddress().subscribe((res: any) => {
      if (res) {
        this.userAddressList = res.data.address.length > 0 ? res.data.address : [];
      }
      // this.userAddressList = res?.data?.address ? res?.data?.address : [];
      // this.showAddressList = this.userAddressList.length === 0 ? false : true;
    });
    // this.showAddressList = false;
    // this.isShowAddressForm = true;
  }

  selectedAddress(add: any, addIndex: number) {
    this.showAddressList = false
    this.isShowAddressForm = false
    this.selectedUserAddress = add;
    this.isProceedToPay = true;
    this.getCartItems()
  }


  onAddressSubmit() {
    console.log('this.addressForm', this.addressForm);
    if (this.addressForm.invalid) return;

    let addressBody = {
      "address": {
        ...this.addressForm.value,
        type: this.userAddressType
      }
    }

    this.cartService.addUserAddress(addressBody).subscribe((res: any) => {
      this.getAddressList();
      this.isShowAddressForm = false
      this.showAddressList = true

      addressBody = {
        "address": {
          "name": "",
          "phoneNo": "",
          "pinCode": "",
          "houseNumber": "",
          "line1": "",
          "country": "India",
          "state": "Maharashtra",
          "city": "Pune",
          "landmark": "",
          "type": "home",
          "counrtyCode": "+91"
        }
      }
    });
  }

  // Akash
  // increment(prod: any) {
  //   return prod.quantity + 1;
  // }

  // decrement(prod: any) {
  //   return prod.quantity != 0 ? prod.quantity - 1 : 0;
  // }

  navigateToHomePage() {
    this.hideCart();
    this.router.navigate([""]);
  }
  navigateToConsultPage() {
    this.hideCart();
    // this.router.navigate(["/consult-us"]);
  }

  openAddressModal() {
    this.selectedUserAddress = null
    this.showAddressList = true
    this.isProceedToPay = false
  }


  getAppointmentSelectedSlot(event: any) {
    console.log('selected slot details in cart component = ', event);
    this.isSelectTimeSlot = false
    if (event) {
      this.isVerificationModal = false;
      this.selectedSlot = event;

      this.showAppointmentDetails = true;
      this.isProceedToPay = true;
      this.timer(5);
    }
  }

  timer(minute: number) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log('finished');
        clearInterval(timer);
      }
    }, 1000);
  }


  payWithPayTM() {
    // this.isPayment = true;
    this.navigateToPayment();
  }

  payWithPayTMForConsultFee() {
    this.isPayment = true;
    this.createAppointment();

  }

  createOrder(data: any, deliveryAddress: any) {
    if (this.isPlaceOrder) {
      return; // prevent multiple clicks
    }
    this.isPlaceOrder = true;
    if (!this.isLoginMob) {
      this.eventTracking.beginCheckout()
      this.showLoginPopup = true;
      this.isPlaceOrder = false;
      return;
    } else {
      this.eventTracking.beginCheckout()
    }

    if (!this.selectedUserAddress) {
      if (this.userAddressList.length) {
        this.showAddressList = true
      } else {
        this.isShowAddressForm = true
      }
      this.isPlaceOrder = false;
      return
    }

    let billingInfo = this.getAddress(deliveryAddress);
    let products: Array<CreateOrderProduct> = [];
    data.forEach((product: any) => {

      let orderProduct: CreateOrderProduct = {
        productId: product.productId._id,
        quantity: product.quantity,
        weight: product.weight,
      };
      if (product.label) {
        orderProduct.label = product.label;
      }
      products.push(orderProduct);
    });

    let order: CreateOrderData = {
      products: products,
      billingInfo,
      shippingInfo: billingInfo,
      couponCode: this.couponCode,
      couponOtp: this.couponOtp ? this.couponOtp : "",
      paymentCallbackUrl: environment.appHost + "pay-status",
    };

    console.log('order = ', order);
    order.couponCode ? "" : delete order.couponCode;
    order.couponOtp ? "" : delete order.couponOtp;
    this.createOrderId(order);
  }

  createAppointment() {
    // this.spinner.show();
    let temp = this.checkoutService.getConsultCheckoutData();
    let [apptData] = temp.appoinment;
    // "appointmentMode": "audio",
    //   "consultantId": "60c8888a1700463b75e07d51",
    //     "date": "2024-05-29",
    //       "fee": 100,
    //         "isGoogleMeet": true,
    //           "paymentCallbackUrl": "https://healthybazar.com/pay-status",
    //             "primaryTimeSlot": "19:15 - 19:30"
    let reqPayload: any = {
      consultantId: apptData.appointment.consultantId,
      date: apptData.appointment.date,
      primaryTimeSlot: apptData.appointment.primaryTimeSlot,
      fee: apptData.appointment.fee,
      paymentCallbackUrl: environment.appHost + "pay-status",
      isGoogleMeet: true,
      // isZoom: apptData.appointment.appointmentMode == 'audio' || apptData.appointment.appointmentMode == 'video',
      appointmentMode: apptData.appointment.appointmentMode.appointmentMode,
    }
    if (this.couponCode) reqPayload['couponCode'] = this.couponCode;

    this.consultusService
      .createAppointment(reqPayload)
      .subscribe(
        (res: any) => {
          console.log('create app = ', res);
          let appointmentData: any = {
            'appointmentId': res.data._id,
            'fee': res.data.fee,
          }
          localStorage.setItem('consultInitiateTransaction', JSON.stringify(appointmentData));

          // this.spinner.hide();
          this.cartService.openDirectCart(false)
          let { isFree, data } = res;
          let { _id, fee, appointmentId } = data;
          if (isFree || fee === 0) {
            let queryParams = {
              resultStatus: 'TXN_SUCCESS',
              paymentFor: 'appointment',
              withoutTxn: true,
              orderId: _id,
              shortOrderID: appointmentId,
            };
            this.router.navigate(['/cart/checkout/thank-you'], { queryParams, replaceUrl: true });
          } else {
            this.processOrderDetails.orderId = _id;
            this.processOrderDetails.amount = fee;
            console.log('processOrderDetails 1017 = ', this.processOrderDetails);
            let payload: any = {
              'amount': res.data.fee,
              'appointmentId': res.data._id,
            }
            // this.initiateTransaction(payload);
            localStorage.setItem('initiateTransaction', JSON.stringify(payload));
            this.cartService.setCartState('consult')
            this.navigateToPayment('appointment');
          }
        },
        (err: HttpErrorResponse) => {
          // this.spinner.hide();
          // this.enablePlaceOrder = true;
          if (err.error?.message?.toLowerCase() == "slot not available") {
            this.toaster.error(err.error.message);
            this.router.navigate(
              [`/consult-us/doctor/${apptData.appointment.consultantSlug}`],
              { replaceUrl: true }
            );
          } else
            this.toaster.error(err.error.message || "Something went wrong!");
        }, () => {
          // this.spinner.hide();
        }
      );
  }

  getAddress(deliveryAddress: any) {
    console.log('deliveryAddress = ', deliveryAddress);

    let name = deliveryAddress.name.trim().split(" ");

    return {
      firstName: name[0],
      lastName: name.length > 1 ? name[name.length - 1] : "",
      email: "",
      countryCode: "+91",
      phone: deliveryAddress.phoneNo,
      address: {
        country: deliveryAddress.country,
        line1: deliveryAddress.line1,
        line2: "",
        landmark: deliveryAddress.landmark,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        pinCode: deliveryAddress.pinCode,
        houseNumber: deliveryAddress.houseNumber,
        type: deliveryAddress.type,
      },
    };
  }

  createOrderId(data: CreateOrderData) {
    // if (this.processOrderDetails.orderId) {
    //   this.navigateToPayment('shop');
    // }

    this.checkoutService.createOrder(data).subscribe((res: any) => {
      //console.log('createOrder = ', data);
      // this.spinner.hide();
      let { totalPayableAmount, totalSavings, _id, orderId, shippingCharges } = res.data;
      this.processOrderDetails.shortOrderID = orderId;
      this.processOrderDetails.orderId = _id;
      this.processOrderDetails.amount = totalPayableAmount;

      this.cartData = {
        ...this.cartData,
        shippingCharge: Math.round(shippingCharges || 0),
        totalPayableAmt: totalPayableAmount,
      };
      this.pdcData = {
        discount: totalSavings,
        giftOptions: this.cartData.giftOptions,
        isGiftable: this.cartData.isGiftable,
        itemsCount: this.getTotalQuantity(res.data.products),
        // itemsCount: this.getTotalQuantity(this.cartData.products),
        shippingCharge: this.cartData.shippingCharge,
        totalAmount: this.cartData.totalAmount,
        totalPayableAmt: this.cartData.totalPayableAmt,
        products: this.cartData.products,
      };
      //console.log('this.pdcData = ', this.pdcData);

      if (totalPayableAmount === 0) {
        this.isPlaceOrder = false;
        let queryParams = {
          resultStatus: 'TXN_SUCCESS',
          paymentFor: 'order',
          withoutTxn: true,
          orderId: _id,
          shortOrderID: orderId,
        };
        return this.router.navigate(['/cart/checkout/thank-you'], { queryParams, replaceUrl: true });
      }


      let initiateTransactionDetails: any = {
        'totalPayableAmount': totalPayableAmount,
        'orderId': _id,
      }
      // this.initiateTransaction(initiateTransactionDetails);

      localStorage.setItem('initiateTransaction', JSON.stringify(initiateTransactionDetails));
      localStorage.setItem('pdcData', JSON.stringify(this.pdcData));
      this.isPlaceOrder = false;
      return this.navigateToPayment('order');
    }, (err: HttpErrorResponse) => {
      // this.spinner.hide();
      // this.enablePlaceOrder = true;
      // this.disableCoupon = false;
      this.isPlaceOrder = false;
      this.toaster.error(err.error?.message || 'Something went wrong');
    });
  }

  // initiateTransaction(data: any) {
  //   console.log('InitiateTransaction data = ', data);
  //   this.checkoutService.initiateTransaction(data).subscribe((res: any) => {
  //     let { resultInfo } = res.body;
  //     if (resultInfo.resultStatus == "S") {
  //       let { txnToken } = res.body;
  //       localStorage.setItem('initiateTransactiontxnToken', JSON.stringify(txnToken));
  //     } else if (resultInfo.resultCode == "325") {
  //       // this.invalidLink = true;
  //     } else {
  //       this.toaster.error(resultInfo.resultMsg)
  //     }
  //   }, (err: any) => {
  //     // this.spinner.hide()
  //     this.toaster.error('Error on initiateTransaction')
  //     console.log('err = ', err);
  //   })
  // }

  getTotalQuantity(products: any[]) {
    return products.reduce((total, el) => total + el.quantity, 0);
  }

  navigateToPayment(orderType?: PaymentFor) {
    this.isPayment = true;
    if (this.desktopSize) {
      this.hideCart();
    }
    this.appService.setMobCartState(true);
    this.router.navigate(['/payment'], { queryParams: { paymentFor: orderType || 'order' } });
  }


  openMobileAddressModal() {
    this.renderer.removeClass(this.filterModal.nativeElement, 'show');
    this.renderer.setStyle(this.filterModal.nativeElement, 'display', 'block');
  }

  enterAddress() {
    this.showAddressList = false;
    this.isShowAddressForm = true;
  }

  quantityPicker(value: string, item: any) {
    if (value == "add") {
      if (item.quantity < item.productId?.maxSaleQty) {
        item.quantity += 1;
        this.changeCartQuantity(item);
      }
      if (item.quantity == item.productId?.maxSaleQty) {
        this.toaster.warning(
          // this.translateService.instant("warningMessages.maxSaleQty")
        );
      }
    }
    if (value == "remove") {
      if (item.quantity > 1) {
        item.quantity -= 1;
        this.changeCartQuantity(item);
      }
      if (item.quantity == 1) {
        item.quantity = item.quantity;
      }
    }
  }



  changeCartQuantity(item: any) {
    console.log('item = ', item);

    if (this.isUser) {
      const data = {
        product: {
          productId: item?.productId?._id,
          quantity: item?.quantity,
          label: item.label || [],
          weight: item.weight,
          slug: item.productId.slug,
          pageType: "cart",
        },
      };
      this.cartService
        .addToCart(data)
        .toPromise()
        .then((res: any) => {
          this.getCartItems();
          this.toaster.success('Quantity updated');
        })
        .catch((err: any) => {
          this.toaster.error(err.error?.message || 'Something went wrong!');
        });
    }
    else {
      let guestCart = this.guestCartService.getGuestCart();
      // let guestCart: any;
      // this.cartService.getCartSubscripition().subscribe((res: any) => {
      //   guestCart = res;
      // });
      const data = {
        _id: guestCart._id,
        product: {
          productId: item?.productId?._id,
          quantity: item?.quantity,
          label: item.label || [],
          weight: item.weight,
          slug: item.productId.slug,
          pageType: "cart",
        },
      };

      this.cartService.addToCartForGuest(data)
        .toPromise()
        .then((res: any) => {
          this.getCartItems();
          this.toaster.success('Quantity updated');
        })
        .catch((err: any) => {
          this.toaster.error(err.error.error);
        });
    }
  }

  removeProductFromCart(product: any) {
    if (this.isUser) {
      const data = {
        productId: product.productId._id
      };
      // this.cartService
      //   .removeProduct(data)
      //   .toPromise()
      //   .then((res: any) => {
      this.cartService
        .removeProductFromCart(data)
        .toPromise()
        .then((res: any) => {

          // const gtagEventData = {
          //   userId: this.commonService.getUser()?.user?._id || null,
          //   // userId: this.cartService.getUser()?.user?._id || null,
          //   productId: product?._id,
          //   productName: product?.name,
          // }

          // gtag && gtag('event', 'remove_from_cart', gtagEventData)

          // this.cartCount.getCartCount();
          this.getCartItems();
          this.toaster.success('Product removed successfully');
        })
        .catch((err: any) => {
          this.toaster.error(err.error.message);
        });
    }
    else {
      let guestCart = this.guestCartService.getGuestCart();
      const data = {
        productId: product.productId._id,
        _id: guestCart._id
      }
      this.cartService.removeGuestProduct(data)
        .toPromise()
        .then((res: any) => {
          this.getCartItems();
          this.toaster.success('Product removed successfully');
        }, error => {
          this.toaster.error('Error')
        })
        .catch((err: any) => {
          this.toaster.error(err);
        });
    }

  }

  // as per satinder sir logic
  async addToCart(productData: any, redirectToCheckout: boolean = false) {
    this.productDataAdd = productData
    // this.spinner.show();
    // if (!redirectToCheckout) this.checkoutService.clearCheckoutData();
    // if (isPlatformBrowser(this.platformId)) {
    let user = this.commonService.getUser();
    // let user = this.cartService.getUser();
    if (user) {
      const data: any = {
        product: {
          productId: productData._id,
          quantity: this.quantity,
          weight: productData.weight,
        },
      };
      let variant = this.getActiveVariant();
      if (productData.label) {
        data.product.label = productData.label;
        data.product.slug = productData.slug;
        data.product.weight = productData.weight;
      } else if (variant) {
        data.product.productId = variant.productId;
        data.product.label = variant.label;
        data.product.slug = variant.slug;
        data.product.weight = variant.weight;
      }
      this.cartService
        .addToCart(data)
        .toPromise()
        .then((res: any) => {
          // this.spinner.hide();
          const gtagEventData = {
            productId: productData._id,
            name: productData.name,
            quantity: this.quantity,
            user: this.commonService.getUser()?.user?._id || null,
            // user: this.cartService.getUser()?.user?._id || null,
          };
          this.commonService.isBrowser && gtag && gtag('event', 'add_to_cart', gtagEventData);
          this.commonService.isBrowser && gtag && gtag('event', 'conversion', { 'send_to': 'AW-564095127/JHdCCIL5zP4CEJfR_YwC' });

          if (!redirectToCheckout) {
            this.toaster.success('Product added to cart');
          }

          // this.cartCount.getCartCount();
          // redirectToCheckout && this.navigateToCheckout();
        })
        .catch((err: any) => {
          // this.spinner.hide();
          this.toaster.error(err.error.error, "Error");
        });
    } else {
      let tempCart: any;
      let guestCart = this.guestCartService.getGuestCart();
      // let guestCart: any;
      // this.cartService.getCartSubscripition().subscribe((res: any) => {
      //   guestCart = res;
      // });
      if (guestCart) {
        let data: any = {
          _id: guestCart._id,
          product: {
            productId: productData._id ? productData._id : productData.prodId,
            quantity: this.quantity,
            weight: productData.weight,
          },
        };

        let variant = this.getActiveVariant();
        if (productData.label) {
          data.product.label = productData.label;
          data.product.slug = productData.slug;
          data.product.weight = productData.weight;
        } else if (variant) {
          data.product.productId = variant.productId;
          data.product.label = variant.label;
          data.product.slug = variant.slug;
          data.product.weight = variant.weight;
        }

        this.cartService
          .addToCartForGuest(data)
          .toPromise()
          .then((res: any) => {
            // this.spinner.hide();
            this.commonService.isBrowser && gtag('event', 'conversion', { 'send_to': 'AW-564095127/JHdCCIL5zP4CEJfR_YwC' });
            if (res.data) {
              if (!redirectToCheckout) {
                this.toaster.success('Product added to cart');
              }
              this.guestCartService.setGuestCart(res.data.cart);
              // this.cartCount.getCartCount();
              // redirectToCheckout && this.navigateToCheckout();
            }
            this.toaster.success('Product added to cart');
          })
          .catch((err: any) => {
            // this.spinner.hide();
            this.toaster.error(err.error.message);
          });
      } else {
        productData.quantity = this.quantity;

        let data: any = {
          product: {
            productId: productData._id ? productData._id : productData.prodId,
            quantity: this.quantity,
            weight: productData.weight,
          },
        };

        let variant = this.getActiveVariant();
        if (productData.label) {
          data.product.label = productData.label;
          data.product.slug = productData.slug;
          data.product.weight = productData.weight;
        } else if (variant) {
          data.product.productId = variant.productId;
          data.product.label = variant.label;
          data.product.slug = variant.slug;
          data.product.weight = variant.weight;
        }

        this.cartService
          .addToCartForGuest(data)
          .toPromise()
          .then((res: any) => {
            // this.spinner.hide();
            // this.commonService.isBrowser && gtag && gtag('event', 'conversion', { 'send_to': 'AW-564095127/JHdCCIL5zP4CEJfR_YwC' });
            if (res.data) {
              if (!redirectToCheckout) {
                this.toaster.success('Product added to cart');
              }
              this.guestCartService.setGuestCart(res.data.cart);
              // this.cartService.setDatatoCartSubscription(res.data.cart);

              // this.cartCount.getCartCount();
              // redirectToCheckout && this.navigateToCheckout();
            }
            this.toaster.success('Product added to cart');
          })
          .catch((err: any) => {
            // this.spinner.hide();
            this.toaster.error(err.error.message);
          });
      }
    }
    // }
  }

  getActiveVariant() {
    let { variations, mainVariations } = this.productDataAdd;
    if (
      variations &&
      variations.length &&
      mainVariations &&
      mainVariations.length
    ) {
      let variant = variations.find(
        (el: any) => el.productId == this.productDataAdd._id
      );
      if (variant) {
        return variant;
      } else {
        return variations.find((el: any) => el.isSelected) || null;
      }
    }
    return null;
  }
  selectAddTypeIndex(index: number, type: string) {
    this.activeTypeIndex = index;
    this.userAddressType = type
  }


  colseLoginModal() {
    this.isVerificationModal = false;
  }

  onLogin() {
    this.getCartItems()
  }

  getUserAddressArea() {
    if (this.addressForm.get('pinCode')?.value.length == 6) {
      this.cartService.getUserAddressArea(this.addressForm.get('pinCode')?.value)
        .toPromise()
        .then((res: any) => {
          if (res.data.length) {
            let state = res.data[0].stateName;
            state = state.toLowerCase().split(' ').map(function (word: any) {
              return (word.charAt(0).toUpperCase() + word.slice(1));
            }).join(' ');
            let city = res.data[0].districtName;
            this.addressForm.patchValue({
              country: "India",
              state: state,
              city: city
            });
          } else {
            this.addressForm.patchValue({
              state: "",
              city: ""
            })
          }

        })
        .catch((err: any) => { err })
    }
  }

  getItemsCount(list: Array<any>) {
    return list.reduce((acc, el) => {
      acc++
      if (el.quantity) {
        acc += el.quantity - 1
      }
      return acc
    }, 0)
  }

}


