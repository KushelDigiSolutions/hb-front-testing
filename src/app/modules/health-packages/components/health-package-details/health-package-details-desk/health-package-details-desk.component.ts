import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardComponent } from '../../../../../components/card/card.component';
import { environment } from '../../../../../../environments/environment';
import { ConsultTopSpecialistsComponent } from '../../../../shop/components/consult-top-specialists/consult-top-specialists.component';
import { AffordableHealthPackagesComponent } from '../../../../shop/components/Affordable-Health-Packages/affordable-health-packages.component';
import { LifeStyleHealthCardComponent } from '../../../../../shared/components/life-style-health-card/life-style-health-card.component';

@Component({
  selector: 'app-health-package-details-desk',
  standalone: true,
  imports: [CommonModule, CardComponent, ConsultTopSpecialistsComponent, AffordableHealthPackagesComponent, LifeStyleHealthCardComponent],
  templateUrl: './health-package-details-desk.component.html',
  styleUrl: './health-package-details-desk.component.scss'
})
export class HealthPackageDetailsDeskComponent {
  cloudImgUrl: string = environment.imageUrl;
  @Input() popularHealthPackageDetail: any;
  @Input() consultList: any;
  @Input() recentTipsData: any;
  isReadMore: boolean = true;

  showText() {
    this.isReadMore = !this.isReadMore
  }

}
