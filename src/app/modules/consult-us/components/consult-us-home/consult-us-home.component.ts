import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { SliderComponent, SliderComponentDataItem } from "../../../../components/slider/slider.component";
import { CommonModule } from "@angular/common";
import { SwiperContainer, register } from 'swiper/element/bundle';
import { ProductService } from "../../../../services/product.service";
import { ShopNowService } from "../../../shop/services/shop-now.services";
import { ShopHealthConcernComponent } from "../../../shop/components/shop-health-concern/shop-health-concern.component";
import { ConsultTopSpecialistsComponent } from "../../../shop/components/consult-top-specialists/consult-top-specialists.component";
import { CommonService } from "../../../../services/common.service";
import { ConsultUsService } from "../../services/consult-us.service";
import { MiniCardsCategorySliderComponent, MiniCardsCategorySliderComponentItem } from "../../../../components/mini-cards-category-slider/mini-cards-category-slider.component";
import { ShopCategoryComponent } from "../../../../components/shop-category/shop-category.component";
import { MetasService } from "../../../../services/metas.service";
import { flaternHealthConcernsChildrens } from "../../../../util/data-transform";
import { SpinnerService } from "../../../../services/spinner.service";
register();
export interface UserLocationDetails {
    _id: string,
    code: string,
    city: {
        _id: string,
        name: string
    }
}
@Component({
    selector: "app-consult-us",
    templateUrl: "./consult-us-home.component.html",
    styleUrls: ['./consult-us-home.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        SliderComponent,
        ShopHealthConcernComponent,
        ConsultTopSpecialistsComponent,
        MiniCardsCategorySliderComponent,
        ShopCategoryComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsultUsHomeComponent implements OnInit {
    isLocation: boolean = false;
    topConsultLists: Array<any> = [];
    consultantNearMeLists: Array<any> = [];
    consultAgainLists: Array<any> = [];
    categoryBannersList: Array<any> = [];
    consultBySpecility: Array<MiniCardsCategorySliderComponentItem> = [];
    consultByHealthConcern: Array<MiniCardsCategorySliderComponentItem> = [];
    //custom slider button
    @ViewChild('swiper') swiper: ElementRef<SwiperContainer>
    @ViewChild('swiper1') swiper1: ElementRef<SwiperContainer>
    sliderInitiated = false
    disabledNext = true
    disabledPrev = true

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
    ayushList: Array<any>;
    pageSize = 10;
    page = 1;
    isUser: any;
    isLoggedin = false;
    constructor(
        private productService: ProductService,
        private shopHomeService: ShopNowService,
        private commonService: CommonService,
        private consultUsService: ConsultUsService,
        private metaService: MetasService,
        private spinner: SpinnerService,
    ) { }

    ngOnInit(): void {
        this.metaService.setPageMeta('consult-us', 'Consult Us');
        //check user logged in or not
        this.commonService.getLoginState().subscribe((state) => {
            this.isLoggedin = state;
            if (state) {
                this.getConsultAgainList();
                this.topConsultLists = [];
            } else {
                this.getTopSpecilistConsult();
                this.consultAgainLists = [];
            }
            this.getConsultantNearByLocation();
        });

        //check user location added or not
        this.commonService.getLocationState().subscribe((state) => {
            this.isLocation = state;
            console.log('this.isLocation = ', this.isLocation);
            if (state) {
                this.getConsultantNearByLocation();
            }
        });

        this.getCategoryBanner();
        this.getConsultSpecility();
        this.getConsultByHealthConcern();
        this.getConsultantTypes();
        // this.getConsultantNearByLocation();
    }

    getConsultAgainList() {
        this.consultUsService.getConsultAgainList({ page: 1, limit: 12 }).subscribe((res: any) => {
            console.log('consult again = ', res);
            this.consultAgainLists = res.data;
        });
    }

    getTopSpecilistConsult() {
        this.spinner.show()
        this.productService.getTopSpecilistConsult({ page: 1, limit: 12 }).subscribe((res: any) => {
            this.spinner.hide()
            this.topConsultLists = res.data;
        }, err => {
            this.spinner.hide()
        });
    }

    getCategoryBanner() {
        let payload = {
            'cardType': 'normal',
            'active': true,
            'type': "consult-us",
        }
        this.commonService.getPromotionBanners(payload).subscribe((res: any) => {
            if (res.success) {
                this.categoryBannersList = res.data.banners.map((el: any) => {
                    return {
                        title: el.altText,
                        img: el.image.savedName,
                        url: el.link
                    } as SliderComponentDataItem
                });
            }
        });
    }

    getConsultSpecility() {
        this.consultUsService.getSpecializations().subscribe((res: any) => {
            this.consultBySpecility = res.data.healthSpeciality.map((el: any) => {
                let item: MiniCardsCategorySliderComponentItem = {
                    img: el.logo.savedName,
                    label: el.name,
                    url: '/consult-us/specializations/' + el.slug
                }
                return item
            });
        });
    }


    getConsultByHealthConcern() {
        this.productService.getShopByHealthConcern().subscribe((res: any) => {
            // console.log('res.data.healthConcerns = ', res.data.healthConcerns);
            this.consultByHealthConcern = flaternHealthConcernsChildrens(res.data.healthConcerns).filter((el: any) => el.visibleAtConsultUs).map((el: any) => {
                let item: MiniCardsCategorySliderComponentItem = {
                    img: el.logo.savedName,
                    label: el.name,
                    url: '/consult-us/' + el.url
                }
                return item
            });
            // console.log('this.consultByHealthConcern = ', this.consultByHealthConcern);
        });
    }

    // custom slider css

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

    onInitR(event: any) {
        setTimeout(() => {
            if (this.swiper1?.nativeElement?.swiper) {
                const { isBeginning, isEnd } = this.swiper?.nativeElement.swiper
                this.disabledPrev = isBeginning
                this.disabledNext = isEnd
            }
        }, 500)

    }

    onChangeR(event: any) {
        const swiper1 = event.target.swiper1
        const { isBeginning, isEnd } = swiper1
        this.disabledPrev = isBeginning
        this.disabledNext = isEnd
    }

    onNextR() {
        this.swiper1.nativeElement.swiper.slideNext()
    }
    onPrevR() {
        this.swiper1.nativeElement.swiper.slidePrev()
    }

    getConsultantTypes() {
        const pars = `limit=${this.pageSize}&page=${this.page}`;
        // const filteredNames = ["Ayurvedic", "Yoga & Naturopathy", "Unani", "Siddha", "Homeopathy"];
        this.consultUsService.getConsultantTypes(pars)
            .toPromise()
            .then((res: any) => {
                if (res.data) {
                    // this.ayushList = res.data;
                    // const desiredOrder = ['A', 'Y', 'U', 'S', 'H'];
                    // this.ayushList = res.data.filter((type: any) => filteredNames.includes(type.name)).sort((a: any, b: any) => {
                    //     const orderA = desiredOrder.indexOf(a.name[0]);
                    //     const orderB = desiredOrder.indexOf(b.name[0]);
                    //     return orderA - orderB;
                    // });
                    const sortOrder = ['A', 'Y', 'U', 'S', 'H'];

                    // Custom sort function
                    this.ayushList = res.data.sort((a: any, b: any) => {
                        const firstCharA = a.name[0].toUpperCase();
                        const firstCharB = b.name[0].toUpperCase();

                        const indexA = sortOrder.indexOf(firstCharA);
                        const indexB = sortOrder.indexOf(firstCharB);

                        // If both are found in sortOrder, compare by their index
                        if (indexA !== -1 && indexB !== -1) {
                            return indexA - indexB;
                        }

                        // If only one of them is found in sortOrder, prioritize that one
                        if (indexA !== -1) return -1;
                        if (indexB !== -1) return 1;

                        // If neither is found in sortOrder, maintain original order
                        return 0;
                    }).slice(0, 6);
                    console.log('this.ayushList = ', this.ayushList);
                }
            })
            .catch((err: any) => {
                console.log("err", err);
            });
    }

    getConsultantNearByLocation() {
        let userLoggedIn = this.commonService.getUser();
        let locationDetails: any;
        let temp: any;
        if (userLoggedIn) {
            locationDetails = localStorage.getItem('userLocation');
            temp = JSON.parse(locationDetails);

        } else {
            locationDetails = localStorage.getItem('guestUserLocation');
            temp = JSON.parse(locationDetails);
        }
        console.log('locationDetails = ', temp);
        if (!temp?.city?._id) return;
        this.consultUsService.getConsultantsNearMe({ page: 1, limit: 12, pincodeId: temp.city._id }).subscribe((res: any) => {
            console.log('getConsultantsNearMe = ', res);
            this.consultantNearMeLists = res.data;
        }, (e) => {
            console.log('getConsultantsNearMe e ', e);
        });
    }

}