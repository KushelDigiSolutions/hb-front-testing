import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CartService, VisibleCartType } from '../../services/cart.service';
import { CartData } from '../../shared/types/index.types';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { ConsultantCartData, ShopCartData } from '../../shared/types/xhr.types';
import { MobileCartBottomSheetComponent } from './mobile-cart-bottom-sheet/mobile-cart-bottom-sheet.component';
import { CartProductListItemComponent } from '../cart/cart-product-list-item/cart-product-list-item.component'

@Component({
  selector: 'app-mobile-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatBottomSheetModule,
    CartProductListItemComponent,
  ],
  templateUrl: './mobile-cart.component.html',
  styleUrl: './mobile-cart.component.scss'
})
export class MobileCartComponent implements OnInit {

  s3Base = environment.imageUrl
  cartData: CartData | null = null
  cartType: VisibleCartType = 'shop'
  showSheet = false
  showMobileCart = false

  constructor(
    private cartService: CartService,
    private bottomSheet: MatBottomSheet,
    private router: Router,
  ) { }

  ngOnInit() {
    // this.cartData.
    this.cartService.getCartState().subscribe(value=>{
      this.cartType = value
    })
    this.cartService.getCartData().subscribe(data => {
      if (this.cartType == 'shop') {
        this.cartData = data
        if(!this.cartData.shop?.products?.length && this.showSheet){
          this.onToggleSheet()
        }
      }
    })

    this.router.events.subscribe(event=>{
      if(event instanceof NavigationEnd){
        if(event.url.startsWith('/payment') || event.url.startsWith('/cart') || event.url.startsWith('/consult-us')  || event.url.startsWith('/lifestyle-tips')){
          this.showMobileCart = false
          document.body.classList.remove('overflow-hidden')
        } else {
          this.showMobileCart = true
        }
      }
    })
  }

  onToggleSheet() {
    this.showSheet = !this.showSheet
    if (this.showSheet) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }

}
