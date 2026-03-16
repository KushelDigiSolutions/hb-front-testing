import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private subject = new BehaviorSubject(false)
  private data = {
    normal: false,
    routeLoader: false
  }

  constructor() { }

  getObserver() {
    return this.subject.asObservable();
  }

  show(type: 'normal' | 'routeLoader' = 'normal') {
    this.data[type] = true;
    this.subject.next(true);
  }
  hide(type: 'normal' | 'routeLoader' = 'normal') {
    this.data[type] = false;
    this.subject.next(!(this.data.normal == false && this.data.routeLoader == false));
  }

}
