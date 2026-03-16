import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { ConsultTopSpecialistsComponent } from '../../../../shop/components/consult-top-specialists/consult-top-specialists.component';
import { ProductSliderComponent } from '../../../../../components/product-slider/product-slider.component';
import { AffordableHealthPackagesComponent } from '../../../../shop/components/Affordable-Health-Packages/affordable-health-packages.component';
import { LifeStyleHealthCardComponent } from '../../../../../shared/components/life-style-health-card/life-style-health-card.component';
import { CartService } from '../../../../../services/cart.service';
import { CommonService } from '../../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbComponent, BreadcrumbData } from '../../../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-consult-us-details-desk',
  standalone: true,
  imports: [CommonModule, ConsultTopSpecialistsComponent, ProductSliderComponent, AffordableHealthPackagesComponent, LifeStyleHealthCardComponent, BreadcrumbComponent],
  templateUrl: './consult-us-details-desk.component.html',
  styleUrl: './consult-us-details-desk.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConsultUsDetailsDeskComponent implements OnChanges {
  cloudImgUrl: string = environment.imageUrl;
  @Input() consultant: any;
  @Input() ConsultantRelatedConsultants: any
  @Input() shopNowProduct: Array<any>
  @Input() healthPackages: Array<any>
  @Input() recentTipsData: Array<any>
  isReadMore: boolean = true;
  breadcrumb: BreadcrumbData[] = [];
  constructor(private cartService: CartService,
    private commonService: CommonService,
    private toaster: ToastrService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log('consultant = 38', this.consultant);

    const { firstName, consultantType }: any = changes['consultant']?.currentValue || {};
    let _breadcrumb: BreadcrumbData[] = []
    if (consultantType?.length) {
      const { name, slug } = consultantType[0];
      _breadcrumb.push({ title: name, url: '/consult-us/' + slug })
    }
    let title = firstName;
    _breadcrumb.push({ title });
    this.breadcrumb = _breadcrumb
  }
  showText() {
    this.isReadMore = !this.isReadMore
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
        this.cartService.openDirectCart(true);
      }, error => {
        this.toaster.error('Book only one consultation at a time');
      });
    } else {
      this.cartService.addToConsultCartForGuest(body).subscribe((res: any) => {
        localStorage.setItem('guestCheckoutCartId', res.data.cart._id);
        this.toaster.success('Consultant added in Cart');
        this.cartService.openDirectCart(true);
      }, error => {
        this.toaster.error('Book only one consultation at a time');
      });
    }
    this.cartService.setCartState('consult');
  }

}
