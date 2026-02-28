import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, UrlSegment } from '@angular/router';
import { LifestyleTipsService } from '../../../../services/lifestyle-tips.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FiltersComponent } from '../../../../shared/components/filters/filters.component';
import { environment } from '../../../../../environments/environment';
import { HealthConcernProduct } from '../../../shop/model/health-concern-product.model';
import { LifeStyleHealthCardComponent } from '../../../../shared/components/life-style-health-card/life-style-health-card.component';
import { AffordableHealthPackagesComponent } from '../../../shop/components/Affordable-Health-Packages/affordable-health-packages.component';
import { ProductService } from '../../../../services/product.service';
import { CategoryDetails, Filter, HealthConcernFilter } from '../../../../shared/types/xhr.types';
import { ShopNowService } from '../../../shop/services/shop-now.services';
import { CategoriesService } from '../../../categories/shop-now-categories.service';
import { CardComponent } from '../../../../components/card/card.component';
import { ProductSliderComponent } from '../../../../components/product-slider/product-slider.component';
import { LifestyleTipCardComponent } from '../../components/lifestyle-tip-card/lifestyle-tip-card.component';
import { EMPTY, filter, Observable } from 'rxjs';
import { CategoryPageHeadComponent } from "../../../../components/category-page-head/category-page-head.component";
import { MetasService } from '../../../../services/metas.service';


@Component({
  selector: 'app-lifestyle-categories',
  standalone: true,
  imports: [
    CommonModule,
    FiltersComponent,
    RouterModule,
    LifeStyleHealthCardComponent,
    AffordableHealthPackagesComponent,
    LifeStyleHealthCardComponent,
    CardComponent,
    ProductSliderComponent,
    LifestyleTipCardComponent,
    CategoryPageHeadComponent,
  ],
  templateUrl: './lifestyle-categories.component.html',
  styleUrl: './lifestyle-categories.component.scss'
})
export class LifestyleCategoriesComponent implements OnInit {

  redirectToLifestyleTipsDetails(titleName: any) {
    this.router.navigate(['lifestyle-tips', titleName]);
  }
  cloudImgUrl: string = environment.imageUrl;
  shopNowProducts: any;
  lifestyleConcern: string;
  blogs: any = [];
  notFound = false

  @ViewChild('filterModal') filterModal: ElementRef;

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

