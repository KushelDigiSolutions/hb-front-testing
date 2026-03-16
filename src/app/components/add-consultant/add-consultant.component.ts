import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { getFormatedDate } from '../../util/date.util';
import { CheckoutService } from '../../shared/components/checkout/checkout.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SpinnerService } from '../../services/spinner.service';
import { ConsultUsService } from '../../modules/consult-us/services/consult-us.service';
import { UserDashboardService } from '../../services/user-dashboard.service';
import { AddConsultantService } from '../../services/add-consultant.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MetasService } from '../../services/metas.service';
import { CartService } from '../../services/cart.service';
import { forkJoin, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageModalComponent, MessageModalData } from '../message-modal/message-modal.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { DropzoneComponent } from '../dropzone/dropzone.component';

@Component({
  selector: 'app-add-consultant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    ReactiveFormsModule,
    DropzoneComponent,
  ],
  templateUrl: './add-consultant.component.html',
  styleUrl: './add-consultant.component.scss'
})
export class AddConsultantComponent implements OnInit {
  imageUrl = environment.imageUrl;

  breadCrumbData = [
    {
      "title": "BECOME CONSULTANT",
      "url": ""
    }
  ];

  gender = [
    {
      name: "Male",
      value: "male",
    },
    {
      name: "Female",
      value: "female",
    },
    {
      name: "Other",
      value: "other",
    },
  ];
  filePath: any;
  specialities: Array<any>;
  activeView: string = "";
  showForm: boolean = true;

  form: FormGroup | any;
  currentChecked: boolean = true;
  maxDate = getFormatedDate(new Date());
  email: string = "support@healthybazar.com"

  constructor(
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private checkoutService: CheckoutService,
    private spinner: SpinnerService,
    private consultUsService: ConsultUsService,
    private dashboardService: UserDashboardService,
    private addConsultantService: AddConsultantService,
    private toaster: ToastrService,
    public dialog: MatDialog,
    private metaService: MetasService,
    private cartService: CartService,
  ) {
    this.form = this.formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: "",
      email: ["", [Validators.required, Validators.email]],
      countryCode: [{ value: "+91", disabled: true }],
      phone: ["", [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      profilePhoto: ["", [Validators.required]],
      gender: "male",
      DOB: ["", [Validators.required]],
      language: "",
      address: "",
      pinCode: "" || null,
      city: "",
      state: "",
      type: [null],
      role: "Consultant",
      fee: ["", [Validators.required]],
      experience: ["", [Validators.required, Validators.pattern(/^[0-9]{0,2}$/)]],
      experienceInMonths: ["", [Validators.required, Validators.pattern(/\b([0-9]|10|11)\b/)]],
      appointmentMode: this.formBuilder.group({
        isVideo: [false],
        isAudio: [false],
        isChat: [false]
      }),
      // password: ["", [Validators.required]],
      qualification: this.formBuilder.array([]),
      currentAddress: this.formBuilder.group({
        address: "",
        pinCode: "",
        city: "",
        state: "",
      })
    });
  }

  ngOnInit() {
    this.metaService.setMetaTags({
      title: 'Become a Consultant'
    })
    this.getSpeciality();
  }

  getSpeciality() {
    this.consultUsService.getConsultationTypes().subscribe(
      (res: any) => {
        this.specialities = res.data;
      },
      (err: any) => { }
    );
  }

