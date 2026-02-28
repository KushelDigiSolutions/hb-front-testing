import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../services/cart.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { UserDashboardService } from '../../../../services/user-dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhoneInputComponent } from "../../phone-input/phone-input.component";
import { SpinnerService } from '../../../../services/spinner.service';
@Component({
  selector: 'app-user-address',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PhoneInputComponent],
  templateUrl: './user-address.component.html',
  styleUrl: './user-address.component.scss'
})
export class UserAddressComponent {
  dataArray: any = [];
  addAddress = false;
  editAddress = false;
  editAddressIndex: any;
  saveHovered = false;
  buttonDisabled = true;

  country: any;
  states: any;
  cities: any;

  userAddressType = [
    {
      addressType: "home",
    },
    {
      addressType: "work",
    }
  ];

  addAddressCountryVar: any = "";
  testVar: any;

  form: FormGroup;
  editForm: FormGroup;

  constructor(
    private cartService: CartService,
    private formbuilder: FormBuilder,
    private spinner: SpinnerService
  ) {
    //add address
    this.form = this.formbuilder.group({
      name: ["", [Validators.required]],
      phoneNo: ["", [Validators.required]],
      pinCode: ["", [Validators.required, Validators.maxLength(6), Validators.pattern(/^[1-9][0-9]{5}$/)]],
      houseNumber: ["", [Validators.required]],
      line1: ["", [Validators.required]],
      country: [{ value: "", disabled: true }, [Validators.required]],
      state: [{ value: "", disabled: true }, [Validators.required]],
      city: ["", [Validators.required]],
      landmark: ["", [Validators.required]],
      type: ["home"],
    });
    //edit address
    this.editForm = this.formbuilder.group({
      default: [false],
      name: ["", [Validators.required]],
      phoneNo: ["", [Validators.required]],
      pinCode: ["", [Validators.required, Validators.maxLength(6), Validators.pattern(/^[1-9][0-9]{5}$/)]],
      houseNumber: ["", [Validators.required]],
      line1: ["", [Validators.required]],
      country: [{ value: "", disabled: true }, [Validators.required]],
      state: [{ value: "", disabled: true }, [Validators.required]],
      city: ["", [Validators.required]],
      landmark: ["", [Validators.required]],
      type: [""],
      _id: [""],
    });
  }

  ngOnInit(): void {
    this.getUserAddress();
  }

  getUserAddress() {
    this.cartService.getUserAddress().subscribe((res: any) => {
      console.log('getUserAddress: ', res);
      if (res.data.address) {
        this.dataArray = res.data.address;
      }

    });
  }

  openAddAddressSection() {
    this.addAddress = true;
  }

  buttonHovered(value: string) {
    if (value == "save") {
      this.saveHovered = true;
    }
  }
  buttonHoveredOut(value: string) {
    if (value == "save") {
      this.saveHovered = false;
    }
  }
  cancelAddressAddition(type: string) {
    if (type == "add") {
      this.addAddress = false;
      this.form.reset();
    }
    if (type == "edit") {
      this.editAddress = false;
    }
  }
  getUserAddressArea() {
    if (this.form.get('pinCode')?.value.length == 6) {
      this.cartService.getUserAddressArea(this.form.get('pinCode')?.value)
        .toPromise()
        .then((res: any) => {
          if (res.data.length) {
            let state = res.data[0].stateName;
            state = state.toLowerCase().split(' ').map(function (word: any) {
              return (word.charAt(0).toUpperCase() + word.slice(1));
            }).join(' ');
            let city = res.data[0].districtName;
            this.cities = res.data;
            this.form.patchValue({
              country: "India",
              state: state,
              city: city
            });
          } else {
            this.form.patchValue({
              state: "",
              city: ""
            })
          }

        })
        .catch((err: any) => { err })
    }
  }

  changeUserAddressArea(item: any) {
    if (item.pinCode.length == 6) {
      this.cartService.getUserAddressArea(item.pinCode)
        .toPromise()
        .then((res: any) => {
          if (res.data.length) {
            let state = res.data[0].stateName;
            state = state.toLowerCase().split(' ').map(function (word: any) {
              return (word.charAt(0).toUpperCase() + word.slice(1));
            }).join(' ');
            let city = res.data[0].districtName;
            item.country = "India";
            item.state = state;
            item.city = city;
          } else {
            item.state = "";
            item.city = "";
          }
        })
        .catch((err: any) => { err })
    }
  }

  addNewAddress() {
    if (this.form.valid) {
      let value = { ...this.form.getRawValue() }
      value.phoneNo = value.phoneNo.slice(3);
      value.counrtyCode = '+91';

      const data = {
        address: value,
      };

      this.cartService.addUserAddress(data).subscribe((res: any) => {
        console.log('addUserAddress: ', res);
        this.form.reset();
        // this.toaster.success(res?.message);
        this.getUserAddress();
        this.addAddress = false;

      });
    }
  }


  checkIfValid(type: string) {
    if (type == "add") {
      if (this.form.valid) {
        this.buttonDisabled = false;
        return false;
      } else {
        this.buttonDisabled = true;
        return true;
      }
    }
    if (type == "edit") {
      if (this.editForm.valid) {
        this.buttonDisabled = false;
        return false;
      } else {
        this.buttonDisabled = true;
        return true;
      }
    }
    return false
  }

  editAddressClicked(index: any, data: any) {
    this.editAddress = true;
    this.editAddressIndex = index;

    this.editForm.reset();
    this.editForm.patchValue({
      default: data.default || false,
      name: data.name,
      phoneNo: data.phoneNo,
      pinCode: data.pinCode,
      houseNumber: data.houseNumber,
      line1: data.line1,
      country: data.country,
      state: data.state,
      city: data.city,
      landmark: data.landmark,
      type: data.type,
    });
  }

  updateAddress(id: any) {
    if (this.editForm.valid) {
      this.editForm.patchValue({ _id: id });
      let value = this.editForm.getRawValue();
      if (value.phoneNo.indexOf('+') == 0) {
        value.phoneNo = value.phoneNo.slice(3);
      }
      value.counrtyCode = '+91';

      const data = {
        address: value,
      };
      this.cartService
        .updateAddress(data)
        .toPromise()
        .then((res: any) => {
          this.editForm.reset();
          // this.toaster.success(res?.message);
          this.getUserAddress();
          this.editAddress = false;
        })
        .catch((err: any) => {
          // this.toaster.error(err.error?.message);
        });
    }
  }

  setDefault(event: any, item: any, i: any) {
    const data = {
      address: {
        ...item,
        default: true
      },
    };
    this.spinner.show();
    this.cartService.updateAddress(data).subscribe((res: any) => {
      this.spinner.hide();
      let updatedArr = this.dataArray.map((el: any) => {
        el.default = false;
        return el;
      });
      updatedArr[i].default = true;
      this.dataArray = updatedArr;
      // this.toaster.success(res?.message);
    }, (err: any) => {
      event.target.checked = false;
      this.spinner.hide();
      // this.toaster.error('Something went wrong');
    })
  }

  removeAddress(item: any) {
    const data = {
      _id: item,
    };

    this.cartService
      .removeAddress(data)
      .toPromise()
      .then((res: any) => {
        // this.toaster.success(res?.message);
        this.ngOnInit();
      })
      .catch((err: any) => {
        // this.toaster.error(err.error?.message);
      });
  }
}
