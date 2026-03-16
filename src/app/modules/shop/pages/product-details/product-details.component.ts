import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { ProductService } from '../../../../services/product.service';
import { ProductSliderComponent } from '../../../../components/product-slider/product-slider.component';
import { ProductComponent } from '../../../../product/product.component';
import { SliderComponent } from '../../../../components/slider/slider.component';
import { CardComponent } from '../../../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { ConsultTopSpecialistsComponent } from '../../components/consult-top-specialists/consult-top-specialists.component';
import { ProductDetailsDeskComponent } from './product-details-desk/product-details-desk.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { Renderer2, HostListener, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CartService } from '../../../../services/cart.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { GuestCartService } from '../../../../services/guest-cart.service';
import { ReviewComponent } from '../../../../components/review/review.component';
import { MetasService } from '../../../../services/metas.service';
import { Product } from '../../../../shared/types/xhr.types';
register();
declare var gtag: any;

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule,
    ProductSliderComponent,
    ProductComponent,
    SliderComponent,
    CardComponent,
    ConsultTopSpecialistsComponent,
    ProductDetailsDeskComponent,
    ReviewComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  isShowCartProductCount = false;
  @ViewChild('detailsModal') detailsModal: ElementRef;
  @Output() variation = new EventEmitter<any>();
  ourBestSeller: Array<any>;
  topConsultLists: Array<any>;
  desktopScreen: any = true;
  display: any;
  screenWidth: any;
  productDetails: any;
  cloudImgUrl: string = environment.imageUrl;
  relatedProducts: any;
  customersBoughtProducts: any;
  selectedProductVariety: any = null;

  swiperBreakpints: any = {
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
      spaceBetween: 40
    },
    1024: {
      slidesPerView: 6.5,
      spaceBetween: 5
    },
    1200: {
      slidesPerView: 7.5,
      spaceBetween: 5
    }
  }
  // productDataAdd: { variations: any; mainVariations: any; };
  productDataAdd: any;
  quantity: number = 1;
  hideDiscountPriceCart: any;

  // ///////
  slug: string;
  productReviews: any;
  reviewsPerPage: number = 2;
  currentPage: number = 1;


  constructor(private productservice: ProductService,
    private renderer: Renderer2,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private commonService: CommonService,
    private toaster: ToastrService,
    private guestCartService: GuestCartService,
    private metaService: MetasService,
  ) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.slug = res['product-slug'];
      this.getProductDetails(this.slug);
    });
  }

  ngOnInit(): void {
    let user = this.commonService.getUser();

    // this.slug = this.activatedRoute.snapshot.params['product-slug'];
    // let slug: any = this.activatedRoute.snapshot.params['product-slug'];
    if (this.slug) {

      // let isCart = this.getProductDetails(this.slug);
      // if (user) {
      //   this.cartService.getShopCart().subscribe((res: any) => {
      //     if (res.data) {
      //       res.data.find((res: any) => {
      //         res.products.find((cartProd: any) => {
      //           // if (prod._id == cartProd._id) {
      //           //   this.isShowCartProductCount = true;
      //           // }
      //         })
      //       })
      //     }
      //   });

      // } else {
      //   // this.cartService.addToCartForGuest(prodBody).subscribe((res: any) => {
      //   //   localStorage.setItem('guestCartId', res.data.cart._id);
      //   // });
      // }
    }
    this.getOutBestSeller();

  }

  ngAfterViewInit() {
    if (typeof window !== undefined && isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth <= 768) {
        this.desktopScreen = false;
        this.openModal();
      } else {
        this.desktopScreen = true;
      }
    }
  }


  openModal() {
    this.renderer.addClass(this.detailsModal.nativeElement, 'show');
    this.renderer.setStyle(this.detailsModal.nativeElement, 'display', 'block');
  }

  closeModal() {
    this.renderer.removeClass(this.detailsModal.nativeElement, 'show');
    this.renderer.setStyle(this.detailsModal.nativeElement, 'display', 'none');
    this.router.navigate([""])
  }

  getOutBestSeller() {
    // this.productservice.getOurBestSeller().subscribe((res: any) => {
    //   this.ourBestSeller = res;
    // });
  }

  getProductDetails(slug: any) {
    this.productservice.getProductsDetailsPage(slug).subscribe((res: any) => {
      const { data } = res
      this.productDetails = data;

      let cMetaTitle = this.productDetails.name;
      cMetaTitle = this.productDetails.brandId.name + "'s " + cMetaTitle;
      cMetaTitle = 'Buy ' + cMetaTitle + ' online at HealthyBazar';

      let _title = this.productDetails.metaTitle || cMetaTitle;
      let _description = this.productDetails.metaDescription || this.productDetails.description.short;

      this.metaService.setCanonical(
        environment.appHost + "product/" + this.productDetails.slug
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

      if (this.productDetails.variations) {
        this.productDetails.variations.sort((a: any, b: any) =>
          (a.price.minPrice || a.price.mrp) - (b.price.minPrice || b.price.mrp)
        );
      }

      if (
        this.productDetails.type == "Normal" &&
        this.productDetails.variations.length
      ) {
        let variation = this.productDetails.variations[0];
        this.productDetails.price = variation.price;
      }

      if (
        this.productDetails.mainVariations.length &&
        this.productDetails.variations.length
      ) {
        this.productDetails.mainVariations =
          this.productDetails.mainVariations.filter(
            (el: any) => !!el.values.length
          );
        this.productDetails.variations = this.productDetails.variations.filter(
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
            this.productDetails.variationsStructureType = "group";
          } else {
            this.productDetails.variationsStructureType = "single";
          }

          let discount = Math.round(((this.productDetails.price.mrp - this.productDetails.price.minPrice) / this.productDetails.price.mrp * 100));
          this.productDetails.price.discount = discount;

          this.makeDefaultVariantsSelected();
        }
      }

      this.productDetails = data;


      //console.log('this.productDetails = ', this.productDetails);

      this.getProductReview(this.productDetails._id);
      let healthConcernId: Array<any> = this.productDetails.healthConcernId.map((res: any) => {
        return res._id;
      });
      this.getTopSpecilistConsult(healthConcernId);
      this.getRelatedProducts(this.productDetails.categories[0]._id, this.productDetails);
      this.getCustomersBoughtProducts(this.productDetails.categories[0]._id);
    });
  }

  makeDefaultVariantsSelected() {
    if (
      !this.productDetails.mainVariations.length ||
      !this.productDetails.variations.length
    )
      return;

    let currentGroup = this.productDetails.variations.find(
      (el: any) => "/" + this.slug == el.url
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

      if (this.productDetails.variationsStructureType == "group") {
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
      //console.log({ 'makeDefaultVariantsSelected productData': this.productDetails });

    }
  }

  checkIsSameGroup(values1: string[], values2: string[]): boolean {
    let set = new Set();
    values1.forEach((el) => set.add(el));
    values2.forEach((el) => set.add(el));
    return values1.length == set.size;
  }

  getProductReview(productId: string) {
    this.productservice.getProductReviews(productId).subscribe((res: any) => {
      this.productReviews = res;
    });
  }

  getRelatedProducts(categoryId: string, product: Product) {
    this.productservice.getProductRelatedProducts(categoryId).subscribe((res: any) => {
      let filterArr: any[] = [];
      let excludeProducts = [product._id, product.parentProductId].filter(el => el)

      res.data.products.filter((el: any) => !excludeProducts.includes(el.prodId)).map((prod: any) => {
        let productDiscount = Math.round(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
        prod.discount = productDiscount;
        filterArr.push(prod);
      });
      this.relatedProducts = filterArr;
    });
  }

  getCustomersBoughtProducts(categoryId: string) {
    this.productservice.getCustomersWhoAlsoBoughtProducts(categoryId).subscribe((res: any) => {
      let filterArr: any[] = [];
      res.data.map((prod: any) => {
        let productDiscount = Math.round(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
        prod.discount = productDiscount;
        filterArr.push(prod);
      });
      this.customersBoughtProducts = filterArr;
    });
  }

  getTopSpecilistConsult(healthConcernId: Array<any>) {
    this.productservice.getTopSpecilistConsult({ page: 1, limit: 12, healthConcernId: healthConcernId }).subscribe((res: any) => {
      this.topConsultLists = res.data;
    });
  }

  getProductSizesData(variationItem: any) {
    this.selectedProductVariety = variationItem;
    this.router.navigate(['/product/', variationItem.slug]);
    this.productDetails.price = variationItem.price;
    this.productDetails['label'] = variationItem.label;

    // this.variation.emit(variationItem.slug);
  }



  async addToCart(productData: any, redirectToCheckout: boolean = false) {
    this.productDataAdd = productData
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
            this.cartService.setDatatoCartSubscription(res.data);
          });
          if (res) {
            this.toaster.success('Product Successfully Added To Cart');
          }
          const gtagEventData = {
            productId: productData._id,
            name: productData.name,
            quantity: this.quantity,
            user: this.cartService.getUser()?.user?._id || null,
          };
          this.commonService.isBrowser && gtag && gtag('event', 'add_to_cart', gtagEventData);
          this.commonService.isBrowser && gtag && gtag('event', 'conversion', { 'send_to': 'AW-564095127/JHdCCIL5zP4CEJfR_YwC' });

          if (!redirectToCheckout) {
            this.toaster.success('Product Successfully Added To Cart');
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
}
