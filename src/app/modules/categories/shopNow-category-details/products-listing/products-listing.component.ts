import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopNowService } from '../../../shop/services/shop-now.services';
import { CategoriesService } from '../../shop-now-categories.service';
import { ProductService } from '../../../../services/product.service';
import { LifestyleTipsService } from '../../../../services/lifestyle-tips.service';
import { environment } from '../../../../../environments/environment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FiltersComponent } from '../../../../shared/components/filters/filters.component';
import { ProductComponent } from '../../../../product/product.component';
import { HealthConcernProduct } from '../../../shop/model/health-concern-product.model';
import { AffordableHealthPackagesComponent } from '../../../shop/components/Affordable-Health-Packages/affordable-health-packages.component';
import { ConsultTopSpecialistsComponent } from '../../../shop/components/consult-top-specialists/consult-top-specialists.component';
import { LifeStyleHealthCardComponent } from '../../../../shared/components/life-style-health-card/life-style-health-card.component';
import { HealthConcernFilter } from '../../../../shared/types/xhr.types';
import { EMPTY, Observable, of } from 'rxjs';
import { MetasService } from '../../../../services/metas.service';
import { CategoryPageHeadComponent } from '../../../../components/category-page-head/category-page-head.component';
import { STATIC_PAGE_CONTENT } from '../../../shop/static-page-content';
import { SpinnerService } from '../../../../services/spinner.service';

type PageType =
  | 'category'
  | 'brand'
  | 'health-concerns'
  | 'search'
  | 'brand-type'
  | 'herbs';
