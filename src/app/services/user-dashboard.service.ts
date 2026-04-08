import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, of } from "rxjs";
import { environment } from "../../environments/environment";
import { GetUserProfileResponse, UserProfile } from "../shared/types/xhr.types";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: "root",
})
export class UserDashboardService {

    private userProfile$ = new BehaviorSubject<UserProfile | null>(null)

    constructor(
        private api: ApiService,
    ) { }

    getOrderDetails(page: number, limit: number) {
        return this.api.get(`orders/user`, {
            'params': {
                'page': page,
                'limit': limit
            }
        });
    }

    // addUserCurrentLocation(locationData: any) {
    //     // /api/v2/users/currentLocation ; send city and pincode id in the body
    //     return this.api.post(`users/currentLocation`, locationData, {
    //         'headers': this.headers,
    //     });
    // }

    getUserProfile() {
        return this.api.get<GetUserProfileResponse>(`users/profile`).pipe(map(res => {
            if (res.success && res.data) {
                this.setUserProfileData(res.data)
            }
            return res
        }));
    }

    getVitals(params: { startDate?: string, endDate?: string }) {
        // return this.api.get<{ success: boolean, data: any }>('stats/vitals', params)
        return this.api.get(`stats/vitals`, {
            params: params
        });
    }

    getSymptoms(params: { startDate?: string, endDate?: string }) {
        return this.api.get(`stats/symptoms`, {
            params: params
        });
        // return this.api.get<{ success: boolean, data: any }>('stats/symptoms', params)
    }

    getAppointments(url: any) {
        let url1 = JSON.parse(url);
        return this.api.get(`appointments`, {
            params: url1
        });
    }

    cancelAppointment(data: any) {
        return this.api.post(`appointments/cancel`, data);
    }

    getAppointmentDetail(id: string) {
        return this.api.get(`appointments/detail`, {
            params: {
                '_id': id
            }
        });
    }

    getFollowUpAppointments(id: string) {
        return this.api.get(`appointments/followups`, {
            params: {
                'parentAppointmentId': id
            }
        });
    }

    getPrescriptionList(url: string) {
        return this.api.get(`prescriptions${url}`);
    }

    addMedicalRecord(data: any) {
        return this.api.post(`medicalrecords`, data);
    }

    getMedicalRecordList(url: any) {
        return this.api.get(`medicalrecords${url}`);
    }

    removeMedicalRecord(id: string) {
        return this.api.delete(`medicalrecords/${id}`);
    }

    setUserProfileData(user: UserProfile) {
        this.userProfile$.next(user)
    }

    getUserProfileData() {
        this.userProfile$.asObservable()
    }

    get userProfile() {
        return this.userProfile$.getValue()
    }

}