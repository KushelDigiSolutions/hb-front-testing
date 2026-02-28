import { Component, ViewChild,ElementRef, AfterViewInit, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-visitor-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitor-counter.component.html',
  styleUrls: ['./visitor-counter.component.scss']
})
export class VisitorCounterComponent implements OnInit {
  stats = [
    { label: 'Monthly Visits', endValue: 50000, current: 1000, suffix: '+' },
    { label: 'Health Products', endValue: 5000, current: 100, suffix: '+' },
    { label: 'Orders Fulfilled', endValue: 150000, current: 15000, suffix: '+' },
    { label: 'Customer Rating', endValue: 4.4, current: 0, suffix: '★', decimal: true }
  ];

  observer!: IntersectionObserver;

  ngOnInit() {
    this.setupObserver();
  }

  setupObserver() {
    const options = { threshold: 0.5 };
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startCount();
          this.observer.disconnect();
        }
      });
    }, options);

    const section = document.querySelector('#stats-section');
    if (section) this.observer.observe(section);
  }

  startCount() {
    this.stats.forEach((stat, index) => {
      const interval = setInterval(() => {
        if (stat.decimal) {
          stat.current = +(stat.current + 0.1).toFixed(1);
          if (stat.current >= stat.endValue) {
            stat.current = stat.endValue;
            clearInterval(interval);
          }
        } else {
          stat.current += Math.ceil(stat.endValue / 100);
          if (stat.current >= stat.endValue) {
            stat.current = stat.endValue;
            clearInterval(interval);
          }
        }
      }, 30);
    });
  }
}