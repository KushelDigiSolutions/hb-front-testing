import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';
import { MetasService } from '../../../../services/metas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDashboardService } from '../../../../services/user-dashboard.service';
import { ConsultUsService } from '../../../../modules/consult-us/services/consult-us.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { DomSanitizer } from '@angular/platform-browser';
import { PrescriptionComponent } from '../modal/prescription/prescription.component';
import { PrescribedProductsComponent } from '../modal/prescribed-products/prescribed-products.component';
import { UploadMedicalRecordComponent } from '../modal/upload-medical-record/upload-medical-record.component';
import { RemoveComponent } from '../modal/remove/remove.component';
import { DoctorCardComponent } from '../doctor-card/doctor-card.component';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [CommonModule, MatTabsModule, DoctorCardComponent],
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.scss'
})
export class AppointmentDetailComponent implements OnInit {
  @ViewChild("recommendedProducts") recommendedProducts: ElementRef;

  imgUrl = environment.imageUrl;
  appointmentId: string;
  appointmentDetail: any;
  pagination = {
    prescription: {
      page: 1,
      limit: 10
    },
    records: {
      page: 1,
      limit: 10
    }
  }
  page = 1;
  limit = 10;
  dialogRef: MatDialogRef<any>;
  addMedicalRecord: boolean = false;
  medicalRecordsCount = 0;
  medicalRecordList: Array<any> = [];
  prescriptionsCount = 0;
  prescriptionList: Array<any> = [];
  followUpAppointments: Array<any> = [];
  breadCrumbData: any = [
    {
      type: "profile",
      name: "Profile",
    },
    {
      type: "Dashboard",
      name: "My Account",
    },
  ];
  activeTab: number = 0;

  constructor(
    private meta: MetasService,
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: UserDashboardService,
    private consultUsService: ConsultUsService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog) { }


  ngOnInit(): void {
    this.meta.setMetaTags({ title: 'Appointment Detail' });
    // this.scriptLoader.load('html2pdf').catch(() => { });
    let { view } = this.route.snapshot.queryParams;
    if (view == "followUp") {
      this.activeTab = 1;
    } else if (view == "prescription") {
      this.activeTab = 2;
    }
    this.route.params.subscribe((res: any) => {
      console.log('res = ', res);

      this.appointmentId = res.id;
    });
    if (this.appointmentId) {

      this.getAppointmentDetail();
      this.getPrescriptionDetail();
      // this.getMedicalRecords();
      this.getFollowUpAppointments();
    }
  }

  getAppointmentDetail() {
    this.dashboardService.getAppointmentDetail(this.appointmentId).subscribe((res: any) => {
      console.log("this", this.appointmentDetail);
      let { data } = res;
      if (data) {
        let { primaryTimeSlot } = data;
        data.primaryTimeSlot12 = this.consultUsService.changeSlotFormatTo12(primaryTimeSlot);
        this.appointmentDetail = data;
      }
    },
      (err: HttpErrorResponse) => {
        this.router.navigate(["/"]);
      }
    );
  }

  getPrescriptionDetail() {
    let { page, limit } = this.pagination.prescription;
    let url = `?appointmentId=${this.appointmentId}&page=${page}&limit=${limit}`;
    console.log('url = ', url);

    this.dashboardService.getPrescriptionList(url).subscribe((res: any) => {

      this.prescriptionsCount = res.count;
      this.prescriptionList = [...this.prescriptionList, ...res.data.map((el: any) => {
        el._prescriptionHtml = this.sanitizer.bypassSecurityTrustHtml(el.prescriptionHtml);
        return el;
      })];
    }, (err: HttpErrorResponse) => {
      console.log("err", err)
    })
  }

  // loadPrescriptions() {
  //   this.pagination.prescription.page++;
  //   this.getPrescriptionDetail()
  // }

