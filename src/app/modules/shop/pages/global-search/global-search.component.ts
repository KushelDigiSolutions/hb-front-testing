import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit } from '@angular/core';
import { CardComponent } from '../../../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { AffordableHealthPackagesComponent } from '../../components/Affordable-Health-Packages/affordable-health-packages.component';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../../services/product.service';
import { ProductSliderComponent } from '../../../../components/product-slider/product-slider.component';
import { ActivatedRoute, Route } from '@angular/router';
import { Subscription } from 'rxjs';
import { log } from 'console';
import { LifestyleTipsService } from '../../../../services/lifestyle-tips.service';
import { ApiService } from '../../../../services/api.service';
import { ConsultUsService } from '../../../consult-us/services/consult-us.service';
import { Product } from '../../../../shared/types/xhr.types';
import { LifeStyleHealthCardComponent } from '../../../../shared/components/life-style-health-card/life-style-health-card.component';
import { ConsultTopSpecialistsComponent } from '../../components/consult-top-specialists/consult-top-specialists.component';
import { SpinnerService } from '../../../../services/spinner.service';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CardComponent,
    CommonModule,
    AffordableHealthPackagesComponent,
    ProductSliderComponent,
    LifeStyleHealthCardComponent,
    ConsultTopSpecialistsComponent,
  ],
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GlobalSearchComponent implements OnInit, OnDestroy {

  query = ''
  subscriptions: Subscription[] = []
  products: Product[] = []
  blogs: any[] = []
  consultants: any[] = []

  affordablePackages: Array<any>;
  shopnowProducts: Array<any>;


  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private lifestyleTipsService: LifestyleTipsService,
    private consultUsService: ConsultUsService,
    private spinner: SpinnerService,
  ) { }

  ngOnInit(): void {
    this.subscribeSearchParams()
    this.getSearchedProducts();
    this.getShopNowData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  subscribeSearchParams() {
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.query = params['query']
      this.searchProducts()
      // this.searchTips()
      // this.searchConsultants()
    }))
  }

  searchProducts() {
    this.spinner.show()
    this.productService.getSearchedResults(this.query).subscribe(res => {
      this.spinner.hide()
      console.log('products res', res);
      this.products = res.data.find(data => data.name == 'Product')?.data || []
      this.blogs = res.data.find(data => data.name == 'Blog')?.data || []
      this.consultants = res.data.find(data => data.name == 'User')?.data || []
    }, err => {
      this.spinner.hide()
    })
  }

  // searchTips() {
  //   this.lifestyleTipsService.searchLifestyleTips({ title: this.query, limit: 12, page: 1 }).subscribe(res => {
  //     console.log('[tips response]', res)
  //   })
  // }

  // searchConsultants() {
  //   this.consultUsService.searchConsultants({query: this.query, limit: 12, page: 1}).subscribe(res => {
  //     console.log('[consultants response]', res)
  //   })
  // }

  getSearchedProducts() {
    this.productService.getAffordablePackages().subscribe((res: any) => {
      let filterArr: any[] = [];
      res.data.map((packages: any) => {
        let productDiscount = Math.round(((packages.packageMRP - packages.packageSellingPrice) / packages.packageMRP * 100));
        packages.discount = productDiscount;
        filterArr.push(packages);
      });
      this.affordablePackages = filterArr;
    });
  }

  getShopNowData() {
    this.productService.getOurBestSeller().subscribe((res: any) => {
      let filterArr: any[] = [];
      res.data.products.map((prod: any) => {
        let productDiscount = Math.round(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
        prod.discount = productDiscount;
        filterArr.push(prod);
      });
      this.shopnowProducts = filterArr;
    });
  }

}
