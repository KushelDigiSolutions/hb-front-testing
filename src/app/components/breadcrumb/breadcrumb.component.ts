import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';

export type BreadcrumbData = {
  title: string,
  url?: string
  urlForSchema?: string
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent implements OnChanges {
  @Input() data: BreadcrumbData[] = []

  breadcrumb: BreadcrumbData[] = []

  ngOnChanges(changes: SimpleChanges): void {
    var _breadcrumb: BreadcrumbData[] = []
    _breadcrumb.push({ title: 'Home', url: '/' })
    _breadcrumb = _breadcrumb.concat(changes['data'].currentValue)
    this.breadcrumb = _breadcrumb
    console.log('final bread', this.breadcrumb)
  }

}
