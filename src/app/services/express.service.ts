import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Request, Response } from 'express';
import { getOS } from '../util/os.util';
export const REQUEST = new InjectionToken<Request>('REQUEST');
export const RESPONSE = new InjectionToken<Response>('RESPONSE');

@Injectable({
  providedIn: 'root'
})
export class ExpressService {

  constructor(
    @Optional() @Inject(REQUEST) public expressRequest: Response,
    @Optional() @Inject(RESPONSE) public expressResponse: Response,
  ) { }

  get OS() {
    return getOS(this.expressRequest?.get('user-agent'))
  }

}
