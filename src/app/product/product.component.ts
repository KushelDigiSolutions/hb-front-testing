import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CardComponent } from '../components/card/card.component';
import { CommonModule, Location } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { ProductService } from '../services/product.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../services/common.service';
import { GuestCartService } from '../services/guest-cart.service';
import { ShopCartResponse } from '../shared/types/xhr.types';
import { Subscription } from 'rxjs';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../shared/components/bottom-sheet/bottom-sheet.component';
import { ProductQuantityControlComponent } from "../components/product-quantity-control/product-quantity-control.component";
import { EventTrackingService } from '../services/event-tracking.service';
declare var gtag: any;

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CardComponent, CommonModule, HttpClientModule, MatBottomSheetModule, ProductQuantityControlComponent, RouterModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductComponent implements OnInit, OnChanges, OnDestroy {
  @Input() product: any; // object comes
  @Input() hideDiscountPriceCart: boolean; // object comes
  @Input() sort?: 'lowHighPrice' | 'highLowPrice' | string

  currentScreenSize: any;
  cloudImgUrl: any = environment.imageUrl;
  discount = 0;
  quantity: number = 1;
  productDataAdd: any;
  subscriptions$: Subscription[] = []
  cartProduct = null
  ////////////
  screenWidth: any;
  desktopScreen: any = true;

  constructor(private http: HttpClient,
    private router: Router,
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cartService: CartService,
    private toaster: ToastrService,
    private commonService: CommonService,
    private guestCartService: GuestCartService,
    private location: Location,
    private bottomSheet: MatBottomSheet,
    private eventTracking: EventTrackingService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof window !== undefined && isPlatformBrowser(this.platformId)) {
      this.currentScreenSize = window.innerWidth;
    }
    this.subscriptions$.push(this.cartService.getCartData().subscribe(data => {
      if (data.shop) {
        this.cartProduct = data.shop.products.find(el => el.productId?._id == this.product.prodId) || null
      }
    }))

    if (this.product.type == 'Normal' && this.product.variations.length) {
      this.product.variations.sort((a: any, b: any) => {
        if (this.sort == 'highLowPrice') {
          return (b.price.minPrice || a.price.mrp) - (a.price.minPrice || a.price.mrp)
        } else {
          return (a.price.minPrice || a.price.mrp) - (b.price.minPrice || a.price.mrp)
        }
      });
      let variation = this.product.variations[0];
      this.product.price = variation.price;
      this.product.prodMRP = variation.price.mrp
      this.product.prodMinPrice = variation.price.minPrice
    }
    if (this.product.price) {
      let { mrp, minPrice } = this.product.price;
      if (minPrice != null && minPrice != undefined && mrp > minPrice) {
        let discount = Math.round(((mrp - minPrice) / mrp * 100));
        this.discount = discount;
      }
    } else {
      this.discount = Math.floor(((this.product.prodMRP - this.product.prodMinPrice) / this.product.prodMRP * 100))
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    if (typeof window !== undefined && isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth <= 768) {
        this.desktopScreen = false;
      } else {
        this.desktopScreen = true;
      }
    }
  }
  ngOnDestroy(): void {
    this.subscriptions$.forEach(subscription => {
      subscription.unsubscribe()
    })
  }

  redirectToProductDetails(slug: any) {
    if (true || this.desktopScreen) {
      this.router.navigate(["/product", slug], {});
    } else {
      // this.productService.getProductsDetailsPage(slug).subscribe((res: any) => {
      //   this.productService.setBottomSheet(res.data);
      // });
      this.location.go("/product/" + slug);
      this.openBottomSheet(slug);
      // this.router.navigate(["/product", slug], {});
    }
    // this.location.go("/product/" + slug)
    // this.router.navigate(["/product", slug], {});
  }

  openBottomSheet(slug: string): void {
    this.bottomSheet.open(BottomSheetComponent, { panelClass: 'productBS', data: { slug } });
  }

  preventNavigate(event: any) {
    event.stopPropagation()
    event.preventDefault()
  }

  async addToCart(event: any, productData: any, redirectToCheckout: boolean = false) {
    this.preventNavigate(event)
    // this.spinner.show();
    // if (!redirectToCheckout) this.checkoutService.clearCheckoutData();
    // if (isPlatformBrowser(this.platformId)) {
    // let user = this.cartService.getUser();

    this.productDataAdd = productData
    let user = this.commonService.getUser();

    if (user) {
      const data: any = {
        product: {
          productId: productData.prodId,
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
          // this.cartService.setDatatoCartSubscription(res.data);

          // this.getUserCart()
          this.toaster.success('Product added to cart');
          const gtagEventData = {
            _id: data.product.productId,
            name: productData.prodName,
            quantity: this.quantity,
            price: this.product.prodMinPrice
          };
          this.eventTracking.addToCart(gtagEventData)
          if (this.commonService.isBrowser && typeof gtag === 'function') {
            // gtag('event', 'add_to_cart', gtagEventData);
            gtag('event', 'conversion', { 'send_to': 'AW-564095127/JHdCCIL5zP4CEJfR_YwC' });
          }
        })
        .catch((err: any) => {
          // this.spinner.hide();
          this.toaster.error(err.error?.message, "Error");
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
        console.log(" minPrice: ", this.product.prodMinPrice);
        this.cartService
          .addToCartForGuest(data)
          .toPromise()
          .then((res: any) => {
            // this.getUserCart()
            // this.cartService.setDatatoCartSubscription(res.data);
            // this.spinner.hide();
            // this.commonService.isBrowser && gtag('event', 'conversion', { 'send_to': 'AW-564095127/JHdCCIL5zP4CEJfR_YwC' });

            const gtagEventData = {
              _id: data.product.productId,
              name: productData.prodName,
              quantity: this.quantity,
              price: this.product.prodMinPrice
            };
            this.eventTracking.addToCart(gtagEventData)
            if (res.data) {
              // this.cartService.setDatatoCartSubscription(res.data);
              if (!redirectToCheckout) {
                this.toaster.success('Product added to cart');
              }

              this.guestCartService.setGuestCart(res.data.cart);
            }
            if (this.hideDiscountPriceCart) {
              //console.log('product added  from cart');
            }

            // this.toaster.success('Product Successfully Added To Cart');
          })
          .catch((err: any) => {
            // this.spinner.hide();
            this.toaster.error(err.message);
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
            // this.getUserCart()
            const gtagEventData = {
              _id: data.product.productId,
              name: productData.prodName,
              quantity: this.quantity,
              price: this.product.prodMinPrice
            };
            this.eventTracking.addToCart(gtagEventData)
            if (res.data) {
              if (!redirectToCheckout) {
                this.toaster.success('Product added to cart');
              }
              this.guestCartService.setGuestCart(res.data.cart);
              // this.cartService.setDatatoCartSubscription(res.data.cart);

              // this.cartCount.getCartCount();
              // redirectToCheckout && this.navigateToCheckout();
            }

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

  getUserCart() {
    const user = this.commonService.getUser()?.user
    if (user) {
      this.cartService.getShopCart().subscribe(this.handleShopCartResponse.bind(this));
    } else {
      const _guestCart = this.guestCartService.getGuestCart()
      if (_guestCart) {
        this.cartService.getGuestCart(_guestCart._id).subscribe(this.handleShopCartResponse.bind(this), e => {

        })
      }
    }
  }

  handleShopCartResponse(res: ShopCartResponse) {
    console.log('[getUserCart]', res)
    if (res?.success) {
      const { cartData } = this.cartService
      cartData.shop = res.data
      this.cartService.setCartData(cartData)
    }
  }

}
