import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopNowService } from '../../../shop/services/shop-now.services';
import { CategoriesService } from '../../../categories/shop-now-categories.service';
import { ProductService } from '../../../../services/product.service';
import { LifestyleTipsService } from '../../../../services/lifestyle-tips.service';
import { CategoryDetails, Filter, HealthConcernFilter } from '../../../../shared/types/xhr.types';
import { environment } from '../../../../../environments/environment';
import { HealthConcernProduct } from '../../../shop/model/health-concern-product.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FiltersComponent } from '../../../../shared/components/filters/filters.component';
import { ConsultUsService } from '../../services/consult-us.service';
import { CardComponent } from '../../../../components/card/card.component';
import { AffordableHealthPackagesComponent } from '../../../shop/components/Affordable-Health-Packages/affordable-health-packages.component';
import { LifeStyleHealthCardComponent } from '../../../../shared/components/life-style-health-card/life-style-health-card.component';
import { CommonService } from '../../../../services/common.service';
import { CartService } from '../../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ConsultantCardComponent } from '../../components/consultant-card/consultant-card.component';
import { MetasService } from '../../../../services/metas.service';
import { ApiService } from '../../../../services/api.service';
import { CategoryPageHeadComponent } from "../../../../components/category-page-head/category-page-head.component";
import { Title } from '@angular/platform-browser';
type PageType = 'category' | 'specializations' | 'search' | 'health-concerns';

@Component({
  selector: 'app-consult-us-categories',
  standalone: true,
  imports: [CommonModule, FiltersComponent, CardComponent, AffordableHealthPackagesComponent, LifeStyleHealthCardComponent, ConsultantCardComponent, CategoryPageHeadComponent],
  templateUrl: './consult-us-categories.component.html',
  styleUrl: './consult-us-categories.component.scss'
})
export class ConsultUsCategoriesComponent implements OnInit {

  @ViewChild('filterModal') filterModal: ElementRef;

  cloudImageUrl = environment.imageUrl;
  pagination = {
    page: 1,
    limit: 12,
  }
  affordablePackages: any[];
  topConsultLists: any;
  relatedTips: any;
  sortIndex: number = 1;
  count: number = 0;
  screenWidth: number;
  desktopScreen: boolean;
  isBottomFilter: boolean;

  // price range slider
  priceRangeSlider: any;
  highValue: number = 300;
  isBrowser: boolean = false;
  value: number = 150;
  pageType: PageType = 'category';
  slug: string;
  // options: Options = {
  //   floor: 0,
  //   ceil: 600,
  // };

  constructor(
    private activatedRoute: ActivatedRoute,
    private shopNowService: ShopNowService,
    private categoriesService: CategoriesService,
    private productService: ProductService,
    private lifestyleTipsService: LifestyleTipsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private renderer: Renderer2,
    private consultusService: ConsultUsService,
    private commonService: CommonService,
    private cartService: CartService,
    private toaster: ToastrService,
    private metasService: MetasService,
    private api: ApiService,
    private titleService: Title
  ) { }
  ////////////////
  modalfilter: any = [];
  activeIndex: any;
  radioActiveIndex = -1;

  // ////////////////////
  defaultFilterUrl: HealthConcernFilter = {
    page: 1,
    limit: 12,
    categoryId: [],
    healthConcernId: [],
    brandId: [],
    minPrice: "",
    maxPrice: "",
    sort: "new",
    keyword: ''
  };
  filterUrl: any = {};
  priceSlider: Filter;
  public healthConcern: string;
  public filterData: any;
  public isFiltersLoading: boolean;

  public consultUsDetails: any[] = [];

