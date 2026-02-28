import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastTwoDigits',
  standalone: true
})
export class LastTwoDigitsPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }
    const length = value.length;
    return length > 2 ? '*'.repeat(length - 2) + value.slice(-2) : value;
  }

}
