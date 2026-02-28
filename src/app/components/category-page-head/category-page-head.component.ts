import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { HealthConcernFilter } from '../../shared/types/xhr.types';
import { FormsModule } from '@angular/forms';

type ModuleType = 'shop' | 'lifestyle' | 'consult';

const SORT_FILTERS = [
  {
    moduleType: ['shop'],
    name: 'Sort',
    filterName: 'sort',
    type: 'radio',
    detail: [
      { _id: 'recent', name: 'Newest' },
      { _id: 'popularity', name: 'Popularity' },
      { _id: 'lowHighPrice', name: 'Price - Low to High' },
      { _id: 'highLowPrice', name: 'Price - High to Low' },
    ],
    icon: '/assets/images/category-filter/sort.png',
  },
  {
    moduleType: ['lifestyle'],
    name: 'Sort',
    filterName: 'sort',
    type: 'radio',
    detail: [
      { _id: 'new', name: 'Newest' },
      { _id: 'trending', name: 'Trending' },
      { _id: 'mostRead', name: 'Most Read' },
    ],
    icon: '/assets/images/category-filter/sort.png',
  },
  {
    moduleType: ['lifestyle'],
    name: 'Language',
    filterName: 'language',
    type: 'radio',
    detail: [
      { _id: null, name: 'All' },
      { _id: 'english', name: 'English' },
      { _id: 'hindi', name: 'Hindi' },
    ],
    icon: null,
  },
];

const filters = [
  {
    name: 'Brand',
    options: [
      { label: 'Hamdard', value: 'hamdard', selected: false },
      { label: 'Rex', value: 'rex', selected: false },
      { label: 'Sadar', value: 'sadar', selected: false },
    ],
  },
  {
    name: 'Price',
    options: [
      { label: 'Under ₹500', value: 'under-500', selected: false },
      { label: '₹500 - ₹1000', value: '500-1000', selected: false },
      { label: 'Above ₹1000', value: 'above-1000', selected: false },
    ],
  },
  {
    name: 'Health Concern',
    options: [
      { label: 'Diabetes', value: 'diabetes', selected: false },
      { label: 'Heart', value: 'heart', selected: false },
    ],
  },
];

@Component({
  selector: 'app-category-page-head',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-page-head.component.html',
  styleUrl: './category-page-head.component.scss',
})
export class CategoryPageHeadComponent implements OnChanges, OnInit {
  @Input() moduleType: ModuleType = 'shop';
  @Input() name: string;
  @Input() list: any[] = [];
  @Input() value: { [key: string]: any } = {};

  @Output() changefilters = new EventEmitter();
  @Output() clearFilters = new EventEmitter<void>();

  @ViewChild('filterModal') filterModal: ElementRef;
  @ViewChild('sampleModal') sampleModal: ElementRef;

  desktopScreen: boolean;
  screenWidth: number;
  isExpanded: boolean = false;
  modalfilter: any = [];
  activeIndex: any;
  radioActiveIndex = -1;
  activeFilterIndex = 0;
  filters = filters;
  searchTerm: string = '';
  initialFilterUrl: any = {};
  herbsSearchTerm: string = '';

  sortFilters: typeof SORT_FILTERS = [];

  defaultFilterUrl: HealthConcernFilter & { language: string | null } = {
    page: 1,
    limit: 12,
    categoryId: [],
    healthConcernId: [],
    brandId: [],
    minPrice: '',
    maxPrice: '',
    sort: 'recent',
    language: null,
    keyword: '',
  };
  // price range slider
  priceRangeSlider: any;
  highValue: number = 300;

  filterUrl = JSON.parse(JSON.stringify(this.defaultFilterUrl));
  tempFilterName: string | null = null;
  tempFilterData: string | string[] | null = null;
  filterData: any = [];

  get activeFilter() {
    return this.list[this.activeFilterIndex];
  }

  setActiveFilter(i: number) {
    if (this.searchTerm != '') {
      this.searchTerm = '';
    }
    this.activeFilterIndex = i;
  }

  toggleOption(option: any) {
    const filterName = this.activeFilter.filterName;
    const value = option._id || option.value;

    if (this.activeFilter.type === 'radio') {
      this.activeFilter.detail.forEach((opt: any) => (opt.selected = false));

      option.selected = true;

      if (this.activeFilter.filterName !== 'priceRange') {
        this.filterUrl[filterName] = value;
      } else {
        if (option.maxPrice !== '') {
          this.filterUrl['maxPrice'] = option.maxPrice;
          this.filterUrl['minPrice'] = option.minPrice;
        } else {
          this.filterUrl['minPrice'] = option.minPrice;
        }
      }
    } else {
      option.selected = !option.selected;
      if (!Array.isArray(this.filterUrl[filterName])) {
        this.filterUrl[filterName] = [];
      }
      if (option.selected) {
        if (!this.filterUrl[filterName].includes(value)) {
          this.filterUrl[filterName].push(value);
        }
      } else {
        this.filterUrl[filterName] = this.filterUrl[filterName].filter(
          (v: any) => v !== value
        );
      }
    }
  }

