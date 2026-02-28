import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { getFormatedDate } from '../../util/date.util';
declare var gtag: any;

export interface DateSlotSelectorConfig {
  minDate?: Date,
  maxDate?: Date,
  showContinueOnSelectSlot?: boolean,
  continueButtonText?: string,
}

const defaultConfig: DateSlotSelectorConfig = {
  minDate: new Date(),
  showContinueOnSelectSlot: true,
  continueButtonText: 'Continue'
}
@Component({
  selector: 'app-date-slot-selector',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatDatepickerModule, FormsModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './date-slot-selector.component.html',
  styleUrl: './date-slot-selector.component.scss',
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [provideNativeDateAdapter()],
})
export class DateSlotSelectorComponent implements OnInit {

  currentDatevalue = new FormControl(new Date());;
  @Input() config: DateSlotSelectorConfig = {};
  @Input() slots: any[] = [];

  @Output() changeDate = new EventEmitter();
  @Output() changeSlot = new EventEmitter();
  @Output() continue = new EventEmitter();
  today = new Date();
  @ViewChild('selectedSlotFromUser') selectedSlotFromUser: ElementRef;

  ////////////////////
  selectedOption: string | null = null;

  selectOption(option: string): void {
    this.selectedOption = option;
  }

  submitForm(): void {
    // Handle form submission
  }

  //////////

  selectedDate: any;
  minDate: Date;
  maxDate: Date;
  selectedSlot: any = null;

  constructor() { }



  ngOnChanges(changes: SimpleChanges): void {
    const currentValue = changes['config']?.currentValue
    if (currentValue) {
      this.setConfig(currentValue)
    }
  }

  ngOnInit(): void {
    // get default slot on bases current date call API
    this.setConfig(this.config)
    this.setMinDate()


  }

  setConfig(config: any) {
    this.config = {
      ...defaultConfig,
      ...config,
    }
  }

  setMinDate() {

    let date = new Date();
    this.minDate = date;
    this.selectedDate = date;
    this.selectedSlot = null;
    // this.onChangeDate(this.minDate);
  }

  onChangeDate(selectedDate: any) {
    this.selectedDate = selectedDate;
    this.selectedSlot = null;
    this.changeDate.emit(selectedDate)
    this.changeSlot.emit(null)
  }

  onSelectSlot(slot: any) {
    //  pending work here to disable button based on slot
    if (slot) {
      this.selectedSlot = slot;
    }
    this.changeSlot.emit(slot)
  }

  onContinue() {
    this.continue.emit()
  }

  onChangeSlotDate(event: any) {
    let chnageSelectedDate = getFormatedDate(event.value, "YYYY-MM-DD");
    this.selectedDate = chnageSelectedDate;
    this.selectedSlot = null;

    this.changeDate.emit(chnageSelectedDate);
    this.changeSlot.emit(null);
    //after date chage call get api for getting slots
  }
}
