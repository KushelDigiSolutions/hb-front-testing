import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
export type CheckoutType = "order" | 'appointment' | 'diagnostic' | 'healthPackage';
export interface CheckoutProduct {
  checkoutFor: CheckoutType,
  productId?: string,
  quantity?: number,
  weight?: number | string,
  /** upper params are required for products */
  slug?: string,
  label?: string,
  /** appointment related params */
  // consultantId?: string,
  // primaryTimeSlot?: string,
  // date?: string,
  // apptFee?: number,
  // startTime12?: string,
  // endTime12?: string,
  // appointmentMode?: 'audio' | 'video' | 'chat',
  appointment?: CreateAppointmentData,
  /** diagnostic related params */
  diagnostic?: {
    testsId: string[],
    Pincode: string,
    OrderBy: string,
    Email: string,
    Mobile: string,
    Age: string,
    Gender: string,
    Address: string,
    ApptDate: string,
    mrp: number,
    sellingPrice: number,
    discount?: number,
    healthPackageBuyId?: string,
  }
  /** health package related params */
  healthPackage?: {
    _id: string,
    slug: string,
    name: string,
    mrp: number,
    sellingPrice: number,
    discount: number
    consultant: string,
    Pincode?: string,
    variationId?: string,
    testsId?: string[],
  }
}


export interface CreateAppointmentData {
  consultantId: string;
  consultantSlug?: string;
  date: string;
  primaryTimeSlot: string;
  fee: number;
  startTime12?: string,
  endTime12?: string,
  appointmentMode?: 'audio' | 'video' | 'chat',
  healthPackageBuyId?: string,
}

@Injectable({
  providedIn: 'root'
})
export class ConsultationCalendarService {

  headers: any = new HttpHeaders({
    'apikey': environment.apikey,
  });
  constructor(
    private http: HttpClient
  ) { }

  getConsultantProfile(_id: string) {
    return this.http.get(`${environment.apiUrl}users/detail?_id=${_id}`);
  }


  getAvailableTimeSlots(id: any, startDate: any) {
    let param = {
      'canBeBooked': true,
      'consultantId': id,
      'startDate': startDate
    }
    return this.http.get(`${environment.apiUrl}users/timeslots`, {
      'headers': this.headers,
      'params': param
    });
  }

  getUnavailableSlot(id: string) {
    return this.http.get(`${environment.apiUrl}users/unavailableslot?consultantId=${id}`);
  }

  rescheduleAppointment(data: any) {
    return this.http.post(`${environment.apiUrl}appointments/reschedule`, data, {
      'headers': this.headers
    });
  }

  isFreeFollowUp(parentAppointmentId: string, date: string) {
    return this.http.get(`${environment.apiUrl}appointments/isFreeFollowUp?parentAppointmentId=${parentAppointmentId}&date=${date}`);
  }
}
