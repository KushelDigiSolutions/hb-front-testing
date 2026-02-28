import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { of } from "rxjs";
import { APIResponse } from "../shared/types/xhr.types";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class LifestyleTipsService {
    constructor(
        private http: HttpClient,
        private api: ApiService,
    ) { }


    lifestylePromostionBanner: Array<any> = [
        {
            "active": true,
            "_id": "65cda9d4cb682f17a8aef257",
            "thumbnail": {
                "savedName": "uploads/healthybazar_17079769240.png",
                "_id": "65cda8dccb682f17a8aef242",
                'tempImg': "src/assets/images/life-style-tips/life-style-tips-banner-1.png"
            },
            "link": "",
            "type": "Homepage-Category Product",
            "createdAt": "2024-02-15T06:06:12.645Z",
            "updatedAt": "2024-02-15T06:06:12.645Z",
            "__v": 0

        },
        {
            "active": true,
            "_id": "65cda9decb682f17a8aef260",
            "thumbnail": {
                "savedName": "uploads/healthybazar_17079769240.png",
                "_id": "65cda8dccb682f17a8aef242",
                'tempImg': "src/assets/images/life-style-tips/life-style-tips-banner-2.png"
            },
            "link": "",
            "type": "Homepage-Category Product",
            "createdAt": "2024-02-15T06:06:22.344Z",
            "updatedAt": "2024-02-15T06:06:22.344Z",
            "__v": 0
        },
        {
            "active": true,
            "_id": "65cda9e0cb682f17a8aef269",
            "thumbnail": {
                "savedName": "uploads/healthybazar_17079769240.png",
                "_id": "65cda8dccb682f17a8aef242",
                'tempImg': "src/assets/images/life-style-tips/life-style-tips-banner-3.png"
            },
            "link": "",
            "type": "Homepage-Category Product",
            "createdAt": "2024-02-15T06:06:24.662Z",
            "updatedAt": "2024-02-15T06:06:24.662Z",
            "__v": 0
        }

    ];

    recentTips: Array<any> = [
        {
            'img': 'src/assets/images/life-style-tips/life-style-tips-banner-1.png',
            'label': "Diet & Lifestyle",
            'sublable': 'Agnimantha: Uses, Benefits, Side Effects & More!'
        },
        {
            'img': 'src/assets/images/life-style-tips/life-style-tips-banner-2.png',
            'label': "Diet & Lifestyle",
            'sublable': 'Agnimantha: Uses, Benefits, Side Effects & More!'
        },
        {
            'img': 'src/assets/images/life-style-tips/life-style-tips-banner-3.png',
            'label': "Diet & Lifestyle",
            'sublable': 'Agnimantha: Uses, Benefits, Side Effects & More!'
        },
        {
            'img': 'src/assets/images/life-style-tips/life-style-tips-banner-3.png',
            'label': "Diet & Lifestyle",
            'sublable': 'Agnimantha: Uses, Benefits, Side Effects & More!'
        },
        {
            'img': 'src/assets/images/life-style-tips/life-style-tips-banner-3.png',
            'label': "Diet & Lifestyle",
            'sublable': 'Agnimantha: Uses, Benefits, Side Effects & More!'
        },
        {
            'img': 'src/assets/images/life-style-tips/life-style-tips-banner-3.png',
            'label': "Diet & Lifestyle",
            'sublable': 'Agnimantha: Uses, Benefits, Side Effects & More!'
        },
        {
            'img': 'src/assets/images/life-style-tips/life-style-tips-banner-3.png',
            'label': "Diet & Lifestyle",
            'sublable': 'Agnimantha: Uses, Benefits, Side Effects & More!'
        },
        {
            'img': 'src/assets/images/life-style-tips/life-style-tips-banner-3.png',
            'label': "Diet & Lifestyle",
            'sublable': 'Agnimantha: Uses, Benefits, Side Effects & More!'
        },
        {
            'img': 'src/assets/images/life-style-tips/life-style-tips-banner-3.png',
            'label': "Diet & Lifestyle",
            'sublable': 'Agnimantha: Uses, Benefits, Side Effects & More!'
        },
        {
            'img': 'src/assets/images/life-style-tips/life-style-tips-banner-3.png',
            'label': "Diet & Lifestyle",
            'sublable': 'Agnimantha: Uses, Benefits, Side Effects & More!'
        },
        {
            'img': 'src/assets/images/life-style-tips/life-style-tips-banner-3.png',
            'label': "Diet & Lifestyle",
            'sublable': 'Agnimantha: Uses, Benefits, Side Effects & More!'
        }
    ]

    searchLifestyleTips(params: { title?: string, page: number, limit: number }) {
        const _params: any = {}

        Object.keys(params).forEach((key) => {
            if ((params as any)[key] !== undefined && (params as any)[key] !== "") {
                _params[key] = (params as any)[key]
            }
        })

        return this.api.get('blogs', { params: { isPublished: true, ..._params } })
    }

    getLifestyleRecentTips(payload: any) {
        // /blogs?page=1&limit=5&source=homepage &isPublished=true
        return this.http.get(`${environment.apiUrl}blogs`, {
            'params': payload
        });
    }

    getHealthTipsByCategory() {
        // /categories?type=LifeStyle&source=homepage
        // return this.http.get(`${environment.apiUrl}categories`, {
        //     'params': {
        //         type: 'LifeStyle',
        //         source: "homepage"
        //     }
        // });

        return this.http.get(`${environment.apiUrl}categories/list`, {
            'params': {
                categoryType: 'LifeStyle',
                source: "homepage"
            }
        });
    }

    getLifestylePromotionBanners() {
        // /api/v2/promotionBanner/getPromotionBanner?type=Lifestyle Tip
        return this.http.get(`${environment.apiUrl}promotionBanner/getPromotionBanner`, {
            'params': {
                type: "Lifestyle Tip"
            }
        });

    }

    getTenSecReadBlog(params?: { page: number, limit: number }) {
        // /blogs?page=1&limit=5&source=homepage&isPublished=true&blogLength=10sec
        return this.http.get(`${environment.apiUrl}blogs`, {
            'params': {
                page: params?.page || 1,
                limit: params?.limit || 12,
                source: 'homepage',
                isPublished: true,
                blogLength: '10sec'
            }
        });

    }

    getAffordablePackages() {
        return this.http.get(`${environment.apiUrl}healthPackages`, {
            'params': {
                source: "homepage"
            }
        });
    }

    /////life style details page API's Start///////

    getLifestyleDetails(name: any) {
        // /api/v2/blogs/detail?titleName=common-diseases-in-monsoon-prevention-tips
        return this.http.get(`${environment.apiUrl}blogs/detail`, {
            'params': {
                'titleName': name,
                'identifier': 'new'
            }
        });
    }

    getLifestyleTenSecReadBlogs(id: any) {
        return this.http.get(`${environment.apiUrl}blogs/relatedblogs`, {
            'params': {
                '_id': id,
                'isPublished': true,
                isShortLength: true
            }
        });
    }

    getTopConsultant(id: any) {
        // /api/v2/users/getConsultantForCard?isTopConsultant=true&blogId=610d1253bc051244a3a14b73
        return this.http.get(`${environment.apiUrl}users/getConsultantForCard`, {
            'params': {
                'isTopConsultant': true,
                'blogId': id,
            }
        });
    }

    getLifestyleFilters(params: any) {
        const _params: any = {}
        Object.keys(params).forEach((key) => {
            if ((params as any)[key] !== undefined && (params as any)[key] !== "") {
                _params[key] = (params as any)[key]
            }
        })
        return this.api.get<APIResponse<any[]>>(`blogs/filter`, { params: _params });
    }

    getLifestyleTips(params: { isPublished: boolean, categories: string, page: number, limit: number }) {
        return this.api.get<APIResponse<any>>(`blogs`, { params });
    }

    getLifestyleTipsFilteredData(url: any) {
        // let url1 = JSON.parse(url);
        // url1 = { ...url1, active: true }
        // return this.http.get(`${environment.apiUrl}blogs`, { headers: this.headers, params: url1 });
    }

    getShopNowProducts(payload: { source: string, isTop: boolean }) {
        let params = new HttpParams()

        Object.keys(payload).forEach(
            (key: string) => {
                params = params.append(key, (payload as any)[key])
            }
        )
        return this.http.get<APIResponse<any>>(`${environment.apiUrl}products`, { params });
    }

    /////////////////

    getShopNowProductsBasedOnTips(id: any) {
        // /api/v2/products?source=homepage&blogId=610d1253bc051244a3a14b73&limit=10
        return this.http.get(`${environment.apiUrl}products`, {
            'params': {
                'source': 'homepage',
                'blogId': id,
                'limit': 12,
            }
        });
    }

    getRelatedArticlesOnLifestyleTips(titleName: string) {
        return this.http.get(`${environment.apiUrl}blogs/relatedblogs`, {
            'params': {
                'titleName': titleName
            }
        });
    }

    getMetaDetail() {
        return this.http.get(`${environment.apiUrl}metacontents/detail?name=lifestyle`);
    }
}