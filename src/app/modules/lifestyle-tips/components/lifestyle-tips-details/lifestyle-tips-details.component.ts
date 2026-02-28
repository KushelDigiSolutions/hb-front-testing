import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { LifestyleTipsDetailsDeskComponent } from './lifestyle-tips-details-desk/lifestyle-tips-details-desk.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LifestyleTipsService } from '../../../../services/lifestyle-tips.service';
import { ShopNowService } from '../../../shop/services/shop-now.services';
import { environment } from '../../../../../environments/environment';
import { CardComponent } from '../../../../components/card/card.component';
import { ProductSliderComponent } from '../../../../components/product-slider/product-slider.component';
import { SliderComponent, SliderComponentDataItem } from '../../../../components/slider/slider.component';
import { LifeStyleHealthCardComponent } from '../../../../shared/components/life-style-health-card/life-style-health-card.component';
import { ConsultTopSpecialistsComponent } from '../../../shop/components/consult-top-specialists/consult-top-specialists.component';
import { MetasService } from '../../../../services/metas.service';
//import { Subscription } from 'rxjs';
import { Error404Component } from "../../../../shared/components/error-404/error-404.component";
import { SpinnerService } from '../../../../services/spinner.service';
import { Subscription, switchMap, tap } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-lifestyle-tips-details',
  standalone: true,
  imports: [
    CommonModule,
    LifestyleTipsDetailsDeskComponent,
    CardComponent,
    ProductSliderComponent,
    SliderComponent,
    LifeStyleHealthCardComponent,
    ConsultTopSpecialistsComponent,
    Error404Component
  ],
  templateUrl: './lifestyle-tips-details.component.html',
  styleUrl: './lifestyle-tips-details.component.scss',
})
export class LifestyleTipsDetailsComponent implements OnInit, OnDestroy {
  showNotFound: boolean;
  subscription: Subscription;
  slug: any;
  lifestyleTipDetails: any;
  lifestyleTipDetailsRelatedBlog: any;
  tipsId: any;
  tenSecBlogs: any;
  detailsPromostionalBanner: any = [];
  recommendedProducts: any;
  screenWidth: any;
  desktopScreen: any = true;
  @ViewChild('detailsModal') detailsModal: ElementRef;
  cloudImageUrl: string = environment.imageUrl;
  topConsultLists: any;
  shopNowProducts: any;
  paragraphBeforeProductList: any;
  paragraphAfterProductList: string;
  paragraphBeforeBanner: string;
  relatedArticles: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private lifestyleTipsService: LifestyleTipsService,
    private router: Router,
    private shopnowhomepageservice: ShopNowService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private metaService: MetasService,
    private spinner: SpinnerService,
  ) { }

  ngOnInit(): void {
    if (typeof window !== undefined && isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth <= 768) {
        this.desktopScreen = false;
        // this.openModal();
      } else {
        this.desktopScreen = true;
      }
    }

    this.loadLifestyleTip();
    // this.getLifestyleBanner();
    // this.getRecommendedProducts();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  private loadLifestyleTip(): void {
    this.subscription = this.activatedRoute.params
      .pipe(
        tap(() => this.spinner.show()),
        switchMap(params => {
          this.slug = params;
          return this.lifestyleTipsService.getLifestyleDetails(this.slug.titleName);
        })
      )
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          const blog = res.data?.['blog'];

          if (!blog || !blog.status || !blog.isPublished) {
            this.showNotFound = true;
            return;
          }

          this.lifestyleTipDetails = blog;
          this.showNotFound = false;
          this.tipsId = blog._id;

          this.setMetaTags(blog);
          //this.metaService.removePreviousSchema();
          if (isPlatformServer(this.platformId)) {
            this.metaService.addBlogSchema(environment.imageUrl +
              (this.lifestyleTipDetails.featuredImage.savedName
                ? this.lifestyleTipDetails.featuredImage.savedName
                : this.lifestyleTipDetails.image.savedName), this.lifestyleTipDetails.metaDescription, this.lifestyleTipDetails.metaTitle, this.lifestyleTipDetails.author.firstName+" "+this.lifestyleTipDetails.author.lastName, this.lifestyleTipDetails.createdAt, this.lifestyleTipDetails.url);
            }
          // Load non-critical data in parallel
          this.loadTenSecReadBlogs();
          this.loadTopConsultantList();
          this.loadShopNowProducts();
          this.loadRelatedArticlesOrFallback();
          // this.loadLifestyleBanner(); // optional: lazy load banners
          // this.loadRecommendedProducts(); // optional
        },
        error: () => {
          this.spinner.hide();
          this.showNotFound = true;
        }
      });
  }

  private setMetaTags(blog: any): void {
    const imageUrl = blog.featuredImage?.savedName || blog.image?.savedName;
    this.metaService.setMetaTags({
      title: blog.metaTitle,
      description: blog.metaDescription,
      image: this.cloudImageUrl + imageUrl
    }, false);
  }

  private loadTenSecReadBlogs(): void {
    if (!this.tipsId) return;
    this.lifestyleTipsService.getLifestyleTenSecReadBlogs(this.tipsId).subscribe((res: any) => {
      this.tenSecBlogs = res.data;
    });
  }

  private loadTopConsultantList(): void {
    if (!this.tipsId) return;
    this.lifestyleTipsService.getTopConsultant(this.tipsId).subscribe((res: any) => {
      this.topConsultLists = res.data;
    });
  }

  private loadShopNowProducts(): void {
    if (!this.tipsId) return;
    this.lifestyleTipsService.getShopNowProductsBasedOnTips(this.tipsId).subscribe((res: any) => {
      this.shopNowProducts = (res.data.products || []).map((prod: any) => ({
        ...prod,
        discount: Math.floor(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP) * 100)
      }));
    });
  }

  private loadRelatedArticlesOrFallback(): void {
    if (this.lifestyleTipDetails?.websiteRelatedBlog?.length) {
      this.relatedArticles = this.lifestyleTipDetails.websiteRelatedBlog;
    } else {
      this.lifestyleTipsService.getRelatedArticlesOnLifestyleTips(this.slug.titleName).subscribe((res: any) => {
        this.relatedArticles = res.data;
      });
    }
  }






  
  getTenSecReadBlogs(tipsId: any) {
    this.lifestyleTipsService.getLifestyleTenSecReadBlogs(tipsId).subscribe((res: any) => {
      this.tenSecBlogs = res.data;
    });
  }

  getTopConsultantList(tipsId: any) {
    this.lifestyleTipsService.getTopConsultant(tipsId).subscribe((res: any) => {
      this.topConsultLists = res.data;
    });
  }

  getShopNowProducts(tipsId: any) {
    this.lifestyleTipsService.getShopNowProductsBasedOnTips(tipsId).subscribe((res: any) => {
      let filterArr: any[] = [];
      res.data.products.map((prod: any) => {
        let productDiscount = Math.floor(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
        prod.discount = productDiscount;
        filterArr.push(prod);
      });

      this.shopNowProducts = filterArr;
    });
  }

  getRelatedArticles(titleName: string) {
    this.lifestyleTipsService.getRelatedArticlesOnLifestyleTips(titleName).subscribe((res: any) => {
      this.relatedArticles = res.data;
    });
  }

  getLifestyleBanner() {
    this.lifestyleTipsService.getLifestylePromotionBanners().subscribe((res: any) => {
      this.detailsPromostionalBanner = res.data.banners.map((el: any) => {
        return {
          title: el.altText,
          img: el.image.savedName,
          url: el.link
        } as SliderComponentDataItem
      });;
    });
  }

  navigateToHomePage() {
    this.router.navigate(['lifestyle-tips']);
  }


  // getRecommendedProducts(tipsId:any) {
  // getRecommendedProducts() {

  //   // this.lifestyleTipsService.getLifestyleRecommendedProducts(this.tipsId).subscribe((res: any) => {
  //   // });


  //   this.shopnowhomepageservice.getUserFavouritesProducts().subscribe((res: any) => {
  //     let filterArr: any[] = [];
  //     res.data.prod.map((prod: any) => {
  //       let productDiscount = Math.round(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
  //       prod.discount = productDiscount;
  //       filterArr.push(prod);
  //     });
  //     this.recommendedProducts = filterArr;
  //   });
  // }


  // getNextLifestyleTips(tipsId: any) {
  //   this.lifestyleTipsService.getNextLifestyleTips(this.tipsId).subscribe((res: any) => {
  //     // this.tenSecBlogs = res.data;
  //   });
  // }


  // openModal() {
  //   // this.renderer.addClass(this.productDetailModal.nativeElement, 'show');
  //   // this.renderer.setStyle(this.productDetailModal.nativeElement, 'display', 'block');
  //   this.renderer.addClass(this.detailsModal.nativeElement, 'show');
  //   this.renderer.setStyle(this.detailsModal.nativeElement, 'display', 'block');
  // }

  // closeModal() {
  //   // this.renderer.removeClass(this.productDetailModal.nativeElement, 'show');
  //   // this.renderer.setStyle(this.productDetailModal.nativeElement, 'display', 'none');
  //   this.renderer.removeClass(this.detailsModal.nativeElement, 'show');
  //   this.renderer.setStyle(this.detailsModal.nativeElement, 'display', 'none');
  //   this.router.navigate([""])
  // }

}
