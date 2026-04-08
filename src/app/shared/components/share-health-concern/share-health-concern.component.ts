import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConsultUsService } from '../../../modules/consult-us/services/consult-us.service';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-share-health-concern',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule, FormsModule],
  templateUrl: './share-health-concern.component.html',
  styleUrl: './share-health-concern.component.scss'
})
export class ShareHealthConcernComponent implements OnInit {
  topHealthConcern: any = [];
  concernFormGroup: FormGroup;
  user: any | null;
  OHCList: any[] = [];
  selectedOtherHC: any[] = [];
  searchPlace: string = "Couldn't find your health concern in the list above? Enter here";
  @Output() newItemEvent = new EventEmitter<any>();


  // ///////////////////
  selectedItem: string;
  dropdownItems: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4']; // Your dropdown options
  filteredItems: string[];


  //////////////

  constructor(
    private consultusService: ConsultUsService,
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) {
    this.concernFormGroup = this.formBuilder.group({
      concern: [[]],
    });

    this.filteredItems = this.dropdownItems.slice();
  }

  ngOnInit(): void {
    this.user = this.commonService.getUser();
    // this.user = this.cartService.getUser();
    let queryParams;
    if (this.user) {

      let tempUser: any = typeof this.user == 'string' ? JSON.parse(this.user) : this.user;
      console.log('this.user = 32 ', tempUser.data.userData._id);


      if (this.user) {
        queryParams = { userId: tempUser.data.userData._id }
      }
    }

    forkJoin([this.consultusService.getTopHealthConcerns(), this.consultusService.getHealthConcernsList(queryParams)])
      .subscribe((res: any[]) => {
        res = JSON.parse(JSON.stringify(res));
        console.log('res = ', res);

        let topConcernsList = res[0].data.healthConcerns.map((el: any) => {
          return {
            _id: el._id,
            name: el.name,
            active: false,
          }
        });
        let otherConcernsList = res[1].data;
        let concernControl: any = this.concernFormGroup.get("concern");

        topConcernsList = topConcernsList.map((el: any) => {
          let concern = otherConcernsList.find((el1: any) => el1._id == el._id);
          if (concern && concern.activeForUser) {
            el.active = true;
            concernControl.value;
            concernControl.setValue([...concernControl.value, { _id: el._id, source: 'topConcern' }]);
          }
          return el;
        });

        otherConcernsList = otherConcernsList.filter((el: any) => {
          let concern = topConcernsList.find((el1: any) => el1._id == el._id);
          concern
          return !concern;
        });

        this.topHealthConcern = topConcernsList;
        this.OHCList = otherConcernsList;
        this.selectedOtherHC = this.OHCList.filter(el => el.activeForUser).map(el => el._id);

        this.OHCList.map((el: any) => {
          if (el.activeForUser) {
            el.active = true;
            concernControl.value;
            concernControl.setValue([...concernControl.value, { _id: el._id, source: 'otherConcern' }]);
          }
        });
        
      }, (err: any) => {
        console.log('err = ', err);

      })
  }

  toggleTopConcern(item: any) {
    let control: any = this.concernFormGroup.get("concern")
    let updatedValue = [...control.value];

    if (item.active) {
      item.active = false
      let index = control.value.findIndex((value: any) => value._id == item._id);
      updatedValue.splice(index, 1);
      control.setValue(updatedValue);

    } else {
      item.active = true;
      updatedValue.push({ _id: item._id, source: 'topConcern' });
      control.setValue(updatedValue);
    }
    // this.newItemEvent.emit(control.value);
  }
  onChangeOtherConcerns(value: any, eventType: 'add' | 'remove' | 'clear') {
    let control: any = this.concernFormGroup.get("concern")
    let updated = [...control.value];
    switch (eventType) {
      case 'add': {
        control.setValue([...control.value, { _id: value._id, source: 'otherConcern' }]);
        break;
      }
      case 'remove': {
        updated = updated.filter(val => val._id != value.value._id);
        control.setValue(updated);
        break;
      }
      case 'clear': {
        updated = updated.filter(val => val.source != 'otherConcern');
        control.setValue(updated);
        break;
      }
    }
    this.newItemEvent.emit(control.value);
  }


  ////////////////
  filterItems() {
    this.filteredItems = this.dropdownItems.filter(item =>
      item.toLowerCase().includes(this.selectedItem.toLowerCase())
    );
  }

  selectItem(item: string) {
    this.selectedItem = item;
    this.filteredItems = this.dropdownItems.slice(); // Reset filteredItems when an item is selected
  }

}
