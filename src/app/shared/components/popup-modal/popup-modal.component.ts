import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.scss']
})
export class PopupModalComponent implements OnInit {
  isVisible = false;
  isAnimatingOut = false;

  readonly whatsappUrl =
    'https://wa.me/9119008008?text=Hi%2C%20I%20want%20to%20place%20an%20order.%20Here%20are%20my%20details%3A%0AProduct%20Name(s)%3A%0AQuantity%3A%0AFull%20Address%3A%0AContact%20Number%3A';

  ngOnInit(): void {
    // Slight delay so modal appears after page paints
    setTimeout(() => {
      this.isVisible = true;
    }, 600);
  }

  closeModal(): void {
    this.isAnimatingOut = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isAnimatingOut = false;
    }, 280);
  }

  // Close when clicking the overlay backdrop
  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  // Close on Escape key
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isVisible) {
      this.closeModal();
    }
  }
}