  isLoading: boolean
  tipsType = ''
  searchQuery = ''
  paginationConfig = {
    itemsPerPage: 12,
    currentPage: 1,
    totalItems: 0
  }
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
    private meta: MetasService,
  ) { }
  ////////////////
  modalfilter: any = [];
  activeIndex: any;
  radioActiveIndex = -1;

  // ////////////////////
  defaultFilterUrl: HealthConcernFilter & { language: string | null } = {
    page: 1,
    limit: 12,
    categoryId: [],
    healthConcernId: [],
    brandId: [],
    minPrice: "",
    maxPrice: "",
    sort: "recent",
    language: null,
    keyword: ''
  };
  filterUrl = JSON.parse(JSON.stringify(this.defaultFilterUrl));
  tempFilterName: string | null = null;
  tempFilterData: string | string[] | null = null;

  priceSlider: Filter;
  slug: string;
  sortFilters = [
    {
      name: 'Sort',
      filterName: 'sort',
      type: 'radio',
      detail: [
        { _id: 'recent', name: 'Newest' },
        { _id: 'trending', name: 'Trending' },
        { _id: 'mostRead', name: 'Most Read' },
      ],
      icon: '/assets/images/category-filter/sort.png'
    },
    {
      name: 'Language',
      filterName: 'language',
      type: 'radio',
      detail: [
        { _id: null, name: 'All' },
        { _id: 'english', name: 'English' },
        { _id: 'hindi', name: 'Hindi' },
      ],
      icon: null
    }
  ]
  filterData: any = [];
  // filterDatav2: Array<FilterComponentData> = []
  filters: any = {
    categories: '',
    title: '',
    type: ''
  };
  isFiltersLoading: boolean;

  imgUrl = environment.imageUrl;
  products: HealthConcernProduct[] = [];
  isSearchPage = false;
  name: string;
  isExpanded: boolean = false;

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
      let urlSegments = this.router.url.split('/').slice(1)
      this.isSearchPage = false;
      if (urlSegments[1] == 'search') {
        //   this.name = `Found 0 results for "${params['query']}"`;
        this.isSearchPage = true;
        this.tipsType = 'search';
        this.searchQuery = params['query'];
        this.filters.type = 'search'
        this.filters.title = params['query'];
        // this.searchTips(true);
      }
      else if (urlSegments[1] == 'category') {
        this.tipsType = 'category';
        this.searchQuery = params['slug'];
        this.filters.type = 'category';
        this.filters.title = '';
        this.filters.categories = params['slug'];
      }
      else {
        // (params['slug'])
        this.slug = params['slug'] || '';
        this.filters.categories = params['slug']
        this.filters.type = 'category'
      }
      this.getFilters();
      this.getCategoryDetails(true);
      this.getShopNowProduct();
      this.getAffordablePackages();
      this.getRecentTips();
    });

  }

  clearApplyFilter(event: boolean) {
    this.ngOnInit();
  }

  // get filters form selected category
  getFilters() {
    this.isFiltersLoading = false
    this.lifestyleTipsService.getLifestyleFilters(this.filters).subscribe(
      (response: any) => {
        this.isFiltersLoading = true;
        if (response.data) {
          this.filterData = response.data;
          // this.filterDatav2 = this.filterData.map((el: any) => {
          //   let item: FilterComponentData = {
          //     inputType: el.type,
          //     name: el.filterName,
          //     label: el.name,
          //     showSelectedValueOnLabel: el.showSelectedValueOnLabel,
          //     noValueLabel: el.noValueLabel,
          //     list: el.detail.map((el2: any) => {
          //       let listItem: FilterComponentListItem = {
          //         label: el2.name,
          //         value: el2._id,
          //       }
          //       return listItem
          //     }),
          //   }
          //   return item
          // })
          this.filterData.forEach((element: any) => {
            if (element.name === 'Price Range') {
              this.priceSlider = element;
            }
          });
        }
      },
      (error: any) => {
        this.isFiltersLoading = true
      }
    )
  }

  // get data from first time when we navigate category page

  getCategoryDetails(refresh?: boolean) {

    this.isLoading = true;
    if (refresh) {
      this.resetPageData()
    }
    let params: any = {
      ...this.filters,
      filter: false,
    }
    for (let key in this.filterUrl) {
      if (this.filterUrl[key] && (Array.isArray(this.filterUrl[key]) ? this.filterUrl[key].length : true)) {
        params[key] = this.filterUrl[key]
      }
    }
    params = {
      ...params,
      page: this.paginationConfig.currentPage,
      limit: this.paginationConfig.itemsPerPage,
    }
    let req: Observable<any> = EMPTY;
    let getTipsPayload = {
      page: this.paginationConfig.currentPage,
      limit: this.paginationConfig.itemsPerPage,
      source: 'homepage',
      isPublished: true,
    }
    switch (this.tipsType) {
      case 'search': {
        if (this.searchQuery == 'recent-tips') {
          req = this.lifestyleTipsService.getLifestyleRecentTips(getTipsPayload);
        } else if (this.searchQuery == '10-seconds-read') {
          req = this.lifestyleTipsService.getTenSecReadBlog({ page: this.paginationConfig.currentPage, limit: this.paginationConfig.itemsPerPage })
        } else if (this.searchQuery == 'related-health-tips') {
          req = this.lifestyleTipsService.getLifestyleRecentTips(getTipsPayload)
        }
        else {
          return this.searchTips(true);
          // req = this.productService.getSearchProducts(this.slug)
        }
        break;
      }
      case 'category': {
        req = this.lifestyleTipsService.getLifestyleTips(params);
        break;
      }
      default:
        throw new Error(this.tipsType + ' Page type not handled')
    }

    req.subscribe((response: any) => {

      this.isLoading = false;
      if (response.data || response.data1) {
        if (this.tipsType == 'search') {
          if (this.searchQuery == 'recent-tips') {
            this.name = "Recent Tips";
            this.blogs = refresh ? response.data : [...this.blogs, ...response.data];
            this.paginationConfig.totalItems = response.count;
          } else if (this.searchQuery == '10-seconds-read') {
            this.name = "10 Seconds Read";
            this.blogs = refresh ? response.data : [...this.blogs, ...response.data];
            this.paginationConfig.totalItems = response.count;
          } else if (this.searchQuery == 'related-health-tips') {
            this.name = "Related Health Tips";
            this.blogs = refresh ? response.data : [...this.blogs, ...response.data];
            this.paginationConfig.totalItems = response.count;
          } else {
            this.name = 'Showing results for "' + this.slug + '"';
          }
          this.meta.setMetaTags({ title: `Search results for ${this.name} at HealthyBazar` }, false)
        } else if (this.tipsType == 'category') {
          this.blogs = refresh ? response.data : [...this.blogs, ...response.data];
          this.name = response.category.name
          this.paginationConfig.totalItems = response.count;
          let { name, metaTitle, metaDescription } = response.category
          this.meta.setMetaTags({
            title: metaTitle || name,
            description: metaDescription
          })
        }
      }
    }, error => {
      this.isLoading = false;
      if (this.paginationConfig.currentPage > 1) {
        this.paginationConfig.currentPage--
      }
    });
  }

  // get data depend on filter
  onFilterChange(data: HealthConcernFilter) {
    this.resetPageData()
    this.filters = { ...this.filters, ...data }

    if (this.searchQuery == 'recent-tips' || this.searchQuery == '10-seconds-read') {
      this.searchTips()
    } else {
      this.getCategoryDetails();
    }
    // if (this.filters.type == 'search') {
    //   this.searchTips()
    // } else {
    //   this.getCategoryDetails()
    // }
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
    this.productService.getTopSpecilistConsult({ page: 1, limit: 12 }).subscribe((res: any) => {
      this.topConsultLists = res.data;
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
      this.relatedTips = res.data;
      //console.log('this.relatedTips = ', res.data);

    });
  }

  getShopNowProduct() {
    let payload: any = { source: 'homepage', isTop: true }
    this.lifestyleTipsService.getShopNowProducts(payload).subscribe((res: any) => {
      //console.log('res shop now product 372 = ', res);
      this.shopNowProducts = res.data.products;
    });
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

    this.modalfilter = []
    this.tempFilterName = filterName
    this.tempFilterData = null

    this.filterData.forEach((filter: any) => {
      if (filterName == filter.filterName) {
        this.modalfilter.push(filter);
        if (filter.inputType == 'radio') {
          let index = filter.detail.findIndex((el: any) => this.filterUrl[filterName] == el._id)
          if (index != -1) {
            this.tempFilterData = filter.detail[index]._id
          }
        } else {
          this.tempFilterData = this.filterUrl[filterName] || []
        }
      }
    })
    if (!this.modalfilter.length) {
      this.sortFilters.forEach((filter: any) => {
        if (filterName == filter.filterName) {
          this.modalfilter.push(filter);
          if (filter.inputType == 'radio') {
            let index = filter.detail.findIndex((el: any) => this.filterUrl[filterName] == (el._id))
            if (index != -1) {
              this.tempFilterData = filter.detail[index]._id
            }
          } else {
            this.tempFilterData = this.filterUrl[filterName] || []
          }
        }
      })
    }

  }

  closeModal() {
    this.renderer.removeClass(this.filterModal.nativeElement, 'show');
    this.renderer.setStyle(this.filterModal.nativeElement, 'display', 'none');
    this.modalfilter = []
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
        if (!this.tempFilterData) this.tempFilterData = [];
        if (Array.isArray(this.tempFilterData)) {
          this.tempFilterData.push(data);
        }
      } else if (inputType == "radio") {
        this.tempFilterData = data;
      }
    } else if (!event.target.checked) {
      if (inputType == "checkbox") {
        if (Array.isArray(this.tempFilterData)) {
          for (var i = 0; i < this.tempFilterData.length; i++) {
            let j;
            j = this.tempFilterData.indexOf(data);
            this.tempFilterData.splice(j, 1);
            break;
          }
        }
      }
      else if (inputType == "radio") {
        this.tempFilterData = data;
      }
    }
  }

  setRadioActiveIndex(index: any) {
    this.radioActiveIndex = index;
  }

  applyFilter() {
    this.closeModal();
    if (this.tempFilterName) {
      this.filterUrl[this.tempFilterName] = this.tempFilterData
    }
    this.getCategoryDetails(true)
  }

  clearFilter() {
    let _filter = this.filterData.find((el: any) => el.filterName = this.tempFilterName)
    if (!_filter) {
      _filter = this.sortFilters.find((el: any) => el.filterName = this.tempFilterName)
    }
    if (_filter.inputType == 'checkbox') {
      this.tempFilterData = []
    } else {
      this.tempFilterData = null
    }
    this.applyFilter()
  }


  // price change slider
  minPriceSliderFxn(value: any) {
    this.filters.minPrice = value;
  }

  maxPriceSliderFxn(value: any) {
    this.filters.maxPrice = value;
  }

  onPriceChangeEnd() {
    this.getFilters();
  }

  searchTips = (refresh?: boolean) => {

    if (refresh) {
      this.resetPageData();
    }
    this.isLoading = true;
    // this.meta.setMetaTags({ title: `Search results for ${this.breadCrumbData[1].name} at HealthyBazar` }, false)

    if (this.filters.title == 'recent-tips' || '10-seconds-read') {
      if (this.filters.title == '10-seconds-read') {
        this.filters.blogLength = '10sec';
        this.filters.title = "";
      } else {
        this.filters.title = "";
      }
    }
    this.filters.title = '';
    this.lifestyleTipsService.searchLifestyleTips({ ...this.filters, title: this.searchQuery, page: this.paginationConfig.currentPage, limit: this.paginationConfig.itemsPerPage }).subscribe((res: any) => {
      this.isLoading = false;
      this.paginationConfig.totalItems = res.count;
      this.blogs = refresh ? res.data : [...this.blogs, ...res.data];
      this.name = `Found ${res.count} results for "${this.searchQuery}"`;
    }, err => {
      if (this.paginationConfig.currentPage > 1) {
        this.paginationConfig.currentPage--
      }
      this.isLoading = false;
    })
  }

  onLoadMore = () => {
    this.paginationConfig.currentPage++;
    if (this.filters.type == 'search') {
      if (this.searchQuery == 'recent-tips') {
        this.getCategoryDetails();
      } else if (this.searchQuery == '10-seconds-read') {
        this.getCategoryDetails();
      } else {
        this.searchTips();
      }
    } else {
      this.getCategoryDetails();
    }
  }

  resetPageData() {
    this.blogs = [];
    this.notFound = false;
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.totalItems = 0
  }
}


// this.products = response.data.map((item: any) => new HealthConcernProduct(item));

// this.lifestyleTipsService.getLifestyleTips(params).subscribe((response: any) => {
//   this.isLoading = false;
//   if (response.success) {
//     this.blogs = refresh ? response.data : [...this.blogs, ...response.data];
//     this.name = response.category.name
//     this.paginationConfig.totalItems = response.count;
//     // this.products = response.data.map((item: any) => new HealthConcernProduct(item));
//   }
// }, error => {
//   this.isLoading = false;
//   if (this.paginationConfig.currentPage > 1) {
//     this.paginationConfig.currentPage--
//   }
// })