import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Renderer2,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
} from '@angular/core';
// import { CardComponent } from '../../../../../components/card/card.component';
import { ProductSliderComponent } from '../../../../../components/product-slider/product-slider.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../../services/product.service';
import { environment } from '../../../../../../environments/environment';
import { ConsultTopSpecialistsComponent } from '../../../components/consult-top-specialists/consult-top-specialists.component';
import { CartService } from '../../../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../services/common.service';
import { GuestCartService } from '../../../../../services/guest-cart.service';
import { Subscription } from 'rxjs';
import { ProductQuantityControlComponent } from '../../../../../components/product-quantity-control/product-quantity-control.component';
import { CartData } from '../../../../../shared/types/index.types';
import {
  BreadcrumbComponent,
  BreadcrumbData,
} from '../../../../../components/breadcrumb/breadcrumb.component';
import { ReviewComponent } from '../../../../../components/review/review.component';
import { MetasService } from '../../../../../services/metas.service';
import { Error404Component } from '../../../../../shared/components/error-404/error-404.component';
import { ExpressService } from '../../../../../services/express.service';
import { SwiperComponent } from '../../../../../components/swiper/swiper.component';
import { EventTrackingService } from '../../../../../services/event-tracking.service';
import { Product } from '../../../../../shared/types/xhr.types';
import { SpinnerService } from '../../../../../services/spinner.service';
import { isPlatformServer } from '@angular/common';
import { ProductInfoIconsComponent } from '../../../../../components/product-info-icons/product-info-icons.component';
import { url } from 'inspector';
import { BulkEnquiryModalComponent } from '../../../../../components/bulk-enquiry-modal/bulk-enquiry-modal.component';
import { InternationalBulkEnquiryComponent } from '../../../../../components/international-bulk-enquiry/international-bulk-enquiry.component';
declare var gtag: any;

