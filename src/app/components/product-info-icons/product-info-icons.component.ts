import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-info-icons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-info-icons.component.html',
  styleUrls: ['./product-info-icons.component.scss']
})
export class ProductInfoIconsComponent {}