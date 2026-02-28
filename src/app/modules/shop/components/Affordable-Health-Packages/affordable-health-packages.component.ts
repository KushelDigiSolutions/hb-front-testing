import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from "@angular/core";
import { CardComponent } from "../../../../components/card/card.component";
import { environment } from "../../../../../environments/environment";
import { Router } from "@angular/router";

@Component({
    selector: "app-affordable-health-packages",
    templateUrl: "./affordable-health-packages.component.html",
    styleUrls: ["./affordable-health-packages.component.scss"],
    standalone: true,
    imports: [CommonModule, CardComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AffordableHealthPackagesComponent implements OnInit {
    @Input() package: any;
    @Input() productBrandTitle: any;
    cloudImgUrl: any = environment.imageUrl;
    constructor(private router: Router) { }
    ngOnInit(): void { }

    redirectHealthPackageDetails(healthPackageslug: any) {
        this.router.navigate(['/health-package/', healthPackageslug]);
    }
    swiperBreakpints: any = {
        // when window width is >= 320px
        320: {
          slidesPerView: 1.5,
          spaceBetween: 15
        },
        390: {
          slidesPerView: 2,
          spaceBetween: 8
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 3,
          spaceBetween: 8
        },
        // when window width is >= 640px
        640: {
          slidesPerView: 3,
          spaceBetween: 15
        },
        768: {
          slidesPerView: 3.5,
          spaceBetween: 15
        },
        
        1100: {
            slidesPerView: 5.5,
            spaceBetween: 15
          }
      }
}