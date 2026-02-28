import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../../product/product.component';
import { RouterModule } from '@angular/router';
import { SwiperComponent } from '../swiper/swiper.component';
import { ProductSkeletonComponent } from '../product-skeleton/product-skeleton.component';


@Component({
  selector: 'app-product-slider',
  standalone: true,
  imports: [CardComponent, CommonModule, ProductComponent, RouterModule, SwiperComponent, ProductSkeletonComponent],
  templateUrl: './product-slider.component.html',
  styleUrl: './product-slider.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductSliderComponent {
  @Input() productData: any; // array comes
  @Input() productBrandTitle: string;
  @Input() isCartSimProduct: boolean
  @Input() seeAllUrl: string
  @Input() loading: boolean

  swiperBreakpints: any = {
    // when window width is >= 320px
    320: {
      slidesPerView: 1.5,
      spaceBetween: 8
    },
    375: {
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
    768: {
      slidesPerView: 4.5,
      spaceBetween: 25
    },
    1024: {
      slidesPerView: 6.5,
      spaceBetween: 15
    }
  }

}