  get filteredOptions() {
    if (!this.activeFilter) return [];

    const options = this.activeFilter.detail || [];

    if (!this.searchTerm) return options;

    return options.filter((opt: any) =>
      opt.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getFilterCount(filter: any): number {
    if (!filter || !Array.isArray(filter.detail)) {
      return 0;
    }
    return filter.detail.filter((option: any) => option.selected).length;
  }

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (typeof window !== undefined && isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth <= 768) {
        this.desktopScreen = false;
        // this.getHeaderMenu();
      } else {
        this.desktopScreen = true;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tempFilterName) {
      this.tempFilterData =
        changes['value'].currentValue?.[this.tempFilterName] || null;
    }

    console.log({ changes });
  }

  ngOnInit(): void {
    this.initialFilterUrl = JSON.parse(JSON.stringify(this.filterUrl));
    this.sortFilters = SORT_FILTERS.filter((el) =>
      el.moduleType.includes(this.moduleType)
    );
    this.route.queryParams.subscribe((params) => {
      const search = params['search'];
      console.log('>>>', this.router.url.startsWith('/herbs'));
      if (this.router.url.startsWith('/herbs')) {
        this.herbsSearchTerm = search;
      }
    });
  }

  openModal(filterName: string) {
    this.renderer.addClass(this.filterModal.nativeElement, 'show');
    this.renderer.setStyle(this.filterModal.nativeElement, 'display', 'block');

    this.modalfilter = [];
    this.tempFilterName = filterName;
    this.tempFilterData = null;
    if (this.value?.[filterName]) {
      this.tempFilterData = this.value?.[filterName];
    }

    this.list.forEach((filter: any) => {
      if (filterName == filter.filterName) {
        this.modalfilter.push(filter);
        if (filter.inputType == 'radio') {
          let index = filter.detail.findIndex(
            (el: any) => this.filterUrl[filterName] == el._id
          );
          if (index != -1) {
            this.tempFilterData = filter.detail[index]._id;
          }
        } else {
          this.tempFilterData = this.filterUrl[filterName]
            ? JSON.parse(JSON.stringify(this.filterUrl[filterName]))
            : [];
        }
      }
    });
    if (!this.modalfilter.length) {
      this.sortFilters.forEach((filter: any) => {
        if (filterName == filter.filterName) {
          this.modalfilter.push(filter);
          if (filter.inputType == 'radio') {
            let index = filter.detail.findIndex(
              (el: any) => this.filterUrl[filterName] == el._id
            );
            if (index != -1) {
              this.tempFilterData = filter.detail[index]._id;
            }
          } else {
            this.tempFilterData = this.filterUrl[filterName] || [];
          }
        }
      });
    }
  }

  openSampleModal() {
    this.renderer.addClass(this.sampleModal.nativeElement, 'show');
    this.renderer.setStyle(this.sampleModal.nativeElement, 'display', 'block');
  }

  closeSampleModal() {
    this.renderer.removeClass(this.sampleModal.nativeElement, 'show');
    this.renderer.setStyle(this.sampleModal.nativeElement, 'display', 'none');
    this.modalfilter = [];
  }

  closeModal() {
    this.renderer.removeClass(this.filterModal.nativeElement, 'show');
    this.renderer.setStyle(this.filterModal.nativeElement, 'display', 'none');
    this.modalfilter = [];
  }

  // toggleFilterType(index: any) {
  //   this.filterUrl[index].showSubCat = !this.filterUrl[index].showSubCat;
  // }

  onSearch(input: any, item: any) {
    item.detail.forEach((el: any) => {
      el.hide = !el.name.toLowerCase().includes(input.value.toLowerCase());
    });
  }

  getProductData(item: any, inputType: any, data: any, event: any) {
    if (event.target.checked) {
      if (inputType == 'checkbox') {
        if (!this.tempFilterData) this.tempFilterData = [];
        if (Array.isArray(this.tempFilterData)) {
          this.tempFilterData.push(data);
        }
      } else if (inputType == 'radio') {
        this.tempFilterData = data;
      }
    } else if (!event.target.checked) {
      if (inputType == 'checkbox') {
        if (Array.isArray(this.tempFilterData)) {
          for (var i = 0; i < this.tempFilterData.length; i++) {
            let j;
            j = this.tempFilterData.indexOf(data);
            this.tempFilterData.splice(j, 1);
            break;
          }
        }
      } else if (inputType == 'radio') {
        this.tempFilterData = data;
      }
    }
  }

  applyFilter() {
    this.closeModal();
    if (this.tempFilterName) {
      this.filterUrl[this.tempFilterName] = this.tempFilterData;
    }
    this.changefilters.next(this.filterUrl);
  }

  applySampleFilter() {
    this.closeSampleModal();
    this.changefilters.next(this.filterUrl);
  }

  clearSampleFilter() {
    // Reset filterUrl
    this.filterUrl = JSON.parse(JSON.stringify(this.initialFilterUrl));
    // Clear selected flags in UI
    this.list.forEach((filter: any) => {
      const details = Array.isArray(filter.detail) ? filter.detail : [];
      const options = Array.isArray(filter.options) ? filter.options : [];
      [...details, ...options].forEach((opt: any) => (opt.selected = false));
    });

    // Emit cleared filters
    this.changefilters.next(this.filterUrl);
  }

  clearFilter() {
    // let _filter = this.filterData.find((el: any) => el.filterName = this.tempFilterName)
    // if (!_filter) {
    //   _filter = this.sortFilters.find((el: any) => el.filterName = this.tempFilterName)
    // }
    // if (_filter.inputType == 'checkbox') {
    //   this.tempFilterData = []
    // } else {
    //   this.tempFilterData = null
    // }
    // this.applyFilter()
    this.tempFilterData = null;
    this.filterUrl = {};
    // this.clearFilters.next()
  }

  backToHomePage() {
    this.router.navigate(['']);
  }

  toggleSearch() {
    this.isExpanded = !this.isExpanded;
  }
}
