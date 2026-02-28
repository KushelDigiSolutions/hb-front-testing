import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { UserDashboardService } from '../../../../services/user-dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { status } from './data';
// import { SlickCarouselModule } from 'ngx-slick-carousel';
import { environment } from '../../../../../environments/environment';
import * as $ from 'jquery';
import { MetasService } from '../../../../services/metas.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule,],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserOrdersComponent implements OnInit {

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number;
  orders: any[] = [];
  totalPages: number; // Define totalPages property
  showOrderDetail = false;
  activeOrderIndex = null;
  statusMapping = <any>status;
  showNoOrderFound: boolean = false;
  nextLoading = false;
  count = 0;
  imgUrl: string = environment.imageUrl;
  slideConfig = {
    "slidesToShow": 2,
    "slidesToScroll": 1,
    "infinite": true,
    "autoplay": true,
    "draggable": true,
    "autoplaySpeed": 2000,
    "arrows": true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  constructor(private userDashboardService: UserDashboardService, private meta: MetasService,) { }

  ngOnInit(): void {
    this.meta.setMetaTags({ title: 'My Orders' });
    this.getOrders();
  }

  getOrders() {
    this.userDashboardService.getOrderDetails(this.currentPage, this.itemsPerPage).subscribe((res: any) => {
      this.totalItems = res.data.count;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      // this.spinner.hide();
      if (res.data.orders) {
        let dayMilliSec = 86400000;
        let currentTime = new Date().getTime();
        res.data.orders.forEach((el: any) => {
          let createdAt = new Date(el.createdAt).getTime();
          el.cancelable = createdAt + dayMilliSec > currentTime;
        });
        this.orders = res.data.orders;

        this.showNoOrderFound = !this.orders.length;
        this.count = res.data.count;
        this.nextLoading = false;
      }
    }, err => {
      this.nextLoading = false;
      // this.spinner.hide();
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getOrders();
    }
  }

  getPageNumbers(): number[] {
    const totalPages = this.totalPages;
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

  showOrderDetailofItem(index: any) {
    this.activeOrderIndex == index
      ? (this.activeOrderIndex = null, this.showOrderDetail = false)
      : (this.activeOrderIndex = index, this.showOrderDetail = true);
  }

}
