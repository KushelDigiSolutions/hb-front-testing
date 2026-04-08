import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import moment from 'moment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ShareHealthConcernComponent } from '../../share-health-concern/share-health-concern.component';
import { Observable, of } from 'rxjs';
import { CartService, FileUploadResponse } from '../../../../services/cart.service';
import { UserDashboardService } from '../../../../services/user-dashboard.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangeMobileNumberComponent } from '../modal/change-mobile-number/change-mobile-number.component';
import { ChangeEmailPasswordComponent } from '../modal/change-email-password/change-email-password.component';
import { AuthService } from '../../../../services/auth.service';
import { CommonService } from '../../../../services/common.service';
import { MetasService } from '../../../../services/metas.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../../services/spinner.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ShareHealthConcernComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  imageUrl = environment.imageUrl;
  filePath: any;

  profileFormGroup: FormGroup;

  topHealthConcern = [];
  allHealthConcern = [];

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

  // getFormatedDate: any = (date: Date | string | number, format: string = "YYYY-MM-DD"): string => {
  //   return moment(date).format(format)
  // }

  // maxDate = this.getFormatedDate(new Date());
  maxDate = new Date();
  newsLetterSubscription: any;
  healthConcernNew: any;

  dialogRef: MatDialogRef<any>;

  constructor(
    private formbuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private commonService: CommonService,
    private cartService: CartService,
    private userdashboardSerivce: UserDashboardService,
    private dialog: MatDialog,
    private meta: MetasService,
    private toaster: ToastrService,
    private spinner: SpinnerService,
  ) {
    this.profileFormGroup = this.formbuilder.group({
      firstName: [""],
      lastName: [""],
      gender: ["male"],
      DOB: [""],
      profilePhoto: "",
      mobileNumber: [{ value: "", disabled: true }],
      countryCode: [{ value: "+91", disabled: true }],
      email: [{ value: "", disabled: true }],
      diseases: [[]],
      weight: "",
      weightUnit: "",
      bodyType: "",
      newsLetter: [true],
    });
  }

  ngOnInit(): void {
    this.meta.setMetaTags({ title: 'My Account' });
    this.getUserProfile();
  }

  getUserProfile() {
    this.userdashboardSerivce
      .getUserProfile()
      .toPromise()
      .then((res: any) => {
        if (res.data) {
          console.log('res.data = userdata = ', res.data);

          let { profilePhoto, firstName, lastName, gender, DOB, phone, email, diseases, weight, bodyType, newsLetter } = res.data;
          if (profilePhoto) {
            this.filePath = this.imageUrl + profilePhoto.savedName;
          }

          this.profileFormGroup.patchValue({
            firstName: firstName || "",
            lastName: lastName || "",
            gender: gender || "male",
            DOB: DOB || '',
            mobileNumber: phone ? phone.split('+91')[phone.split('+91').length - 1] : "",
            countryCode: "+91",
            email: email || "",
            diseases: diseases,
            weight: weight || "",
            profilePhoto: profilePhoto?._id || "",
            bodyType: bodyType || "",
            weightUnit: "kg",
            newsLetter: Boolean(newsLetter)
          });
        }
      })
      .catch((err: any) => { });
  }

  profilePhotoUpload(event: any) {
    console.log(event.target.files);
    let file = event.target.files[0];
    if (file && ["image/jpeg", "image/png"].includes(file.type)) {
      let fileToUpload: any = URL.createObjectURL(file);
      fileToUpload = this.sanitizeImageUrl(fileToUpload);
      this.filePath = fileToUpload ? fileToUpload : this.filePath;
      this.profileFormGroup.patchValue({ profilePhoto: file });
    }
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  openModal(value: string) {
    if (value == "mobile") {
      this.dialogRef = this.dialog.open(ChangeMobileNumberComponent, {
        maxHeight: "450px",
        width: "800px",
      });
      this.dialogRef.afterClosed().subscribe(
        (res: any) => {
          if (res && res.success) {
            this.profileFormGroup.patchValue({
              mobileNumber: [res.data.phone],
              countryCode: [res.data.countryCode],
            });
          }
        },
        (err: any) => { }
      );
    } else if (value == "email") {
      this.dialogRef = this.dialog.open(ChangeEmailPasswordComponent, {
        maxHeight: "450px",
        width: "800px",
      });

      this.dialogRef.afterClosed().subscribe(
        (res: any) => {
          if (res && res.success) {
            this.getUserProfile();
            this.profileFormGroup.patchValue({
              email: res.data.email ? res.data.email : "",
            });
          }
        },
        (err: any) => { }
      );
    }
  }

  getUserHealthConcernList(event: any) {
    this.profileFormGroup.patchValue({ 'diseases': event.map((el: any) => el._id) });
  }

  saveChanges() {
    let { profilePhoto, firstName, lastName, gender, DOB, diseases, weight, weightUnit, bodyType, newsLetter } = this.profileFormGroup.value;

    const data = {
      profilePhoto,
      firstName,
      lastName,
      gender,
      DOB,
      diseases,
      weight,
      weightUnit,
      bodyType,
      newsLetter,
    };

    console.log('this.profileFormGroup.value = ', this.profileFormGroup.value);
    this.spinner.show();

    let uploadReq: Observable<FileUploadResponse>;

    if (typeof profilePhoto == "string") {
      uploadReq = of({ success: true, data: [profilePhoto] });
    } else {
      uploadReq = this.cartService.fileUpload([profilePhoto], "profile");
    }
    uploadReq.subscribe(res => {
      if (res.success) {
        let imgId = res.data[0];
        if (imgId) data.profilePhoto = imgId;
        else delete data.profilePhoto;
      } else {
        this.spinner.hide();
        this.toaster.error('Try again later', 'Failed to upload image!');
        return 
      }

      console.log('data = 168', data);


      this.cartService.updateUserProfile(data).subscribe((res: any) => {
        this.spinner.hide();
        this.toaster.success('Profile updated successfully!');

        let oldData = this.commonService.getUser();
        oldData.user.firstName = data.firstName;
        oldData.user.lastName = data.lastName;
        this.authService.onLoggedIn(oldData)
        // this.cartService.setUser(oldData);
        this.commonService.setLoginState(true);
      }, (err: any) => {
        console.log('update profile data = ', err);

        this.spinner.hide();
        this.toaster.error('Something went wrong!');
      }, () => {
        this.spinner.hide();
      });

    }, err => {
      this.spinner.hide()
      console.log('upload req error = ', err);
    });

  }
}
