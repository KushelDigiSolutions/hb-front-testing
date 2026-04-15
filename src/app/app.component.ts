import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { register } from 'swiper/element/bundle';
import { NavbarCategoriesComponent } from './navbar-categories/navbar-categories.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartComponent } from './shared/components/cart/cart.component';
import { environment } from '../environments/environment';
import { CartService } from './services/cart.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonService } from './services/common.service';
import { ShopIconComponent } from './my-svg/shop-icon/shop-icon.component';
import { ConsultIconComponent } from './my-svg/consult-icon/consult-icon.component';
import { PackageIconComponent } from './my-svg/package-icon/package-icon.component';
import { TipsIconComponent } from './my-svg/tips-icon/tips-icon.component';
import { ToastrService } from 'ngx-toastr';
import { dateDiff } from './util/date.util';
import { CheckoutService } from './shared/components/checkout/checkout.service';
import { GuestCartService } from './services/guest-cart.service';
import { InflateDataComponent } from './components/inflate-data/inflate-data.component';
import { MobileCartComponent } from './components/mobile-cart/mobile-cart.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MetasService } from './services/metas.service';
import { AssessmentIconComponent } from './my-svg/assessment-icon/assessment-icon.component';
import { testPattern, EMAIL_PATTERN } from '../app/util/pattern.util';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ExpressService } from './services/express.service';
import { UserDashboardService } from './services/user-dashboard.service';
import { UserProfile } from './shared/types/xhr.types';
import { DynamicScriptLoaderService } from './services/dynamic-script-loader.service';
import { SpinnerService } from './services/spinner.service';
import { OneSignal } from 'onesignal-ngx';
import { DiscountStripComponent } from './components/discount-strip/discount-strip.component';