  public imgUrl = environment.imageUrl;
  public loader = false;
  public products: HealthConcernProduct[] = [];
  public name: string;
  isExpanded: boolean = false;
  sortFilter: any = [
    {
      'name': 'Newest',
      'value': 'new'
    },
    {
      'name': 'Popularity',
      'value': 'popularity'
    },
    {
      'name': 'Price--Low to High',
      'value': 'lowHighPrice'
    },
    {
      'name': 'Price--High to Low',
      'value': 'highLowPrice'
    },
  ];

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (typeof window !== undefined && isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth <= 768) {
        this.desktopScreen = false;
        // this.getHeaderMenu();
      } else {
        this.desktopScreen = true;
      }
    }

    this.activatedRoute.params.subscribe(params => {
      this.pageType = this.router.url.split('/')[2] as PageType || 'category';

      this.slug = params['slug'];
      //Setting up dynamic title for selected pages:       
      const title = this.getTitleMap()[this.slug];
      if (title) {
        this.titleService.setTitle(title);
      }

      if (this.pageType == 'search') {
        if (this.slug == 'top-consultants') {
          this.name = 'Top Consultants'
        } else if (this.slug == 'consult-again') {
          this.name = 'Consult Again'
        } else if (this.slug == 'consult-near-me') {
          this.name = 'Consult Near Me'
        } else if (this.slug == 'top-specialists') {
          this.name = 'Top Specialists'
        } else {
          this.name = `Showing - results for "${this.slug}"`;
        }
      } else if (this.pageType == 'specializations') {
        this.name = '';
      } else if (this.pageType == 'health-concerns') {
        this.name = '';
      } else {
        this.pageType = 'category'
        this.name = '';
      }
      this.getFilters(this.slug);
      this.getConsultUsDetails(true);
    })
    this.getAffordablePackages();
    this.getTopSpecilistConsult();
    this.getRecentTips();
  }

  clearApplyFilter() {
    this.filterUrl = {}
    this.pagination.page = 1
    this.getConsultUsDetails(true)
  }

  // get filters form selected category
  getFilters(healthConcern: string) {
    this.isFiltersLoading = false
    let params: any = {}
    if (this.pageType == 'specializations') {
      params.pageType = 'specialization'
      params.specializationId = healthConcern
    } else if (this.pageType == 'category') {
      params.pageType = 'category'
      params.categoryId = healthConcern
    } else if (this.pageType == 'health-concerns') {
      params.pageType = 'concern'
      params.healthConcernId = healthConcern
    } else if (this.pageType == 'search') {
      params.pageType = 'search'
      params.userIdentifier = healthConcern
    }
    this.consultusService.getConsultCategoryFilters(params).subscribe(
      (response: any) => {
        this.isFiltersLoading = true;
        if (response.data) {
          this.filterData = response.data;
          this.filterData.forEach((element: any) => {
            if (element.name === 'Price Range') {
              this.priceSlider = element;
            }
          });
        }
      },
      error => {
        this.isFiltersLoading = true
      }
    )
  }

  // get data from first time when we navigate category page
  getConsultUsDetails(refresh?: boolean) {
    this.loader = true;
    let payload: any = {
      slug: this.slug,
      pageType: this.pageType,
      ...this.filterUrl,
      ...this.pagination,
      pincodeId: ''
    }
    if (this.pageType == 'category') {
      payload.categoryId = this.slug
    } else if (this.pageType == 'specializations') {
      payload.specializationId = this.slug
    }

    let req = this.consultusService.getConsultCategoryDetails(payload)

    if (this.pageType == 'search') {
      delete payload.slug
      payload.query = this.slug
      if (this.slug == 'top-consultants') {
        req = this.productService.getTopSpecilistConsult(this.pagination);
      } else if (this.slug == 'consult-again') {
        req = this.consultusService.getConsultAgainList(payload);
      } else if (this.slug == 'consult-near-me') {
        let location: any;
        let userLoggedIn = this.commonService.getUser();
        if (userLoggedIn) {
          let temp: any = localStorage.getItem('userLocation');
          location = JSON.parse(temp);
          payload.pincodeId = location.city._id
        } else {
          let temp: any = localStorage.getItem('guestUserLocation');
          location = JSON.parse(temp);
          payload.pincodeId = location.city._id
        }
        req = this.consultusService.getConsultantsNearMe(payload);
      } else if (this.slug == 'top-specialists') {
        delete payload.query
        delete payload.pageType
        req = this.productService.getTopSpecilistConsult(payload)
      } else {
        req = this.consultusService.searchConsultants(payload);
      }
    } else if (this.pageType == 'health-concerns') {
      req = this.consultusService.getConsultByHealthConcern(payload);
    } else if (this.pageType == 'specializations') {
      req = this.consultusService.getConsultBySpecialization(payload);
    }

    req.subscribe((response: any) => {
      this.loader = false;
      if (response.data) {
        this.count = response.count
        let transformedData = []
        if (this.pageType == 'search') {
          if (this.slug == 'top-consultants') {
            this.name = 'Top Consultants'
            transformedData = response.data
          } else if (this.slug == 'consult-again') {
            this.name = 'Consult Again'
            transformedData = response.data
          } else if (this.slug == 'consult-near-me') {
            this.name = 'Consult Near Me'
            transformedData = response.data
          } else if (this.slug == 'top-specialists') {
            this.name = 'Top Specialists'
            transformedData = response.data
          } else {
            this.name = `Showing ${this.count} results for "${this.slug}"`
            transformedData = response.data.map((el: any) => this.consultusService.ConsultantDataTransform(el));
          }
        } else {
          let _metaName = (response.pageMeta?.[0] || response.pageMeta)?.name
          if (_metaName) {
            this.name = _metaName
          }
          transformedData = response.data.map((el: any) => this.consultusService.ConsultantDataTransform(el))
        }

        this.consultUsDetails = refresh ? transformedData : [...this.consultUsDetails, ...transformedData];

        // this.api.get('users', data).subscribe((res: any) => {
        //   let { success, data, count, pageMeta } = res || {}
        //   this.loader = false;
        //   if (success && data) {
        //     this.pageTitle = `Showing ${count} results for " ${this.query} "`
        //     let metaData: SeoMetaTags = {
        //       title: "Search Results for " + this.query + " at HealthyBazar",
        //       ogTitle: '',
        //       ogDescription: '',
        //       image: null
        //     }

        //     if (this.pageType == 'all-consultant') {
        //       this.pageTitle = 'Consultants';
        //       metaData.title = 'Consultants';
        //     } else if (this.pageType != 'search') {
        //       if (pageMeta) {
        //         pageMeta = pageMeta instanceof Array ? pageMeta[0] : pageMeta;
        //         let { name, metaTitle, metaDescription, logo } = pageMeta;

        //         metaData = {
        //           title: metaTitle || name + ' Consultants',
        //           description: metaDescription,
        //           image: logo && logo.savedName ? environment.imageUrl + logo.savedName : null,
        //         }
        //         this.pageTitle = name;
        //       } else {
        //         this.pageTitle = this.query;
        //         metaData.title = this.query
        //       }
        //     }

        //     this.metasService.setMetaTags(metaData, this.pageType != 'search');

        //     this.count = count;
        //     if (this.nextLoading) {
        //       this.consultants = [...this.consultants, ...data];
        //       this.nextLoading = false;
        //     } else {
        //       this.consultants = data
        //     }
        //   }

        // }, (err: HttpErrorResponse) => {
        //   this.loader = false;
        //   this.nextLoading = false;
        //   if (err.status == 404) {
        //     this.notFound = true;
        //   } else {
        //     this.toaster.error(err.error.message, "Error");
        //   }
        // })
      }
    }, error => {
      this.loader = false;
    })
  }


  // get data depend on filter
  onFilterChange(data: HealthConcernFilter) {
    this.pagination.page = 1
    this.filterUrl = data
    this.getConsultUsDetails(true)
    window.scroll({ top: 0, left: 0, behavior: "smooth", })
  }

  getAffordablePackages() {
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

  getTopSpecilistConsult() {
    return this.productService.getTopSpecilistConsult({ page: 1, limit: 12 })
  }

  getRecentTips() {
    let payload: any = {
      page: 1,
      limit: 12,
      source: 'homepage',
      isPublished: true
    }
    this.lifestyleTipsService.getLifestyleRecentTips(payload).subscribe((res: any) => {
      this.relatedTips = res.data;
    });
  }

  changeSortIndex(position: any, value: any) {
    this.sortIndex = position;
    this.filterUrl.sort = value;
    this.filterUrl.page = 1;
    // this.consultUsDetails.products = [];
    this.count = 0;
    // this.getFilteredData();
    // this.getHealthConcernDetails();
  }

  backToHomePage() {
    this.router.navigate([""]);
  }

  toggleSearch() {
    this.isExpanded = !this.isExpanded;
  }
  /////////////////mobile filter modal
  openModal(filterName: string) {

    this.renderer.addClass(this.filterModal.nativeElement, 'show');
    this.renderer.setStyle(this.filterModal.nativeElement, 'display', 'block');

    if (filterName == 'Sort') {
      // this.sortFilter.map((filter: any) => {

      // })
    } else {
      this.filterData.map((filter: any) => {
        if (filterName == filter.name) {
          this.modalfilter.push(filter);
        }
      })
    }

  }

  closeModal() {
    this.renderer.removeClass(this.filterModal.nativeElement, 'show');
    this.renderer.setStyle(this.filterModal.nativeElement, 'display', 'none');
    this.modalfilter = []
  }

  onSortFilter() {

  }

  // toggleFilterType(index: any) {
  //   this.filterUrl[index].showSubCat = !this.filterUrl[index].showSubCat;
  // }

  onSearch(input: any, item: any) {
    item.detail.forEach((el: any) => {
      el.hide = !el.name.toLowerCase().includes(input.value.toLowerCase());
    })
  }

  getProductData(item: any, inputType: any, data: any, event: any) {
    if (event.target.checked) {
      if (inputType == "checkbox") {
        if (!this.filterUrl[item]) this.filterUrl[item] = [];
        this.filterUrl[item].push(data);
      } else if (inputType == "radio") {
        this.filterUrl[item] = [data];
      }
    }
    if (!event.target.checked) {
      if (inputType == "checkbox") {
        for (var i = 0; i < this.filterUrl[item].length; i++) {
          let j;
          j = this.filterUrl[item].indexOf(data);
          this.filterUrl[item].splice(j, 1);
          break;
        }
      }
      else if (inputType == "radio") {
        this.filterUrl[item] = data;
      }
    }
  }

  setRadioActiveIndex(index: any) {
    this.radioActiveIndex = index;
  }

  applyFilter() {
    this.getFilteredData(this.filterUrl);
  }


  getFilteredData(data: HealthConcernFilter) {
    this.shopNowService
      .getFilteredData(JSON.stringify(data))
      .subscribe((res: any) => {
        this.loader = false;
        if (res?.data) {
          this.consultUsDetails = res.data;

          this.products = res.data.products.map((item: any) => new HealthConcernProduct(item));
          if (this.products) {
            this.closeModal();
          }
        }
      }, (err) => {
      });
  }

  // price change slider
  minPriceSliderFxn(value: any) {
    this.filterData.minPrice = value;
  }

  maxPriceSliderFxn(value: any) {
    this.filterData.maxPrice = value;
  }

  onPriceChangeEnd() {
    this.getFilters(this.filterData);
  }

  redirectToConsultUsDetailsPage(slug: string) {
    this.router.navigate(['/consult-us/doctor', slug]);
  }

  addToCheckout(id: string) {

    let body = {
      'consultantId': id
    }
    let user = this.commonService.getUser();
    if (user) {
      this.cartService.addToConsultCheckout(body).subscribe((res: any) => {
        localStorage.setItem('guestCheckoutCartId', res.data.cart._id);
        this.toaster.success('Consultant added in Cart');
        this.cartService.setCartState('consult');
        this.cartService.openDirectCart(true);
      }, error => {
        this.toaster.error('Book only one consultation at a time');
      });
    } else {
      this.cartService.addToConsultCartForGuest(body).subscribe((res: any) => {
        localStorage.setItem('guestCheckoutCartId', res.data.cart._id);
        this.toaster.success('Consultant added in Cart');
        this.cartService.setCartState('consult');
        this.cartService.openDirectCart(true);
      }, error => {
        this.toaster.error('Book only one consultation at a time');
      });
    }

  }

  onLoadMore() {
    this.pagination.page++
    this.getConsultUsDetails()
  }

  setMetaTags(data: any, appendSiteNameOnTitle = true) {
    this.metasService.setMetaTags({
      title: data.metaTitle || data.name,
      description: data.metaDescription,
      image: data.bannerImage?.savedName ? environment.imageUrl + data.bannerImage?.savedName : null
    }, appendSiteNameOnTitle);
  }

  getTitleMap(): { [key: string]: string } {
    return {
      'mental-health': 'Online Mental Health Consultation',
      'physiotherapy': 'Online Physiotherapy Consultation',
      'skin': 'Online Skin Consultation',
      'accupressure': 'Online Accupressure Consultation',
      'ayurvedic': 'Online Ayurvedic Consultation',
      'chest-and-lungs': 'Online Chest And Lungs Consultation',
      'children': 'Online Children Consultation',
      'cupping-therapy-hijama': 'Online Cupping Therapy Hijama Consultation',
      'dermatology-skin-hair': 'Online Dermatology Skin Hair Consultation',
      'diet-and-nutrition': 'Online Diet And Nutrition Consultation',
      'diet-nutrition': 'Online Diet Nutrition Consultation',
      'dr-asfiya-najmi-a81940': 'Online Dr Asfiya Najmi Consultation',
      'gastroenterology-stomach-intestines': 'Online Gastroenterology Consultation',
      'gynaecology': 'Online Gynaecology Consultation',
      'hair': 'Online Hair Consultation',
      'homeopathy': 'Online Homeopathy Consultation',
      'indian-culture-spirituality': 'Online Indian Culture & Spirituality Consultation',
      'kshar-sutra-treatment-for-piles-fistula-etc': 'Online Kshar Sutra Treatment Consultation',
      'lifestyle-diseases': 'Online Lifestyle Diseases Consultation',
      'marma-chikitsa': 'Online Marma Chikitsa Consultation',
      'medicine': 'Online Medicine Consultation',
      'naturopathy': 'Online Naturopathy Consultation',
      'neurology': 'Online Neurology Consultation',
      'opthalmology': 'Online Opthalmology Consultation',
      'osteology-bones': 'Online Osteology Bones Consultation',
      'paediatrician': 'Online Paediatrician Consultation',
      'panchkarma': 'Online Panchkarma Consultation',
      'psychiatry': 'Online Psychiatry Consultation',
      'rejuvination': 'Online Rejuvination Consultation',
      'respiratory-disorder': 'Online Respiratory Disorder Consultation',
      'sexologist': 'Online Sexologist Consultation',
      'sexual-wellness': 'Online Sexual Wellness Consultation',
      'siddha': 'Online Siddha Consultation',
      'stomach': 'Online Stomach Consultation',
      'toxicology': 'Online Toxicology Consultation',
      'unani': 'Online Unani Consultation',
      'urology': 'Online Urology Consultation',
      'yoga-pranayama': 'Online Yoga Pranayama Consultation',
      'yogacharya': 'Online Yogacharya Consultation',
    };
  }

}
