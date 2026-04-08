import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { MatCalendarCellClassFunction, MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { Subject, debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getFormatedDate, getTotalDaysInMonth, time24to12 } from '../../../../util/date.util';
import { HealthPackageService, HttpRequestParams } from '../../../../services/health-package.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConsultUsService } from '../../../../modules/consult-us/services/consult-us.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-health-package-subscription',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatDatepickerModule],

  templateUrl: './health-package-subscription.component.html',
  styleUrl: './health-package-subscription.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HealthPackageSubscriptionComponent implements OnInit {
  @ViewChild(MatDatepicker) picker: MatDatepicker<Date>;

  daysChangeSubject = new Subject<Date>()
  email: string = "support@healthybazar.com"

  imgBase = environment.imageUrl;
  selectedTabIndex = 0;
  list: any = [];
  selectedPackage: any;
  date = getFormatedDate(new Date());
  datePreview: string;
  // insightsCharts: InsightsChartData[] = [
  insightsCharts: any[] = [
    { title: 'SURVEY', chartData: [{ label: 'Completed', labelValue: 0, value: 0 }, { label: 'Total Surveys', labelValue: 0, value: 0 }] },
    { title: 'ALERTS', chartData: [{ label: 'Advice Followed', labelValue: 0, value: 0 }, { label: 'Advice Unfollowed', labelValue: 0, value: 0 }] },
    { title: 'APPOINTMENTS', chartData: [{ label: 'Completed', labelValue: 0, value: 0 }, { label: 'Total Appointments', labelValue: 0, value: 0 }] },
    { title: 'LAB TESTS', chartData: [{ label: 'Booked', labelValue: 0, value: 0 }, { label: 'Total Tests', labelValue: 0, value: 0 }] },
  ];
  notificationsObj: any = {};
  notifications: any[] = [];


  constructor(
    private healthPackagesService: HealthPackageService,
    private consultUsService: ConsultUsService,
    private config: NgSelectConfig
  ) { }

  ngOnInit(): void {
    // this.updateDatePreview();
    this.getList();
    // this.daysChangeSubject.pipe(debounceTime(200)).subscribe(this.onMonthChange.bind(this));
  }

  getList() {
    this.healthPackagesService.getSubscribedPackages().subscribe(res => {
      let { success, data } = res;
      if (success && data) {
        // data.forEach(healthPackage => {
        //   healthPackage.appointments = healthPackage.appointments.map((appt => {
        //     appt.slot = this.consultUsService.changeSlotFormatTo12(appt.primaryTimeSlot);
        //     return appt;
        //   }))
        // })
        this.list = data;
        this.onChangePackage(data[0])
      }
    }, (err: HttpErrorResponse) => {

    })
  }

  getSubscribedPackage(id: string) {
    this.healthPackagesService.getSubscribedPackage(id).subscribe(res => {
      let { success, data } = res;
      if (success && data) {
        this.selectedPackage = data;
        this.selectedPackage.appointments = this.selectedPackage.appointments.map(((appt: any) => {
          appt.slot = this.consultUsService.changeSlotFormatTo12(appt.primaryTimeSlot);
          return appt;
        }))

        let { usedAppointments, totalAppointments, testProducts, createdAt, expirayDate } = data,
          totalTests = testProducts.length,
          bookedTests = testProducts.filter((test: any) => test.diagnosticBookingId).length,
          insights = this.selectedPackage.insights;

        this.insightsCharts[0].chartData[0].value = insights.totalAnswers;
        this.insightsCharts[0].chartData[1].value = insights.totalSurveyNotifications - insights.totalAnswers;

        this.insightsCharts[0].chartData[0].labelValue = insights.totalAnswers;
        this.insightsCharts[0].chartData[1].labelValue = insights.totalSurveyNotifications;

        this.insightsCharts[1].chartData[0].value = insights.yesAnswers;
        this.insightsCharts[1].chartData[1].value = insights.noAnswers;

        this.insightsCharts[1].chartData[0].labelValue = insights.yesAnswers;
        this.insightsCharts[1].chartData[1].labelValue = insights.noAnswers;

        this.insightsCharts[2].chartData[0].value = usedAppointments;
        this.insightsCharts[2].chartData[1].value = totalAppointments - usedAppointments;

        this.insightsCharts[2].chartData[0].labelValue = usedAppointments;
        this.insightsCharts[2].chartData[1].labelValue = totalAppointments;

        this.insightsCharts[3].chartData[0].value = bookedTests;
        this.insightsCharts[3].chartData[1].value = totalTests - bookedTests;
        this.insightsCharts[3].chartData[0].labelValue = bookedTests;
        this.insightsCharts[3].chartData[1].labelValue = totalTests;

        let startDate = new Date(createdAt).getTime(),
          endDate = new Date(expirayDate).getTime(),
          totalTime = endDate - startDate,
          currentTime = new Date().getTime(),
          timePassed = endDate - currentTime,
          expirationProgress = 100 - timePassed / totalTime * 100;
        if (expirationProgress > 100) expirationProgress = 100;
        console.log({ expirationProgress });

        this.selectedPackage.expirationProgress = expirationProgress.toFixed(2)

        this.notificationsObj = {}
        this.date = getFormatedDate(new Date());
        this.onDateChange()
        this.getNotifications()
      }
    }, ((err: HttpRequestParams) => {
      console.log(err);
    }))
  }

  getNotifications(fromDate?: string, toDate?: string) {
    let date = new Date()

    date.setDate(1)
    fromDate = fromDate || getFormatedDate(date);

    date.setDate(getTotalDaysInMonth(date))
    toDate = toDate || getFormatedDate(date);

    if (this.notificationsObj[fromDate] && this.notificationsObj[toDate]) return;

    // this.spinner.show()
    this.healthPackagesService.getNotifications(this.selectedPackage._id, fromDate, toDate).subscribe(res => {
      // this.spinner.hide()
      console.log({ picker: this.picker });
      let { success, data } = res

      if (success) {
        this.notificationsObj = { ...this.notificationsObj, ...data };
        this.setNotifications()
      }
    }, (err: HttpErrorResponse) => {
      // this.spinner.hide()

    })
  }

  setNotifications() {
    let selectedDate = getFormatedDate(this.date)
    this.notifications = this.notificationsObj[selectedDate] || []
    console.log('notifications = ', this.notifications);

  }

  onChangePackage(event: any) {
    this.selectedPackage = null;
    if (event) {
      this.getSubscribedPackage(event._id);
    } else {
      this.selectedPackage = null;
    }
    return;
    this.selectedPackage = event;
    if (this.selectedPackage) {
      let { usedAppointments, totalAppointments, testProducts, createdAt, expirayDate } = this.selectedPackage,
        totalTests = testProducts.length,
        bookedTests = testProducts.filter((test: any) => test.diagnosticBookingId).length;

      this.insightsCharts[2].chartData[0].value = usedAppointments;
      this.insightsCharts[2].chartData[1].value = totalAppointments - usedAppointments;

      this.insightsCharts[2].chartData[0].labelValue = usedAppointments;
      this.insightsCharts[2].chartData[1].labelValue = totalAppointments;

      this.insightsCharts[3].chartData[0].value = bookedTests;
      this.insightsCharts[3].chartData[1].value = totalTests - bookedTests;
      this.insightsCharts[3].chartData[0].labelValue = bookedTests;
      this.insightsCharts[3].chartData[1].labelValue = totalTests;

      let startDate = new Date(createdAt).getTime(),
        endDate = new Date(expirayDate).getTime(),
        totalTime = endDate - startDate,
        currentTime = new Date().getTime(),
        timePassed = endDate - currentTime,
        expirationProgress = 100 - timePassed / totalTime * 100;
      if (expirationProgress > 100) expirationProgress = 100;
      console.log({ expirationProgress });

      this.selectedPackage.expirationProgress = expirationProgress.toFixed(2)

      this.notificationsObj = {}
      this.date = getFormatedDate(new Date());
      this.onDateChange()
      this.getNotifications()
    }
  }

  showDatePicker(picker: any) {
    console.log(picker);
    picker.open()
  }

  updateDatePreview() {
    this.datePreview = getFormatedDate(this.date, 'MMM DD, YYYY')
  }

  onDateChange() {
    this.updateDatePreview()
    this.setNotifications()
  }

  onMonthChange(date: Date) {
    date = new Date(date)
    let toDate = getFormatedDate(date)
    date.setDate(1)
    let fromDate = getFormatedDate(date)
    console.log({ fromDate, toDate });
    this.getNotifications(fromDate, toDate)
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      this.daysChangeSubject.next(cellDate)
      let haveNotifications = !!this.notificationsObj[getFormatedDate(cellDate)]?.length

      return haveNotifications ? 'highlightMatDate' : '';
    }

    return '';
  }

  onTabChange(event: any) {
    console.log(event);

  }

  format24to12(time: string) {
    return time24to12(time)
  }

  onClickNotification(noti: any) {
    let { notificationType } = noti
    switch (notificationType) {
      case 'medication': {
        window.open('/my-account/appointments/' + noti.data.appointmentId + '?view=prescription')
        break;
      }
    }
  }

  onSubmitSurvey(notification: any) {
    let { _id, userAnswer } = notification

    let data = {
      notificationId: _id,
      healthPackageBuyId: this.selectedPackage._id,
      answer: userAnswer == 'true',
      date: getFormatedDate(this.date)
    }

    // this.spinner.show()
    this.healthPackagesService.submitNotificationSurvey(data).subscribe(res => {
      // this.spinner.hide()
      // this.toastr.success('Answer submitted successfully')
      notification.survey = { answer: userAnswer == 'true' }
    }, ((err: HttpErrorResponse) => {
      // this.spinner.hide()
      // this.toastr.success(err.error?.message || 'Something went wrong!')
    }))
  }

}
