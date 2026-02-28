import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CardComponent } from '../../../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop-health-concern',
  standalone: true,
  imports: [CardComponent, CommonModule, RouterLink,],
  templateUrl: './shop-health-concern.component.html',
  styleUrl: './shop-health-concern.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShopHealthConcernComponent {
  @Input() shopByConcern: any;
  cloudeImagePath: any = environment.imageUrl;
}
