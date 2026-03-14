import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../services/api.service';
import { time24to12 } from '../../../util/date.util';
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
export class ConsultUsService {

  constructor(
    private api: ApiService,
  ) { }

  ConsultantDataTransform(data: any) {
    const { _id, slug, profilePhoto, firstName, lastName, consultantType, experience, experienceInMonths, fee } = data
    const [type] = consultantType || []

    return {
      id: _id,
      slug,
      firstName,
      lastName,
      imageURL: profilePhoto.savedName,
      type: type?.name,
      experience,
      experienceInMonths,
      fee,
    }
  }

  searchConsultants(params: { query: string, page: number, limit: number }) {
    const { query, ...rest } = params
    let _params = {
      role: "Consultant",
      active: true,
      activate: true,
      userIdentifier: query,
      pageType: 'search',
      ...rest,
    }
    return this.api.get('users', { params: _params })
  }

  getConsultCategoryFilters(params: any) {
    let payload: any = {
      role: 'Consultant',
      active: true,
      activate: true,
      ...params
    };

    return this.api.get(`users/filter`, { params: payload });
  }

  getConsultCategoryDetails(params: { slug: string, page: number, limit: number }) {
    const { ...rest } = params
    let payload: any = {
      role: 'Consultant',
      active: true,
      activate: true,
      fliter: false,
      ...rest,
    };

    return this.api.get(`users`, { params: payload });
  }

  getConsultBySpecialization(params: { slug: string, page: number, limit: number }) {
    const { slug: specializationId, ...rest } = params
    let payload: any = {
      role: 'Consultant',
      active: true,
      activate: true,
      fliter: false,
      specializationId,
      ...rest,
      pageType: 'specialization',
    };

    return this.api.get(`users`, { params: payload });
  }

  getConsultByHealthConcern(params: { slug: string, page: number, limit: number }) {
    const { slug: healthConcernId, ...rest } = params
    let payload: any = {
      role: 'Consultant',
      active: true,
      activate: true,
      fliter: false,
      healthConcernId,
      ...rest,
      pageType: 'concern',
    };

    return this.api.get(`users`, { params: payload });
  }

  getConsultantDetails(consultantSlug: any) {
    // /api/v2/users/consultantBySlug?slug=satinderpal-singh-5c8548
    return this.api.get(`users/consultantBySlug`, {
      params: {
        slug: consultantSlug
      }
    });
  }

  getConsultationTypes() {
    return this.api.get(`types`);
  }

  getConsultRelatedConsultant(consultantSlug: any) {
    // /api/v2/users/getConsultantForCard?slug=ratanjot-kaur-acf447
    return this.api.get(`users/getConsultantForCard`, {
      params: {
        slug: consultantSlug
      }
    });
  }

  getShopNowProduct(consultantId: string) {
    // /api/v2/products?source=homepage&consultantId=61c5aeb03365df96e089efbe
    return this.api.get(`products`, {
      params: {
        source: 'homepage',
        consultantId: consultantId
      }
    });
  }

  getConsultRelatedHealthPackage(consultantId: string) {
    // /api/v2/healthPackages?source=homepage&consultantId=60fe8e1ed8cbfc89d95fd5ac
    return this.api.get(`healthPackages`, {
      params: {
        source: "homepage",
        consultantId: consultantId
      }
    });
  }

  getConsultRelatedHealthTips(consultantId: string) {
    // /api/v2/blogs?page=1&limit=5&isPublished=true&consultantId=60c98cd481eb191ab47b0347
    return this.api.get(`blogs`, {
      params: {
        page: 1,
        limit: 5,
        isPublished: true,
        consultantId: consultantId
      }
    });
  }

  // consult us category API's

  getTopHealthConcerns() {
    return this.api.get(`healthConcerns`, {
      params: {
        isTop: true
      }
    });
  }

  getHealthConcernsList(queryParams?: {
    [key: string]: any
  }) {
    const params = new HttpParams({ fromObject: queryParams || {} });
    return this.api.get(`healthconcerns/list`, { params });
  }

  changeSlotFormatTo12(slot: any) {
    return slot.split('-').map((el: any) => time24to12(el.trim())).join(' - ')
  }

  createAppointment(data: CreateAppointmentData) {
    let reqData = {
      ...data,
      paymentCallbackUrl: environment.appHost + "pay-status",
    };
    return this.api.post(`appointments`, reqData);
  }

  getSpecializations() {
    return this.api.get('healthSpecialization')
  }

  getConsultantTypes(url = '') {
    return this.api.get(`types?${url}`);
  }

  getConsultantsNearMe(params: { page: number, limit: number, pincodeId: string }) {
    // getConsultantsNearMe(params: any) {
    let _params = {
      ...params
    }
    return this.api.get(`users/getConsultantForCard`, { params: _params });
  }

  getConsultAgainList(params: { page: number, limit: number }) {
    let _params = {
      ...params
    }
    return this.api.get(`appointments/getUserFavouriteConsultant`, { params: _params });
  }

}
