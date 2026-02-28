import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserDashboardService } from '../../../../services/user-dashboard.service';

@Component({
  selector: 'app-cancel-appointment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancel-appointment.component.html',
  styleUrl: './cancel-appointment.component.scss'
})
export class CancelAppointmentComponent implements OnInit {

  id: string;
  type: any;
  submitting = false

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<any>,
    private dashboardService: UserDashboardService,
    private toastr: ToastrService,
  ) {
    this.id = data._id;
    this.type = data.type;
  }

  ngOnInit(): void { }

  cancelAppointment(value: string) {
    if (value == 'yes') {
      if (this.type == 'appointment') {
        // this.spinner.show();
        this.submitting = true
        this.dashboardService.cancelAppointment({ _id: this.id }).subscribe((res: any) => {
          this.submitting = false
          this.dialogRef.close('yes');
          this.toastr.success(res.message);
        }, (err: any) => {
          this.submitting = false
          this.toastr.error('try again later', 'Something went wrong!');
        });
      } else if (this.type == 'order') {
        // this.spinner.show();
        // this.apiService.cancelOrder({ _id: this.id }).subscribe((res: any) => {
        //   this.spinner.hide();
        //   this.dialogRef.close('yes');
        //   this.toastr.success(res.message)
        // }, (err: any) => {
        //   this.spinner.hide();
        //   this.toastr.error('try again later', 'Something went wrong!');
        // });
      } else this.dialogRef.close('yes');
    } else {
      this.dialogRef.close('no');
    }
  }
}
