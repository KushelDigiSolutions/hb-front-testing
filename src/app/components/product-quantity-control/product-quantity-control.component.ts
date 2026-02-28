import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';
import { CommonService } from '../../services/common.service';
import { GuestCartService } from '../../services/guest-cart.service';

@Component({
  selector: 'app-product-quantity-control',
  standalone: true,
  imports: [],
  templateUrl: './product-quantity-control.component.html',
  styleUrl: './product-quantity-control.component.scss'
})
export class ProductQuantityControlComponent implements OnInit, OnChanges {

  @Input() data: any;
  isUser: any;
  tempQuantity = 0

  constructor(
    private toaster: ToastrService,
    private commonService: CommonService,
    private cartService: CartService,
    private guestCartService: GuestCartService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.tempQuantity = this.data.quantity
  }

  ngOnInit(): void {
    this.isUser = this.commonService.getUser()?.user
  }

  quantityPicker(value: string) {
    if (value == "add") {
      if (this.tempQuantity < this.data.productId?.maxSaleQty) {
        this.tempQuantity += 1;
        this.changeCartQuantity(this.data);
      } else if (this.tempQuantity == this.data.productId?.maxSaleQty) {
        this.toaster.warning("Maximum limit exceeded");
      }
    } else if (value == "remove") {
      if (this.tempQuantity > 1) {
        this.tempQuantity -= 1;
        this.changeCartQuantity(this.data);
      } else {
        this.removeProduct(this.data)
      }
      if (this.tempQuantity == 1) {
        this.tempQuantity = this.tempQuantity;
      }
    }
  }

  changeCartQuantity(item: any, resetQtyCount?: number) {
    console.log('item = ', item);

    if (this.isUser) {
      const data = {
        product: {
          productId: item?.productId?._id,
          quantity: resetQtyCount == undefined ? this.tempQuantity : resetQtyCount,
          label: item.label || [],
          weight: item.weight,
          slug: item.productId.slug,
          pageType: "cart",
        },
      };
      this.cartService
        .addToCart(data).subscribe((res: any) => {
          // this.getCartItems();
          this.toaster.success('Quantity Updated');
        }, (err: any) => {
          this.tempQuantity = item?.quantity
          this.toaster.error(err.error?.message || 'Something went wrong!');
        })
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
          quantity: resetQtyCount == undefined ? this.tempQuantity : resetQtyCount,
          label: item.label || [],
          weight: item.weight,
          slug: item.productId.slug,
          pageType: "cart",
        },
      };

      this.cartService.addToCartForGuest(data).subscribe((res: any) => {
        // this.getCartItems();
        this.toaster.success('Quantity updated');
      }, (err: any) => {
        this.tempQuantity = item?.quantity
        this.toaster.error(err.error.error);
      })
    }
  }

  removeProduct(product: any) {
    if (this.isUser) {
      const data = {
        productId: product.productId._id
      };
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
          // this.getCartItems();
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
          // this.getCartItems();
          this.toaster.success('Product Removed Successfully');
        }, error => {
          this.toaster.error('Error')
        })
        .catch((err: any) => {
          this.toaster.error(err);
        });
    }

  }
}
