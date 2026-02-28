import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { ConsultUsDetailsDeskComponent } from './consult-us-details-desk/consult-us-details-desk.component';
import { ConsultUsDetailsMobComponent } from './consult-us-details-mob/consult-us-details-mob.component';
import { ProductSliderComponent } from '../../../../components/product-slider/product-slider.component';
import { HttpClient } from '@angular/common/http';
import { ConsultUsService } from '../../services/consult-us.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { CartService } from '../../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MetasService } from '../../../../services/metas.service';
import { SpinnerService } from '../../../../services/spinner.service';

@Component({
  selector: 'app-consult-us-details',
  standalone: true,
  imports: [CommonModule, ConsultUsDetailsDeskComponent, ConsultUsDetailsMobComponent, ProductSliderComponent],
  templateUrl: './consult-us-details.component.html',
  styleUrl: './consult-us-details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsultUsDetailsComponent implements OnInit, AfterViewInit {

  subscription: Subscription[] = []
  desktopScreen: any = true;
  consultantDetails: any;
  relatedConsultant: Array<any>;
  shopNowProducts: Array<any>;
  relatedHealthPackages: Array<any>;
  relatedHealthTips: Array<any>;
  consultantId: string;
  cloudImgUrl: string = environment.imageUrl;
  screenWidth: any;
  @ViewChild('detailsModal') detailsModal: ElementRef;
  isReadMore: boolean = true;

  constructor(private http: HttpClient,
    private consultUsService: ConsultUsService,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private commonService: CommonService,
    private cartService: CartService,
    private toaster: ToastrService,
    private metaService: MetasService,
    private spinner: SpinnerService,
  ) { }

  ngOnInit(): void {
    this.getConsultantDetails();
    // let slug: any = this.activatedRoute.snapshot.params;
    // this.getConsultantRelatedHealthTips(slug.consultantSlug);
  }

  ngAfterViewInit(): void {
    if (typeof window !== undefined && isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth <= 768) {
        this.desktopScreen = false;
        this.openModal();
      } else {
        this.desktopScreen = true;
      }
    }
  }

  showText() {
    this.isReadMore = !this.isReadMore
  }

  getConsultantDetails() {
    this.subscription.push(this.activatedRoute.params.subscribe(params => {
      let slug = params['consultantSlug']
      this.spinner.show()
      this.consultUsService.getConsultantDetails(slug).subscribe((res: any) => {
        this.spinner.hide()
        this.consultantDetails = res.data;
        let { _id, firstName, lastName, designation, consultant } = this.consultantDetails;
        let { metaTitle, metaDescription } = consultant || {};
        let title = [];
        let name = ((firstName || '') + ' ' + (lastName || '')).trim();
        if (!name) {
          name = 'HB Consultant'
        }
        title.push(name)
        designation && title.push(designation);
        title.push('Book Appointment Online, View Fees');
        this.metaService.setMetaTags({
          title: metaTitle || title.join(' - '),
          description: metaDescription || 'Book appointments Online, View Fees, User Feedbacks for ' + name
        });
        this.consultantId = this.consultantDetails._id;
        this.getShopnowProducts(this.consultantId);
        // this.getRelatedHealthPackages(this.consultantId);
        this.getConsultantRelatedHealthTips(this.consultantId);
      }, err => {
        this.spinner.hide()
      });
      this.getRelatedConsultant(slug)
    }))
  }

  getRelatedConsultant(slug: string) {
    this.consultUsService.getConsultRelatedConsultant(slug).subscribe((res: any) => {
      this.relatedConsultant = res.data
    });
  }

  getShopnowProducts(consultantId: string) {
    this.consultUsService.getShopNowProduct(consultantId).subscribe((res: any) => {
      let filterArr: any[] = [];
      res.data.products.map((prod: any) => {
        let productDiscount = Math.round(((prod.prodMRP - prod.prodMinPrice) / prod.prodMRP * 100));
        prod.discount = productDiscount;
        filterArr.push(prod);
      });
      this.shopNowProducts = filterArr;

    });
  }

  getRelatedHealthPackages(consultantId: string) {
    this.consultUsService.getConsultRelatedHealthPackage(consultantId).subscribe((res: any) => {
      this.relatedHealthPackages = res.data;
    });

  }
  getConsultantRelatedHealthTips(consultantId: string) {
    this.consultUsService.getConsultRelatedHealthTips(consultantId).subscribe((res: any) => {
      this.relatedHealthTips = res.data;
    });
  }


  ////////

  openModal() {
    this.renderer.addClass(this.detailsModal.nativeElement, 'show');
    this.renderer.setStyle(this.detailsModal.nativeElement, 'display', 'block');
  }

  closeModal() {
    this.renderer.removeClass(this.detailsModal.nativeElement, 'show');
    this.renderer.setStyle(this.detailsModal.nativeElement, 'display', 'none');
    this.router.navigate(["consult-us"])
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
      }, (error: any) => {
        this.toaster.error('Book only one consultation at a time');
      });
    } else {
      this.cartService.addToConsultCartForGuest(body).subscribe((res: any) => {
        localStorage.setItem('guestCheckoutCartId', res.data.cart._id);
        this.toaster.success('Consultant added in Cart');
      }, (error: any) => {
        this.toaster.error('Book only one consultation at a time');
      });
    }
    this.cartService.setCartState('consult');
  }
}
