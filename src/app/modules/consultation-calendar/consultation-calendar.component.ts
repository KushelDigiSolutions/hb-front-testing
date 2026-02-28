import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetasService } from '../../services/metas.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DateSlotSelectorComponent } from '../date-slot-selector/date-slot-selector.component';
import { CartService } from '../../services/cart.service';
import { getFormatedDate, time24to12 } from '../../util/date.util';
import { CheckoutProduct, ConsultationCalendarService } from '../../services/consultation-calendar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConsultUsService, CreateAppointmentData } from '../consult-us/services/consult-us.service';
import { CheckoutService } from '../../shared/components/checkout/checkout.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';


interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  isBooked: boolean;
  _id: string;
  startTime12: string;
  endTime12: string;
  label: string;
}
export interface PriceDetailContainerData {
  isGiftable?: boolean,
  giftOptions?: {
    charges: number
  },
  itemsCount: number,
  shippingCharge?: number,
  totalAmount: number,
  totalPayableAmt: number,
  discount: number,
  couponDiscount?: number,
  products?: any[],
  consultantId?: string,
}

@Component({
  selector: 'app-consultation-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DateSlotSelectorComponent, RouterModule],
  templateUrl: './consultation-calendar.component.html',
  styleUrl: './consultation-calendar.component.scss'
})

export class ConsultationCalendarComponent implements OnInit {
  gtag: any;
  step: 'calendar' | 'mode' = 'calendar';
  selectedDate: Date;
  minDate: Date;
  maxDate: Date;

  timeSlots: any = [];
  availableTimeSlots = [];
  selectedSlot: any;
  pdcData: PriceDetailContainerData;
  enableContineu: any;

  consultantDetails: any;
  consultantId: string;
  consultantSlug: string;

  startDate: any;
  endDate: any;

  rescheduler: boolean = false;
  appointmentId: string;
  parentAppointmentId: string;
  isFreeReschedule = true;
  freeWithinDays = 0;
  modeFG = this.fb.group({
    appointmentMode: ['', Validators.required],
  })

  isHealthPackagePurchased = false;
  healthPackageBuyId: string;
  @Input() consultantIdSlug: string;

  //selected appointment slot
  @Output() selectedAppointmentSlot = new EventEmitter();


