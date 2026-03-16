import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddConsultantService {

  constructor(private http: HttpClient) { }

  /**Add Cosnultant API */
  addConsultant(data: any) {
    return this.http.post(`${environment.apiUrl}users/addfromweb`, data)
  }
}