  profilePhotoUpload(event: any) {
    if (event.target.files.length > 0) {
      let fileToUpload: any = URL.createObjectURL(event.target.files[0]);
      fileToUpload = this.sanitizeImageUrl(fileToUpload);
      this.filePath = fileToUpload ? fileToUpload : this.filePath;
      this.form.patchValue({ profilePhoto: event.target.files[0] });
    }
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  getUserAddressArea() {
    if (this.form.get("pinCode")!.value.length == 6) {
      this.checkoutService
        .getUserAddressArea(this.form.get("pinCode")!.value)
        .toPromise()
        .then((res: any) => {
          if (res.data.length) {
            let state = res.data[0].stateName;
            state = state
              .toLowerCase()
              .split(" ")
              .map(function (word: any) {
                return word.charAt(0).toUpperCase() + word.slice(1);
              })
              .join(" ");
            let city = res.data[0].districtName;
            this.form.patchValue({
              country: "India",
              state: state,
              city: city,
            });
          } else {
            this.form.patchValue({
              state: "",
              city: "",
            });
          }
        })
        .catch((err: any) => {
          err;
        });
    }
  }

  getUserCurrentAddressArea() {
    if (this.form.get("currentAddress")?.get("pinCode")?.value.length == 6) {
      this.checkoutService
        .getUserAddressArea(this.form.get("currentAddress")?.get("pinCode")?.value)
        .toPromise()
        .then((res: any) => {
          if (res.data.length) {
            let state = res.data[0].stateName;
            state = state
              .toLowerCase()
              .split(" ")
              .map(function (word: any) {
                return word.charAt(0).toUpperCase() + word.slice(1);
              })
              .join(" ");
            let city = res.data[0].districtName;
            this.form.get("currentAddress")?.patchValue({
              country: "India",
              state: state,
              city: city,
            });
          } else {
            this.form.get("currentAddress")?.patchValue({
              state: "",
              city: "",
            });
          }
        })
        .catch((err: any) => {
          err;
        });
    }
  }

  addNewQualification() {
    let value = this.form.get("qualification") as FormArray;

    value.push(this.createqualificationGroup());
  }

  createqualificationGroup(
    degree = "",
    college = "",
    passingYear = "",
    certificate = []
  ) {
    return this.formBuilder.group({
      degree: [degree, [Validators.required]],
      college: [college, [Validators.required]],
      passingYear: [passingYear, [Validators.required]],
      certificate: [certificate],
    });
  }

  removeQualification(i: any) {
    let value = this.form.get("qualification") as FormArray;
    value.removeAt(i);
  }

  saveChanges() {
    if (this.currentChecked) {
      let { currentAddress } = this.form.value;
      currentAddress.address = this.form.get("address")?.value;
      currentAddress.pinCode = this.form.get("pinCode")?.value;
      currentAddress.state = this.form.get("state")?.value;
      currentAddress.city = this.form.get("city")?.value;
    }
    console.log("form", this.form.value);
    if (this.form.valid && !this.isInvalidAppointmentMode()) {
      let { value } = this.form;

      this.spinner.show();

      const fileUploadReqArray = [];

      fileUploadReqArray.push(
        this.cartService.fileUpload([value.profilePhoto], "profile")
      );

      value.qualification.forEach((el: any) => {
        let certificate = el.certificate[0]
        if (certificate) {
          if (typeof certificate == "object") {
            fileUploadReqArray.push(
              this.cartService.fileUpload([certificate], "")
            );
          } else {
            fileUploadReqArray.push(of(null));
          }
        } else {
          fileUploadReqArray.push(of(null));
        }
      });
      forkJoin(fileUploadReqArray).subscribe(
        (res: Array<{ success: boolean; data: string[] }> | null) => {
          value = JSON.parse(JSON.stringify(value));
          let [profilePhotoRes, ...certificatesRes]: any = res;
          if (profilePhotoRes) {
            value.profilePhoto = profilePhotoRes.data[0];
          }
          certificatesRes.forEach((data: any, i: any) => {
            if (data) {
              value.qualification[i].certificate = data.data[0];
            } else {
              delete value.qualification[i].certificate;
            }
          });

          const data = {
            DOB: value.DOB,
            currentAddress: value.currentAddress,
            address: {
              city: value.city,
              line1: value.address,
              name: value.firstName + value.lastName || "",
              phoneNo: value.phone,
              pinCode: value.pinCode,
              state: value.state,
              type: "work",
            },
            email: value.email,
            experience: value.experience,
            experienceInMonths: value.experienceInMonths,
            fee: value.fee,
            firstName: value.firstName,
            gender: value.gender,
            language: value.language,
            lastName: value.lastName,
            phone: value.phone,
            profilePhoto: value.profilePhoto,
            consultantType: value.type ? [value.type] : [],
            qualification: value.qualification,
            appointmentMode: value.appointmentMode,
            role: ['Consultant']
          };

          this.addConsultantService.addConsultant(data).subscribe(
            (res: any) => {
              this.spinner.hide();
              this.form.reset();
              this.showForm = false;
              this.toaster.success(res.message);
              window.scroll(0, 0);
            },
            (err: HttpErrorResponse) => {
              this.spinner.hide();
              let { message } = err.error;
              if (message == "User already exists!") {
                let modalData: MessageModalData = {
                  type: 'error',
                  title: 'Account already exists!',
                  message: `Your account already exists on our platform.<br/> You can access your consultant panel by logging with your email <b>${data.email}</b> on ${environment.adminHost}`,
                }
                this.dialog.open(MessageModalComponent, {
                  width: '500px',
                  data: modalData
                });
              } else
                this.toaster.error(err.error.message);

            }
          );
        },
        (err: any) => {
          this.spinner.hide();
          this.toaster.error("Something went wrong!");
        }
      );
    }
  }
  checkboxClicked() {
    this.currentChecked = !this.currentChecked;
  }
  isInvalidAppointmentMode() {
    let { value }: any = this.form.get('appointmentMode')
    return !(value.isAudio || value.isVideo || value.isChat);
  }
}


