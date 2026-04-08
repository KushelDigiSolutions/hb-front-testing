import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { getFormatedDate } from '../../../../../util/date.util';
import { CartService } from '../../../../../services/cart.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalsService } from '../modals.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'app-upload-medical-record',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-medical-record.component.html',
  styleUrl: './upload-medical-record.component.scss'
})
export class UploadMedicalRecordComponent {
  // file: File;
  file: any;
  filePath: any;
  addMedicalRecord: boolean = false;
  title: string;


  constructor(private sanitizer: DomSanitizer,
    private cartService: CartService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modalService: ModalsService,
    private dialogRef: MatDialogRef<any>,
    private commonService: CommonService

  ) { }

  PhotoUpload(event: any) {
    this.file = event.target.files[0];
    if (this.file && ["image/jpeg", "image/png"].includes(this.file.type)) {
      let fileToUpload: any = URL.createObjectURL(this.file);
      fileToUpload = this.sanitizeImageUrl(fileToUpload);
      this.filePath = fileToUpload ? fileToUpload : this.filePath;
      this.addMedicalRecord = true;
    } else if (this.file && ["application/pdf"].includes(this.file.type)) {
      let fileToUpload: any = URL.createObjectURL(this.file);
      fileToUpload = this.sanitizeImageUrl(fileToUpload);
      this.filePath = fileToUpload ? fileToUpload : this.filePath;
      this.addMedicalRecord = true;
    } else {
      // this.file && this.toastr.error('Unsupported file format')
      this.addMedicalRecord = false
      this.file = null;
    }
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  uploadMedicalRecord() {
    // this.spinner.show();
    let date: any = new Date();
    date = getFormatedDate(date, 'YYYY-MM-DD');
    let user = this.commonService.getUser();
    // let user = this.cartService.getUser();

    if (this.data.type == "Product") {
      this.modalService.fileUpload([this.file], 'requiredPrescriptions')
        .subscribe((res: any) => {
          console.log("res", res);
        }, (err: HttpErrorResponse) => { })
    } else {
      this.modalService.fileUpload([this.file], '')
        .subscribe((res: any) => {
          const data = {
            userId: user.user._id,
            description: this.title,
            attachment: res.data[0],
            dateTime: date,
            appointmentId: this.data.appointmentId,
            by: "Patient",
          };
          // this.spinner.hide();
          this.dialogRef.close(data);
        }, (err: HttpErrorResponse) => { })
    }
  }
}
