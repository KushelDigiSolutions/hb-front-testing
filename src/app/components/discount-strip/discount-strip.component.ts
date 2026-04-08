import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-discount-strip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discount-strip.component.html',
  styleUrls: ['./discount-strip.component.scss'],
})
export class DiscountStripComponent implements OnInit, OnDestroy {
  showStrip = false;
  isVisible = false;
  private currentStripHeight = '32px'; // Dynamic height based on screen size

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Only run in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Set initial height based on screen size
      this.setStripHeight();

      // Listen for window resize events
      window.addEventListener('resize', this.handleResize.bind(this));

      // Show strip after page load (similar to 1mg)
      setTimeout(() => {
        this.showStrip = true;
        // Add slight delay for smooth animation
        setTimeout(() => {
          this.isVisible = true;
          this.adjustBodyPadding(true);
        }, 50);
      }, 1000); // Show after 1 second like 1mg
    }
  }

  ngOnDestroy() {
    // Clean up body padding when component is destroyed
    if (isPlatformBrowser(this.platformId)) {
      this.adjustBodyPadding(false);
      window.removeEventListener('resize', this.handleResize.bind(this));
    }
  }

  closeStrip() {
    this.isVisible = false;

    // Wait for animation to complete before hiding
    setTimeout(() => {
      this.showStrip = false;
      if (isPlatformBrowser(this.platformId)) {
        this.adjustBodyPadding(false);
      }
    }, 300);
  }

  private handleResize() {
    // Update strip height on resize
    this.setStripHeight();

    // Readjust body padding if strip is visible
    if (this.isVisible) {
      this.adjustBodyPadding(true);
    }
  }

  private setStripHeight() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const screenWidth = window.innerWidth;

    // Adjust height based on screen size
    if (screenWidth <= 480) {
      this.currentStripHeight = '24px';
    } else if (screenWidth <= 768) {
      this.currentStripHeight = '28px';
    } else if (screenWidth >= 1200) {
      this.currentStripHeight = '36px';
    } else {
      this.currentStripHeight = '32px';
    }

    // Handle landscape orientation on mobile
    if (screenWidth <= 768 && window.innerHeight < window.innerWidth) {
      this.currentStripHeight = '20px';
    }
  }

  private adjustBodyPadding(add: boolean) {
    // Only execute in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const body = document.body;

    // Find your specific navbar and navbar-upper-section
    const navbar = document.querySelector('.navbar') as HTMLElement;
    const navbarUpperSection = document.querySelector(
      '.navbar-upper-section'
    ) as HTMLElement;

    if (add) {
      // body.style.paddingTop = this.currentStripHeight;
      // body.style.transition = 'padding-top 0.3s ease';

      // Adjust navbar if it's fixed positioned
      if (navbar && this.isFixedElement(navbar)) {
        navbar.style.top = this.currentStripHeight;
        navbar.style.transition = 'top 0.3s ease';
      }

      // Also adjust navbar-upper-section if it's fixed (for mobile)
      if (navbarUpperSection && this.isFixedElement(navbarUpperSection)) {
        navbarUpperSection.style.top = this.currentStripHeight;
        navbarUpperSection.style.transition = 'top 0.3s ease';
      }
    } else {
      // body.style.paddingTop = '0';

      // Reset navbar position
      if (navbar && this.isFixedElement(navbar)) {
        navbar.style.top = '0';
      }

      // Reset navbar-upper-section position
      if (navbarUpperSection && this.isFixedElement(navbarUpperSection)) {
        navbarUpperSection.style.top = '0';
      }

      // Remove transition after animation completes
      setTimeout(() => {
        body.style.transition = '';
        if (navbar) {
          navbar.style.transition = '';
        }
        if (navbarUpperSection) {
          navbarUpperSection.style.transition = '';
        }
      }, 300);
    }
  }

  private isFixedElement(element: HTMLElement): boolean {
    const computedStyle = window.getComputedStyle(element);
    return (
      computedStyle.position === 'fixed' || computedStyle.position === 'sticky'
    );
  }
}