  constructor(
    private fb: FormBuilder,
    private metaService: MetasService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private calendarService: ConsultationCalendarService,
    private consultUsService: ConsultUsService,
    private checkoutService: CheckoutService,
    private toaster: ToastrService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {

    this.metaService.setMetaTags({
      title: 'Book Consultation'
    })
    // this.consultantSlug = this.route.snapshot.params["id"];
    let { paymentFor, healthPackageBuyId } = this.route.snapshot.queryParams;
    this.isHealthPackagePurchased = !!paymentFor;
    this.healthPackageBuyId = healthPackageBuyId;

    this.route.queryParams.subscribe((res: any) => {
      if (res.reschedule) {
        this.rescheduler = JSON.parse(res.reschedule);
        this.appointmentId = res.appointmentId;
        this.parentAppointmentId = res.parentAppointmentId;
      }
      if (res.step == 'mode') {
        if (!this.selectedSlot) {
          this.router.navigate([], { relativeTo: this.route, queryParams: { step: 'calendar' }, queryParamsHandling: 'merge', replaceUrl: true })
        } else {
          this.step = res.step
        }
      } else {
        this.step = "calendar"
      }
    });

    this.getConsultant();
    this.setMinDate();
    this.setMaxDate();
  }


  setPdcData(data: any) {
    this.pdcData = {
      totalAmount: 0,
      totalPayableAmt: 0,
      discount: 0,
      giftOptions: null,
      isGiftable: false,
      itemsCount: 1,
      shippingCharge: 0,
      ...data
    }
  }

  getConsultant() {

    this.consultUsService.getConsultantDetails(this.consultantIdSlug).subscribe(
      (res: any) => {
        let { data } = res;
        if (data) {
          this.consultantDetails = data;
          this.consultantId = data._id;

          let { firstName, lastName, designation } = data
          let title = [];
          let name = ((firstName || '') + ' ' + (lastName || '')).trim();
          if (!name) {
            name = 'HB Consultant'
          }
          title.push(name)
          designation && title.push(designation);
          this.metaService.setMetaTags({
            title: 'Book Consultation with ' + title.join(' - ')
          })

          if (this.gtag) {
            this.gtag('event', "begin_consultation_booking", {
              userId: this.commonService.getUser()?.user?._id || null,
              // userId: this.cartService.getUser()?.user?._id || null,
              consultantId: data._id,
              consultantName: name,
            })
          }

          this.getAvailableTimeSlot();
          let amount = this.rescheduler ? 0 : data.fee;
          this.setPdcData({ totalAmount: amount, totalPayableAmt: amount })
          if (this.healthPackageBuyId) {
            this.setPdcData({ totalAmount: amount, totalPayableAmt: 0, discount: amount })
          }
        }
      },
      (err: any) => { }
    );
  }

  getAvailableTimeSlot(date: Date | string = new Date()) {

    this.startDate = getFormatedDate(date, "YYYY-MM-DD");
    // this.endDate = new Date(date).setDate(date.getDate() + 6);
    // this.endDate = getFormatedDate(this.endDate, "YYYY-MM-DD");
    // this.spinner.show();
    this.calendarService.getAvailableTimeSlots(
      this.consultantId,
      this.startDate
    ).subscribe(
      (res: any) => {
        let { slots } = res.data;

        slots = slots.map((slot: any) => {
          slot.startTime12 = time24to12(slot.startTime);
          slot.endTime12 = time24to12(slot.endTime);
          slot.label = slot.startTime12;
          return slot;
        });
        const morningSlots: TimeSlot[] = [];
        const noonSlots: TimeSlot[] = [];
        const eveningSlots: TimeSlot[] = [];

        slots.forEach((slot: any) => {
          const startHour = parseInt(slot.startTime.split(':')[0], 10);

          if (startHour >= 6 && startHour < 12) {
            morningSlots.push(slot);
          } else if (startHour >= 12 && startHour < 18) {
            noonSlots.push(slot);
          } else if (startHour >= 18 && startHour < 24) {
            eveningSlots.push(slot);
          }
        });

        const sortedSlots: any = [
          {
            'time': 'MORNING',
            'timeSlots': morningSlots
          },
          {
            'time': 'NOON',
            'timeSlots': noonSlots
          },
          {
            'time': 'EVENING',
            'timeSlots': eveningSlots
          },
        ]

        this.availableTimeSlots = sortedSlots;
      },
      (err: HttpErrorResponse) => {
        // this.spinner.hide();
      }
    );
  }

  setMinDate() {
    let date = new Date();
    this.minDate = date;
    this.selectedDate = date;
    this.selectedSlot = null;
    // this.onChangeDate(this.minDate);
  }

  setMaxDate() {
    let date = new Date()
    date.setMonth(date.getMonth() + 3)
    this.maxDate = date;
  }

  onChangeDate(selectedDate: any) {
    this.selectedDate = selectedDate;
    this.selectedSlot = null;

    // let selectedTimeSlot = this.timeSlots.find((el: any) => {
    //   return (
    //     getFormatedDate(el.date, "YYYY-MM-DD") ==
    //     getFormatedDate(selectedDate, "YYYY-MM-DD")
    //   );
    // });
    // 
    // this.availableTimeSlots = selectedTimeSlot.slots;

    this.getAvailableTimeSlot(selectedDate);
  }

  fetchTimeSlot(date: any) {
    let selectedSlot = this.timeSlots.find((el: any) => {
      return (
        getFormatedDate(el.date, "YYYY-MM-DD") ==
        getFormatedDate(date, "YYYY-MM-DD")
      );
    });
    return selectedSlot;
  }

  onSelectSlot(slot: any) {
    this.selectedSlot = slot;
    if (this.parentAppointmentId) {
      // this.spinner.show();
      this.calendarService
        .isFreeFollowUp(
          this.parentAppointmentId,
          getFormatedDate(this.selectedDate)
        )
        .subscribe(
          (res: any) => {
            // this.spinner.hide();
            let { data } = res;
            let fee = 0;
            this.isFreeReschedule = data.isFree;
            this.freeWithinDays = data.freeWithinDays;
            if (!data.isFree) {
              fee = this.consultantDetails.fee;
            }
            this.setPdcData({ totalAmount: fee, totalPayableAmt: fee });
          },
          (err: HttpErrorResponse) => {
            // this.spinner.hide();
          }
        );
    }
  }

  onContinue() {
    if (!this.rescheduler) {
      if (this.gtag) {
        const { _id, firstName, lastName } = this.consultantDetails;

        let name = ((firstName || '') + ' ' + (lastName || '')).trim();
        if (!name) {
          name = 'HB Consultant'
        }
        this.gtag('event', "consultation_slot_selected", {
          userId: this.commonService.getUser()?.user?._id || null,
          // userId: this.cartService.getUser()?.user?._id || null,
          consultantId: _id,
          consultantName: name,
          date: getFormatedDate(this.selectedDate),
          time: this.selectedSlot.label
        })
      }

      this.step = 'mode'
      // this.router.navigate(['/calender'], { relativeTo: this.route, queryParams: { step: 'mode' }, queryParamsHandling: 'merge' })
    }
    else {
      // let userConsultationSlot = slo
      this.onConfirm()
    }

  }

  onConfirm() {
    let slot = this.selectedSlot;
    // let slotDate = this.selectedDate;
    let slotObj = {
      'slot': this.selectedSlot,
      'slotDate': this.selectedDate,
    }
    this.selectedAppointmentSlot.emit(slotObj);

    let appointmentMode: any = this.modeFG.value;

    let data: CheckoutProduct = {
      checkoutFor: "appointment",
      appointment: {
        consultantId: this.consultantId,
        consultantSlug: this.consultantIdSlug,
        date: getFormatedDate(this.selectedDate, "YYYY-MM-DD"),
        primaryTimeSlot: slot.startTime + " - " + slot.endTime,
        fee: this.pdcData.totalAmount,
        startTime12: slot.startTime12,
        endTime12: slot.endTime12,
        appointmentMode,
      },

    };
    if (this.rescheduler) {
      // this.spinner.show();
      let rescheduledData: any = {
        date: getFormatedDate(this.selectedDate, "YYYY-MM-DD"),
        primaryTimeSlot: slot.startTime + " - " + slot.endTime,
        _id: this.appointmentId,
      };
      if (!this.isFreeReschedule) {
        rescheduledData.fee = this.consultantDetails.fee;
        rescheduledData.paymentType = "";
      }

      this.calendarService.rescheduleAppointment(rescheduledData).subscribe(
        (res: any) => {
          // this.spinner.hide();
          this.toaster.success(res.message);
          this.router.navigate(
            [
              "my-account",
              "appointments",
              this.parentAppointmentId || this.appointmentId,
            ],
            {
              queryParams: this.parentAppointmentId ? { view: "followUp" } : {},
            }
          );
        },
        (err: HttpErrorResponse) => {
          // this.spinner.hide();
          this.toaster.error(err.error.message);
        }
      );
    } else if (this.healthPackageBuyId) {

      let apptData: CreateAppointmentData | any = {
        ...data.appointment,
        healthPackageBuyId: this.healthPackageBuyId
      }
      // this.spinner.show()
      this.consultUsService.createAppointment(apptData).subscribe((res: any) => {
        // this.spinner.hide()
        let { success, data } = res;
        if (data) {
          let { _id, appointmentId } = data
          let queryParams = {
            orderId: _id,
            shortOrderID: appointmentId,
            healthPackageBuyId: this.healthPackageBuyId,
            paymentFor: 'Appointment',
            withoutTxn: true,
          }
          this.router.navigate(['/cart/checkout/thank-you'], { queryParams })
        }
      }, (err: HttpErrorResponse) => {
        // this.spinner.hide()
        if (err.status == 400 && err.error?.message == "Booking limit exceeded") {
          this.toaster.error('You have booked all your appointment(s) included in Health Package.')
        } else {
          this.toaster.error(err.error?.message || 'Something went wrong!');
        }
      });

    } else {
      if (this.gtag) {
        const { _id, firstName, lastName } = this.consultantDetails;
        let name = ((firstName || '') + ' ' + (lastName || '')).trim();
        if (!name) {
          name = 'HB Consultant'
        }
        this.gtag('event', "consultation_mode_selected", {
          userId: this.commonService.getUser()?.user?._id || null,
          // userId: this.cartService.getUser()?.user?._id || null,
          consultantId: _id,
          consultantName: name,
          date: getFormatedDate(this.selectedDate),
          time: this.selectedSlot?.label,
          mode: appointmentMode
        })
        this.gtag('event', "begin_consultation_checkout", {
          userId: this.commonService.getUser()?.user?._id || null,
          // userId: this.cartService.getUser()?.user?._id || null,
          consultantId: _id,
          consultantName: name,
          date: getFormatedDate(this.selectedDate),
          time: this.selectedSlot?.label,
          mode: appointmentMode
        })
      }
      this.checkoutService.setCheckoutAppointment(data);
      this.cartService.setCartState('consult');
    }
  }
}










