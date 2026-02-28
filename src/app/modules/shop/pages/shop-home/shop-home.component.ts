import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, PLATFORM_ID, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { ProductComponent } from '../../../../product/product.component';
import { ProductDetails, TopSellingCategories } from '../../../../shared/types/xhr.types';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProductService } from '../../../../services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { ShopNowService } from '../../services/shop-now.services';
import Swiper from 'swiper';
import { BannerComponent } from '../../../../components/banner/banner.component';
import { CouponCardComponent } from '../../../../components/coupon-code/coupon-code.component';
import { ShopCategoryComponent, ShopCategoryComponentItem } from '../../../../components/shop-category/shop-category.component';
// import { AffordableHealthPackagesComponent } from '../../components/Affordable-Health-Packages/affordable-health-packages.component';
import { AppCategoriesComponent } from '../../components/app-categories/app-categories.component';
import { TopBrandsComponent } from '../../components/top-brands/top-brands.component';
import { ConsultTopSpecialistsComponent } from '../../components/consult-top-specialists/consult-top-specialists.component';
import { SliderComponent, SliderComponentDataItem } from '../../../../components/slider/slider.component';
import { SwiperContainer, register } from 'swiper/element/bundle';
import { ProductSliderComponent } from '../../../../components/product-slider/product-slider.component';
import { ShopHealthConcernComponent } from '../../components/shop-health-concern/shop-health-concern.component';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { CommonService } from '../../../../services/common.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { HealthConcernProduct } from '../../model/health-concern-product.model';
import { MetasService } from '../../../../services/metas.service';
import { SwiperComponent } from '../../../../components/swiper/swiper.component';
import { flaternHealthConcernsChildrens } from '../../../../util/data-transform';
import { SpinnerService } from '../../../../services/spinner.service';
import {CarouselComponent} from '../../../../components/carousel/carousel.component';
register();

