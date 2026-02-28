import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalsService } from '../modals.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../../../services/spinner.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhoneInputComponent } from '../../../phone-input/phone-input.component';

@Component({
  selector: 'app-change-mobile-number',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PhoneInputComponent],
  templateUrl: './change-mobile-number.component.html',
  styleUrl: './change-mobile-number.component.scss'
})
export class ChangeMobileNumberComponent implements OnInit, OnDestroy {
  steps = {
    changeNumber: ['Enter New Number', 'Enter OTP', 'Done'].reverse()
  }
  activeStep = 1;
  otpArray = [1, 2, 3, 4, 5, 6];
  country_code: any = "+91";
  phone: number;
  otpString = "";
  password: string;

  newPassword: '';
  confirmPassword: '';

  showOTPPassword: number;
  intervalRef: any;
  countdown: number = 0;
  sec: string = '00';

  constructor(
    private _el: ElementRef,
    private dialogRef: MatDialogRef<any>,
    private apiService: ModalsService,
    private toaster: ToastrService,
    private spinner: SpinnerService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    clearInterval(this.intervalRef);
  }

  @HostListener("keyup", ["$event"]) onKeyDown(e: any) {
    if (e.srcElement.maxLength === e.srcElement.value.length) {
      e.preventDefault();

      let nextControl: any = e.srcElement.nextElementSibling;
      // Searching for next similar control to set it focus
      while (true) {
        if (nextControl) {
          if (nextControl.type === e.srcElement.type) {
            nextControl.focus();
            return;
          } else {
            nextControl = nextControl.nextElementSibling;
          }
        } else {
          return;
        }
      }
    }
  }

  getCountryCodeValue(value: any) {
    if (value.includes("+")) {
      value = value;
    } else {
      value = "+" + value;
    }

    this.country_code = value;
  }

  getOtp() {
    const data = {
      countryCode: '+91',
      phone: this.phone.toString().slice(3),
    };
    this.spinner.show();
    this.apiService
      .getOTP(data)
      .toPromise()
      .then((res: any) => {
        this.activeStep = 2;
        this.spinner.hide();
        res.success ? this.showOTPPassword = res.success : this.showOTPPassword = res.success;
        this.toaster.success(res.message);
        this.initCounter();
      })
      .catch((err: any) => {
        this.spinner.hide();
        this.toaster.error(err.error.message);
      });
  }

  getOtpValue(event: any, index: any) {

    let value = event.target.value.toString();
    this.otpString += value;
    var str = this.otpString;
    str = this.setCharAt(str, index, value);
    if (str.length > 6) {
      str = str.substring(0, 6);
    }
    this.otpString = str;
  }

  setCharAt(str: string, index: number, chr: any) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  saveChanges() {
    if (this.otpString.length < 6) return this.toaster.error('Please enter valid OTP.')
    const data = {
      otp: this.otpString,
      countryCode: '+91',
      phone: this.phone.toString().slice(3),
    }
    this.spinner.show();
    this.apiService.changeNumber(data)
      .toPromise()
      .then((res: any) => {
        this.activeStep = 3;
        this.spinner.hide();

      })
      .catch((err: any) => {
        this.spinner.hide();
        this.toaster.error(err.error.message || 'Please enter valid OTP.');
      });
    return
  }

  initCounter() {
    this.countdown = 59;
    this.intervalRef = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown == 0) {
        clearInterval(this.intervalRef);
      }
      this.sec = String(this.countdown).length == 1 ? '0' + this.countdown : '' + this.countdown;
    }, 1000);
  }

  done() {
    let body = {
      success: true,
      data: {
        countryCode: '+91',
        phone: this.phone.toString().slice(3)
      }
    }
    this.dialogRef.close(body);
  }
}
