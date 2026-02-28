import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsultTopSpecialistsComponent } from '../shop/components/consult-top-specialists/consult-top-specialists.component';
import { ProductService } from '../../services/product.service';
import { ProductSliderComponent } from '../../components/product-slider/product-slider.component';
import { ShopNowService } from '../shop/services/shop-now.services';
import { LifeStyleHealthCardComponent } from '../../shared/components/life-style-health-card/life-style-health-card.component';
import { LifestyleTipsService } from '../../services/lifestyle-tips.service';
import { SelfHealthAssessmentService } from '../../services/self-health-assessment.service';
import { environment } from '../../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { ConsultUsList } from '../../shared/types/consult-us-xhr.types';
import { MetasService } from '../../services/metas.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-self-health-assessment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ConsultTopSpecialistsComponent,
    ProductSliderComponent,
    LifeStyleHealthCardComponent,
    RouterModule
  ],
  templateUrl: './self-health-assessment.component.html',
  styleUrl: './self-health-assessment.component.scss'
})
export class SelfHealthAssessmentComponent implements OnInit {
  imageUrl = environment.imageUrl;
  productBrandTitle: string = "Self Health Assessment";
  topConsultLists: ConsultUsList;
  trendingProducts: any[];
  recentTips: Array<any>;

  surveyStart = [];
  isBrowser: boolean = false;
  screenWidth: number;
  desktopScreen: boolean;
  isExpanded: boolean = false;

  constructor(
    private productService: ProductService,
    private lifestyleTipsService: LifestyleTipsService,
    private selfHealthAssessmentService: SelfHealthAssessmentService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private meta: MetasService,
    private spinner: SpinnerService,
  ) { }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (typeof window !== undefined && isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth <= 768) {
        this.desktopScreen = false;
      } else {
        this.desktopScreen = true;
      }
    }
    this.meta.setMetaTags({
      title: 'Self Health Assessment',
      description: 'Self Health Assessment',
    })
    this.getAssessments();
    this.getTopSpecilistConsult();
    this.getFeturedProducts();
    this.getRecentTips();
  }

  getAssessments() {
    this.spinner.show()
    this.selfHealthAssessmentService.getAssessments().subscribe((res: any) => {
      this.spinner.hide()
      this.surveyStart = res.data;
    }, error => {
      this.spinner.hide()
      console.log('error = ', error);
    });
  }

  getTopSpecilistConsult() {
    this.productService.getTopSpecilistConsult({ page: 1, limit: 12 }).subscribe((res: any) => {
      this.topConsultLists = res.data;
    });
  }
  getFeturedProducts() {
    this.productService.getFeturedProducts().subscribe((res: any) => {
      let filterArr: any[] = [];
      res.data.products.map((prod: any) => {
        let productDiscount = Math.round(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
        prod.discount = productDiscount;
        filterArr.push(prod);
      });
      this.trendingProducts = filterArr;
    });
  }

  getRecentTips() {
    let payload: any = {
      page: 1,
      limit: 12,
      source: 'homepage',
      isPublished: true
    }
    this.lifestyleTipsService.getLifestyleRecentTips(payload).subscribe((res: any) => {
      this.recentTips = res.data;
    });
  }

  backToHomePage() {
    this.router.navigate([""]);
  }
  toggleSearch() {
    this.isExpanded = !this.isExpanded;
  }
}
