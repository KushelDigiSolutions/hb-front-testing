import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './phone-input.component.html',
  styleUrl: './phone-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true
    }
  ]
})
export class PhoneInputComponent implements OnInit, ControlValueAccessor {

  @Input() placeholder: string = '';
  @Output() keyup = new EventEmitter();

  inputClicked = false;
  showCountryCode: boolean = false;
  numberInput = '';

  constructor() { }

  ngOnInit(): void {

  }

  onKeyUp(event: any) {
    let { value } = event.target;
    let updatedValue = value.replace(/[^\d+]/g, '');

    while (updatedValue.lastIndexOf('+') != 0 && updatedValue.lastIndexOf('+') != -1) {
      let arr: any[] = updatedValue.split('');
      arr.splice(arr.lastIndexOf('+'), 1)
      updatedValue = arr.join('')
    }
    if (updatedValue.indexOf('+') == 0 || !updatedValue) {
      this.showCountryCode = false;
    } else {
      this.showCountryCode = true;
    }

    if (value != updatedValue) {
      event.target.value = updatedValue;
    }
    let finalValue = this.showCountryCode ? '+91' + event.target.value : event.target.value;
    this.keyup.emit(event);
    this.propagateChange(finalValue);
  }

  onClick() {
    this.inputClicked = true;
  }

  onBlur() {
    this.inputClicked && this.onTouched(true);
  }

  propagateChange(_: any) { };

  onTouched(_: any) { };

  writeValue(value: any): void {
    if (value) {
      let updatedValue = value.replace(/[^\d+]/g, '');

      while (updatedValue.lastIndexOf('+') != 0 && updatedValue.lastIndexOf('+') != -1) {
        let arr: any[] = updatedValue.split('');
        arr.splice(arr.lastIndexOf('+'), 1)
        updatedValue = arr.join('')
      }
      if (updatedValue.indexOf('+') == 0 || !updatedValue) {
        this.showCountryCode = false;
      } else {
        this.showCountryCode = true;
      }

      this.numberInput = updatedValue;
      let finalValue = this.showCountryCode ? '+91' + updatedValue : updatedValue;
      this.propagateChange(finalValue);
    } else {
      this.numberInput = '';
    }

  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }
}
