import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SwiperService {

  constructor() { }

  navigationController(swiper: any, disabledPrev: boolean, disabledNext: any) {
    setTimeout(() => {
      const { isBeginning, isEnd } = swiper
      disabledPrev = isBeginning
      disabledNext = isEnd
    }, 100)
  }
}
