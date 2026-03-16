import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserDashboardService } from '../../../../services/user-dashboard.service';
import { environment } from '../../../../../environments/environment';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CancelAppointmentComponent } from '../cancel-appointment/cancel-appointment.component';
import { MetasService } from '../../../../services/metas.service';
import { ConsultUsService } from '../../../../modules/consult-us/services/consult-us.service';

@Component({
  selector: 'app-user-appoinments',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    CancelAppointmentComponent,
  ],
  templateUrl: './user-appoinments.component.html',
  styleUrl: './user-appoinments.component.scss',
})
export class UserAppoinmentsComponent implements OnInit {
  imgUrl = environment.imageUrl;
  appointmentUrl = {
    page: 1,
    limit: 10,
  };
  dataArray: any = [];
  nextLoading = false;
  count = 0;
  dialogRef: MatDialogRef<any>;
  constructor(
    private userdashboardService: UserDashboardService,
    private router: Router,
    private dialog: MatDialog,
    private meta: MetasService,
    private consultUsService: ConsultUsService,
  ) {}

  ngOnInit(): void {
    this.meta.setMetaTags({ title: 'My Appointments' });
    this.getAppointments();
  }

  getAppointments() {
    this.userdashboardService
      .getAppointments(JSON.stringify(this.appointmentUrl))
      .toPromise()
      .then((res: any) => {
        if (res.data) {
          res.data.appointments.forEach((el: any) => {
            let { primaryTimeSlot } = el;
            el.primaryTimeSlot12 =
              this.consultUsService.changeSlotFormatTo12(primaryTimeSlot);
          });
          this.dataArray.push(...res.data.appointments);
          console.log('this.dataArray 46 = ', this.dataArray);

          this.count = res.data.noOfAppointments;
          this.nextLoading = false;
        }
      })
      .catch((err: any) => {
        this.nextLoading = false;
      });
  }

  viewAppt(appt: any) {
    console.log('appt = ', appt);
    let queryParams = appt._id ? { view: 'followUp' } : {};
    console.log('queryParams 57 = ', queryParams);
    this.router.navigate(
      ['my-account', 'appointments', appt.parentAppointmentId || appt._id],
      { queryParams },
    );
  }

  joinCall(event: any, appt: any) {
    event.preventDefault();
    window.open(appt.event.link);
  }

  cancelAppointment(id: string) {
    let index = this.dataArray.findIndex((el: any) => el._id == id);
    this.dialogRef = this.dialog.open(CancelAppointmentComponent, {
      maxHeight: '450px',
      width: '800px',
      data: {
        type: 'appointment',
        _id: id,
      },
    });

    this.dialogRef.afterClosed().subscribe((res) => {
      if (res == 'yes') {
        this.dataArray[index].status = 'Cancelled';
        this.dataArray[index].canCancel = false;
      }
    });
  }

  loadMore() {
    if (!this.nextLoading) {
      if (this.count > this.dataArray.length) {
        this.nextLoading = true;
        this.appointmentUrl.page += 1;
        this.appointmentUrl.limit = 10;
        this.getAppointments();
      }
    }
  }
}
