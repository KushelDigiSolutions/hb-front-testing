import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../shared/types/xhr.types';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient,) { }

  /**Filter Related API */
  getFilteredData(url: any) {
    let url1 = JSON.parse(url);
    url1 = { ...url1, active: true }
  }

  /**Category Related API */
  // getCategoryDetail(data: { [key: string]: any }) {
  //   let params = new HttpParams({ fromObject: data })
  //   return this.http.get(`${environment.apiUrl}categories/detail`, { params });
  // }

  // getCategoryFilters(params?: any) {
  //   return this.api.get<{ success: boolean, data: any[] }>(`categories/filter`, params);
  // }

  // /**Health Concern Related API */
  // getHealthConcernDetails(data: { [key: string]: any }) {
  //   let params = new HttpParams({ fromObject: data })
  //   return this.http.get(`${environment.apiUrl}healthconcerns/detail`, { params });
  // }

  getHealthConcernFilters(params?: any) {
    return this.http.get<{ success: boolean, data: any[] }>(`healthconcerns/filter`, params);
  }

  /**Brand Related API */
  getBrandDetails(data: any) {
    // let params = new HttpParams(data);
    return this.http.get(`${environment.apiUrl}brands/detail`, {
      'params': data
    });

    // return this.http.get(`${environment.apiUrl}brands/detail`, { params });
  }

  getBrandFilters(data: any) {
    let params = new HttpParams(data);
    return this.http.get(`${environment.apiUrl}brands/filter`, {
      'params': data
    });
    // return this.api.get<{ success: boolean, data: any[] }>(`brands/filter`, params);
  }

  // /**Search Related API */
  // getSearchedProduct(data: { name: string, page?: number, limit?: number }) {
  //   return this.api.get('algoliasearch', data);
  // }

  // /**Health Package Related API */
  // getHealthPackages() {
  //   return this.http.get(`${environment.apiUrl}healthpackages`);
  // }

  // getHealthPackagesFilters(params?: any) {
  //   return this.api.get<{ success: boolean, data: any[] }>(`healthpackages/filter`, params);
  // }

  // getCategoryFilters(data: any) {
  //   let params = new HttpParams(data);
  //   // /api/v2/categories/filter?slug=herb&page=1&limit=12&filter=false
  //   return this.http.get(`${environment.apiUrl}filter`, {
  //     'params': data
  //   });
  //   // return this.api.get<{ success: boolean, data: any[] }>(`brands/filter`, params);
  // }
  getCategoryFilters(category: String) {
    let params = new HttpParams();
    let payload: any = {
      slug: category,
      page: 1,
      limit: 12,
      filter: false,
    };

    Object.keys(payload).forEach(
      (key: string) => {
        params = params.append(key, payload[key])
      }
    )
    return this.http.get(`${environment.apiUrl}categories/filter`, { params: params });
  }

  getCategoryDetails(payload: {
    slug: string, page: number, limit: number, filter: boolean
  }) {

    let params = new HttpParams()

    Object.keys(payload).forEach(
      (key: string) => {
        params = params.append(key, (payload as any)[key])
      }
    )
    return this.http.get(`${environment.apiUrl}categories/detail`, { params });
  }

  getHerbsDetails(payload: {
    slug: string, page: number, limit: number, filter: boolean
  }) {

    let params = new HttpParams()

    Object.keys(payload).forEach(
      (key: string) => {
        params = params.append(key, (payload as any)[key])
      }
    )
    return this.http.get(`${environment.apiUrl}categories/detail`, { params });
  }
}
