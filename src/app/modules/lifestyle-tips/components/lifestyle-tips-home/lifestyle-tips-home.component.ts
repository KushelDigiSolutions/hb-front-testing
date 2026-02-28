import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from "@angular/core";
import { ShopCategoryComponent, ShopCategoryComponentItem } from "../../../../components/shop-category/shop-category.component";
import { CommonModule } from "@angular/common";
import { register } from 'swiper/element/bundle';
import { HttpClient } from "@angular/common/http";
import { LifestyleTipsService } from "../../../../services/lifestyle-tips.service";
import { SliderComponent, SliderComponentDataItem } from "../../../../components/slider/slider.component";
import { AffordableHealthPackagesComponent } from "../../../shop/components/Affordable-Health-Packages/affordable-health-packages.component";
import { LifeStyleHealthCardComponent } from "../../../../shared/components/life-style-health-card/life-style-health-card.component";
import { CommonService } from "../../../../services/common.service";
import { MetasService } from "../../../../services/metas.service";
import { SpinnerService } from "../../../../services/spinner.service";
register();
@Component({
    selector: "app-lifestyle-tips",
    templateUrl: "./lifestyle-tips-home.component.html",
    styleUrls: ["./lifestyle-tips-home.component.scss"],
    standalone: true,
    imports: [
        CommonModule,
        ShopCategoryComponent,
        SliderComponent,
        AffordableHealthPackagesComponent,
        LifeStyleHealthCardComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LifeStyleTipsHomeComponent implements OnInit {
    recentTips: Array<any>;
    healthTipsByCategoryListsItem: Array<ShopCategoryComponentItem> = [];
    categoryBannersList: Array<any> = [];
    affordablePackages: Array<any>;
    tenSecReadBlog: Array<any>;
    getLifestyleRecentTipPayload = {
        page: 1,
        limit: 12,
        source: 'homepage',
        isPublished: true,
    }

    constructor(
        private http: HttpClient,
        private lifestyleTipsService: LifestyleTipsService,
        private commonService: CommonService,
        private metaService: MetasService,
        private spinner: SpinnerService,
    ) { }
    ngOnInit(): void {
        this.getMetaDetail();
        this.getRecentTips();
        this.getHealthTipsByCategory();
        this.getLifesyleTipsPromostionBanner();
        this.getTenSecReadBlog();
        this.getAffordablePackages();

    }

    getRecentTips() {
        this.spinner.show()
        this.lifestyleTipsService.getLifestyleRecentTips(this.getLifestyleRecentTipPayload).subscribe((res: any) => {
            this.spinner.hide()
            this.recentTips = res.data;
        }, err => {
            this.spinner.hide()
        });
    }
    getHealthTipsByCategory() {
        this.lifestyleTipsService.getHealthTipsByCategory().subscribe((res: any) => {
            // this.healthTipsByCategoryListsItem = res.data.categories;
            this.healthTipsByCategoryListsItem = res.data.map((el: any) => {
                let item: ShopCategoryComponentItem = {
                    img: el.image.savedName,
                    label: el.name,
                    url: el.url
                }
                return item
            });
        });
    }

    getLifesyleTipsPromostionBanner() {
        // promotionBanner / getPromotionBanner ? cardType = normal & active=true & type=consult - us
        let payload = {
            'cardType': 'normal',
            'active': true,
            'type': "lifestyle-tip",
        }
        this.commonService.getPromotionBanners(payload).subscribe((res: any) => {
           // console.log('res = ', res);
            this.categoryBannersList = res.data.banners.map((el: any) => {
                return {
                    title: el.altText,
                    img: el.image.savedName,
                    url: el.link
                } as SliderComponentDataItem
            });

        });
    }

    getTenSecReadBlog() {
        this.lifestyleTipsService.getTenSecReadBlog().subscribe((res: any) => {
            this.tenSecReadBlog = res.data;
        });
    }

    getAffordablePackages() {
        this.lifestyleTipsService.getAffordablePackages().subscribe((res: any) => {
            let filterArr: any[] = [];
            res.data.map((packages: any) => {
                let productDiscount = Math.round(((packages.packageMRP - packages.packageSellingPrice) / packages.packageMRP * 100));
                packages.discount = productDiscount;
                filterArr.push(packages);
            });
            this.affordablePackages = filterArr;
        });
    }

    getMetaDetail() {
        this.lifestyleTipsService.getMetaDetail().subscribe((res: any) => {
            if (res.data) {
                this.metaService.setMetaTags({
                    title: res.data.metaTitle,
                    description: res.data.metaDescription,
                    keywords: res.data.metaTags.join()
                });
            }
        }, err => { });
    }


}