import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LifestyleTipCardComponent } from '../../../modules/lifestyle-tips/components/lifestyle-tip-card/lifestyle-tip-card.component';
import { SwiperComponent } from '../../../components/swiper/swiper.component';
register();

@Component({
  selector: 'app-life-style-health-card',
  standalone: true,
  imports: [CommonModule, RouterModule, LifestyleTipCardComponent, SwiperComponent,],
  templateUrl: './life-style-health-card.component.html',
  styleUrl: './life-style-health-card.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LifeStyleHealthCardComponent implements OnInit {
  @Input() seeAllUrl: string;
  @Input() productBrandTitle: string;
  @Input() recentTipsData: Array<any>;
  cloudImgUrl: string = environment.imageUrl;


  ngOnInit(): void {
  }

  constructor(private router: Router) { }

  redirectToLifestyleTipsDetails(titleName: any) {
    this.router.navigate(['lifestyle-tips', titleName]);
  }
}
