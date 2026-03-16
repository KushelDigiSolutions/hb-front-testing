import { Component, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-doctor-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './doctor-card.component.html',
  styleUrl: './doctor-card.component.scss'
})
export class DoctorCardComponent {
  imgUrl = environment.imageUrl;
  @Input() appointment: any;
  @Input() doctorDetail: any;

  joinCall(event: any, appt: any) {
    event.preventDefault()
    window.open(appt.event.link)
  }
}