declare var gtag: any;
// register Swiper custom elements
register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    InflateDataComponent,
    NavbarCategoriesComponent,
    FooterComponent,
    CartComponent,
    RouterModule,
    NgxSkeletonLoaderModule,
    ReactiveFormsModule,
    FormsModule,
    ShopIconComponent,
    ConsultIconComponent,
    PackageIconComponent,
    TipsIconComponent,
    NgxSkeletonLoaderModule,
    MobileCartComponent,
    LazyLoadImageModule,
    AssessmentIconComponent,
    SpinnerComponent,
    DiscountStripComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  cuaHost = environment.corporateUserAppHost;
  admHost = environment.adminHost;

  isMobile = false;
  isLoading: boolean = false;
  title = 'healthybazar';
  screenSize: number;
  mobileSize: boolean;
  desktopSize: boolean;
  email: string = 'support@healthybazar.com';
  hideNavbar: boolean;
  isCartopen: boolean = false;
  imgUrl: string = environment.imageUrl;
  navigationValue: string = 'shop-now';
  // cart reated
  cartData: any;
  cartProducts: any;
  cartProductsCount: any;
  checkoutConsultationCart: any;
  userLoggedInAccessTokan: any;
  activatedUrl: string;
  @ViewChild('subscriptionEmail') subscriptionEmail: ElementRef;
  userSubscription: FormGroup = new FormGroup({
    subEmail: new FormControl(''),
  });
  submitted: boolean;
  subEmail: any;
  @Output() onCart = new EventEmitter();
  isUser: any;
  pdcData: {
    discount: any;
    giftOptions: any;
    isGiftable: any;
    itemsCount: any;
    shippingCharge: any;
    totalAmount: any;
    totalPayableAmt: any;
    products: any;
  };
  productData: any;
  hideFixedFooter: boolean = false;
  pageUrl: any;
  pageUrl1: any;
  pageUrl2: any;
  urlEvent: string;
  navHeight = 0;

  /////////////////

  newsLetterFormGroup: FormGroup | any;
  year = new Date().getFullYear();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private toaster: ToastrService,
    private checkoutService: CheckoutService,
    private guestCartService: GuestCartService,
    private metaService: MetasService,
    private expressService: ExpressService,
    private userdashboardSerivce: UserDashboardService,
    private scriptsLoader: DynamicScriptLoaderService,
    private spinner: SpinnerService,
    private oneSignal: OneSignal,
  ) {
    let a = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        //console.log('NavigationEnd', event, activatedRoute.snapshot.firstChild?.data)
        this.urlEvent = event.url;
        this.pageUrl = this.urlEvent.split('/');
        this.pageUrl1 = this.pageUrl[1];
        this.pageUrl2 = this.pageUrl[2];
        if (
          this.pageUrl1 == 'self-health-assessment' &&
          this.pageUrl2 !== undefined
        ) {
          this.hideFixedFooter = true;
        }
        this.metaService.setCanonical(
          environment.appHost.slice(0, environment.appHost.length - 1) +
            (this.urlEvent == '/' ? '' : this.urlEvent),
        );
      } else if (event instanceof NavigationStart) {
        spinner.hide();
      }
    });

    this.newsLetterFormGroup = this.formBuilder.group({
      email: ['', [Validators.email]],
    });
  }

  ngOnInit(): void {
    this.isMobile =
      this.expressService.OS == 'Android' ||
      this.expressService.OS == 'iOS' ||
      this.expressService.OS == 'Windows Phone';
    // this.hideNavbar = this.isMobile
    if (isPlatformBrowser(this.platformId)) {
      this.oneSignal.init({
        appId: environment.oneSignalAppID,
      });

      if (environment.production) {
        setTimeout(() => {
          this.scriptsLoader.load('gtm');
        }, 8000);
      }
    }

    let userData = this.commonService.getUser();
    this.commonService.setLoginState(!!userData?.token);

    // this.isLoading = true;
    this.getScreenSize();
    this.hideNavigationBarForCategoryPage();
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.activatedUrl = this.router.url;
    });
    // this.isLoading = false;
    if (this.mobileSize) {
      // this.cartService.getCartSubscripition().subscribe(res => {
      //   console.log('cart subscription res= ', res);
      //   this.getCartItems();
      // });
    }
    // this.getCartItems();

    // this.activatedRoute.params.subscribe((res: any) => {
    //   console.log('route change to payment');

    // })
    this.getUserDetails();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userSubscription.controls;
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

  subscribeToNewsLetter(subscriptionEmail: any) {
    if (
      !subscriptionEmail.value.trim() ||
      !testPattern(EMAIL_PATTERN, subscriptionEmail.value)
    )
      return;
    let payLoad: Object = {
      email: subscriptionEmail.value,
    };
    this.commonService.subscriptionToNewsletter(payLoad).subscribe(
      (res: any) => {
        if (res.success !== false) {
          subscriptionEmail.value = '';
          this.toaster.success('Successfully Subscribed');
        } else {
          this.toaster.error(res.message);
        }
      },
      (error) => {
        this.toaster.error('Something Wrong ');
      },
    );
    this.submitted = true;
  }

  navigateToCategoryPage(slug: string) {
    if (slug == 'shop-now') {
      this.router.navigate(['/']);
      this.navigationValue = 'shop-now';
      this.cartService.setCartState('shop');
    } else if (slug == 'lifestyle') {
      this.router.navigate(['/lifestyle-tips']);
      this.navigationValue = 'lifestyle';
      this.cartService.setCartState('shop');
    } else if (slug == 'consult-us') {
      this.router.navigate(['/consult-us']);
      this.navigationValue = 'consult-us';
      this.cartService.setCartState('consult');
    } else if (slug == 'health-packages') {
      this.router.navigate(['/health-packages']);
      this.navigationValue = 'health-packages';
      this.cartService.setCartState('shop');
    } else if (slug == 'herbs') {
      this.router.navigate(['/herbs']);
      this.navigationValue = 'herbs';
      this.cartService.setCartState('shop');
    }
  }

  hideNavigationBarForCategoryPage() {
    if (this.mobileSize) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          // let currentRoute = this.router.url;
          // if ((currentRoute === "/") || (currentRoute === "/health-packages") || (currentRoute === "/consult-us") || (currentRoute === "/lifestyle-tips")) {
          //   this.hideNavbar = false;
          // } else {
          //   this.hideNavbar = true;
          // }
        }
      });
    }
  }

  followFxn(value: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (value == 'insta') {
        window.open('https://www.instagram.com/healthybazar/');
      }
      if (value == 'fb') {
        window.open('https://www.facebook.com/healthybazar/');
      }
      if (value == 'you-tube') {
        window.open(
          'https://www.youtube.com/channel/UCR5FTS-wm9YgMY1yzLyE9SQ/featured?view_as=subscriber',
        );
      }
    }
  }

  openCart(value: boolean) {
    this.isCartopen = value;
  }

  getCartItems() {
    this.isUser = this.commonService.getUser();
    // this.isLoadingCart = true;
    let user = this.commonService.getUser();

    if (this.activatedUrl == '/consult-us') {
      if (user) {
        //checkout cart
        this.cartService.getConsultantCart().subscribe((res: any) => {
          if (res.data.cart.consultant) {
            this.checkoutConsultationCart.push(res.data.cart);
          } else {
            this.checkoutConsultationCart = [];
          }
          // this.isLoadingCart = false;
        });
      } else {
        let guestCartId = localStorage.getItem('guestCheckoutCartId');
        if (guestCartId) {
          this.cartService
            .getGuestConsultCart(guestCartId)
            .subscribe((res: any) => {
              if (res.data.cart) {
                this.checkoutConsultationCart.push(res.data.cart);
              } else {
                this.checkoutConsultationCart = [];
              }
            });
        }
      }
    } else {
      //product cart
      if (user) {
        this.cartService.getShopCart().subscribe((res: any) => {
          this.handleCartResponse(res.data);
        });
      } else {
        if (typeof localStorage !== 'undefined') {
          let guestCartId = localStorage.getItem('guestCartId');
          let guestCart = this.guestCartService.getGuestCart();

          if (guestCart) {
            // this.loader = true;
            this.cartService
              .getGuestCart(guestCart._id)
              .toPromise()
              .then((res: any) => {
                this.cartService.setDatatoCartSubscription(res.data);
                this.handleCartResponse(res.data);
              })
              .catch((err: HttpErrorResponse) => {
                if (err.status == 404) {
                  localStorage.removeItem('cart');
                } else {
                  this.toaster.error(err.error.message);
                }
              });
          } else {
            // this.showUpsell = false;
            this.cartProducts = [];
          }
        }
      }
    }
  }

  handleCartResponse(data: any) {
    if (!data) {
      return;
    }
    this.productData = data;
    let { _id, products, updatedAt } = data;
    let daysDiff = dateDiff(updatedAt || '2023-04-09T11:05:08.398Z', 'days');

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
      itemsCount: data.products.reduce(
        (total: number, el: any) => total + el.quantity,
        0,
      ),
      shippingCharge: data.shippingCharge,
      totalAmount: data.totalAmount,
      totalPayableAmt: data.totalPayableAmt,
      products: data.products,
    };

    products = products.map((product: any) => {
      product.productId.mainVariations =
        product.productId.mainVariations.filter(
          (el: any) => !!el.values.length,
        );
      product.productId.variations = product.productId.variations.filter(
        (el: any) => !!el.label.length,
      );
      return product;
    });
    products = products.map((product: any) => {
      if (
        product.productId.mainVariations.length &&
        product.productId.variations.length
      ) {
        this.checkoutService.addTitleInVariations(product.productId);
        let selectedVariation = product.productId.variations.find(
          (el: any) => el.slug == product.productId.slug,
        );
        product.selectedVariation = selectedVariation;
      }
      return product;
    });

    this.cartProducts = products;
  }

  getCurrentURL(event: any) {
    if (this.mobileSize) {
      if (event == '/payment') {
        console.log('getCurrentURL = ', event);
      }
    }
  }

  getCartData() {
    this.onCart.emit(true);
  }

  ////////////////////////

  subscribeToNewsLetter1() {
    if (this.newsLetterFormGroup.get('email').valid) {
      const data = {
        email: this.newsLetterFormGroup.get('email').value,
      };
      this.commonService
        .subscriptionToNewsletter(data)
        .toPromise()
        .then((res: any) => {
          this.gtag_report_conversion();
          this.toaster.success(res.message);
        })
        .catch((err: any) => {
          this.toaster.error(err);
        });
      this.newsLetterFormGroup.reset();
    }
  }

  gtag_report_conversion(url?: any) {
    var callback = function () {
      if (typeof url != 'undefined') {
        window.location = url;
      }
    };
    gtag &&
      gtag('event', 'conversion', {
        send_to: 'AW-564095127/6OKKCNOLzf4CEJfR_YwC',
        event_callback: callback,
      });
    return false;
  }

  getUserDetails() {
    this.commonService.getLoginState().subscribe((loggedin) => {
      if (loggedin) {
        this.userdashboardSerivce.getUserProfile().subscribe((res) => {
          if (res.data) {
            this.commonService.setUserProfileDetails(res.data);
          }
        });
      } else {
        this.commonService.setUserProfileDetails(null);
      }
    });
  }
}
