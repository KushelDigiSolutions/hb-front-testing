import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-prescribed-products',
  standalone: true,
  imports: [],
  templateUrl: './prescribed-products.component.html',
  styleUrl: './prescribed-products.component.scss'
})
export class PrescribedProductsComponent implements OnInit {
  recommendedProducts: any;
  imageUrl = environment.imageUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    @Inject(PLATFORM_ID) private platformId: any) { }

  ngOnInit(): void {
    this.recommendedProducts = this.data.data;
  }

  viewProduct(productData: any) {
    if (isPlatformBrowser(this.platformId)) {
      window.open(`product/${productData.slug}`);
    }
  }

}
