import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExpressService } from '../../../services/express.service';
import { MetasService } from '../../../services/metas.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-error-404',
  templateUrl: './error-404.component.html',
  styleUrls: ['./error-404.component.scss']
})
export class Error404Component implements OnInit {

  constructor(
    private expressService: ExpressService,
    private meta: MetasService,
  ) { }

  ngOnInit(): void {
    if (this.expressService.expressResponse) {
      this.expressService.expressResponse.status(404);
    }
    this.meta.setMetaTags({
      title: 'Page Not Found'
    })
  }

}
