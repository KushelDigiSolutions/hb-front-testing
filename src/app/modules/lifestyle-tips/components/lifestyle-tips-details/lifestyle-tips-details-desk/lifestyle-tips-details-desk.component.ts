import { CommonModule, DOCUMENT } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, HostListener, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CardComponent } from '../../../../../components/card/card.component';
import { environment } from '../../../../../../environments/environment';
import { LifeStyleHealthCardComponent } from '../../../../../shared/components/life-style-health-card/life-style-health-card.component';
import { ProductSliderComponent } from '../../../../../components/product-slider/product-slider.component';
import { SliderComponent } from '../../../../../components/slider/slider.component';
import { register } from 'swiper/element/bundle';
import { Router, RouterModule } from '@angular/router';
import { ConsultTopSpecialistsComponent } from '../../../../shop/components/consult-top-specialists/consult-top-specialists.component';
import { ProductComponent } from '../../../../../product/product.component';
import { BreadcrumbComponent, BreadcrumbData } from '../../../../../components/breadcrumb/breadcrumb.component';
import { LifestyleTipCardComponent } from '../../lifestyle-tip-card/lifestyle-tip-card.component';
import { LifestyleDescriptionComponent } from '../lifestyle-description/lifestyle-description.component';
register();

@Component({
  selector: 'app-lifestyle-tips-details-desk',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    RouterModule,
    LifeStyleHealthCardComponent,
    ProductSliderComponent,
    SliderComponent,
    ConsultTopSpecialistsComponent,
    ProductComponent,
    BreadcrumbComponent,
    LifeStyleHealthCardComponent,
    LifestyleTipCardComponent,
    LifestyleDescriptionComponent,
  ],
  templateUrl: './lifestyle-tips-details-desk.component.html',
  styleUrl: './lifestyle-tips-details-desk.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LifestyleTipsDetailsDeskComponent implements OnInit, OnChanges {

  @Input() tipsDetail: any;
  @Input() tipRelatedBolg: any;
  @Input() tenSecReadBlogs: any;
  @Input() consultList: any;
  @Input() shopNowProductsData: any;
  @Input() relatedArticle: any[] = [];
  @Input() banner: any;
  @Input() products: any;

  @ViewChild('cont') contRef: ElementRef;
  cdnBase: string = environment.imageUrl;
  breadcrumb: BreadcrumbData[] = [];


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
    768: {
      slidesPerView: 4.5,
      spaceBetween: 25
    },
    1024: {
      slidesPerView: 2.3,
      spaceBetween: 15
    }
  }

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  @HostListener('document:scroll')
  onScroll() {
    let contElem: any = this.document.querySelector('.relatedItemsCol');
    let offsetTop = contElem['offsetTop'];
    let innerElem = contElem.children[0];
    let innerElemHeight = innerElem.clientHeight;
    let footer: any = this.document.querySelector('.footer');
    let footerOffsetTop = footer['offsetTop'];
    let scrollTop = window.pageYOffset;
    let windowHeight = window.innerHeight;

    const styleObj = innerElem['style'] as CSSStyleDeclaration;
    if (window.innerWidth > 991) {
      if (scrollTop + windowHeight > offsetTop + innerElemHeight && scrollTop + windowHeight < footerOffsetTop) {
        // const { clientWidth, offsetLeft } = this.contRef.nativeElement || {}
        styleObj.position = 'fixed';
        styleObj.bottom = '0px';
        // styleObj.marginRight = ((offsetLeft || 0) - 15) + 'px';
        styleObj.width = this.document.querySelector('.dontRemove-toComputeColWidth')?.clientWidth + 'px'
      } else if (scrollTop + windowHeight > footerOffsetTop) {
        styleObj.position = "absolute";
        styleObj.bottom = '0px';
        // styleObj.marginRight = '15px';
        styleObj.width = 'initial';
      } else {
        styleObj.position = "";
        styleObj.bottom = '';
        // styleObj.marginRight = '';
        styleObj.width = '';
      }
    } else {
      styleObj.position = "";
      styleObj.bottom = '';
      styleObj.marginRight = '';
    }
    // To auto load related blogs
    if (scrollTop + windowHeight > footerOffsetTop - 100) {
      // this.loadBlog()
    }
  }
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { title, categories }: any = changes['tipsDetail']?.currentValue || {};
    if (title && categories) {
      let _breadcrumb: BreadcrumbData[] = []
      if (categories?.length) {
        const { name, url } = categories[0]
        _breadcrumb.push({ title: name, url: (url as string).startsWith('/') ? url : '/' + url })
      }

      _breadcrumb.push({ title });
      this.breadcrumb = _breadcrumb
    }
    this.tipsDetail.products = this.tipsDetail?.products ?? [];
    //console.log('tipsDetail?.products', this.tipsDetail?.products)
  }

  redirectToLifestyleTipsDetails(titleName: any) {
    this.router.navigate(['lifestyle-tips', titleName]);
  }

}
