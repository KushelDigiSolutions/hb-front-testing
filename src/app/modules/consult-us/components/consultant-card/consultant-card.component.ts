import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-consultant-card',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './consultant-card.component.html',
  styleUrl: './consultant-card.component.scss'
})
export class ConsultantCardComponent {

  @Input() data: any;
  @Output() book = new EventEmitter()

  cloudImageUrl = environment.imageUrl

  constructor(
    private router: Router,
    private cartService: CartService,
  ) { }

  preventNavigate(event: any) {
    event.stopPropagation()
    event.preventDefault()
  }

  addToCheckout(event: any, data: any) {
    this.preventNavigate(event)
    this.cartService.setCartState('consult')
    this.book.next(data)
  }

  redirectToConsultUsDetailsPage() {
    this.router.navigate(['/consult-us/doctor', this.data.slug]);
  }

}
