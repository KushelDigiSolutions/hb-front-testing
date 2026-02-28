import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import {VisitorCounterComponent} from '../../../components/visitor-counter/visitor-counter.component'
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, VisitorCounterComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})

export class FooterComponent implements OnInit {
  footerImage: any[];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getFooterImage();
  }

  getFooterImage() {
    this.productService.getFooterImages().subscribe((res: any) => {
      this.footerImage = res
    });
  }
}
