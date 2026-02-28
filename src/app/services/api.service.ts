import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
// import { environment } from 'src/environments/environment';


export type SimpleObject = {
  [key: string]: any
}

export type HttpClientOptions = {
  params?: SimpleObject,
  headers?: SimpleObject
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  createOptions(options: HttpClientOptions) {
    const params = options.params ? new HttpParams({ fromObject: options.params }) : undefined;
    const headers = options.headers ? new HttpHeaders(options.headers || {}) : undefined;
    return { params, headers }
  }

  get<T>(url: string, options: HttpClientOptions = {}) {
    return this.http.get<T>(`${environment.apiUrl}${url}`, this.createOptions(options));
  }

  post<T>(url: string, body: any, options: HttpClientOptions = {}) {
    return this.http.post<T>(`${environment.apiUrl}${url}`, body, this.createOptions(options));
  }

  put(url: string, body: any, options: HttpClientOptions = {}) {
    return this.http.put(`${environment.apiUrl}${url}`, body, this.createOptions(options));
  }

  delete(url: string, options: HttpClientOptions = {}) {
    return this.http.delete(`${environment.apiUrl}${url}`, this.createOptions(options));
  }

  getExternal(url: string, options: HttpClientOptions = {}) {
    return this.http.get(url, this.createOptions(options));
  }

  postExternal(url: string, body: any, options: HttpClientOptions = {}) {
    return this.http.post(url, body, this.createOptions(options));
  }
}
