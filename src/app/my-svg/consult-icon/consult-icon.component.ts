import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-consult-icon',
  standalone: true,
  imports: [],
  templateUrl: './consult-icon.component.html',
  styleUrl: './consult-icon.component.scss'
})
export class ConsultIconComponent {
  @Input() navigationValue: string;
}
