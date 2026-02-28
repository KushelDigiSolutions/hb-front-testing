import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ONLY_NUMBERS_PATTERN, testPattern } from '../../../../../../util/pattern.util';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { trimInputValue } from '../../../../../../util/input.util';
import { SpinnerService } from '../../../../../../services/spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { log } from 'console';
import { ApiService } from '../../../../../../services/api.service';

@Component({
  selector: 'app-add-health-stats',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, ToastrModule],
  templateUrl: './add-health-stats.component.html',
  styleUrl: './add-health-stats.component.scss'
})
export class AddHealthStatsComponent implements OnInit {
  type: 'vitals' | 'symptoms' = 'vitals';
  submitted = false;

  form = this.fb.group({
    vitals: this.fb.group({
      height: this.fb.group({
        unit: 'Cms',
        value: ['', [Validators.min(20), Validators.max(300)]]
      }),
      weight: this.fb.group({
        unit: 'kgs',
        value: ['', [Validators.min(1), Validators.max(500)]]
      }),
      pulse: this.fb.group({
        unit: 'BPM',
        value: ['', [Validators.min(40), Validators.max(180)]]
      }),
      temperature: this.fb.group({
        unit: '°F',
        value: ['', [Validators.pattern(/^\d+(\.\d{1})?$/), this.temperatureValidator]]
      }),
      respiratoryRate: this.fb.group({
        unit: 'min',
        value: ['', [Validators.min(5), Validators.max(30)]]
      }),
      spo: this.fb.group({
        unit: '%',
        value: ['', [Validators.min(80), Validators.max(100)]]
      }),
      bloodPressure: this.fb.group({
        unit: 'mm/Hg',
        value: ['', [this.bloodPressureValidator]]
      }),

    }),
    symptom: this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
    }),
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddHealthStatsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: 'vitals' | 'symptoms' },
    private toastr: ToastrService,
    private spinner: SpinnerService,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.type = this.data.type;
    if (this.type == 'vitals') {
      this.form.get('symptom')?.disable()
    } else {
      this.form.get('vitals')?.disable()
    }
  }
  bloodPressureValidator(control: FormControl) {
    let value: string = control.value

    if (value) {
      let bp = value.split('/'),
        [systolic, diastolic] = bp;
      if (bp.length != 2 || !(testPattern(ONLY_NUMBERS_PATTERN, systolic) && testPattern(ONLY_NUMBERS_PATTERN, diastolic)) || !(parseInt(systolic) && parseInt(diastolic))) return { bloodPressure: true };
    }
    return null
  }

  temperatureValidator(control: FormControl) {
    if (control.value) {
      let parsedValue = parseFloat(control.value)
      if (isNaN(parsedValue)) return { invalidValue: true }
      if (control.value < 32 || control.value > 110) return { invalidRange: true }
    }
    return null
  }

  onSubmit() {
    this.submitted = true;
    let { invalid, value }: any = this.form,
      { vitals, symptom }: any = value;
    console.log(invalid, value);
    if (invalid) {
      this.toastr.error('Please enter a valid data')
      return
    }
    let data: any = {}

    let endpoint: any = 'vitals'
    if (vitals) {
      data.vitals = {}
      Object.keys(vitals).forEach(key => {
        if (vitals[key].value) data.vitals[key] = vitals[key];
      });

    } else {
      endpoint = 'symptoms'
      data.name = symptom.name
      data.description = symptom.description
    }

    console.log('data = 117 = ', data);
    this.spinner.show()
    this.api.post('stats/' + endpoint, data).subscribe((res: any) => {
      this.spinner.hide()
      let { success, data } = res;
      if (success && data) {

        this.toastr.success('Updated Health Stats Successfully');
        this.dialogRef.close({ type: endpoint == 'vitals' ? 'vitals' : 'symptom', payload: data })
      }
    }, (err: HttpErrorResponse) => {
      this.spinner.hide()
      this.toastr.error(err.error?.message || 'Something went wrong');
    }, () => {
      this.spinner.hide()
    })
  }

  trimValue(input: any) {
    trimInputValue(input)
  }

  get v() {
    return (<FormGroup>this.form.get('vitals')).controls
  }

  get s() {
    return (<FormGroup>this.form.get('symptom')).controls
  }
}
