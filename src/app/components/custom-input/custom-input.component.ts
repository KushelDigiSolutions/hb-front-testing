import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {

  @Input() type = 'text'
  @Input() placeholder = ''
  @Input() label = ''
  @Input() prefix = ''
  @Input() maxlength: string

  value = ''

  propagateChange(_: any) { };

  onTouched(_: any) { };

  writeValue(obj: any): void {
    this.value = obj
    this.propagateChange(obj)
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  onInput(event: Event) {
    const value = (event.target as any)['value']
    this.value = value
    this.propagateChange(value)

  }



}
