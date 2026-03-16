import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  standalone: true,
  selector: 'app-spinner',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  show: boolean = false;

  constructor(
    private spinner: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.getObserver().subscribe(value => {
      this.show = value;
    });
  }

}
