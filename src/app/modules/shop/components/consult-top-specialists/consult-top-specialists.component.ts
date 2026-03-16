import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from "@angular/core";
import { CardComponent } from "../../../../components/card/card.component";
import { CommonModule } from "@angular/common";
import { environment } from "../../../../../environments/environment";
import { RouterModule, Router } from "@angular/router";
import { CartService } from "../../../../services/cart.service";
import { CommonService } from "../../../../services/common.service";
import { ToastrService } from "ngx-toastr";
import { ConsultantCardComponent } from "../../../consult-us/components/consultant-card/consultant-card.component";
import { SwiperComponent } from "../../../../components/swiper/swiper.component";

@Component({
    selector: "app-top-consult-specialist",
    templateUrl: "./consult-top-specialists.component.html",
    styleUrls: ["./consult-top-specialists.component.scss"],
    standalone: true,
    imports: [CardComponent, CommonModule, RouterModule, ConsultantCardComponent,SwiperComponent,],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsultTopSpecialistsComponent {

    cloudImageUrl: string = environment.imageUrl;
    @Input() productBrandTitle: string;
    @Input() topConsult: any;
    @Input() seeAllUrl: string;
    // custom swiper slider button

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
            slidesPerView: 4,
            spaceBetween: 8
        },
        768: {
            slidesPerView: 4.5,
            spaceBetween: 8
        },

        1100: {
            slidesPerView: 6.5,
            spaceBetween: 8
        }
    }

    constructor(
        private router: Router,
        private cartService: CartService,
        private commonService: CommonService,
        private toaster: ToastrService,
    ) { }

    // consult-us/doctor/:consultantSlug
    redirectToConsultUsDetailsPage(slug: string) {
        this.router.navigate(['/consult-us/doctor', slug]);
    }

    addToCheckout(id: string) {
        let body = {
            'consultantId': id
        }
        let user = this.commonService.getUser();
        if (user) {
            this.cartService.addToConsultCheckout(body).subscribe((res: any) => {
                localStorage.setItem('guestCheckoutCartId', res.data.cart._id);
                this.toaster.success('Consultant added in Cart');
                this.cartService.setCartState('consult');
                this.cartService.openDirectCart(true);
            }, error => {
                this.toaster.error('Book only one consultation at a time');
                this.cartService.setCartState('consult');
                this.cartService.openDirectCart(true);
            });
        } else {
            this.cartService.addToConsultCartForGuest(body).subscribe((res: any) => {
                localStorage.setItem('guestCheckoutCartId', res.data.cart._id);
                this.toaster.success('Consultant added in Cart');
                this.cartService.setCartState('consult');
                this.cartService.openDirectCart(true);
            }, error => {
                this.toaster.error('Book only one consultation at a time');
                this.cartService.setCartState('consult');
                this.cartService.openDirectCart(true);
            });
        }
        // this.cartService.setCartState('consult');
        // this.cartService.openDirectCart(true);
    }


    ngAfterViewInit(): void {
        
    }

    exploreMore(title: any) {
        this.router.navigate(['category', title])
    }
}