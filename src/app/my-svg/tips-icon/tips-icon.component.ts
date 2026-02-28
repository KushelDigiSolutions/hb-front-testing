import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tips-icon',
  standalone: true,
  imports: [],
  templateUrl: './tips-icon.component.html',
  styleUrl: './tips-icon.component.scss'
})
export class TipsIconComponent {
  @Input() navigationValue: string;
}
