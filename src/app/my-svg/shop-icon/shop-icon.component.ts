import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shop-icon',
  standalone: true,
  imports: [],
  templateUrl: './shop-icon.component.html',
  styleUrl: './shop-icon.component.scss'
})
export class ShopIconComponent {
  @Input() navigationValue: string;
}
