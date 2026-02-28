import { Component, Input } from "@angular/core";
import { CardComponent } from "../card/card.component";
import { CommonModule } from "@angular/common";
import Swiper from "swiper";
import { environment } from "../../../environments/environment";
import { RouterModule } from "@angular/router";

export type ShopCategoryComponentItem = {
  label: string,
  img: string,
  url: string,
}

@Component({
  selector: "app-shop-category",
  templateUrl: "./shop-category.component.html",
  styleUrls: ['./shop-category.component.scss'],
  imports: [CardComponent, CommonModule, RouterModule],
  standalone: true
})
export class ShopCategoryComponent {
  // @Input('categories') item: ShopCategoryComponentItem;
  @Input('categories') item: any;
  @Input() i: number;
  imageCloudPath: string = environment.imageUrl;
  // Define the colors array
  colors: string[] = ['#f1ffd6;', '#FFF4E4', '#FFF8D6', '#FFEAD6'];
  // height: string = "151.06px";
  // width: string = "148.52px";
  // Method to get the color based on the index
  getColor(index: number): string {
    return this?.colors[index % this?.colors?.length];
  }

}