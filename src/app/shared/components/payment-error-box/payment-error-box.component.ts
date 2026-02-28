import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-payment-error-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-error-box.component.html',
  styleUrl: './payment-error-box.component.scss'
})
export class PaymentErrorBoxComponent {
  @Input() data: { resultMsg: string, resultCode: string };
  @Output() close = new EventEmitter();

  onClose() {
    this.close.emit();
  }
}
