import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonService } from '../../services/common.service';
import { GuestCartService } from '../../services/guest-cart.service';
import { UserDashboardService } from '../../services/user-dashboard.service';
import { ConsultantCartData, ConsultantCartResponse, ShopCartResponse } from '../../shared/types/xhr.types';

@Component({
  selector: 'app-inflate-data',
  standalone: true,
  imports: [],
  templateUrl: './inflate-data.component.html',
  styleUrl: './inflate-data.component.scss'
})
export class InflateDataComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private cartService: CartService,
    private guestCartService: GuestCartService,
    private userSerivce: UserDashboardService,
  ) { }

  ngOnInit(): void {
    const userData = this.commonService.getUser()

    if (userData?.user) {
      this.cartService.getShopCart().subscribe(this.handleShopCartResponse.bind(this), e => {

      })
      this.cartService.getConsultantCart().subscribe(this.handleConsultantCartResponse.bind(this), e => {

      })

      this.userSerivce.getUserProfile().subscribe()

    } else {
      const _guestCart = this.guestCartService.getGuestCart()
      let _guestConsultantCartId;
      if (typeof localStorage != 'undefined') {
        _guestConsultantCartId = localStorage.getItem('guestCheckoutCartId');
      }

      if (_guestCart?._id) {
        this.cartService.getGuestCart(_guestCart?._id).subscribe(this.handleShopCartResponse.bind(this), e => {

        })
      }
      if (_guestConsultantCartId) {
        this.cartService.getGuestConsultCart(_guestConsultantCartId).subscribe(this.handleConsultantCartResponse.bind(this), e => {

        })

      }
      //console.log({ _guestConsultantCartId, _guestCart })
    }

  }

  handleShopCartResponse(res: ShopCartResponse) {
    if (res?.success) {
      const { cartData } = this.cartService
      cartData.shop = res.data
      this.cartService.setCartData(cartData)
    }
  }

  handleConsultantCartResponse(res: ConsultantCartResponse) {
    if (res?.success && res.data?.cart) {
      const { cartData } = this.cartService
      cartData.consult = res.data.cart
      this.cartService.setCartData(cartData)
    }
  }


}
