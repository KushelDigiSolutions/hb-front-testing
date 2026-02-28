import { Component, OnInit } from '@angular/core';
import { MetasService } from '../../../services/metas.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit {
  constructor(
    private metaService: MetasService,
  ) { }
  ngOnInit(): void {
  this.metaService.setHomeAndAboutUsSchema();
  }

}
