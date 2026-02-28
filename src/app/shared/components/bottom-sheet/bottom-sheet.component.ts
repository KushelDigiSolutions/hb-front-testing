import { CommonModule, Location } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ProductDetailsDeskComponent } from '../../../modules/shop/pages/product-details/product-details-desk/product-details-desk.component';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  imports: [
    CommonModule,
    ProductDetailsDeskComponent,
  ],

  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BottomSheetComponent implements OnInit {

  @ViewChild('detailsModal') detailsModal: ElementRef;

  private _bottomSheetRef = inject<MatBottomSheetRef<BottomSheetComponent>>(MatBottomSheetRef);

  cloudImgUrl: string = environment.imageUrl;
  // @Input() productDetails: any;
  productDetails: any;
  isShowCartProductCount = false;
  selectedProductVariety: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { slug: string }
  ) {
    // this.productService.getBottomSheet().subscribe((value: any) => {
    //   this.productDetails = value.data
    // });
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        this.close()
      }
    });
    this._bottomSheetRef.afterDismissed().subscribe(value => {
      console.log('[_bottomSheetRef]', value)
    })
  }

  close() {
    this._bottomSheetRef.dismiss()
  }

  onClose() {
    this._location.back()
    this.close()
  }


}
