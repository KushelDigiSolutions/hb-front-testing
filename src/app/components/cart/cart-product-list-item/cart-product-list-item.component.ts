import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { CartService } from '../../../services/cart.service';
import { CommonService } from '../../../services/common.service';
import { GuestCartService } from '../../../services/guest-cart.service';
import { CheckoutService } from '../../../shared/components/checkout/checkout.service';
import { ProductQuantityControlComponent } from '../../product-quantity-control/product-quantity-control.component';
import { EventTrackingService } from '../../../services/event-tracking.service';

@Component({
  selector: 'app-cart-product-list-item',
  standalone: true,
  imports: [
    CommonModule,
    ProductQuantityControlComponent,
  ],
  templateUrl: './cart-product-list-item.component.html',
  styleUrl: './cart-product-list-item.component.scss'
})
export class CartProductListItemComponent implements OnInit {

  @Input() data: any

  @ViewChild(ProductQuantityControlComponent) quantityControl: ProductQuantityControlComponent;

  s3Base = environment.imageUrl
  isReadMore = false
  isUser = this.commonService.getUser()?.user
  maxQtyAllowed = 0

  constructor(
    private toaster: ToastrService,
    private commonService: CommonService,
    private cartService: CartService,
    private guestCartService: GuestCartService,
    private checkoutService: CheckoutService,
    private eventTracking: EventTrackingService,
  ) { }

  ngOnInit(): void {
    if (this.data.productId) {
      this.maxQtyAllowed = this.data.productId?.maxSaleQty;
      if (this.data.productId.stock?.availableQuantity < this.maxQtyAllowed) {
        this.maxQtyAllowed = this.data.productId.stock?.availableQuantity
      }
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

          const gtagEventData = {
            _id: product.productId._id,
            name: product.productId.name,
          }
          this.eventTracking.removeFromCart(gtagEventData)
          // gtag && gtag('event', 'remove_from_cart', gtagEventData)

          // this.cartCount.getCartCount();
          // this.getCartItems();
          this.toaster.success('Product Removed Successfully');
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
          // this.getCartItems();
          this.eventTracking.removeFromCart({ _id: product.productId._id, name: product.productId.name })
          this.toaster.success('Product Removed Successfully');
        }, error => {
          this.toaster.error('Error')
        })
        .catch((err: any) => {
          this.toaster.error(err);
        });
    }

  }

  changeQuantity() {
    this.quantityControl.changeCartQuantity(this.data, this.maxQtyAllowed)
  }

}
