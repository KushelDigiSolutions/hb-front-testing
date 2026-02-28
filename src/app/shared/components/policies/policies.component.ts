import { Component } from '@angular/core';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.scss'
})
export class PoliciesComponent {
  supportEmail: string = "support@healthybazar.com";
  specialChar: string = "@";

}