@Component({
  selector: 'app-shop-home',
  standalone: true,
  imports: [
    CommonModule,
    ProductComponent,
    HttpClientModule,
    BannerComponent,
    CouponCardComponent,
    ShopCategoryComponent,
    AppCategoriesComponent,
    TopBrandsComponent,
    ConsultTopSpecialistsComponent,
    SliderComponent,
    ProductSliderComponent,
    ShopHealthConcernComponent,
    FooterComponent,
    NgxSkeletonLoaderModule,
    SwiperComponent,
    CarouselComponent
  ],
  templateUrl: './shop-home.component.html',
  styleUrls: ['./shop-home.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ShopHomeComponent implements OnInit {
  @ViewChild('swiper') swiper: ElementRef<SwiperContainer>;
  disabledNext = true;
  disabledPrev = true;
  isLoggedin = false;
  userId: string = '';
  favOrderTitle: string = "Raj’s favourites, order again";
  appCategoriesList: any[] = [];
  productsList: Array<any> = [];
  productsList1: Array<any> = [];
  medicalPackageList: Array<any> = [];
  couponCodes: Array<any> = [];
  affordablePackages: Array<any> = [];
  healthConcernList: Array<any> = [];
  footerImage: Array<any> = [];
  topConsultLists: Array<any> = [];
  trendingProducts: any[] = []
  sexualWellnessProducts: any[] = []
  userFavouritesProducts: Array<any> = [];
  normalCardBanners: Array<any> = [];
  ourBestsellerProducts: Array<any> = [];

  shopByCategoryListsItem: Array<ShopCategoryComponentItem> = [];
  shopByHealthConcern: Array<any> = [];
  topBrands: Array<any> = [];
  headerMenu: Array<any> = [];
  cloudImageUrl: string = environment.imageUrl;
  email: string = "support@healthybazar.com"
  categoryData: any;
  screenSize: any;
  mobileSize: any;
  desktopSize: any;
  isLoadingSec1: boolean = true;
  isLoadingSec2: boolean = true;
  recommendedProducts: any[] = []
  seasonSpecialProducts: any[] = []
  topSellingCategories: TopSellingCategories = []


  swiperBreakpints: any = {
    // when window width is >= 320px
    320: {
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
    1024: {
      slidesPerView: 6.5,
      spaceBetween: 5
    },
    1200: {
      slidesPerView: 7.5,
      spaceBetween: 5
    }
  }
  // @ViewChild('category.categoryBackImg ') categoryBackImg: string = '';
  // slideCount = 4
  userName: string | null | any;
  temp: string;

  constructor(
    private productService: ProductService,
    private shopnowhomepageservice: ShopNowService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private metaService: MetasService,
    private spinnerService: SpinnerService,
  ) { }

  ngOnInit(): void {
    this.spinnerService.show()
    this.getMetaDetail();
    //this.metaService.removePreviousSchema();
    this.metaService.setHomeAndAboutUsSchema();
    this.commonService.getLoginState().subscribe((state) => {
      this.isLoggedin = state;
      this.userFavouritesProducts = []

    });

    let userData = this.commonService.getUser();
    this.isLoggedin = !!userData?.user;
    this.userName = userData ? userData.user.firstName : "";
    this.userId = userData ? userData.user._id : "";
    let temp: any
    this.getScreenSize();

    this.loadHomePageData();


    //this.getHealthConcern();

    this.getFooterImage();

  }


  loadHomePageData(): void {
    this.isLoadingSec1 = true
    this.productService.getHomePageData(this.isLoggedin, this.userId ).subscribe((res: any) => {
      this.isLoadingSec1 = false
      this.hideSpinner()
      if (res.success && res.data) {
        // if (this.isLoggedin) {
        //   const { firstName } = this.commonService.getUser().user
        //   // this.userName = firstName + ' favourites, order again';
        //   this.temp = (firstName ? firstName + "'s" : 'Your') + ' favourites, order again';
        //   let filterArr: any[] = [];
        //   res.data.userFavouriteProducts.map((prod: any) => {
        //     let productDiscount = Math.floor(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
        //     prod.discount = productDiscount;
        //     filterArr.push(prod);
        //   });
        //   this.userFavouritesProducts = filterArr;

        // } else {
        this.trendingProducts = res.data.trending || [];
        //}
        this.sexualWellnessProducts = res.data.sexualWellness || [];
        this.seasonSpecialProducts = res.data.seasonSpecial || [];
        this.topSellingCategories = res.data.topSellingCategories || [];
        this.topConsultLists = res.data.topConsultant || [];
        this.topBrands = res.data.topBrands || [];
        this.shopByHealthConcern = res.data.healthConcerns || [];
        this.shopByCategoryListsItem = res.data.topCategories.map((el: any) => {
          let item: ShopCategoryComponentItem = {
            img: el.imageURL,
            label: el.categoryName,
            url: el.url
          }
          return item
        });
        this.normalCardBanners = res.data.promotionalBanner.map((el: any) => {
          return {
            title: el.altText,
            img: el.image.savedName,
            url: el.link,
            couponCode: el.couponCode
          } as SliderComponentDataItem
        });
      }
    },
      err => {
        console.error('Error fetching home page data:', err);
      });
  }

  ngAfterViewInit(): void {
    if (this.swiper?.nativeElement.swiper) {
      const { isBeginning, isEnd } = this.swiper?.nativeElement.swiper
      this.disabledPrev = isBeginning
      this.disabledNext = isEnd
    }
  }

  //////////////////////////////////////

  getMetaDetail() {
    this.shopnowhomepageservice.getMetaDetail().subscribe((res: any) => {

      if (res.data) {
        this.metaService.setMetaTags({
          title: res.data.metaTitle,
          description: res.data.metaDescription,
          keywords: res.data.metaTags.join()
        });
      }
    }, err => { });
  }

  public getUserFavouritesProducts() {
    this.isLoadingSec1 = true
    this.shopnowhomepageservice.getUserFavouritesProducts(this.isLoggedin).subscribe((res: any) => {
      console.log("INSIDE FAV 1::: ");
      this.isLoadingSec1 = false
      this.hideSpinner()

      let filterArr: any[] = [];
      res.data.products.map((prod: any) => {
        let productDiscount = Math.floor(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
        prod.discount = productDiscount;
        filterArr.push(prod);
      });
      this.userFavouritesProducts = filterArr;

      console.log("FAV PRODUCTS::: ", this.userFavouritesProducts);

      // if (this.userFavouritesProducts.length == 0) {
      //   this.temp = 'Treding Products';
      //   this.getFeturedProducts();
      // }
    },err=>{
      this.isLoadingSec1 = false
      this.hideSpinner()
    });
  }

  getFeturedProducts() {
    this.productService.getFeturedProducts().subscribe((res: any) => {
      this.isLoadingSec1 = false
      this.hideSpinner()
      let filterArr: any[] = [];
      res.data.products.map((prod: any) => {
        let productDiscount = Math.floor(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
        prod.discount = productDiscount;
        filterArr.push(prod);
      });
      this.trendingProducts = filterArr;

    },err=>{
      this.isLoadingSec1 = false
      this.hideSpinner()
    });
  }

  getSexualWellnessProducts() {
    this.productService.getSexualWellnessProducts().subscribe((res: any) => {
      this.isLoadingSec1 = false
      this.hideSpinner()
      let filterArr: any[] = [];
      res.data.products.map((prod: any) => {
        let productDiscount = Math.floor(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
        prod.discount = productDiscount;
        filterArr.push(prod);
      });
      this.sexualWellnessProducts = filterArr;
      //console.log("SEXUAL WELL DATA::: " ,this.sexualWellnessProducts);
    },err=>{
      this.isLoadingSec1 = false
      this.hideSpinner()
    });
  }


  toggleBannersLoading(event: boolean) {
    this.isLoadingSec2 = event;
    this.hideSpinner()
}

hideSpinner(){
  if(!this.isLoadingSec1 && !this.isLoadingSec2){
    this.spinnerService.hide()
  }
}

  getCategoryBanner() {
    let payload = {
      'cardType': 'normal',
      'active': true,
      'type': "shop-now",
    }

    this.commonService.getPromotionBanners(payload).subscribe((res: any) => {

      this.normalCardBanners = res.data.banners.map((el: any) => {
        return {
          title: el.altText,
          img: el.image.savedName,
          url: el.link,
          couponCode: el.couponCode
        } as SliderComponentDataItem
      });
    });
  }


  getOfferCoupon() {
    let payload = {
      'cardType': 'coupon',
      'active': true,
      'type': "shop-now",
    }

    this.commonService.getPromotionBanners(payload).subscribe((res: any) => {
      this.couponCodes = res.data.banners.map((el: any) => {
        return {
          title: el.altText,
          img: el.image.savedName,
          url: el.link,
          couponCode: el.couponCode,
        } as SliderComponentDataItem
      });

    });

  }


  // getOurBestSellerProducts() {

  //   this.productService.getOurBestSeller().subscribe((res: any) => {
  //     let filterArr: any[] = [];
  //     res.data?.map((prod: any) => {
  //       let productDiscount = Math.floor(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
  //       prod.discount = productDiscount;
  //       filterArr.push(prod);
  //     });
  //     this.ourBestsellerProducts = filterArr;
  //     //console.warn('ourBestsellerProducts',this.ourBestsellerProducts)
  //   }, err => {

  //   });
  // }

  getRecommendedProducts() {
    this.productService.getRecommendedProducts({ page: 1, limit: 12 }).subscribe((res: any) => {
      if (res.success && res.data.products) {
        this.recommendedProducts = res.data.products.map((product: any) => new HealthConcernProduct(product))

      }
    })
  }

  getSeasonSpecial() {
    this.productService.getSeasonSpecial({ page: 1, limit: 12 }).subscribe((res: any) => {
      if (res.success && res.data.products) {
        this.seasonSpecialProducts = res.data.products.map((product: any) => new HealthConcernProduct(product))

      }
    })
  }

  getShopByCategoryLists() {
    this.productService.getShopByCategory().subscribe((res: any) => {
      this.shopByCategoryListsItem = res.data.categories.map((el: any) => {
        let item: ShopCategoryComponentItem = {
          img: el.imageURL,
          label: el.categoryName,
          url: el.url
        }
        return item
      });
    });
  }

  getAffordablePackages() {
    this.productService.getAffordablePackages().subscribe((res: any) => {
      let filterArr: any[] = [];
      res.data.map((packages: any) => {
        let productDiscount = Math.floor(((packages.packageMRP - packages.packageSellingPrice) / packages.packageMRP * 100));
        packages.discount = productDiscount;
        filterArr.push(packages);
      });
      this.affordablePackages = filterArr;
    });
  }

  getMedicalPackageBanner() {
    this.productService.getMedicalHealthPacakgeBanner().subscribe((res: any) => {
      this.medicalPackageList = res.banners;

    });
  }

  getTopSellingCategories() {
    this.productService.getTopSellingCategories({ page: 1, limit: 16 }).subscribe((res: any) => {
      this.topSellingCategories = res.data.categories
      console.log("Selling categories: ", this.topSellingCategories);
    });
  }

getCategoryUrl(category: any): string {
  return category.url === 'sexual-wellness' ? '/category/sexual-wellness' : category.url;
}

  /////////////////////////////////////////////////////
  getShopNowData() {
    // this.productService.getProductList().subscribe((res: any) => {
    //   this.productsList = res.data;
    // });
  }


  getAppCategoriesList() {
    this.productService.getAppCategories().subscribe((res: any) => {
      this.appCategoriesList = res;
    });
  }

  getHealthConcern() {
    this.productService.getHealthConcern().subscribe((res: any) => {
      this.healthConcernList = res
    });
  }

  getShopByHealthConcern() {
    this.productService.getShopByHealthConcern().subscribe((res: any) => {

      this.shopByHealthConcern = flaternHealthConcernsChildrens(res.data.healthConcerns).filter((el: any) => el.visibleAtHome);
    });
  }

  getTopBrands() {
    this.productService.getTopBrands().subscribe((res: any) => {
      this.topBrands = res.data.brands;
    });
  }

  getFooterImage() {
    this.productService.getFooterImages().subscribe((res: any) => {
      this.footerImage = res
    });
  }

  getTopSpecilistConsult() {
    this.productService.getTopSpecilistConsult({ page: 1, limit: 12 }).subscribe((res: any) => {
      this.topConsultLists = res.data;
    });
  }

  getScreenSize() {
    if (typeof window !== undefined && isPlatformBrowser(this.platformId)) {
      this.screenSize = window.innerWidth;
      if (this.screenSize <= 768) {
        this.mobileSize = true;
      } else {
        this.desktopSize = true;
      }
    }
  }

  onInit(event: any) {
    setTimeout(() => {
      if (this.swiper?.nativeElement?.swiper) {
        const { isBeginning, isEnd } = this.swiper?.nativeElement.swiper
        this.disabledPrev = isBeginning
        this.disabledNext = isEnd
      }
    }, 500)

  }

  onChange(event: any) {
    const swiper = event.target.swiper
    const { isBeginning, isEnd } = swiper
    this.disabledPrev = isBeginning
    this.disabledNext = isEnd
  }

  onNext() {
    this.swiper.nativeElement.swiper.slideNext()
  }
  onPrev() {
    this.swiper.nativeElement.swiper.slidePrev()
  }
}