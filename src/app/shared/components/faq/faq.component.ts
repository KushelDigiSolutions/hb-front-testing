import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { faqsList, shopList } from './faqs-list';
import { MetasService } from '../../../services/metas.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatTabsModule
  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {

  faqs = faqsList;
  shops = shopList;
  activeTab = 0;

  constructor(
    private metasService: MetasService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.metasService.setMetaTags({
      title: 'FAQ',
      description: 'Have some queries, doubts or confusion? Read our frequently asked questions, and resolve all your doubts in a few minutes. Click here to explore!'
    });

    this.route.queryParams.subscribe(({ view }) => {
      if (view == 'consultUs') {
        this.activeTab = 1
      } else {
        this.activeTab = 0
      }
    })

  }
}
