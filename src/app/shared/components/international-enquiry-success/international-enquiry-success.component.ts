import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-international-enquiry-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './international-enquiry-success.component.html',
  styleUrl: './international-enquiry-success.component.scss',
})
export class InternationalEnquirySuccessComponent {
  refId: any;
  copied = false;
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log(params['refId']);
      this.refId = params['refId'];
    });
  }

  copyRef() {
    const text = this.refId || '';
    if (!text) {
      return;
    }

    // Use navigator.clipboard when available
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      navigator.clipboard.writeText
    ) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.showCopied();
        })
        .catch(() => {
          this.fallbackCopy(text);
        });
    } else {
      this.fallbackCopy(text);
    }
  }

  private fallbackCopy(text: string) {
    if (typeof document === 'undefined') {
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      this.showCopied();
    } catch (e) {
      // ignore
    }
    document.body.removeChild(textarea);
  }

  private showCopied() {
    this.copied = true;
    setTimeout(() => (this.copied = false), 1500);
  }

  constructor(private route: ActivatedRoute) {}
}
