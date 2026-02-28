import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-product-skeleton',
  standalone: true,
  imports: [NgxSkeletonLoaderModule],
  templateUrl: './product-skeleton.component.html',
  styleUrl: './product-skeleton.component.scss'
})
export class ProductSkeletonComponent {

}