  // getMedicalRecords() {
  //   let { page, limit } = this.pagination.records;
  //   let url = `?appointmentId=${this.appointmentId}&page=${page}&limit=${limit}`;
  //   // this.spinner.show();
  //   this.dashboardService.getMedicalRecordList(url).subscribe((res: any) => {
  //     this.spinner.hide();
  //     this.medicalRecordsCount = res.count
  //     this.medicalRecordList = [...this.medicalRecordList, ...res.data];
  //   }, (err: HttpErrorResponse) => {
  //     this.spinner.hide();
  //     console.log("err", err);
  //   })
  // }

  // loadMoreRecords() {
  //   this.pagination.records.page++;
  //   this.getMedicalRecords();
  // }

  getFollowUpAppointments() {
    this.dashboardService.getFollowUpAppointments(this.appointmentId).subscribe((res: any) => {
      this.followUpAppointments = res.data.appointments.map((appt: any) => {
        let { primaryTimeSlot } = appt;
        appt.primaryTimeSlot12 = this.consultUsService.changeSlotFormatTo12(primaryTimeSlot);
        return appt;
      });
    }, (err: HttpErrorResponse) => {
      console.log("err", err);
    })
  }

  viewPrescription(data: any) {
    this.dialogRef = this.dialog.open(PrescriptionComponent, {
      width: "1200px",
      data,
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if (result == 'viewProducts') {
        this.openRecommendedProducts(data)
      }
    })
  }

  openRecommendedProducts(item: any) {

    this.dialogRef = this.dialog.open(PrescribedProductsComponent, {
      // maxHeight: "60vh",
      width: "750px",
      data: {
        data: item.medicines
      },
    });
  }

  loadPrescriptions() {
    this.pagination.prescription.page++;
    this.getPrescriptionDetail()
  }

  uploadMedicalRecord() {
    this.dialogRef = this.dialog.open(UploadMedicalRecordComponent, {
      maxHeight: "450px",
      width: "800px",
      data: {
        appointmentId: this.appointmentId
      }
    });

    this.dialogRef.afterClosed().subscribe((res) => {
      // this.spinner.show();
      if (res) {
        this.dashboardService.addMedicalRecord(res)
          .subscribe((res: any) => {
            // this.spinner.hide();
            this.pagination.records.page = 1;
            this.medicalRecordList = []
            this.getMedicalRecords();
          })
      } else {
        // this.spinner.hide();
      }
    }, (err: HttpErrorResponse) => {
      console.log("err", err);
    });

  }

  getMedicalRecords() {
    let { page, limit } = this.pagination.records;
    let url = `?appointmentId=${this.appointmentId}&page=${page}&limit=${limit}`;
    // this.spinner.show();
    this.dashboardService.getMedicalRecordList(url).subscribe((res: any) => {
      // this.spinner.hide();
      this.medicalRecordsCount = res.count
      this.medicalRecordList = [...this.medicalRecordList, ...res.data];
    }, (err: HttpErrorResponse) => {
      // this.spinner.hide();
      console.log("err", err);
    })
  }

  deleteMedicalRecord(id: string) {
    this.dialogRef = this.dialog.open(RemoveComponent, {
      maxHeight: "450px",
      width: "800px",
      data: {
        type: "appointment"
      },
    });

    this.dialogRef.afterClosed().subscribe((res) => {
      if (res == "yes") {
        this.dashboardService.removeMedicalRecord(id).subscribe((res: any) => {
          // this.toaster.success(res.message);
          this.pagination.records.page = 1;
          this.medicalRecordList = []
          this.getMedicalRecords();
        }, (err: HttpErrorResponse) => {

        })
      }
    });
  }

  loadMoreRecords() {
    this.pagination.records.page++;
    this.getMedicalRecords();
  }

  rescheduleAppointment(data: any) {
    // let check = this.dashboardService.canRescheduleTimeCheck(data.date);
    // if (!check) {
    //   return this.rescheduleTimeToastr()
    // }
    this.router.navigate([`/consult-us/doctor/${data.consultantId._id}/book`], {
      queryParams: {
        reschedule: true,
        appointmentId: this.appointmentId
      }
    });
  }
}
