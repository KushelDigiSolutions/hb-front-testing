import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';
import { StarRatingComponentComponent } from '../star-rating-component/star-rating-component.component';


@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    StarRatingComponentComponent,
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReviewComponent {
  // @Input() proReview: any;
  maxRating: number = 5;
  // @Output() loadMoreReview = new EventEmitter();
  // page: number = 1;
  stars: number[] = [];

  @Input() data: any;
  @Input() type: string;
  @Output("reviews") reviewsEmitter = new EventEmitter<boolean>()

  imgUrl = environment.imageUrl;
  user: any;
  showReviewSection: boolean = false;
  canAddReview: boolean = false;

  reviewArray: any = [];
  reviewCount = 0;
  avgRating = 0;
  page = 1;
  limit = 3;

  isBrowser = false;

  constructor(
    private commonService: CommonService,
    private dialog: MatDialog,
    private toaster: ToastrService,
    // private sharedService: SharedService,
    private productservice: ProductService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) { }

  ngOnChanges(): void {
    this.stars = Array(this.maxRating).fill(0).map((_, i) => i + 1);
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId)
    this.user = this.commonService.getUser();
    if (this.isBrowser) {
      this.getReviews();
    }
  }

  getReviews() {
    // if (this.type == "Consultant") {
    //   let data = {
    //     page: this.page,
    //     limit: this.limit,
    //   }


    //   this.sharedService.getConsultantReview(this.data._id, data).subscribe((res: any) => {
    //     let { avgRating, userReview, canGiveReview, count, data } = res;

    //     this.showReviewSection = !!count || canGiveReview;
    //     this.canAddReview = canGiveReview && !userReview;

    //     if (userReview && this.page === 1) {
    //       this.reviewArray.push(userReview)
    //     }
    //     this.reviewArray = [...this.reviewArray, ...data];
    //     this.reviewCount = userReview ? count - 1 : count;
    //     this.avgRating = avgRating;
    //     this.reviewsEmitter.emit(!!this.showReviewSection);
    //   }, (err: HttpErrorResponse) => {

    //   })
    // }
    // if (this.type == "Product") {
    let data = {
      productId: this.data.parentProductId || this.data._id,
      page: this.page,
      limit: this.limit,
    }
    this.productservice.getProductReviews(data).subscribe((res: any) => {
      let { avgRating, userReview, canGiveReview, count, data } = res;
      this.showReviewSection = !!count || canGiveReview;
      this.canAddReview = canGiveReview && !userReview;

      if (userReview && this.page === 1) {
        this.reviewArray.push(userReview)
      }
      this.reviewArray = [...this.reviewArray, ...data];
      this.reviewCount = userReview ? count - 1 : count;

      this.avgRating = avgRating;
      this.reviewsEmitter.emit(!!this.showReviewSection);
    }, (err: HttpErrorResponse) => {

    })
    // }
  }

  // ratePoduct() {
  //   const dialogRef = this.dialog.open(RateProductModalComponent, {
  //     width: '550px',
  //     data: {
  //       data: this.data,
  //       type: this.type
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result && result.success) {
  //       this.toaster.success('Review submitted successfully');
  //       this.page = 1
  //       this.reviewArray = []
  //       this.reviewCount = 0;
  //       this.getReviews();
  //     }
  //   })
  // }

  onLoadMore() {
    if (this.reviewArray.length == this.reviewCount) {
      this.page = 1;
      this.reviewArray = [];
      this.reviewCount = 0;
      this.getReviews();
    } else {
      this.page++;
      this.getReviews()
    }
  }

  fromNow(date: string) {
    return moment(date).fromNow()
  }

}
