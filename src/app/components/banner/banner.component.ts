import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { environment } from "../../../environments/environment";
import { CommonService } from "../../services/common.service";
import { BannersType } from "../../shared/types/index.types";
import { Banner } from "../../shared/types/xhr.types";
import { ToastrService } from "ngx-toastr";
import { Clipboard } from '@angular/cdk/clipboard'

@Component({
    selector: "app-banner",
    templateUrl: "./banner.component.html",
    styleUrls: ["./banner.component.scss"],
    imports: [CommonModule, RouterModule],
    standalone: true
})
export class BannerComponent implements OnInit {

    @Input('bannersType') bannersType: BannersType;
    @Output() loading = new EventEmitter<boolean>();

    s3base = environment.imageUrl
    banners: Banner[] = []


    constructor(
        private commonService: CommonService,
        private clipboard: Clipboard,
        private toastr: ToastrService,
    ) { }


    ngOnInit(): void {
        this.loading.emit(true);
        this.commonService.getBanners(this.bannersType).subscribe(res => {
            this.loading.emit(false);
            if (res?.success) {
                this.banners = res.data.banners.filter(banner => banner.active);
            }
        }, err => {
            this.loading.emit(false);
        })
    }

    copyCoupon(banner: any) {
        if (!banner.couponCode) return;
        if (this.clipboard.copy(banner.couponCode)) {
            this.toastr.success('Use at checkout', 'Coupon code copied!')
        } else {
            this.toastr.error('Failed to copy coupon code!')
        }
    }

}