@Component({
  selector: 'app-product-details-desk',
  standalone: true,
  imports: [
    CommonModule,
    // CardComponent,
    ProductSliderComponent,
    ConsultTopSpecialistsComponent,
    ProductQuantityControlComponent,
    BreadcrumbComponent,
    ReviewComponent,
    Error404Component,
    SwiperComponent,
    ProductInfoIconsComponent,
    BulkEnquiryModalComponent,
    InternationalBulkEnquiryComponent,
  ],
  templateUrl: './product-details-desk.component.html',
  styleUrl: './product-details-desk.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductDetailsDeskComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input('slug') _slug?: string;
  // @Input() product: any;
  productDetails: any;
  relatedProducts: any[] = [];
  customersBoughtProducts: any[] = [];
  topConsultLists: any[] = [];
  noProductFound = false;
  // @Input() productDetails: any;
  // @Input() productsRelatedProduct: any;
  // @Input() customersWhoBoughtProducts: any;
  // @Input() topConsultLists: any;
  // @Input() reviews: any;
  // @Output() variation = new EventEmitter<any>();

  cloudImgUrl: string = environment.imageUrl;
  // productVarSize: string;

  quantity: number = 1;
  productDataAdd: any;
  // hideDiscountPriceCart: any;
  subscriptions$: Subscription[] = [];
  cartProduct = null;
  breadcrumb: BreadcrumbData[] = [];

  showEnquiryForm: boolean = false;
  showInternationalEnquiryForm = false;

  // ////////////
  // @Input() productIdReview: string;
  slug: string;
  // screenWidth: any;
  // desktopScreen: any = true;
  // @ViewChild('detailsModal') detailsModal: ElementRef;
  isReadMoreDesc = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productservice: ProductService,
    private router: Router,
    private cartService: CartService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private toaster: ToastrService,
    private guestCartService: GuestCartService,
    private metaService: MetasService,
    private renderer: Renderer2,
    private expressService: ExpressService,
    private eventTracking: EventTrackingService,
    private spinner: SpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.handleCartChanges(this.cartService.cartData);

    // const { _id, name, categories }: any = changes['productDetails'].currentValue || {} || null || undefined;

    // let _breadcrumb: BreadcrumbData[] = []
    // if (categories?.length) {
    //   const { name, slug } = categories[0]
    //   _breadcrumb.push({ title: name, url: '/category/' + slug })
    // }
    // let title = name;
    // _breadcrumb.push({ title });
    // this.breadcrumb = _breadcrumb
  }

  ngOnInit(): void {
    //console.log('[product-details-desk.component]', this.activatedRoute.snapshot.data)

    this.activatedRoute.params.subscribe((res: any) => {
      this.slug = res['product-slug'];
      if (this._slug) {
        this.slug = this._slug;
      }
      this.getProductDetails(this._slug || this.slug);
    });
    this.subscriptions$.push(
      this.cartService
        .getCartData()
        .subscribe(this.handleCartChanges.bind(this))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  ngAfterViewInit() {
    // if (typeof window !== undefined && isPlatformBrowser(this.platformId)) {
    //   this.screenWidth = window.innerWidth;
    //   if (this.screenWidth <= 768) {
    //     this.desktopScreen = false;
    //     // this.openModal();
    //   } else {
    //     this.desktopScreen = true;
    //   }
    // }
  }

  openModal() {
    // this.renderer.addClass(this.detailsModal.nativeElement, 'show');
    // this.renderer.setStyle(this.detailsModal.nativeElement, 'display', 'block');
  }

  closeModal() {
    // this.renderer.removeClass(this.detailsModal.nativeElement, 'show');
    // this.renderer.setStyle(this.detailsModal.nativeElement, 'display', 'none');
    // this.router.navigate([""])
  }

  handleCartChanges(data: CartData) {
    if (data.shop && this.productDetails) {
      this.cartProduct =
        data.shop.products.find(
          (el) => el.productId?._id == this.productDetails._id
        ) || null;
    } else {
      this.cartProduct = null;
    }
  }

  toggleContent(review: any) {
    // review.showFullContent = !review.showFullContent;
  }

  getProductSizesData(variationItem: any) {
    this.router.navigate(['/product/', variationItem.slug]);
    // this.variation.emit(variationItem.slug);
  }

  openBulkEnquiryForm() {
    this.showEnquiryForm = true;
  }

  openInternationBulkEnquiryForm() {
    this.showInternationalEnquiryForm = true;
  }

  async addToCart(productData: any, redirectToCheckout: boolean = false) {
    this.productDataAdd = productData;
    // this.spinner.show();
    // if (!redirectToCheckout) this.checkoutService.clearCheckoutData();
    // if (isPlatformBrowser(this.platformId)) {
    // let user = this.cartService.getUser();
    let user = this.commonService.getUser();

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
          // this.cartService.setDatatoCartSubscription(res.data);

          this.cartService.getShopCart().subscribe((res: any) => {
            // console.log(' getUserCart res', res);
            this.cartService.setDatatoCartSubscription(res.data);
          });
          const gtagEventData = {
            _id: productData._id,
            name: productData.name,
            quantity: this.quantity,
            price: productData.price.minPrice,
          };
          this.eventTracking.addToCart(gtagEventData);
          // this.commonService.isBrowser && gtag && gtag('event', 'add_to_cart', gtagEventData);
          // this.commonService.isBrowser && gtag && gtag('event', 'conversion', { 'send_to': 'AW-564095127/JHdCCIL5zP4CEJfR_YwC' });

          if (!redirectToCheckout) {
            this.toaster.success('Product Successfully Added To Cart');
          }

          // this.cartCount.getCartCount();
          // redirectToCheckout && this.navigateToCheckout();
        })
        .catch((err: any) => {
          // this.spinner.hide();
          this.toaster.error(err.error.message, 'Error');
        });
    } else {
      let tempCart: any;
      let guestCart = this.guestCartService.getGuestCart();
      // let guestCart: any;
      // this.cartService.getCartSubscripition().subscribe((res: any) => {
      //   guestCart = res;
      // });
      if (guestCart) {
        //console.log("Finding the trace for adding cart DESK IF GUEST");
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
        // console.log("PRODUCT DATA: ", productData);
        // console.log("VARIANT DATA: ", variant);
        //console.log("PRICE: ", productData.price.minPrice);
        this.cartService
          .addToCartForGuest(data)
          .toPromise()
          .then((res: any) => {
            const gtagEventData = {
              _id: productData._id,
              name: productData.name,
              quantity: this.quantity,
              price: productData.price.minPrice,
            };
            this.eventTracking.addToCart(gtagEventData);

            this.cartService.setDatatoCartSubscription(res.data);
            // this.spinner.hide();
            // this.commonService.isBrowser && gtag('event', 'conversion', { 'send_to': 'AW-564095127/JHdCCIL5zP4CEJfR_YwC' });

            if (res.data) {
              this.cartService.setDatatoCartSubscription(res.data);
              if (!redirectToCheckout) {
                this.toaster.success('Product Successfully Added To Cart');
              }

              this.guestCartService.setGuestCart(res.data.cart);

              // this.cartCount.getCartCount();
              // redirectToCheckout && this.navigateToCheckout();
            }
            // if (this.hideDiscountPriceCart) {
            //   console.log('product added  from cart');
            // }

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
            const gtagEventData = {
              _id: productData._id,
              name: productData.name,
              quantity: this.quantity,
              price: productData.price.minPrice,
            };
            this.eventTracking.addToCart(gtagEventData);
            if (res.data) {
              if (!redirectToCheckout) {
                this.toaster.success('Product Successfully Added To Cart');
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

  // as per new update and satinder sir instruction

  getProductDetails(slug: any) {
    this.noProductFound = false;
    this.spinner.show();
    this.productservice.getProductsDetailsPage(slug).subscribe(
      (res: any) => {
        this.spinner.hide();
        const { data } = res;
        console.log('RESPONSE:  ', res);
        if (!data) {
          this.noProductFound = true;
          return;
        }
        this.productDetails = data;
        this.eventTracking.viewProduct(data);

        if (this.productDetails?.description?.short) {
          this.productDetails.description.short =
            this.productDetails.description.short.replace(
              /<\/?[^>]+(>|$)/g,
              ''
            );
        }

        let cMetaTitle = this.productDetails.name;
        cMetaTitle = this.productDetails.brandId.name + "'s " + cMetaTitle;
        cMetaTitle = 'Buy ' + cMetaTitle + ' online at HealthyBazar';

        let _breadcrumb: BreadcrumbData[] = [];
        if (this.productDetails.categories?.length) {
          const { name, slug } = this.productDetails.categories[0];
          _breadcrumb.push({
            title: name,
            url: '/category/' + slug,
            urlForSchema: 'category/' + slug,
          });
        }
        let title = this.productDetails.name;
        _breadcrumb.push({ title });
        this.breadcrumb = _breadcrumb;
        let _title = this.productDetails.metaTitle || cMetaTitle;
        let _description =
          this.productDetails.metaDescription ||
          this.productDetails.description.short;

        this.metaService.setCanonical(
          environment.appHost + 'product/' + this.productDetails.slug
        );

        this.metaService.setMetaTags(
          {
            title: _title,
            description: _description,
            image:
              environment.imageUrl +
              (this.productDetails.thumbnail
                ? this.productDetails.thumbnail.savedName
                : this.productDetails.images[0].savedName),
          },
          false
        );

        if (this.productDetails.metaIndex == true)
          this.metaService.setNoIndexTag();

        if (this.productDetails.variations) {
          this.productDetails.variations.sort(
            (a: any, b: any) =>
              (a.price.minPrice || a.price.mrp) -
              (b.price.minPrice || b.price.mrp)
          );
        }

        if (
          this.productDetails.type == 'Normal' &&
          this.productDetails.variations.length
        ) {
          let variation = this.productDetails.variations[0];
          variation.isSelected = true;
          this.productDetails.price = variation.price;
        }
        if (isPlatformServer(this.platformId)) {
          this.metaService.setProductSchema(
            environment.imageUrl +
              (this.productDetails.thumbnail
                ? this.productDetails.thumbnail.savedName
                : this.productDetails.images[0].savedName),
            _description,
            this.productDetails.price,
            this.productDetails.brandId.name,
            this.productDetails.name,
            environment.appHost + 'product/' + this.productDetails.slug
          );

          this.metaService.setBreadCrumb(
            this.breadcrumb[0].title,
            environment.appHost + this.breadcrumb[0].urlForSchema,
            title,
            environment.appHost + 'product/' + this.productDetails.slug
          );
        }
        if (
          this.productDetails.mainVariations.length &&
          this.productDetails.variations.length
        ) {
          this.productDetails.mainVariations =
            this.productDetails.mainVariations.filter(
              (el: any) => !!el.values.length
            );
          this.productDetails.variations =
            this.productDetails.variations.filter(
              (el: any) => !!el.label.length
            );
          if (
            this.productDetails.mainVariations.length &&
            this.productDetails.variations.length
          ) {
            let maxGroupSize =
              this.productDetails.mainVariations
                .map((el: any) => el.values.length)
                .reduce((total: any, el: any) => total * el) || 0;

            // this.checkoutService.addTitleInVariations(data);

            if (this.productDetails.variations.length != maxGroupSize) {
              this.productDetails.variationsStructureType = 'group';
            } else {
              this.productDetails.variationsStructureType = 'single';
            }

            let discount = Math.round(
              ((this.productDetails.price.mrp -
                this.productDetails.price.minPrice) /
                this.productDetails.price.mrp) *
                100
            );
            this.productDetails.price.discount = discount;

            this.makeDefaultVariantsSelected();
          }
        }

        this.productDetails = data;

        //console.log('this.productDetails = ', this.productDetails);

        // this.getProductReview(this.productDetails._id);
        let healthConcernId: Array<any> =
          this.productDetails.healthConcernId.map((res: any) => {
            return res._id;
          });
        this.getTopSpecilistConsult(healthConcernId);
        this.getRelatedProducts(
          this.productDetails.categories[0]._id,
          this.productDetails
        );
        this.getCustomersBoughtProducts(this.productDetails.categories[0]._id);

        this.handleCartChanges(this.cartService.cartData);
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  makeDefaultVariantsSelected() {
    if (
      !this.productDetails.mainVariations.length ||
      !this.productDetails.variations.length
    )
      return;

    let currentGroup = this.productDetails.variations.find(
      (el: any) => '/' + this.slug == el.url
    );

    if (currentGroup) {
      /** if product type is variant */
      currentGroup.isSelected = true;
      let labelArr = currentGroup.label;
      labelArr.forEach((label: any) => {
        this.productDetails.mainVariations.forEach((el: any) => {
          let index = el.values.indexOf(label);
          if (index != -1) {
            el.selectedIndex = index;
          }
        });
      });
    } else {
      /** if product type is normal */
      this.productDetails.variations[0].isSelected = true;
      let selectedValue: any = [];

      let labelArr = this.productDetails.variations[0].label;
      labelArr.forEach((label: any) => {
        this.productDetails.mainVariations.forEach((el: any) => {
          let index = el.values.indexOf(label);
          if (index != -1) {
            el.selectedIndex = index;
            selectedValue.push(el.values[index]);
          }
        });
      });

      // this.productDetails.mainVariations.forEach(el => {
      //   selectedValue.push(el.values[0])
      //   el.selectedIndex = 0;
      // });

      if (this.productDetails.variationsStructureType == 'group') {
        var group = this.productDetails.variations[0];
      } else {
        group = this.productDetails.variations.find((el: any) =>
          this.checkIsSameGroup(selectedValue, el.label)
        );
      }
      this.productDetails = {
        ...this.productDetails,
        parentProductId: this.productDetails._id,
        _id: group.productId,
        weight: group.weight,
        price: group.price,
        stock: group.stock,
        noOfProductSold: group.noOfProductSold,
      };
      this.handleCartChanges(this.cartService.cartData);
      //console.log({ 'makeDefaultVariantsSelected productData': this.productDetails });
    }
  }

  checkIsSameGroup(values1: string[], values2: string[]): boolean {
    // let set = new Set();
    // values1.forEach((el) => set.add(el));
    // values2.forEach((el) => set.add(el));
    // return values1.length == set.size;
    return true;
  }

  getRelatedProducts(categoryId: string, product: Product) {
    this.productservice
      .getProductRelatedProducts(categoryId)
      .subscribe((res: any) => {
        let filterArr: any[] = [];
        let excludeProducts = [product._id, product.parentProductId].filter(
          (el) => el
        );

        res.data.products
          .filter((el: any) => !excludeProducts.includes(el.prodId))
          .map((prod: any) => {
            let productDiscount = Math.round(
              ((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP) * 100
            );
            prod.discount = productDiscount;
            filterArr.push(prod);
          });
        this.relatedProducts = filterArr;
      });
  }

  getCustomersBoughtProducts(categoryId: string) {
    this.productservice
      .getCustomersWhoAlsoBoughtProducts(categoryId)
      .subscribe((res: any) => {
        let filterArr: any[] = [];
        res.data.map((prod: any) => {
          let productDiscount = Math.round(
            ((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP) * 100
          );
          prod.discount = productDiscount;
          filterArr.push(prod);
        });
        this.customersBoughtProducts = filterArr;
      });
  }

  getTopSpecilistConsult(healthConcernId: Array<any>) {
    this.productservice
      .getTopSpecilistConsult({
        page: 1,
        limit: 12,
        healthConcernId: healthConcernId,
      })
      .subscribe((res: any) => {
        this.topConsultLists = res.data;
      });
  }

  showDesc() {
    this.isReadMoreDesc = !this.isReadMoreDesc;
  }
}
