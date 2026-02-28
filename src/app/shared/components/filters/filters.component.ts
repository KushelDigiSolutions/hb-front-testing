import {
  Component,
  EventEmitter,
  Input,
  Output,
  PLATFORM_ID,
  Inject,
  Renderer2,
} from '@angular/core';
import {
  CommonModule,
  DOCUMENT,
  isPlatformBrowser,
  Location,
} from '@angular/common';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { selectedFilterType } from '../../types/xhr.types';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, NgxSliderModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  // isBrowser: boolean;
  // activeIndex: any;
  // radioActiveIndex: any;
  // @Input() loader: boolean;
  // categoryData2: any;
  // @Input()
  // set categoryData(catData: any) {
  //   this.categoryData2 = catData;
  //   for (let k in this.categoryData) {
  //     this.categoryData[k].showSubCat = true;
  //   }
  // }
  // get categoryData(): any {
  //   return this.categoryData2;
  // }
  // filterableData: any;
  // @Input()
  // set filterData(filters: any) {
  //   this.filterableData = filters;
  // }
  // get filterData(): any {
  //   return this.filterableData;
  // }
  // @Input()
  // set priceSlider(price: any) {
  //   // this.priceRangeSlider = price;
  //   // this.value = this.priceSlider?.detail?.minPrice || 0;
  //   // this.highValue = this.priceSlider?.detail?.maxPrice || 0;
  //   // let newOptions: Options = Object.assign({}, this.options);
  //   // newOptions.floor = this.priceSlider?.detail?.minPrice;
  //   // newOptions.ceil = this.priceSlider?.detail?.maxPrice;
  //   // this.options = newOptions;
  // }
  // // get priceSlider(): any {
  // //   // return this.priceRangeSlider;
  // // }
  // @Output() newItemEvent = new EventEmitter<any>();

  // constructor(
  //   @Inject(PLATFORM_ID) private platformId: any
  // ) { }

  // async ngOnInit() {
  //   this.isBrowser = isPlatformBrowser(this.platformId);
  //   console.log('this.isBrowser: ', this.isBrowser);
  //   console.log('filters: ', this);
  // }

  // toggleFilterType(index: number) {
  //   this.categoryData[index].showSubCat = !this.categoryData[index].showSubCat;
  // }

  // onSearch(input: any, item: any) {
  //   item.detail.forEach((el: any) => {
  //     el.hide = !el.name.toLowerCase().includes(input.value.toLowerCase());
  //   })
  // }

  // getProductData(item: any, inputType: any, data: any, event: any) {
  //   if (event.target.checked) {
  //     if (inputType == "checkbox") {
  //       if (!this.filterData[item]) this.filterData[item] = [];
  //       this.filterData[item].push(data);
  //     } else if (inputType == "radio") {
  //       this.filterData[item] = [data];
  //     }
  //   }
  //   if (!event.target.checked) {
  //     if (inputType == "checkbox") {
  //       for (var i = 0; i < this.filterData[item].length; i++) {
  //         let j;
  //         j = this.filterData[item].indexOf(data);
  //         this.filterData[item].splice(j, 1);
  //         break;
  //       }
  //     }
  //     else if (inputType == "radio") {
  //       this.filterData[item] = data;
  //     }
  //   }
  //
  //   this.getFilters(this.filterData);
  // }

  // getFilters(value: any) {
  //   this.newItemEvent.emit(value);
  // }

  // setRadioActiveIndex(index: number) {
  //   this.radioActiveIndex = index;
  // }

  //////////////////////////

  skeltons = [{ rows: new Array(5).fill('') }, { rows: new Array(5).fill('') }];

  isBrowser = false;
  originalFiltersData: any = {};
  private filterableData = {
    categoryId: [],
    healthConcernId: [],
    brandId: [],
    minPrice: '',
    maxPrice: '',
  };
  priceRangeData = [
    {
      id: 1,
      minPrice: '0',
      maxPrice: '500',
    },
    {
      id: 2,
      minPrice: '501',
      maxPrice: '1000',
    },
    {
      id: 3,
      minPrice: '1001',
      maxPrice: '2500',
    },
    {
      id: 4,
      minPrice: '2501',
      maxPrice: '10000',
    },
  ];
  categoryData2: any;
  priceRangeJSON = {};
  priceRangeSlider: any;
  priceRangeFilter: boolean = false;

  // **Range SliderConfig**//
  value: number = 150;
  highValue: number = 300;
  options: any = {
    floor: 0,
    ceil: 600,
  };
  // **Range SliderConfig**//

  @Output() newItemEvent = new EventEmitter<any>();
  @Output() removeFilter = new EventEmitter<any>();
  /*
   **Below code is written to have input from the category detail component and set the price bar
   **accordingly to the value fetched
   */

  @Input() loader: boolean;
  @Input() filterTitle: string;
  @Input() sorting: boolean = true;
  @Input()
  set priceSlider(price: any) {
    this.priceRangeSlider = price;
    this.value = this.priceSlider?.detail?.minPrice || 0;
    this.highValue = this.priceSlider?.detail?.maxPrice || 0;
    let newOptions: any = Object.assign({}, this.options);
    newOptions.floor = this.priceSlider?.detail?.minPrice;
    newOptions.ceil = this.priceSlider?.detail?.maxPrice;
    this.options = newOptions;
  }
  get priceSlider(): any {
    return this.priceRangeSlider;
  }

  @Input()
  set categoryData(catData: any) {
    this.categoryData2 = catData;
    // 🧹 1️⃣ Remove brand filter instantly if on /brand route
    if (this.location.path().startsWith('/brand')) {
      catData = catData.filter((item: any) => item.filterName !== 'brandId');
    }

    // ✅ Assign after cleanup
    this.categoryData2 = catData;

    for (let k in this.categoryData) {
      this.categoryData[k].showSubCat = true;
    }
    this.originalFiltersData = JSON.parse(JSON.stringify(this.categoryData));

    // 🧭 3️⃣ Store a deep copy for reset/reference
    this.originalFiltersData = JSON.parse(JSON.stringify(this.categoryData2));

    // 💰 4️⃣ Handle price range logic
    const priceRange = this.categoryData2.find(
      (item: any) => item.filterName === 'priceRange'
    );

    if (priceRange) {
      this.priceRangeFilter = true;
      this.priceRangeData = priceRange.detail;
    } else {
      this.priceRangeFilter = false;
    }
  }
  get categoryData(): any {
    return this.categoryData2;
  }

  @Input()
  set filterData(filters: any) {
    this.filterableData = filters;
  }
  get filterData(): any {
    return this.filterableData;
  }
  activeIndex: any;

  subActiveIndex: any;
  priceRange = 'minPrice';
  priceValue: any;

  selectedPriceRange: selectedFilterType = {
    id: 0,
    minPrice: 0,
    maxPrice: 0,
  };

  minPrice: number | string = 0;
  maxPrice: number | string = 0;

  price = ['200', '500', '1000', '1500', '2000', '2500', '3000+'];

  radioActiveIndex = -1;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private _document: Document,
    // private apiService: SharedService,
    // private toaster: ToastrService,
    private renderer: Renderer2, // private route: ActivatedRoute, // private router: Router
    private location: Location
  ) {}

  checkPriceRange() {
    console.log('>>>>>>>', this.location.path().startsWith('/brand'));
    if (
      this.categoryData.find((item: any) => item.filterName === 'priceRange')
    ) {
      this.priceRangeFilter = true;
    }
  }

  removeBrandFilter() {
    if (this.location.path().startsWith('/brand')) {
      console.log('>>> CAME');
      this.categoryData = this.categoryData.filter(
        (item: any) => item.filterName !== 'brandId'
      );
    }
  }

  async ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    const priceRange = this.categoryData.find(
      (item: any) => item.filterName === 'priceRange'
    );
    if (priceRange) {
      this.priceRangeData = priceRange?.detail;
    }
    this.checkPriceRange();
    this.removeBrandFilter();
  }

  ngOnDestroy() {
    this.renderer.removeClass(this._document.body, 'overflow-hidden');
  }

  toggleFilterType(index: any) {
    this.categoryData[index].showSubCat = !this.categoryData[index].showSubCat;
  }

  toggleSubFilterType(value: any, index: any) {}

  selectPriceRange(item: selectedFilterType) {
    this.maxPrice = item?.maxPrice;
    this.minPrice = item?.minPrice;
    this.filterData.maxPrice = item?.maxPrice;
    this.filterData.minPrice = item?.minPrice;
    this.getFilters(this.filterData);
  }

  getProductData(item: any, inputType: any, data: any, event: any) {
    console.log('DATA: ', item, inputType, data, this.filterData);
    if (event.target.checked) {
      if (inputType == 'checkbox') {
        if (!this.filterData[item] || !Array.isArray(this.filterData[item]))
          this.filterData[item] = [];
        this.filterData[item].push(data);
        console.log('data', data);
      } else if (inputType == 'radio') {
        this.filterData[item] = [data];
      }
    }
    if (!event.target.checked) {
      if (inputType == 'checkbox') {
        for (var i = 0; i < this.filterData[item].length; i++) {
          let j;
          j = this.filterData[item].indexOf(data);
          this.filterData[item].splice(j, 1);
          break;
        }
      } else if (inputType == 'radio') {
        this.filterData[item] = data;
      }
    }
    this.getFilters(this.filterData);
  }

  removeAllFilter() {
    this.categoryData = JSON.parse(JSON.stringify(this.originalFiltersData));
    this.removeFilter.emit(true);
  }
  setRadioActiveIndex(index: any) {
    this.radioActiveIndex = index;
  }

  //OUTPUT FUNCTION
  getFilters(value: any) {
    this.newItemEvent.emit(value);
  }

  minPriceSliderFxn(value: any) {
    this.filterData.minPrice = value;
  }

  maxPriceSliderFxn(value: any) {
    //this.filterData.maxPrice = value;
    // Check if the slider is at maximum position
    if (value >= this.options.ceil) {
      // Set a special flag or value to indicate "and above"
      this.filterData.maxPrice = null; // or use a special value like "unlimited"
      this.filterData.isMaxPriceUnlimited = true;
    } else {
      this.filterData.maxPrice = value;
      this.filterData.isMaxPriceUnlimited = false;
    }
  }

  onPriceChangeEnd() {
    //this.getFilters(this.filterData);
    // Check if high value is at ceiling
    if (this.highValue >= this.options.ceil) {
      this.filterData.maxPrice = null; // Indicates no upper limit
      this.filterData.isMaxPriceUnlimited = true;
    } else {
      this.filterData.maxPrice = this.highValue;
      this.filterData.isMaxPriceUnlimited = false;
    }

    this.filterData.minPrice = this.value;
    this.getFilters(this.filterData);
  }

  onSearch(input: any, item: any) {
    item.detail.forEach((el: any) => {
      el.hide = !el.name.toLowerCase().includes(input.value.toLowerCase());
    });
  }

  setOverflow() {
    this.renderer.addClass(this._document.body, 'overflow-hidden-max-sm');
  }
  removeOverflow() {
    this.renderer.removeClass(this._document.body, 'overflow-hidden-max-sm');
  }
  showFilterBar = false;
  showSort = false;

  toggleFiltersBar() {
    this.showSort = false;
    this.showFilterBar = !this.showFilterBar;
    if (this.showFilterBar) {
      this.setOverflow();
    } else {
      this.removeOverflow();
    }
  }

  // openCategory(item,subItem){
  //   let catName=subItem.name
  //   .toLowerCase()
  //   .replace(/ /g, "-")
  //   .replace('/', "-");
  //   let path:any = this.router.url.split('/');f
  //   path.pop();
  //   // path=path.slice(1);
  //   path=path.join();
  //   path=path.replace(/[,]/g,"/");
  //   if(isPlatformBrowser(this.platformId)){
  //     window.open(`${path}/${catName}`);
  //   }
  // }

  toggleSort() {
    this.showFilterBar = false;
    this.showSort = !this.showSort;
    if (this.showSort) {
      this.setOverflow();
    } else {
      this.removeOverflow();
    }
  }

  // onChangeSort(event) {
  //   this.showSort = false;
  //   this.filterData.sort = event.target.value;
  //   this.getFilters(this.filterData);
  // }
}
