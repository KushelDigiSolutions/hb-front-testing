import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-star-rating-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating-component.component.html',
  styleUrl: './star-rating-component.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StarRatingComponentComponent implements OnInit {
  @Input() rating: number;

  constructor() { }

  ngOnInit(): void {
  }
}
