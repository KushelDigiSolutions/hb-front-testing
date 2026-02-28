import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { HealthPackageDetailsDeskComponent } from './health-package-details-desk/health-package-details-desk.component';
import { HealthPackageService } from '../../../../services/health-package.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { LifestyleTipsService } from '../../../../services/lifestyle-tips.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-health-package-details',
  standalone: true,
  imports: [CommonModule, HealthPackageDetailsDeskComponent],
  templateUrl: './health-package-details.component.html',
  styleUrl: './health-package-details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HealthPackageDetailsComponent implements OnInit, AfterViewInit {
  desktopScreen: boolean = true;
  healthPackageDetails: any;
  relatedHealthPackage: Array<any>;
  topConsultLists: Array<any>;
  relatedHealthTips: Array<any>;
  cloudImgUrl: string = environment.imageUrl;
  screenWidth: any;
  @ViewChild('detailsModal') detailsModal: ElementRef;
  isReadMore: boolean = true;

  constructor(private healthPackageService: HealthPackageService, private activatedRoute: ActivatedRoute, private productService: ProductService, private lifestyleTipsService: LifestyleTipsService, private renderer: Renderer2, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }
  showText() {
    this.isReadMore = !this.isReadMore
  }

  ngOnInit(): void {
    this.getPopularHealthPackageDetails();
    this.getRelatedHealthPackages();
    this.getTopSpecilistConsult();
    this.getRecentTips();
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

  getPopularHealthPackageDetails() {
    let slug: any = this.activatedRoute.snapshot.params;
    this.healthPackageService.getPopularHealthPackageDetails(slug.packageSlug).subscribe((res: any) => {
      let discount = Math.round(((res.data.price.mrp - res.data.price.sellingPrice) / res.data.price.mrp * 100));
      res.data.price.discount = discount;
      this.healthPackageDetails = res.data;
    });
  }

  getRelatedHealthPackages() {
    let slug: any = this.activatedRoute.snapshot.params;

    // this.healthPackageService.getRelatedHealthPackages(slug.packageSlug).subscribe((res: any) => {
    //   this.relatedHealthPackage = res.data

    // });

    this.healthPackageService.getRelatedHealthPackages(slug.packageSlug);
  }

  // getTopSpecilistConsult() {
  //   let slug: any = this.activatedRoute.snapshot.params;
  //   this.healthPackageService.getTopSpecilistConsult(slug.packageSlug).subscribe((res: any) => {
  //     this.topConsultant = res.data;
  //   });
  // }

  getTopSpecilistConsult() {
    this.productService.getTopSpecilistConsult({ page: 1, limit: 12 }).subscribe((res: any) => {
      this.topConsultLists = res.data;
    });
  }

  getRecentTips() {
    let payload: any = {
      page: 1,
      limit: 12,
      source: 'homepage',
      isPublished: true
    }
    this.lifestyleTipsService.getLifestyleRecentTips(payload).subscribe((res: any) => {
      this.relatedHealthTips = res.data;
    });
  }
  // modal //////////////////
  openModal() {
    this.renderer.addClass(this.detailsModal.nativeElement, 'show');
    this.renderer.setStyle(this.detailsModal.nativeElement, 'display', 'block');
  }

  closeModal() {
    this.renderer.removeClass(this.detailsModal.nativeElement, 'show');
    this.renderer.setStyle(this.detailsModal.nativeElement, 'display', 'none');
    this.router.navigate(["health-packages"])
  }
}
