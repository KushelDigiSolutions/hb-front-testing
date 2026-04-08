import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { ProductSliderComponent } from '../../../../../components/product-slider/product-slider.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lifestyle-description',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductSliderComponent,
  ],
  templateUrl: './lifestyle-description.component.html',
  styleUrl: './lifestyle-description.component.scss'
})
export class LifestyleDescriptionComponent implements OnInit {
  cdnBase: string = environment.imageUrl;
  @Input() blog: any;
  recommendedProducts: any;
  paragraphBeforeProductList: any;
  paragraphAfterBanner: any
  showFullBlog = false;

  ngOnInit(): void {
    this.genrateHTML();
    // this.addDiscount();
  }

  genrateHTML() {
    let temp: any = this.blog.description;
    this.paragraphBeforeProductList = temp.split(['@p@']);
    // this.paragraphAfterBanner = temp.split(['@c@']);
  }

  addDiscount() {
    let filterArr: any[] = [];
    this.blog.products.map((prod: any) => {
      let productDiscount = Math.round(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
      prod.discount = productDiscount;
      filterArr.push(prod);
    });
    this.recommendedProducts = filterArr;
  }

  

}
