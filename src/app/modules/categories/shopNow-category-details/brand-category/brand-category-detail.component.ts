import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild, } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../shop-now-categories.service';
import { HttpErrorResponse } from '@angular/common/http';
import { log } from 'console';
import { FiltersComponent } from '../../../../shared/components/filters/filters.component';
import { ProductComponent } from '../../../../product/product.component';
import { HealthPackagesHomeComponent } from '../../../health-packages/components/health-package-home/health-package-home.component';
import { AffordableHealthPackagesComponent } from '../../../shop/components/Affordable-Health-Packages/affordable-health-packages.component';
import { ProductService } from '../../../../services/product.service';
import { ConsultTopSpecialistsComponent } from '../../../shop/components/consult-top-specialists/consult-top-specialists.component';
import { LifeStyleHealthCardComponent } from '../../../../shared/components/life-style-health-card/life-style-health-card.component';
import { LifestyleTipsService } from '../../../../services/lifestyle-tips.service';
import { CategoryDetails, Filter, HealthConcernFilter } from '../../../../shared/types/xhr.types';
import { ShopNowService } from '../../../shop/services/shop-now.services';
import { HealthConcernProduct } from '../../../shop/model/health-concern-product.model';
import e from 'express';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [
    CommonModule,
    FiltersComponent,
    ProductComponent,
    HealthPackagesHomeComponent,
    AffordableHealthPackagesComponent,
    ConsultTopSpecialistsComponent,
    LifeStyleHealthCardComponent],
  templateUrl: './brand-category-detail.component.html',
  styleUrl: './brand-category-detail.component.scss'
})
export class CategoryDetailComponent implements OnInit {

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
    private renderer: Renderer2
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
  filterUrl = JSON.parse(JSON.stringify(this.defaultFilterUrl));
  priceSlider: Filter;
  public healthConcern: string;
  public filterData: any;
  public isFiltersLoading: boolean;

  public healthConcernDetails: CategoryDetails;

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


    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.get('category')) {
        this.healthConcern = paramMap.get('category') || '';
        this.getFilters(this.healthConcern);
        this.getHealthConcernDetails(this.healthConcern);
      }
    });
    // this.getAffordablePackages();
    this.getTopSpecilistConsult();
    this.getRecentTips();
  }

  clearApplyFilter(event: boolean) {
    this.ngOnInit();
  }

  // get filters form selected category
  getFilters(healthConcern: string) {
    this.isFiltersLoading = false
    this.categoriesService.getBrandFilters(healthConcern).subscribe(
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
  getHealthConcernDetails(healthConcern: string) {
    this.loader = true;
    let payload: any = {
      slug: healthConcern,
      page: 1,
      limit: 12,
      filter: false,
    }
    this.categoriesService.getBrandDetails(payload).subscribe((response: any) => {
      this.loader = false;
      if (response.data) {
        this.healthConcernDetails = response.data;

        this.name = this.healthConcernDetails.name;

        this.products = response.data.products.map((item: any) => new HealthConcernProduct(item));
      }
    }, error => {
      this.loader = false;
    })
  }

  // get data depend on filter
  onFilterChange(data: HealthConcernFilter) {
    this.shopNowService
      .getFilteredData(JSON.stringify(data))
      .subscribe((res: any) => {
        this.loader = false;
        if (res?.data) {
          this.healthConcernDetails = res.data;
          this.products = res.data.products.map((item: any) => new HealthConcernProduct(item));
        }
      }, (err) => {

      });
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
    this.productService.getTopSpecilistConsult({page: 1, limit:12}).subscribe((res: any) => {
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
    });
  }

  changeSortIndex(position: any, value: any) {
    this.sortIndex = position;
    this.filterUrl.sort = value;
    this.filterUrl.page = 1;
    this.healthConcernDetails.products = [];
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
      this.sortFilter.map((filter: any) => {
        if (filterName == filter.name) {
          this.modalfilter.push(filter);
        }
      })
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
          this.healthConcernDetails = res.data;

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

}
