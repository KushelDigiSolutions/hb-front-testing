import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { SwiperContainer } from 'swiper/element';


@Component({
  selector: 'app-swiper',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperComponent implements OnInit, AfterViewInit {


  @Input('slides-per-view') slidesPerView: string | number = 'auto';
  @Input('space-between') spaceBetween?: string | number;
  @Input('breakpoints') breakpoints?: any;
  @Input('thumbs-swiper') thumbsSwiper?: string;



  @ViewChild('swiper') swiperRef!: ElementRef<SwiperContainer>;

  disabledPrev = true;
  disabledNext = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.onInitiate()
    }
  }

  onInitiate() {
    const params = {
      navigation: false,
      pagination: false,
      slidesPerView: 3,
      breakpoints: this.breakpoints || {},
      // modules: [
      //   Navigation,
      //   Pagination,
      // ],
      // inject modules styles to shadow DOM
      injectStylesUrls: [
        // 'assets/css/navigation-element.scss',
      ],
      on: {
        init: (event: any) => {
          // console.log('[on:init]', event)
          this.handleSwiperEvent(event)
          setTimeout(() => {
            event?.slideTo(1)
            event?.slideTo(0)
          }, 800)
        },
        slideChange: (event: any) => {
          // console.log('[on:slideChange]', event)
          this.handleSwiperEvent(event)
        },
      },
    };

    Object.assign(this.swiperRef.nativeElement, params);

    this.swiperRef.nativeElement?.initialize?.();
  }

  get swiper() {
    return this.swiperRef.nativeElement?.swiper || {}
  }

  handleSwiperEvent(event: any) {
    if (event) {
      const { allowSlideNext, allowSlidePrev, isBeginning, isEnd } = event
      if (!allowSlideNext && !allowSlidePrev) {
        this.disabledNext = true
        this.disabledPrev = true
      } else {
        this.disabledPrev = isBeginning
        this.disabledNext = isEnd
      }


    }
  }

  onPrev() {
    this.swiper?.slidePrev()
    this.handleSwiperEvent(this.swiper)
  }

  onNext() {
    // this.swiperRef?.nativeElement?.swiper
    console.dir(this.swiper)
    this.swiperRef.nativeElement?.swiper?.slideNext()
    this.handleSwiperEvent(this.swiper)
  }


}
