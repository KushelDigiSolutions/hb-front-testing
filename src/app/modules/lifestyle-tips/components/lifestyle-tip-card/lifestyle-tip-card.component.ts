import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-lifestyle-tip-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lifestyle-tip-card.component.html',
  styleUrl: './lifestyle-tip-card.component.scss'
})
export class LifestyleTipCardComponent {

  @Input() data: any

  cloudImgUrl: string = environment.imageUrl;

}
