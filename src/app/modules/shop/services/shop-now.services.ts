import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { register } from 'swiper/element/bundle';
import { environment } from "../../../../environments/environment";
import { param } from "jquery";
import { APIResponse, CategoryDetails, Filter, GetTopSellingCategoriesResponse } from "../../../shared/types/xhr.types";
import { ApiService } from "../../../services/api.service";
// register Swiper custom elements
register();

@Injectable({
  providedIn: "root"
})
export class ShopNowService {

  constructor(
    private http: HttpClient,
    private api: ApiService,
  ) { }

  // getShopNowProductList() {
  //     return this.http.get(this.URL + "products")
  // }

  getUserFavouritesProducts(isLoggedin: boolean = true) {
    //old user with orders history
    const params = new HttpParams().set('userStatus', isLoggedin ? 'logged_in' : 'guest');
    console.log("INSIDE FAV 2::: ");
    return this.api.get(`orders/getUserFavouriteProducts`, { params });
  }

  getUserFavouritesProductsFilter() {
    //old user with orders history
    return this.api.get(`orders/favourite-product-filter`);
  }

  getPromotionBanners(payload: any) {
    // /api/v2/promotionBanner/getPromotionBanner?type=Homepage-Category Product
    let params = new HttpParams(payload);
    return this.http.get(`${environment.apiUrl}promotionBanner/getPromotionBanner`, {
      params: params
    });
  }

  getHealthConcernFilters(healthConcern: String) {
    let params = new HttpParams();
    let payload: any = {
      slug: healthConcern,
      page: 1,
      limit: 12,
      filter: false,
      'source': 'healthconcerncategory'
    };

    Object.keys(payload).forEach(
      (key: string) => {
        params = params.append(key, payload[key])
      }
    )
    return this.http.get<APIResponse<Filter[]>>(`${environment.apiUrl}healthconcerns/filter`, { params: params });
  }

  getHealthConcernDetails(payload: {
    slug: string, page: number, limit: number, filter: boolean
  }) {

    let params = new HttpParams()

    Object.keys(payload).forEach(
      (key: string) => {
        params = params.append(key, (payload as any)[key])
      }
    )
    return this.http.get<APIResponse<CategoryDetails>>(`${environment.apiUrl}healthconcerns/detail`, { params });
  }


  getFilteredData(url: any) {
    let url1 = JSON.parse(url);
    url1 = { ...url1, active: true }
    //console.log("PARAMS >>>>>>>>>>>>>>>>>>>>>>>>>>>> ", url1);
    return this.http.get(`${environment.apiUrl}products`, { params: url1 });
  }


  /**Get Meta Detail */
  getMetaDetail() {
    return this.http.get(`${environment.apiUrl}metacontents/detail?name=home`);
  }
}