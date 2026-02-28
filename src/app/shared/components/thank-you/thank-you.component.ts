import { Component } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { PaymentFor } from '../cart/cart.component';
import { environment } from '../../../../environments/environment';
import { MetasService } from '../../../services/metas.service';
import { getOS } from '../../../util/os.util';
import { CheckoutService } from '../checkout/checkout.service';
import { CommonService } from '../../../services/common.service';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { EventTrackingService } from '../../../services/event-tracking.service';
var gtag: any;
var dataLayer: any;
@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.scss'
})
export class ThankYouComponent {

  queryParams: Params;
  orderId: string;
  shortOrderID: string;
  paymentFor: PaymentFor;
  imgUrl = environment.imageUrl;
  continueButtonHovered = false;
  surveyButtonHovered = false;
  exploreButtonHovered = false;
  showAppDownload = false;

  slides = [
    {
      img: "trending-blog-tile.png",
    },
    {
      img: "trending-blog-tile.png",
    },
    {
      img: "trending-blog-tile.png",
    },
    {
      img: "trending-blog-tile.png",
    },
  ];
  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    draggable: false,
    autoplaySpeed: 3000,
    arrows: true,
  };
  OS: string;

  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private metasService: MetasService,
    // private chec: UserDashboardService,
    private commonService: CommonService,
    private eventTracking: EventTrackingService,
  ) { }

  ngOnInit(): void {

    this.queryParams = this.route.snapshot.queryParams;
    this.getOrderDetails();
    let { shortOrderID, orderId, paymentFor, withoutTxn, appDownload } = this.queryParams;
    this.showAppDownload = appDownload
    this.orderId = orderId;
    this.paymentFor = paymentFor || 'order';
    this.shortOrderID = shortOrderID || orderId;
    this.OS = getOS()

    const gtagEventData = {
      userId: this.commonService.getUser()?.user?._id || null,
      orderId,
      paymentFor,
      withoutTxn,
    }
    // gtag('event', 'purchase', gtagEventData)
    //this.eventTracking.purchaseCompleted(gtagEventData)

    // if (!withoutTxn) {
    //   gtag('event', 'conversion', {
    //     'send_to': 'AW-564095127/RaDsCL6ckf4CEJfR_YwC',
    //     'transaction_id': ''
    //   });
    // }

    this.metasService.setMetaTags({
      title: paymentFor == 'order' ? 'Order placed ' : 'Appointment Created Successfully',
    });
    let checkoutData = this.checkoutService.getCheckoutData();
    let product = checkoutData.products[0];

    if (product) {
      this.checkoutService.clearCheckoutData();
      const body = {
        productId: product.productId,
      };

      this.cartService.removeProductFromCart(body).subscribe((res: any) => {
        this.cartService.getCartCount();
      }, (err: any) => {
        this.cartService.getCartCount();
      });
    } else {
      this.checkoutService.deleteCart().subscribe((res: any) => {
        this.cartService.getCartCount();
      }, (err: any) => {
        this.cartService.getCartCount();
      })
    }
    const cartClone = { ...this.cartService.cartData }
    if (this.paymentFor == 'order') {
      this.cartService.setCartData({ ...cartClone, shop: null })
    } else if (this.paymentFor == 'appointment') {
      this.cartService.setCartData({ ...cartClone, consult: null })
    }
  }

  getOrderDetails() {
    const { paymentFor, orderId } = this.queryParams
    switch (paymentFor) {
      case 'order':
        let { shortOrderID, orderId, paymentFor, withoutTxn, appDownload } = this.queryParams;
        this.checkoutService.getOrderDetails(orderId).subscribe((res: any) => {
          let { status, data } = res
          if (status && data) {
            let { shippingCharges, tax, totalPayableAmount, paymentDetails, products } = data;

            let ecommerceData = {
              transaction_id: paymentDetails?.txnId || "",
              value: totalPayableAmount,
              tax,
              shipping: shippingCharges,
              currency: "INR",
              // coupon: "SUMMER_SALE",
              userId: this.commonService.getUser()?.user?._id || null,
              order_id: shortOrderID,
              paymentFor,
              items: products.map((el: any) => {
                let categories = {};
                // el.productId?.categories?.forEach((el, index) => {
                //   categories['item_category' + (index > 0 ? index + 1 : '')] = el.name
                // })
                let data = {
                  item_id: el._id,
                  item_name: el.productName,
                  // coupon: "SUMMER_FUN",
                  currency: "inr",
                  discount: el.discount,
                  index: 0,
                  item_brand: el.seller,
                  ...categories,
                  price: el.productPrice,
                  quantity: el.quantity,
                }
                return data;
              })
            }
            console.log({ ecommerceData });
            // saving direct object to gtag
            this.eventTracking.purchaseCompleted({
              transaction_id: paymentDetails?.txnId || "",
              value: totalPayableAmount,
              tax,
              shipping: shippingCharges,
              currency: "inr",
              //
              userId: this.commonService.getUser()?.user?._id || null,
              order_id: shortOrderID,
              paymentFor,
              // coupon: "SUMMER_SALE",
              items: products.map((el: any) => {
                let categories = {};
                // el.productId?.categories?.forEach((el, index) => {
                //   categories['item_category' + (index > 0 ? index + 1 : '')] = el.name
                // })
                let data = {
                  item_id: el._id,
                  item_name: el.productName,
                  // coupon: "SUMMER_FUN",
                  currency: "INR",
                  discount: el.discount,
                  index: 0,
                  item_brand: el.seller,
                  ...categories,
                  price: el.productPrice,
                  quantity: el.quantity,
                }
                return data;
              })
            });
            dataLayer?.push({ ecommerce: null });
            dataLayer?.push({
              event: "purchase",
              ecommerce: ecommerceData
            });
          }
        }, (err: any) => {

        })
        break;
      case 'appointment':
        break;
    }
  }

  buttonHovered(value: any) {
    if (value == "continue") {
      this.continueButtonHovered = true;
    }
    if (value == "survey") {
      this.surveyButtonHovered = true;
    }
    if (value == "explore") {
      this.exploreButtonHovered = true;
    }
  }
  buttonHoveredOut(value: any) {
    if (value == "continue") {
      this.continueButtonHovered = false;
    }
    if (value == "survey") {
      this.surveyButtonHovered = false;
    }
    if (value == "explore") {
      this.exploreButtonHovered = false;
    }
  }

  downloadApp() {
    if (this.OS == 'Android') {
      window.open("https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.healthybazar")
    } else if (this.OS == 'iOS') {
      // window.open("itms-apps://apps.apple.com/in/app/snapchat/id447188370")
      // https://apps.apple.com/in/app/apple-store/id375380948
    } else {

    }
  }
}
