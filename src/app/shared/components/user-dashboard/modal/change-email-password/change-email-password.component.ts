import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { SpinnerService } from "../../../../../services/spinner.service";
import { ModalsService } from "../modals.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: "app-change-email-password",
  templateUrl: "./change-email-password.component.html",
  styleUrls: ["./change-email-password.component.scss"],
})
export class ChangeEmailPasswordComponent implements OnInit, OnDestroy {

  steps = ['Enter New Email', 'Enter OTP', 'Done'].reverse();
  activeStep = 1;

  otpArray = [1, 2, 3, 4, 5, 6];
  otpString = "";
  email: string = '';
  password: string;
  newPassword: string;
  confirmPassword: string;

  activeType = "email";

  intervalRef: any;
  countdown: number = 0;
  sec: string = '00';
  successRes: any;

  constructor(
    private dialogRef: MatDialogRef<any>,
    private apiService: ModalsService,
    private toaster: ToastrService,
    private spinner: SpinnerService,
  ) { }

  ngOnInit(): void {

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

  changeActiveType(value: any) {
    this.activeType = value;

    if (value == 'password') {
      const data = {
        email: '',
        phone: ''
      }

      this.apiService.getOTP(data)
        .toPromise()
        .then((res: any) => {
          this.toaster.success(res.message);
        })
        .catch((err: any) => {
          this.toaster.error(err.error.message);
        });

    }

  }

  otpRequested() {
    this.activeType = "otpRequested";
  }

  getOTP() {
    const data = {
      email: this.email,
    };
    this.spinner.show();
    this.apiService
      .getOTP(data)
      .toPromise()
      .then((res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.activeStep = 2;
          this.initCounter();
          this.toaster.success(res.message);
        }
      })
      .catch((err: any) => {
        this.spinner.hide();
        this.toaster.error(err.error.message);
      });
  }

  getOtpValue(event: any, index: number) {
    let value = event.target.value.toString();
    this.otpString += value;
    var str = this.otpString;
    str = this.setCharAt(str, index, value);
    if (str.length > 6) {
      str = str.substring(0, 6);
    }
    this.otpString = str;
  }

  setCharAt(str: string, index: number, chr: string) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  saveChanges() {
    if (this.otpString.length < 6) {
      this.toaster.error("Please enter valid OTP")
      return
    }
    const data = {
      email: this.email,
      otp: this.otpString,
    }
    this.spinner.show();
    this.apiService.changeEmail(data)
      .toPromise()
      .then((res: any) => {
        this.activeStep = 3;
        this.spinner.hide();
        this.toaster.success(res.message);
        this.successRes = {
          success: true,
          data: {
            email: this.email
          }
        };
      })
      .catch((err: any) => {
        this.spinner.hide();
        this.toaster.error(err.error.message || "Please enter valid OTP");
      });
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
    this.dialogRef.close(this.successRes);
  }
}
