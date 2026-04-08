import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { ProductComponent } from '../../product/product.component';
import { environment } from '../../../environments/environment';
import { register } from 'swiper/element/bundle';
import { RouterModule } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard'
import { ToastrService } from 'ngx-toastr';
import { SwiperComponent } from "../swiper/swiper.component";
register();

export type SliderComponentDataItem = {
  title: string,
  img: string,
  url?: string
  couponCode?: string
}

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, CardComponent, ProductComponent, RouterModule, SwiperComponent],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SliderComponent {
  @Input() data: SliderComponentDataItem[] = [];
  @Input() section: string;

  cloudImageUrl: any = environment.imageUrl;


  swiperBannerBreakpoints: any = {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 5
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 1.1,
      spaceBetween: 15
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 2,
      spaceBetween: 15
    },
    991: {
      slidePerView: 3,
      spaceBetween: 15
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20
    }
  }

  swiperCouponBreakpoints: any = {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 10
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 1,
      spaceBetween: 15
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    768: {
      slidePerView: 2,
      spaceBetween: 15
    },
    1024: {
      slidesPerView: 2,
      spaceBetween: 20
    }
  }

  constructor(
    private productService: ProductService,
    private clipboard: Clipboard,
    private toastr: ToastrService,
  ) { }

  copyCoupon(coupon: any) {
    if (coupon) {
      this.clipboard.copy(coupon)
      this.toastr.success('Use at checkout', 'Coupon code copied!')
    }
  }
}