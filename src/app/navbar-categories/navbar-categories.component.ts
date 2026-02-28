import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
  Event as NavigationEvent,
  NavigationStart,
} from '@angular/router';
import { environment } from '../../environments/environment';
import { ProductService } from '../services/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { CardComponent } from '../components/card/card.component';
import { CartComponent } from '../shared/components/cart/cart.component';
import { CartService } from '../services/cart.service';
import { CommonService } from '../services/common.service';
import { LastTwoDigitsPipe } from '../pipes/last-two-digits.pipe';
import { DetectLocation } from '../util/common.util';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { CrossIconComponent } from '../my-svg/cross-icon/cross-icon.component';
import { LoginPopupComponent } from '../components/login-popup/login-popup.component';
import { CartData } from '../shared/types/index.types';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile } from '../shared/types/xhr.types';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-navbar-categories',
  templateUrl: './navbar-categories.component.html',
  styleUrls: ['./navbar-categories.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    CartComponent,
    LastTwoDigitsPipe,
    CrossIconComponent,
    LoginPopupComponent,
    NgbCollapseModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NavbarCategoriesComponent implements OnInit, AfterViewInit {
  @ViewChild('myModal') locationModalRef: ElementRef;
  @ViewChild('myCartModal') cartModalRef: ElementRef;
  @ViewChild('formOuter') formOuter: ElementRef;
  @ViewChild('search') searchref: ElementRef;
  @ViewChild('formInner') formInner: ElementRef;
  @ViewChild('pincode') searcPincode: ElementRef;
  @ViewChild('filterModal') filterModal: ElementRef;
  @ViewChild('navbar') navbar!: ElementRef;

  @Input() hideNav: boolean;

  @Output() onCart = new EventEmitter();
  @Output('currentPageUrl') currentPageUrl = new EventEmitter();
  @Output() navbarHeight = new EventEmitter<number>();

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (
      this.formOuter &&
      !this.formOuter.nativeElement.contains(event.target)
    ) {
      this.showArrayContainer = false;
    }
  }

  userProfile: UserProfile | null = null;
  guestDeliverLocation: any;
  userDeliverLocation: any;
  productCapacity: number = 1;

  screenWidth: number;
  desktopScreen: boolean = true;
  showMegaMenu: any;
  category: any;
  hoverIndex: boolean = false;
  cloudeImagePath: any = environment.imageUrl;
  menuFilteredData: any;
  subBrandItems: any;
  showRightArrow: boolean = false;
  rightSideNavMenuFilteredData: any;
  rightSideSubBrandItems: any;
  showRightSideMenu: boolean = false;
  collapseState: { [id: string]: boolean } = {};
  collapsedItems: { [key: string]: boolean } = {};
  submenuCollapseMap: { [key: string]: boolean } = {};

  mainMenuCollapseMap: { [key: string]: boolean } = {};

  // search related variables
  urlEvent$: any;
  pageUrl: any;
  searchPlaceholder = 'Search Health Products';
  searchInput: string = '';
  showArrayContainer: any;
  searchListArray: Array<any>;

  ////////////location /////////////

  searchPincode: string = '';
  searchedCityArray: any;
  currentCategoryUrl: any;
  categoryPageUrl: any;
  activatedUrl: string = '';
  activatedIndex: any = 0;
  // Keep track of which accordion item is open
  // openIndex: number | null = null;
  accordionItems = [
    {
      id: 1,
      title: 'Accordion Item #1',
      content: "This is the first item's accordion body.",
    },
    {
      id: 2,
      title: 'Accordion Item #2',
      content: "This is the second item's accordion body.",
    },
    {
      id: 3,
      title: 'Accordion Item #3',
      content: "This is the third item's accordion body.",
    },
  ];
  rightSideNavMenuFilteredChildernData: any;
  currBrandIndex: number;
  currSubBrandIndex: number;
  similarproductData: any;
  cloudImgUrl: string = environment.imageUrl;
  swiperBreakpints: any = {
    // when window width is >= 320px
    320: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    768: {
      slidesPerView: 4.5,
      spaceBetween: 25,
    },
    1024: {
      slidesPerView: 2.3,
      spaceBetween: 10,
    },
  };
  slideCount = 4;
  // login modal
  isGetOTP: boolean = false;
  isLoginModal: boolean = false;
  userMobile = '';
  isVerifyOTP: boolean = false;
  isVerification: boolean = false;
  enteredOtp: any = '';
  otpVerified: boolean = false;
  otpVerificationTokan: string = '';
  isUserLoggin: boolean;
  currentRoute: string = '/';
  // login modal
  userMenuLinks = [
    {
      icon: 'https://cdn.healthybazar.com/images/dashboard-profile.svg',
      title: 'View Profile',
      link: '/my-account',
      params: { view: true },
    },
    {
      icon: 'https://cdn.healthybazar.com/images/dashboard-my-orders.svg',
      title: 'My Orders',
      link: '/my-account/orders',
      params: { view: true },
    },
    {
      icon: 'https://cdn.healthybazar.com/images/dashboard-address-green.svg',
      title: 'Manage Address',
      link: '/my-account/manage-address',
      params: { view: true },
    },
    {
      icon: 'https://cdn.healthybazar.com/images/dashboard-appointment.svg',
      title: 'My Appointments',
      link: '/my-account/appointments',
      params: { view: true },
    },
    {
      icon: 'https://cdn.healthybazar.com/images/dashboard-diagnostic.svg',
      title: 'Health Stats',
      link: '/my-account/health-stats',
      params: { view: true },
    },
  ];
  isSelectedLocation: boolean;
  cartCount = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private cartService: CartService,
    private commonService: CommonService,
    private toaster: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationEnd) {
        this.searchListArray = [];
        this.showArrayContainer = false;
        this.urlEvent$ = event.url;
        this.pageUrl = this.urlEvent$.split('/')[1];

        this.activatedUrl = event.url;
        // console.log('this.pageUrl = ', this.pageUrl);
        if (this.pageUrl == 'lifestyle-tips') {
          this.searchPlaceholder = 'Search Lifestyle Tips';
        } else if (this.pageUrl == 'consult-us') {
          this.searchPlaceholder = 'Search Consultant';
        } else if (this.pageUrl == 'health-packages') {
          this.searchPlaceholder = 'Search Health Packages';
        } else if (this.pageUrl == 'lab-tests') {
          this.searchPlaceholder = 'Search Lab Tests';
        } else if (this.pageUrl == 'herbs') {
          this.searchPlaceholder = 'Search Herbs';
        } else {
          this.searchPlaceholder = 'Search Health Products';
        }

        this.handleCartCount(this.cartService.cartData);
      } else if (event instanceof NavigationStart) {
        this.onLeave(-1);
        this.closeSideMenu();
      }
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
    this.commonService.getLoginState().subscribe((state) => {
      this.isUserLoggin = state;
    });

    this.commonService.getUserProfileDetails().subscribe((data) => {
      this.userProfile = data;
    });

    this.cartService.getDirectCart().subscribe((res: boolean) => {
      this.onCart.emit(res);
    });

    this.cartService.getCartData().subscribe(this.handleCartCount.bind(this));

    let a = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.searchListArray = [];
        this.showArrayContainer = false;
        this.urlEvent$ = event.url;
        this.pageUrl = this.urlEvent$.split('/');
        this.pageUrl = this.pageUrl[1];
        this.currentPageUrl.emit(this.pageUrl);
      }
    });
    this.getHeaderMenu();
    if (typeof window !== undefined && isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth <= 768) {
        this.desktopScreen = false;
      } else {
        this.desktopScreen = true;
      }
      this.getDeliverLocation();
    }
  }

  ngAfterViewInit() {
    let userLoggedIn = this.commonService.getUser();
    if (userLoggedIn) {
      this.isUserLoggin = true;
    }
    fromEvent(this.searchref.nativeElement, 'keyup')
      .pipe(
        map((i: any) => i.target.value),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((res: any) => {
        if (res) {
          if (this.currentRoute.startsWith('/herbs')) {
            this.productService
              .getHerbsSearchResults(res)
              .subscribe((res: any) => {
                this.searchListArray = [];
                let _results: any[] = [];
                res.data.products.map((item: any) => {
                  _results.push({
                    name: item.name,
                    brandName: item.brandId.name,
                    path: '/product/' + item.slug,
                  });
                });
                this.searchListArray.push({
                  label: 'Shop Now',
                  results: _results,
                });
                this.showArrayContainer = true;
              });
          } else {
            this.productService
              .getSearchedResults(res)
              .subscribe((res: any) => {
                this.searchListArray = [];
                console.log('>>>>', res);
                res.data.map((category: any) => {
                  if (category.name == 'Product') {
                    // this.searchListArray =
                    let _results: any[] = [];
                    category.data.map((res: any) => {
                      _results.push({
                        name: res.prodName,
                        brandName: res.brandName,
                        path: '/product/' + res.slug,
                      });
                    });
                    this.searchListArray.push({
                      label: 'Shop Now',
                      results: _results,
                    });
                  } else if (category.name == 'User') {
                    let _results: any[] = [];
                    category.data.map((res: any) => {
                      _results.push({
                        name:
                          (
                            (res.firstName || '') +
                            ' ' +
                            (res.lastName || '')
                          ).trim() || 'HB Consultant',
                        path: `consult-us/doctor/${res.slug}`,
                        consultantType: res.consultantType,
                      });
                    });
                    this.searchListArray.push({
                      label: 'Consultants',
                      results: _results,
                    });
                  }
                  // else if (category.name == 'HealthPackage') {
                  //     // this.searchListArray =
                  //     category.data.map((res: any) => {
                  //         this.searchListArray.push({
                  //             name: res.name,
                  //             path: `/health-packages/${res.slug}`,
                  //         });
                  //     });
                  // }
                  else if (category.name == 'Blog') {
                    let _results: any[] = [];
                    category.data.map((res: any) => {
                      _results.push({
                        name: res.title,
                        path: '/lifestyle-tips/' + res.titleName,
                        blogType: res.blogType,
                      });
                    });
                    this.searchListArray.push({
                      label: 'Lifestyle Tips',
                      results: _results,
                    });
                  }
                });
                this.showArrayContainer = true;
              });
          }
        } else {
          this.searchListArray = [];
          this.showArrayContainer = false;
        }
      });

    const menu: any = document.querySelector('.mega-menu-sub-brand');
    if (menu) {
      menu.addEventListener(
        'wheel',
        (e: WheelEvent) => {
          const target = e.currentTarget as HTMLElement;
          const atTop = target.scrollTop === 0;
          const atBottom =
            target.scrollHeight - target.scrollTop === target.clientHeight;

          if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
            e.preventDefault(); // stop body from scrolling
          }
        },
        { passive: false }
      );
    }
  }

  handleCartCount(value: CartData) {
    if (this.router.url.startsWith('/consult-us')) {
      this.cartCount = value.consult?.consultant ? 1 : 0;
    } else {
      this.cartCount =
        value.shop?.products?.reduce((acc, el) => {
          acc++;
          if (el.quantity) {
            acc += el.quantity - 1;
          }
          return acc;
        }, 0) || 0;
    }
  }

  searchCityBasedOnPincode(searchPin: any) {
    if (searchPin.length > 2) {
      this.productService.getPincodeResults(searchPin).subscribe((res: any) => {
        this.searchedCityArray = res;
      });
    } else {
      this.showArrayContainer = false;
      this.searchedCityArray = [];
    }
  }

  // getGeoLocation() {
  //     this.productService.getCurrentPosition().subscribe({
  //         next: (position) => {
  //             // console.log('Latitude:', position.coords.latitude);
  //             // console.log('Longitude:', position.coords.longitude);
  //         },
  //         error: (error) => {
  //             console.error('Error getting geolocation:', error);
  //         },
  //     });
  // }

  onHover(slug: any) {
    if (this.screenWidth > 768) {
      this.hoverIndex = true;
      this.menuFilteredData = this.category['children'].find(
        (x: any) => x.slug === slug
      );

      this.subBrandItems =
        this.menuFilteredData &&
        this.menuFilteredData.children[0] &&
        this.menuFilteredData?.children[0]?.children
          ? this.menuFilteredData.children[0].children
          : [];

      //console.log('>>>>>>>>>>>>>>>>>>', this.subBrandItems);

      // this.currentCategoryName = (this.menuFilteredData && this.menuFilteredData.children[0] && this.menuFilteredData.children[0].children) ? this.menuFilteredData.children[0].url : '';

      // this.currentCategoryName = this.menuFilteredData
    }
  }

  onLeave(id: any) {
    this.hoverIndex = false;
  }

  getHeaderMenu() {
    this.productService.getHeaderMenu().subscribe((res: any) => {
      this.category = res.data.menus[0];
      // res.data.menus[0].children.forEach((subMenu: any) => {
      //     this.createMenuURLs(subMenu)
      // });
      // console.log(res.data.menus[0].children)
    });
  }

  // createMenuURLs(menu: any, prefix?: string) {
  //     if (menu.isLink) {
  //         menu.tempUrl = prefix + '/' + menu.slug
  //     }
  //     let _prefix = ''
  //     if (menu.slug == 'brand') {
  //         _prefix = '/brand'
  //     } else if (menu.slug == 'health-concern') {
  //         _prefix = '/health-concern'
  //     }
  //     menu.children.forEach((subMenu: any) => {
  //         this.createMenuURLs(subMenu, _prefix)
  //     })
  // }

  getBrandItems(brand: any, brandIndex: number) {
    this.subBrandItems = brand.children;
    this.currentCategoryUrl = brand.url;
    this.currBrandIndex = brandIndex;
  }

  viewSideMenu() {
    // document.body.style.overflow = 'hidden';
    let slug: any;
    let url: any = this.activatedRoute.snapshot;
    if (url._routerState.url == '"/health-packages"') {
      slug = 'health-packages';
    } else if (url._routerState.url == '/lifestyle-tips') {
      slug = 'lifestyle';
    } else if (url._routerState.url == '/consult-us') {
      slug = 'consult-us';
    } else {
      slug = 'shop-now';
    }

    this.showRightSideMenu = true;
    this.rightSideNavMenuFilteredData = this.category['children'].find(
      (x: any) => x.slug === slug
    );
    this.rightSideNavMenuFilteredChildernData =
      this.rightSideNavMenuFilteredData.children.map(
        (brand: any, i: number) => {
          brand['id'] = i;
          return brand;
        }
      );

    this.rightSideSubBrandItems =
      this.rightSideNavMenuFilteredData.children[0].children.map(
        (subBrand: any, i: number) => {
          subBrand['idx'] = i;
          return subBrand;
        }
      );
  }

  getRightSideBrandItems(brand: any) {
    this.rightSideSubBrandItems = brand.children.map(
      (subBrand: any, i: number) => {
        subBrand['idx'] = i;
        return subBrand;
      }
    );
    // console.log("this.rightSideSubBrandItems",this.rightSideSubBrandItems)
  }

  closeSideMenu() {
    this.showRightSideMenu = false;
  }

  navigateToCategoryPage(slug: string, index: number) {
    this.activatedIndex = index;
    if (slug == 'shop-now') {
      this.cartService.setCartState('shop');
      this.router.navigate(['']);
      // this.getActivatedCategory();
    }
    if (slug == 'lifestyle') {
      this.router.navigate(['/lifestyle-tips']);
      this.cartService.setCartState('shop');
      // this.getActivatedCategory();
    }
    if (slug == 'consult-us') {
      this.router.navigate(['/consult-us']);
      this.cartService.setCartState('consult');
      // this.getActivatedCategory();
    }
    if (slug == 'health-packages') {
      this.router.navigate(['/health-packages']);
      this.cartService.setCartState('shop');
      // this.getActivatedCategory();
    }
  }

  // // Function to toggle accordion item
  // toggleAccordion(index: number) {
  //     this.openIndex = (this.openIndex === index) ? null : index;
  // }
  getRelatedSearch() {
    console.log('searchInput = ', this.searchInput);
    console.log('searchListArray = ', this.searchListArray);
  }

  onSearch() {
    // this.searchSubmitted = true;
    this.showArrayContainer = false;
    let query = this.searchInput.trim();
    if (query === '' && this.currentRoute.startsWith('/herbs')) {
      this.router.navigate(['/herbs'], {
        queryParams: {},
      });
      return;
    }
    if (!query && !this.currentRoute.startsWith('/herbs')) return;
    if (!this.currentRoute.startsWith('/herbs')) {
      this.router.navigate(['/search/', query]);
    } else {
      this.router.navigate(['/herbs'], {
        queryParams: {
          search: this.searchInput,
        },
      });
    }
    // if (this.pageUrl == "lifestyle-tips") {
    //     this.router.navigate(["/lifestyle-tips/search", query]);
    // } else if (this.pageUrl == "consult-us") {
    //     this.router.navigate(["/consult-us/search", query]);
    // } else if (this.pageUrl == "health-packages") {
    //     this.router.navigate(["/health-packages/search", query]);
    // } else if (this.pageUrl == "lab-tests") {
    //     this.router.navigate(["/lab-tests/search", query]);
    // } else {
    //     this.router.navigate(["/search/global", query]);
    // }
  }

  redirectBlog(item: any) {
    const extractedPath = this.getStringAfterFirstSlash(item.path);

    const firstPart: any = extractedPath.split('/')[0];

    if (firstPart == 'product') {
      this.router.navigate([extractedPath]);
    } else if (firstPart == 'lifestyle-tips') {
      this.router.navigate([extractedPath]);
    } else if (firstPart == 'doctor') {
      this.router.navigate([item.path]);
    } else {
      console.log('something is wrong');
    }
  }

  getStringAfterFirstSlash(path: string): string {
    // Split the string by '/' and get the part after the first '/'
    return path.split('/').slice(1).join('/');
  }

  addLocation(locationDetails: any) {
    this.searchPincode = locationDetails.code;
    let locationData: DetectLocation = {
      pincode: locationDetails._id,
      city: locationDetails.city._id,
    };

    let userLoggedIn = this.commonService.getUser();
    // let userLoggedIn = localStorage.getItem('userData');
    if (userLoggedIn) {
      this.commonService
        .addUserCurrentLocation(locationData)
        .subscribe((res: any) => {
          if (res) {
            this.commonService.setLocationState(true);
            localStorage.setItem(
              'userLocation',
              JSON.stringify(locationDetails)
            );
            this.isSelectedLocation = false;
            this.getDeliverLocation();
          }
          this.searchedCityArray = [];
          // this.searchPincode = ""
        });
    } else {
      localStorage.setItem(
        'guestUserLocation',
        JSON.stringify(locationDetails)
      );
      this.commonService.setLocationState(true);
      this.isSelectedLocation = false;
      this.getDeliverLocation();
      this.searchedCityArray = [];
      // this.searchPincode = ""
    }
    this.locationModalRef.nativeElement.querySelector('.btn-close')?.click();
  }

  getDeliverLocation() {
    // let userLoggedIn = localStorage.getItem('userData');
    let userLoggedIn = this.commonService.getUser();
    if (userLoggedIn) {
      this.commonService.getUserCurrentLocation().subscribe(
        (res: any) => {
          if (res) {
            this.userDeliverLocation = res.location;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      let guestLocationParse: any = localStorage.getItem('guestUserLocation');
      this.guestDeliverLocation = JSON.parse(guestLocationParse);
    }
  }

  // getUrl(subItemUrl: any) {
  //     return this.categoryPageUrl = this.currentCategoryUrl + subItemUrl;
  //     this.router.navigate([this.categoryPageUrl]);
  // }

  getUrl(subItem: any) {
    if (subItem.categoryId) {
      return subItem.categoryId?.url || '';
    } else if (subItem.brandId) {
      return subItem.brandId?.url || '';
    } else if (subItem.healthConcernId) {
      return subItem.healthConcernId?.url || '';
    } else if (subItem.consultantTypeId) {
      return subItem.consultantTypeId?.url || '';
    }
  }

  getSubBrandUrl(option: any) {
    if (option.isLink) {
      this.categoryPageUrl = option.url;
      this.router.navigate([this.categoryPageUrl]);
      this.closeSideMenu();
    }
  }

  getMobUrl(option: any, subOption: any) {
    if (subOption.isLink) {
      console.log(
        'Option URL - $s and Sub option url - %s',
        option.url,
        subOption.url
      );
      if (option.url !== subOption.url) {
        this.categoryPageUrl = option.url + subOption.url;
      } else {
        this.categoryPageUrl = option.url;
      }
      //this.categoryPageUrl = option.url + subOption.url;
      this.router.navigate([this.categoryPageUrl]);
      this.closeSideMenu();
    }
  }

  getActivatedCategory() {
    // this.activatedUrl = this.activatedRoute.snapshot;
    let activatedUrl: any = this.activatedRoute.snapshot;
  }

  // openSidebarModal() {
  //     this.renderer.addClass(this.cartModalRef.nativeElement, 'show');
  //     this.renderer.setStyle(this.cartModalRef.nativeElement, 'display', 'block');
  //     this.renderer.setStyle(this.cartModalRef.nativeElement, 'right', '0');
  //     // const modalElement = this.myCartModal.nativeElement;
  //     // // this.renderer.setStyle(modalElement, 'right', '0');
  //     // this.renderer.addClass(modalElement, 'show');
  //     // this.renderer.addClass(document.body, 'modal-open');
  // }

  increment() {
    this.productCapacity = this.productCapacity + 1;
    // this.settingForm.setValue({
    //     capacity: this.settingForm.get("capacity").value + 1
    // });
  }

  decrement() {
    this.productCapacity = this.productCapacity - 1;
    // this.settingForm.setValue({
    //     capacity: this.settingForm.get("capacity").value - 1
    // });
  }

  // openModal() {
  //     // this.modalService.openModal();
  // }

  getCartData() {
    if (this.activatedUrl.startsWith('/payment')) return;
    if (this.activatedUrl.startsWith('/consult-us')) {
      this.cartService.setCartState('consult');
    } else {
      this.cartService.setCartState('shop');
    }
    this.onCart.emit(true);
  }

  login() {
    this.isLoginModal = true;
    this.isGetOTP = true;
    // this.cartService.setUser({});
  }

  logout() {
    this.cartService.setCartData({ shop: null, consult: null });
    this.commonService.setLoginState(false);
    this.commonService.removeUser();
    this.toaster.success('Successfully Logout');
    this.router.navigate(['/']);
  }

  getOTPForUserLogin() {
    // Call the API if API response received then open 2nd body to verify the OTP
    let body = {
      phone: this.userMobile,
      logintType: 'mobileOtpLogin',
      countryCode: '+91',
    };

    this.cartService.checkUser(body).subscribe((res: any) => {
      if (res) {
        this.otpVerificationTokan = res.data.confirmationToken;
        this.isGetOTP = false;
        this.isVerifyOTP = true;
      }
    });
  }

  submitOTP() {
    let verifyOTPBody = {
      otp: this.enteredOtp,
      verificationToken: this.otpVerificationTokan,
      cartId: '',
    };
    this.isVerifyOTP = false;
    this.cartService.LoginVerifyOTP(verifyOTPBody).subscribe(
      (res: any) => {
        if (res) {
          this.isVerification = true;
          this.authService.onLoggedIn(res.data);

          setTimeout(() => {
            // And any other code that should run only after 5s
            this.isVerification = false;
            this.closeVerificationModal();
          }, 2500);

          this.otpVerified = true;
          this.commonService.setLoginState(true);
          // let userLoggedIn: any = localStorage.getItem('userData');
          let userLoggedIn: any = this.commonService.getUser();
          userLoggedIn = JSON.parse(userLoggedIn);
          if (userLoggedIn) {
            let guestLocation: any = localStorage.getItem('guestUserLocation');
            guestLocation = JSON.parse(guestLocation);
            if (guestLocation) {
              this.commonService
                .addUserCurrentLocation(guestLocation)
                .subscribe((res: any) => {
                  if (res) {
                    localStorage.setItem(
                      'userLocation',
                      JSON.stringify(guestLocation)
                    );
                    this.isSelectedLocation = false;
                    this.getDeliverLocation();
                  }
                  localStorage.removeItem('guestUserLocation');
                });
            }
            this.isUserLoggin = true;
          }
          // this.router.navigate([""]);
        }
      },
      (error) => {
        this.isVerifyOTP = true;
      }
    );
    this.userMobile = '';
    // this.router.navigate([""])
  }

  closeVerificationModal() {
    this.isLoginModal = false;
  }
  changeMobileNo() {
    this.isLoginModal = true;
    this.isVerifyOTP = false;
    this.isGetOTP = true;
  }

  getBrandUrl(brand: any): string {
    if (
      brand.categoryId ||
      brand.brandId ||
      brand.healthConcernId ||
      brand.consultantTypeId
    ) {
      if (brand.categoryId) {
        return brand.categoryId?.url || '';
      } else if (brand.brandId) {
        return brand.brandId?.url || '';
      } else if (brand.healthConcernId) {
        return brand.healthConcernId?.url || '';
      } else if (brand.consultantTypeId) {
        return brand.consultantTypeId?.url || '';
      }
    }
    return '';
  }

  getMenuTitle(option: any) {
    return (
      option.name ||
      option.categoryId?.name ||
      option.brandId?.name ||
      option.healthConcernId?.name ||
      option.consultantTypeId?.name
    );
  }

  toggleRightSideMenu() {
    this.showRightSideMenu = !this.showRightSideMenu;
  }

  isCollapsed(id: string): boolean {
    // Default to collapsed
    if (!(id in this.collapsedItems)) {
      this.collapsedItems[id] = true;
    }
    return this.collapsedItems[id];
  }

  isSubMenuCollapsed(id: string): boolean {
    if (!(id in this.submenuCollapseMap)) {
      this.submenuCollapseMap[id] = true;
    }
    return this.submenuCollapseMap[id];
  }

  toggleCollapse(id: string): void {
    this.collapsedItems[id] = !this.isCollapsed(id);
  }

  toggleSubmenu(id: string): void {
    this.submenuCollapseMap[id] = !this.submenuCollapseMap[id];
  }

  onItemClick(item: any): void {
    if (item?.children?.length) {
      this.toggleCollapse(item.id);
      this.getRightSideBrandItems(item);
    } else {
      this.getMobUrl(item, item);
    }
  }
}
