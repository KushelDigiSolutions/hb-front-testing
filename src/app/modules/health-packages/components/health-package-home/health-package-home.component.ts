import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from "@angular/core";
import { AffordableHealthPackagesComponent } from "../../../shop/components/Affordable-Health-Packages/affordable-health-packages.component";
import { ProductSliderComponent } from "../../../../components/product-slider/product-slider.component";
import { register } from 'swiper/element/bundle';
import { ProductService } from "../../../../services/product.service";
import { ShopNowService } from "../../../shop/services/shop-now.services";
import { SliderComponent } from "../../../../components/slider/slider.component";
import { HealthPackageService } from "../../../../services/health-package.service";
import { ActivatedRoute } from "@angular/router";
register();

@Component({
    selector: "app-health-packages",
    templateUrl: "./health-package-home.component.html",
    styleUrls: ['./health-package-home.component.scss'],
    standalone: true,
    imports: [CommonModule, AffordableHealthPackagesComponent, ProductSliderComponent, SliderComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HealthPackagesHomeComponent implements OnInit {
    popularPackages: Array<any>;
    healthPackagespromostionBanner: Array<any>;
    healthPackageCoupon: Array<any>;
    constructor(private healthPackageService: HealthPackageService, private productService: ProductService, private shopnowhomepageservice: ShopNowService, private activatedRoute: ActivatedRoute) { }
    ngOnInit(): void {
        this.getPopularPackages();
        this.getHealthCategoryBanner();
        this.getHealthPackageOfferCoupon();
    }
    getPopularPackages() {
        this.healthPackageService.getHealthPopularPackages().subscribe((res: any) => {
            let filterArr: any[] = [];
            res.data.map((packages: any) => {
                let productDiscount = Math.round(((packages.packageMRP - packages.packageSellingPrice) / packages.packageMRP * 100));
                packages.discount = productDiscount;
                filterArr.push(packages);
            });
            this.popularPackages = filterArr;
        });
    }

    getHealthCategoryBanner() {
        this.healthPackageService.getHealthPackagePromotionBanners().subscribe((res: any) => {
            this.healthPackagespromostionBanner = res.banners;
        });
    }

    getHealthPackageOfferCoupon() {
        this.productService.getCouponCode().subscribe((res: any) => {
            this.healthPackageCoupon = res;
        });
    }
}