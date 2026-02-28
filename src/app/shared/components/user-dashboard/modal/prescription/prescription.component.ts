import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PdfService } from '../../../../pdf.service';
import { getFormatedDate } from '../../../../../util/date.util';

@Component({
  selector: 'app-prescription',
  standalone: true,
  imports: [CommonModule, MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './prescription.component.html',
  styleUrl: './prescription.component.scss'
})
export class PrescriptionComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pdf: PdfService,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  downloadPrescription() {
    let { title, userId } = this.data;
    let username = '';
    if (userId) {
      username = userId.firstName + ' ' + (userId.lastName);
    }
    this.pdf.downloadPDF('#presCont', `${title}-${username}-${getFormatedDate(new Date, 'DD-MM-YYYY')}`);
  }

}
