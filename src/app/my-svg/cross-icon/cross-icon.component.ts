import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cross-icon',
  standalone: true,
  imports: [],
  templateUrl: './cross-icon.component.html',
  styleUrl: './cross-icon.component.scss'
})
export class CrossIconComponent {
  @Input() navigationValue: string;
}
