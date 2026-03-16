import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-package-icon',
  standalone: true,
  imports: [],
  templateUrl: './package-icon.component.html',
  styleUrl: './package-icon.component.scss'
})
export class PackageIconComponent {
  @Input() navigationValue: string;
}
