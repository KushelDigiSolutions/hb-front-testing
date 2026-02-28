import { Injectable } from '@angular/core';
import { Product } from '../shared/types/xhr.types';
import { environment } from '../../environments/environment';
import { CommonService } from './common.service';
declare var dataLayer: Array<any>
declare let gtag: Function; // Declare gtag globally

@Injectable({
  providedIn: 'root'
})
export class EventTrackingService {

  constructor(
    private commonService: CommonService,
  ) { }

  // gtag('event'

  googleTagEvent(event_name: string, event_data?: any) {
    //if (environment.production && this.commonService.isBrowser && typeof dataLayer === 'object') {
    //console.log("ENV: ", environment)
    //if ( this.commonService.isBrowser && typeof dataLayer === 'object') {
    if (environment.production){
      if (typeof gtag === 'function') {
        console.log('event', event_name)
        gtag("event", event_name, event_data);
      }
      console.log("EVENT SENT TO GTAG")
    }
      //dataLayer?.push({ ecommerce: null })
      //dataLayer?.push({ event: event_name, ecommerce: event_data })
     
    //}
  }

  viewProduct(product: Product) {
    try {
      const eventData = {
        user: this.commonService.getUser()?.user?._id || null,
        productId: product._id,
        name: product.name,
        categoryId: product.primaryCategory?._id || null,
        categoryName: product.primaryCategory?.name || null,
        brandId: product.brandId?._id || null,
        brandName: product.brandId?.name || null,
        availability: product.stock?.availableQuantity ? "In Stock" : "Out of Stock",
        description: product.description?.short?.replace(/<[^>]*>?/gm, '') || null,
        rating: product.averageRating,
        images: product.images?.map(el => environment.imageUrl + el.savedName) || null,
        features: product.attributes || null,
      };
      this.googleTagEvent('view_item', eventData)
    } catch (e) {
      console.error('[event tracking]', e)
    }
  }

  addToCart(product: { _id: string, name: string, quantity: number, price: number}) {
    try {
     /* const eventData = {
        user: this.commonService.getUser()?.user?._id || null,
        productId: product._id,
        name: product.name,
        quantity: product.quantity,
      }; */
      // Prepare event data in the correct GA4 format
      const eventData = {
        currency: "inr", // Required for eCommerce tracking
        value: product.price * product.quantity, // Total price of the item
        items: [
          {
            item_id: product._id, // Correct GA4 key
            item_name: product.name, // Correct GA4 key
            quantity: product.quantity, // Quantity of item added
            price: product.price,
          }
        ]
      }

      this.googleTagEvent('add_to_cart', eventData)
    } catch (e) {
      console.error('[event tracking]', e)
    }
  }

  removeFromCart(product: { _id: string, name: string }) {
    try {
      const eventData = {
        user: this.commonService.getUser()?.user?._id || null,
        productId: product._id,
        name: product.name,
      };
      this.googleTagEvent('remove_from_cart', eventData)
    } catch (e) {
      console.error('[event tracking]', e)
    }
  }

  beginCheckout() {
    try {
      let user = this.commonService.getUser()?.user?._id || null;
      this.googleTagEvent('begin_checkout', { user })
    } catch (e) {
      console.error('[event tracking]', e)
    }
  }

  purchaseCompleted(data: any) {
    try {
      this.googleTagEvent('purchase', data)
    } catch (e) {
      console.error('[event tracking]', e)
    }
  }

  viewCart() {
    try {
      let user = this.commonService.getUser()?.user?._id || null;
      // let listOfProductsInOrder = [];
      // let orderStatus;
      // if(order.products.length > 0){
      //   order.products.forEach((item) => {
      //     //listOfProductsInOrder += item.productName;
      //     listOfProductsInOrder.push(item.productName+" ["+item.seller+"]");
      //   });
      // }
      // const eventData = {
      //   currency: "inr", // Required for eCommerce tracking
      //   value: data.totalPayableAmt, // Total price of the item
      //   items: [
      //     {
      //       item_id: product._id, // Correct GA4 key
      //       item_name: product.name, // Correct GA4 key
      //       quantity: product.quantity, // Quantity of item added
      //       price: product.price,
      //     }
      //   ]
      // }
      this.googleTagEvent('view_cart', { user })
    } catch (e) {
      console.error('[event tracking]', e)
    }
  }



}