@Component({
  selector: 'app-products-listing',
  standalone: true,
  imports: [
    CommonModule,
    FiltersComponent,
    ProductComponent,
    AffordableHealthPackagesComponent,
    ConsultTopSpecialistsComponent,
    LifeStyleHealthCardComponent,
    CategoryPageHeadComponent,
  ],
  templateUrl: './products-listing.component.html',
  styleUrl: './products-listing.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductsListingComponent implements OnInit {
  @ViewChild('filterModal') filterModal: ElementRef;
  sortSelectedFilter: any = 'new';
  affordablePackages: any[];
  topConsultLists: any;
  relatedTips: any;
  sortIndex: number = 1;
  count: number = 0;
  radioActiveIndex = -1;
  modalfilter: any = [];
  activeIndex: any;
  sortFilter: any = [
    {
      name: 'Newest',
      value: 'new',
    },
    {
      name: 'Popularity',
      value: 'popularity',
    },
    {
      name: 'Price--Low to High',
      value: 'lowHighPrice',
    },
    {
      name: 'Price--High to Low',
      value: 'highLowPrice',
    },
  ];
  isExpanded: boolean = false;

  // price range slider
  priceRangeSlider: any;
  highValue: number = 300;
  isBrowser: boolean = false;
  value: number = 150;
  screenWidth: number;
  desktopScreen: boolean;
  totalItems = 0;
  defaultFilterUrl = {
    type: '',
    page: 1,
    limit: 12,
    categoryId: [],
    healthConcernId: [],
    brandId: [],
    minPrice: '',
    maxPrice: '',
    keyword: '',
    sort: 'new',
    source: '',
  };

  filterUrl = JSON.parse(
    JSON.stringify(this.defaultFilterUrl)
  ) as typeof this.defaultFilterUrl;

  // priceSlider: Filter;
  priceSlider: any;
  pageType: PageType;
  public slug: string;
  // public filterData: Filter[];
  public filterData: any[];
  public isFiltersLoading: boolean;

  // public pageData: CategoryDetails;
  public pageData: any = {};

  public imgUrl = environment.imageUrl;
  public loader = false;
  // public products: HealthConcernProduct[] = [];
  public products: any[] = [];
  categoryType: string;
  pageContent?: string;
  searchTerm?: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private shopNowService: ShopNowService,
    private categoriesService: CategoriesService,
    private productService: ProductService,
    private lifestyleTipsService: LifestyleTipsService,
    private renderer: Renderer2,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private metaService: MetasService,
    private spinner: SpinnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const search = params['search'];
      console.log('Search Query:', search);

      if (search) {
        this.searchTerm = search;
      }
    });
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
    console.log('[this.activatedRoute]', this.activatedRoute, this.router);
    this.activatedRoute.params.subscribe((params) => {
      this.pageContent = STATIC_PAGE_CONTENT[this.router.url.split('?')[0]];
      this.pageType = this.router.url.split('?')[0].split('/')[1] as PageType;
      this.slug = params['slug'];
      this.products = [];
      this.filterData = [];
      this.filterUrl.type = this.pageType;
      this.getFilters();
      // this.getAffordablePackages();

      //Old way api calling
      // this.getTopSpecilistConsult();
      // this.getRecentTips();

      //New way api calling
      this.getTopConsultAndRelatedArticles();
    });
    this.getProducts(true);
  }
  applyFilter() {
    this.getFilteredData(this.filterUrl);
  }

  clearApplyFilter(event: boolean) {
    //console.log(event)
    let mainFilters: any = {};
    if (this.pageType == 'brand') {
      mainFilters.brandId = this.filterUrl.brandId;
    } else if (this.pageType == 'category') {
      mainFilters.categoryId = this.filterUrl.categoryId;
    } else if (this.pageType == 'health-concerns') {
      mainFilters.healthConcernId = this.filterUrl.healthConcernId;
    } else if (this.pageType == 'search') {
      mainFilters.keyword = this.filterUrl.keyword;
    }
    this.filterUrl = {
      ...JSON.parse(JSON.stringify(this.defaultFilterUrl)),
      ...mainFilters,
      type: this.pageType,
    };
    this.onFilterChange({}, true);

    // this.ngOnInit();
  }

  getFilteredData(data: HealthConcernFilter) {
    this.shopNowService.getFilteredData(JSON.stringify(data)).subscribe(
      (res: any) => {
        this.loader = false;
        if (res?.data) {
          // this.pageData = res.data;
          this.totalItems = res.data.count;

          this.products = res.data.products.map(
            (item: any) => new HealthConcernProduct(item)
          );
          if (this.products) {
            this.closeModal();
          }
        }
      },
      (err) => {}
    );
  }

  toggleSearch() {
    this.isExpanded = !this.isExpanded;
  }

  getProducts(refresh?: boolean) {
    this.loader = true;
    let payload: any = {
      ...this.filterUrl,
      slug: this.slug,
      filter: false,
    };
    let req: Observable<any> = EMPTY;

    switch (this.pageType) {
      case 'herbs': {
        // let payload: any = {
        //   ...this.filterUrl,
        //   slug: "herbs",
        //   filter: false,
        // };
        if (
          this.searchTerm !== '' ||
          this.searchTerm !== undefined ||
          this.searchTerm !== null
        ) {
          req = this.productService.getHerbsSearchResults(this.searchTerm, {
            page: 1,
            limit: 12,
          });
        } else {
          payload.slug = 'herbs';
          req = this.categoriesService.getHerbsDetails(payload);
          this.categoryType = 'herbsDetails';
        }
        break;
      }
      case 'category': {
        req = this.categoriesService.getCategoryDetails(payload);
        this.categoryType = 'categoryDetail';
        break;
      }
      case 'brand': {
        req = this.categoriesService.getBrandDetails(payload);
        this.categoryType = 'brandDetail';
        break;
      }
      case 'health-concerns': {
        req = this.shopNowService.getHealthConcernDetails(payload);
        this.categoryType = 'healthConcerns';
        break;
      }
      case 'search': {
        req = this.productService.getSearchProducts(this.slug);
        //this.filterUrl.page = 1
        if (this.slug == 'favourite-products') {
          req = this.shopNowService.getUserFavouritesProducts();
        } else if (this.slug == 'trending-products') {
          req = this.productService.getFeturedProducts();
        } else if (this.slug == 'bestseller-products') {
          // req = this.productService.getRecommendedProducts({ page: 1, limit: 12 });
          req = this.productService.getOurBestSeller({ page: 1, limit: 12 });
        } else if (this.slug == 'season-special') {
          req = this.productService.getSeasonSpecial({ page: 1, limit: 12 });
        }
        this.categoryType = 'search';
        break;
      }
      case 'brand-type': {
        req = this.productService.getBrandTypeProducts(this.slug, {
          ...this.filterData,
          page: 1,
          limit: 12,
        });
        this.categoryType = 'brandType';
        break;
      }
      default:
        throw new Error(this.pageType + ' Page type not handled');
    }
    this.spinner.show();
    req.subscribe(
      (response: any) => {
        this.loader = false;
        this.spinner.hide();
        if (response.data || response.data1) {
          if (this.pageType == 'search') {
            this.pageData = {
              name: 'Showing results for "' + this.slug + '"',
            };

            if (this.slug == 'favourite-products') {
              this.pageData.name = 'Favourite products';
              this.products = refresh
                ? response.data?.products
                : [...this.products, ...response.data?.products];
            } else if (this.slug == 'trending-products') {
              this.pageData.name = 'Trending Products';
              this.products = refresh
                ? response.data?.products
                : [...this.products, ...response.data?.products];
              this.totalItems = response.data.count;
            } else if (this.slug == 'bestseller-products') {
              this.pageData.name = 'Our Bestseller';
              let mappedProducts =
                response.data.map(
                  (item: any) => new HealthConcernProduct(item)
                ) || [];
              this.products = refresh
                ? mappedProducts
                : [...this.products, ...mappedProducts];
              this.totalItems = response.total;
            } else if (this.slug == 'season-special') {
              this.pageData.name = 'Season Special';
              let mappedProducts =
                response.data.products.map(
                  (item: any) => new HealthConcernProduct(item)
                ) || [];
              this.products = refresh
                ? mappedProducts
                : [...this.products, ...mappedProducts];
              this.totalItems = response.data.count;
            } else {
              let mappedProducts =
                response.data1?.hits?.map(
                  (item: any) => new HealthConcernProduct(item)
                ) || [];
              this.products = refresh
                ? mappedProducts
                : [...this.products, ...mappedProducts];
              this.totalItems = response.data1?.nbHits;
              //this.handleFiltersData(response.data1?.filters || [])
            }
          } else {
            if (this.pageType == 'brand') {
              this.filterUrl.brandId = response.data._id;
            } else if (this.pageType == 'category') {
              this.filterUrl.categoryId = response.data._id;
            } else if (this.pageType == 'health-concerns') {
              this.filterUrl.healthConcernId = response.data._id;
            }
            let mappedProducts = response.data.products.map(
              (item: any) => new HealthConcernProduct(item)
            );
            this.pageData = response.data;
            this.products = refresh
              ? mappedProducts
              : [...this.products, ...mappedProducts];
            this.totalItems = response.data.count;
          }
          this.setMetaTags(response.data);
        }
      },
      (error) => {
        this.loader = false;
        this.spinner.hide();
      }
    );
  }

  getFilters() {
    this.isFiltersLoading = false;

    let req: Observable<any> = EMPTY;

    switch (this.pageType) {
      case 'herbs': {
        //req = this.categoriesService.getCategoryFilters(this.slug)
        req = this.shopNowService.getHealthConcernFilters('herbs');
        break;
      }
      case 'category': {
        //req = this.categoriesService.getCategoryFilters(this.slug)
        req = this.shopNowService.getHealthConcernFilters(this.slug);
        break;
      }
      case 'brand': {
        let params = {
          slug: this.slug,
          page: 1,
          limit: 12,
          filter: false,
        };
        //req = this.categoriesService.getBrandFilters(params)
        req = this.shopNowService.getHealthConcernFilters(this.slug);
        break;
      }
      case 'health-concerns': {
        req = this.shopNowService.getHealthConcernFilters(this.slug);
        break;
      }
      case 'search': {
        // if (this.slug == 'favourite-products') {
        //   req = this.shopNowService.getUserFavouritesProductsFilter()
        // } else if (this.slug == 'trending-products') {
        //   req = this.productService.getProductsFilter(this.productService.defaultFeaturedProductsParams)
        // } else if (this.slug == 'bestseller-products') {
        //   req = this.productService.getProductsFilter(this.productService.defaultBestSellersProductsParams)
        // } else if (this.slug == 'season-special') {
        //   req = this.productService.getProductsFilter({ seasonSpecial: true, ...this.productService.defaultBestSellersProductsParams })
        // }else{
        //   console.log("DEFAULT CASE >>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<");
        req = this.shopNowService.getHealthConcernFilters(this.slug);
        // }

        break;
      }
      case 'brand-type': {
        req = this.shopNowService.getHealthConcernFilters(this.slug);
        break;
      }
      default:
        throw new Error(this.pageType + ' Page type not handled');
    }
    this.filterData = [];
    req.subscribe(
      (response: any) => {
        this.isFiltersLoading = true;
        if (response.data) {
          this.handleFiltersData(response.data);
        }
      },
      (error) => {
        this.isFiltersLoading = true;
      }
    );
  }

  handleFiltersData(data: any[]) {
    this.isFiltersLoading = true;
    //this.filterData = data.filter(el => el.filterName != "priceRange");
    this.filterData = data;
    this.filterData.forEach((element) => {
      if (element.name === 'Price Range') {
        this.priceSlider = element;
      }
    });
  }

  changeSort(sort: any) {
    this.sortSelectedFilter = sort;
    this.filterUrl.sort = sort;
    this.filterUrl.page = 1;
    this.getProducts(true);
    this.onFilterChange({}, true);
  }

  onFilterChange(data: any, refresh?: boolean) {
    if (this.pageType == 'brand') {
      delete data.brandId;
    }
    const _data: any = {};
    Object.keys(data || {}).forEach((key) => {
      if (data[key]) {
        (this.filterUrl as any)[key] = data[key];
        _data[key] = data[key];
      }
    });

    if (this.pageType == 'search') {
      this.filterUrl.keyword = this.slug;
      this.filterUrl.source = 'mainSearch';
      if (this.slug == 'season-special') {
        // @ts-ignore
        this.filterUrl.seasonSpecial = true;
        this.filterUrl.type = '';
        this.filterUrl.keyword = '';
      } else if (this.slug == 'trending-products') {
        // (this.filterUrl as any).hbRecommended = true
        // @ts-ignore
        this.filterUrl.isFeatured = true;
        this.filterUrl.type = '';
        this.filterUrl.keyword = '';
      } else if (this.slug == 'bestseller-products') {
        // (this.filterUrl as any).hbRecommended = true
        this.filterUrl.type = '';
        this.filterUrl.keyword = '';
      }
    } else {
      this.filterUrl.keyword = '';
    }
    if (refresh) {
      _data.page = 1;
      this.filterUrl.page = 1;
    }
    this.loader = true;
    let req = this.shopNowService.getFilteredData(
      JSON.stringify({ ...this.filterUrl, ..._data })
    );
    if (this.pageType == 'search' && this.slug == 'bestseller-products') {
      req = this.productService.getOurBestSeller({
        ...this.filterUrl,
        ..._data,
      });
    }
    req.subscribe(
      (res: any) => {
        this.loader = false;
        if (res?.data) {
          console.log('TOTAL ITEMS', this.totalItems);
          // this.pageData = res.data;
          if (
            this.pageType == 'search' &&
            this.slug !== 'bestseller-products'
          ) {
            if (this.totalItems > 12) {
              this.totalItems = res.data.count + 12;
            } else {
              this.totalItems += res.data.count;
            }
          } else {
            this.totalItems = res.data.count;
          }

          let mappedProducts = (res.data.products || res.data).map(
            (item: any) => new HealthConcernProduct(item)
          );
          this.products = refresh
            ? mappedProducts
            : [...this.products, ...mappedProducts];
        }
      },
      (err) => {}
    );
  }

  // getAffordablePackages() {
  //   this.productService.getAffordablePackages().subscribe((res: any) => {
  //     let filterArr: any[] = [];
  //     res.data.map((packages: any) => {
  //       let productDiscount = Math.round(((packages.packageMRP - packages.packageSellingPrice) / packages.packageMRP * 100));
  //       packages.discount = productDiscount;
  //       filterArr.push(packages);
  //     });
  //     this.affordablePackages = filterArr;
  //   });
  // }

  getTopConsultAndRelatedArticles() {
    let payload: any = {
      isHerbRelated: false,
    };
    if (this.pageType == 'herbs') {
      payload.isHerbRelated = true;
    }
    this.productService
      .getTopConsultAndRelatedArticles(payload)
      .subscribe((res: any) => {
        this.topConsultLists = res.data.topConsultant;
        this.relatedTips = res.data.relatedBlogs;
      });
  }
  getTopSpecilistConsult() {
    this.productService
      .getTopSpecilistConsult({ page: 1, limit: 12 })
      .subscribe((res: any) => {
        this.topConsultLists = res.data;
      });
  }

  getRecentTips() {
    let payload: any = {
      page: 1,
      limit: 12,
      source: 'homepage',
      isPublished: true,
    };
    this.lifestyleTipsService
      .getLifestyleRecentTips(payload)
      .subscribe((res: any) => {
        this.relatedTips = res.data;
      });
  }

  // changeSortIndex(position: any, value: any) {
  //   this.sortIndex = position;
  //   this.filterUrl.sort = value;
  //   this.filterUrl.page = 1;
  //   this.pageData.products = [];
  //   this.count = 0;
  //   // this.getFilteredData();
  //   // this.getpageData();
  // }
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
      });
    }
  }
  closeModal() {
    this.renderer.removeClass(this.filterModal.nativeElement, 'show');
    this.renderer.setStyle(this.filterModal.nativeElement, 'display', 'none');
    this.modalfilter = [];
  }

  onSearch(input: any, item: any) {
    item.detail.forEach((el: any) => {
      el.hide = !el.name.toLowerCase().includes(input.value.toLowerCase());
    });
  }
  getProductData(item: any, inputType: any, data: any, event: any) {
    if (event.target.checked) {
      if (inputType == 'checkbox') {
        if (!(this.filterUrl as any)[item]) (this.filterUrl as any)[item] = [];
        (this.filterUrl as any)[item].push(data);
      } else if (inputType == 'radio') {
        (this.filterUrl as any)[item] = [data];
      }
    }
    if (!event.target.checked) {
      if (inputType == 'checkbox') {
        for (var i = 0; i < (this.filterUrl as any)[item].length; i++) {
          let j;
          j = (this.filterUrl as any)[item].indexOf(data);
          (this.filterUrl as any)[item].splice(j, 1);
          break;
        }
      } else if (inputType == 'radio') {
        (this.filterUrl as any)[item] = data;
      }
    }
  }

  setRadioActiveIndex(index: any) {
    this.radioActiveIndex = index;
  }

  backToHomePage() {
    this.router.navigate(['/']);
  }

  onLoadMore() {
    this.filterUrl.page++;
    this.onFilterChange({});
  }

  setMetaTags(data: any, appendSiteNameOnTitle = true) {
    var image;
    //console.log("meta index: ", data?.metaIndex);
    if (data?.metaIndex == true) this.metaService.setNoIndexTag();
    switch (this.categoryType) {
      case 'herbsDetails':
        image = (data.image || data.bannerImage || {}).savedName;
        break;
      case 'categoryDetail':
        image = (data.image || data.bannerImage || {}).savedName;
        break;
      case 'healthConcerns':
        image = (data.logo || data.bannerImage || {}).savedName;
        break;
      case 'brandDetail':
        image = (data.logo || data.bannerImage || {}).savedName;
        break;
      case 'healthPackages':
        image = data.thumbnail?.savedName;
        break;
      case 'search':
        this.metaService.setMetaTags(
          {
            title: 'Search Results for ' + this.slug + ' at HealthyBazar',
            description: '',
          },
          false
        );
        return;
    }

    this.metaService.setMetaTags(
      {
        title: data.metaTitle || data.name,
        description: data.metaDescription,
        image: image ? environment.imageUrl + image : null,
      },
      appendSiteNameOnTitle
    );
  }
}
