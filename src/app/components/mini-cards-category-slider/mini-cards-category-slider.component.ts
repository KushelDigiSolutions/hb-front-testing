import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ShopHealthConcernComponent } from "../../modules/shop/components/shop-health-concern/shop-health-concern.component";
import { SwiperComponent } from "../swiper/swiper.component";

export type MiniCardsCategorySliderComponentItem = {
  label: string,
  img: string,
  url: string,
}

@Component({
  selector: 'app-mini-cards-category-slider',
  standalone: true,
  imports: [CommonModule, RouterModule, ShopHealthConcernComponent, SwiperComponent],
  templateUrl: './mini-cards-category-slider.component.html',
  styleUrl: './mini-cards-category-slider.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MiniCardsCategorySliderComponent {

  @Input() label: string;
  @Input('data') list: MiniCardsCategorySliderComponentItem[] = []
  @Input() seeAllUrl?: string
  @Input() bgColor1?: string = '#FFEDDC'
  @Input() bgColor2?: string = '#FFF1E5'


  cloudImagePath = environment.imageUrl

  static DataTransform(label: string, img: string, url: string) {
    return { label, img, url } as MiniCardsCategorySliderComponentItem
  }

}
