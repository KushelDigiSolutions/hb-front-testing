import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SelfHealthAssessmentService {

  constructor(private http: HttpClient) { }

  getAssessments() {
    return this.http.get(`${environment.apiUrl}assessments`);
  }

  getAssessmentsFromId(id: string) {
    return this.http.get(`${environment.apiUrl}assessments/${id}`);
  }

  getInstructions(id: string) {
    return this.http.get(`${environment.apiUrl}instructions?assessmentId=${id}`);
  }

  getQuestions(id: string) {
    return this.http.get(`${environment.apiUrl}questions?assessmentId=${id}`);
  }

  postSurvey(data: any) {
    return this.http.post<{ success: boolean, message: string, data: { [key: string]: any } }>
      (`${environment.apiUrl}survey`, data);
  }
}
