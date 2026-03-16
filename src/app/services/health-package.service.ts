import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { of } from "rxjs";
export interface HttpRequestParams {
    [key: string]: any
}
@Injectable({
    providedIn: 'root'
})
export class HealthPackageService {

    constructor(private http: HttpClient,) { }

    getHealthPopularPackages() {
        // healthPackages?source=homepage&isPopular=true
        return this.http.get(`${environment.apiUrl}healthPackages`, {
            'params': {
                source: 'homepage',
                isPopular: true
            }
        });
    }

    getHealthPackagePromotionBanners() {
        // /api/v2/promotionBanner/getPromotionBanner?type=Health Package
        return this.http.get(`${environment.apiUrl}promotionBanner/getPromotionBanner`, {
            'params': {
                type: "Health Package"
            }
        });

    }

    // getHealthPackageCouponCode() {
    //     // /coupons?source=homepage
    //     return this.http.get(`${environment.apiUrl}coupons`, {
    //         'params': {
    //             source: "homepage"
    //         }
    //     });
    // }
    ///////////////////////health package details page//////////////////

    getPopularHealthPackageDetails(slug: any) {
        // /api/v2/healthPackages/detail?slug=mental-health-package-6-month
        return this.http.get(`${environment.apiUrl}healthPackages/detail`, {
            'params': {
                'slug': slug
            }
        });
    }

    getSubscribedPackages(params?: HttpRequestParams) {
        return this.http.get<{ total: number, success: boolean, data: any[] }>(`${environment.apiUrl}healthpackagebuy`, {
            'params': params
        });
    }

    getSubscribedPackage(id: string) {
        return this.http.get<{ success: boolean, data: any }>(`${environment.apiUrl}healthpackagebuy/detail`, {
            'params': {
                '_id': id
            }
        })
    }

    submitNotificationSurvey(data: { notificationId: string, healthPackageBuyId: string, answer: boolean, date: string }) {
        return this.http.post<{ success: boolean, data: any }>(`${environment.apiUrl}notification/survey`, data, {
        });
    }


    getNotifications(id: string, fromDate: string, toDate: string) {
        return this.http.get<{ success: boolean, data: any }>(`${environment.apiUrl}healthpackagebuy/notification-list`, {
            'params': {
                'healthPackageBuyId': id,
                'fromDate': fromDate,
                'toDate': toDate
            }
        });
    }

    getRelatedHealthPackages(slug: any) {
        // /api/v2/healthPackages/related?slug=mental-health-package-6-month
        // this.http.get(`${environment.apiUrl}healthPackages/related`, {
        //     'headers': this.headers,
        //     'params': {
        //         'slug': slug
        //     }
        // }).subscribe((res: any) => {
        // });
    }

    // getTopSpecilistConsult(slug: any) {
    //     // /api/v2/users/getConsultantForCard?isTopConsultant=true&healthPackageId=610d1253bc051244a3a14b73
    //     return this.http.get(`${environment.apiUrl}users/getConsultantForCard`, {
    //         'headers': this.headers,
    //         'params': {
    //             'isTopConsultant': true,
    //             'healthPackageId': true,
    //         }
    //     });
    // }



    // getHealthPopularPackages() {
    //     // healthPackages?source=homepage&isPopular=true
    //     return this.http.get(`${environment.apiUrl}healthPackages`, {
    //         'headers': this.headers,
    //         'params': {
    //             'source': 'homepage',
    //             isPopular: true,

    //         }
    //     });
    // }



}