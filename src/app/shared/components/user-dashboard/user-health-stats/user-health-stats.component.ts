import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { getTotalDaysInMonth, getFormatedDate } from "../../../../../app/util/date.util";
import { UserDashboardService } from '../../../../services/user-dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { register } from 'swiper/element/bundle';
import { CardComponent } from '../../../../components/card/card.component';
import { AddHealthStatsComponent } from './component/add-health-stats/add-health-stats.component';
register();


@Component({
  selector: 'app-user-health-stats',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatMenuModule, CardComponent, AddHealthStatsComponent],
  templateUrl: './user-health-stats.component.html',
  styleUrl: './user-health-stats.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserHealthStatsComponent implements OnInit {

  tabs = {
    symptoms: {
      label: 'Symptoms'
    },
    vitals: {
      label: 'Vitals'
    },
  }
  activeTab: 'symptoms' | 'vitals' = 'vitals';
  swiperBreakpints: any = {
    // when window width is >= 320px
    320: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 3,
      spaceBetween: 30
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 4,
      spaceBetween: 40
    },
    768: {
      slidesPerView: 4.5,
      spaceBetween: 25
    },
    1024: {
      slidesPerView: 6.5,
      spaceBetween: 15
    }
  }
  slideCount = 4;
  // config: SwiperOptions = {
  //   slidesPerView: 7,
  //   spaceBetween: 0,
  //   navigation: false,
  //   // pagination: { clickable: true },
  //   // scrollbar: { draggable: true },
  //   freeMode: true,
  //   breakpoints: {
  //     0: {
  //       slidesPerView: 2
  //     },
  //     350: {
  //       slidesPerView: 3
  //     },
  //     500: {
  //       slidesPerView: 4
  //     },
  //     600: {
  //       slidesPerView: 5
  //     },
  //     992: {
  //       slidesPerView: 6
  //     },
  //     1200: {
  //       slidesPerView: 7
  //     },
  //   }
  // };

  vitalsData: any = {
    height: [],
    weight: [],
    pulse: [],
    temperature: [],
    respiratoryRate: [],
    spo: [],
    bloodPressure: [],
  }
  // VitalChartData
  vitals: { [key: string]: any } = {
    height: {},
    weight: {},
    pulse: {},
    temperature: {},
    respiratoryRate: {},
    spo: {},
    bloodPressure: {},
  };

  rangeForm: FormGroup;
  maxDate: string;

  firstRenderSymptomsSlider = true;
  symptomsData: any = [];
  symptomsList: any = [];
  sliderDate: Date;
  symptomsFilters = {};
  selectedDay = null;

  constructor(
    private dashboardService: UserDashboardService,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initRangeForm()
    this.getVitals();
    this.changeSymptomsFilterDate();
  }

  initRangeForm() {
    let currentDate = new Date()
    let startDate: any = new Date();
    this.maxDate = getFormatedDate(currentDate);
    startDate.setDate(startDate.getDate() - getTotalDaysInMonth(startDate))
    startDate = getFormatedDate(startDate)

    this.rangeForm = this.fb.group({
      endDate: [this.maxDate, Validators.required],
      startDate: [startDate, Validators.required],
    })
  }

  getVitals() {
    let { invalid, value }: any = this.rangeForm;

    if (invalid) return;
    let { startDate, endDate } = value;

    let reqData = {
      startDate,
      endDate,
    }
    console.log(value);

    this.resetVitalsData();
    this.dashboardService.getVitals(reqData).subscribe(res => {
      let { success, data }: any = res;
      if (success && data) {
        data.forEach((el: any) => {
          Object.keys(el.vitals).forEach(key => {
            if (!this.vitalsData[key]) this.vitalsData[key] = [];
            this.vitalsData[key].push({ ...el.vitals[key], createdBy: el.createdBy })
          })
        });
        console.log({ vitalsData: this.vitalsData });
        this.updateVitalsGraph()
      } else {

      }
    }, (err: HttpErrorResponse) => {
      console.log(err);

    })
  }

  updateVitalsGraph() {
    this.createBarChart()
    this.createAreaChart()
    this.createBloodPressureChart()
  }

  createBarChart() {
    ['height', 'weight'].forEach(vital => {
      let seriesData: any = []
      let categories: any = []

      this.vitalsData[vital]?.forEach((el: any, index: number) => {
        seriesData.push(el.value)
        categories.push(el.date)
      })

      this.vitals[vital] = {
        series: [seriesData],
        xaxis: {
          categories
        }
      };
    })

    this.vitals = { ...this.vitals };
    console.log('[graph data]', this.vitals);
  }

  createAreaChart() {
    ['pulse', 'temperature', 'respiratoryRate', 'spo'].forEach(vital => {
      let seriesData: any = []
      let categories: any = []

      this.vitalsData[vital]?.forEach((el: any, index: number) => {
        seriesData.push(el.value)
        categories.push(el.date)
      })

      this.vitals[vital] = {
        series: [seriesData],
        xaxis: {
          categories
        }
      };
    })
  }

  createBloodPressureChart() {
    ['bloodPressure'].forEach(vital => {
      let seriesData: any = []
      let seriesData2: any = []
      let categories: any = []

      this.vitalsData[vital]?.forEach((el: any, index: number) => {
        let [systolic, diastolic] = el.value.split('/')
        seriesData.push(systolic)
        seriesData2.push(diastolic)
        categories.push(el.date)
      })

      this.vitals[vital] = {
        series: [seriesData, seriesData2],
        xaxis: {
          categories
        }
      };
    })
  }

  resetVitalsData() {
    this.vitalsData = {
      height: [],
      weight: [],
      pulse: [],
      temperature: [],
      respiratoryRate: [],
      spo: [],
      bloodPressure: [],
    }
  }

  onChangeTab(key: any) {
    this.activeTab = key;
  }

  openModal() {
    this.dialog.open(AddHealthStatsComponent, {
      width: '800px',
      data: {
        type: this.activeTab
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.onUpdatedStats(result);
      }
    });
  }
  onUpdatedStats(data: { type: 'vitals' | 'symptom', payload: any }) {
    if (data.type == 'symptom') {
      if (this.isSameMonthAndYear(this.sliderDate)) {
        this.symptomsData.push(data.payload)
        this.updateSymptomsSlider();
      }
    } else {
      this.getVitals()
    }

  }

  changeSymptomsFilterDate(action?: 'next' | 'prev') {
    let startDate = '';
    let endDate = '';
    let date: Date;
    this.firstRenderSymptomsSlider = false;
    // this.sliderDate.setHours(0, 0, 0, 0);

    if (action == 'next') {
      if (this.isSameMonthAndYear(this.sliderDate)) return;
      date = new Date(this.sliderDate);
      date = new Date(date.setMonth(date.getMonth() + 1))

      let month = date.getMonth() + 1;
      startDate = `${date.getFullYear()}-${month < 10 ? '0' + month : month}-01`
      endDate = `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${getTotalDaysInMonth(date)}`
    } else if (action == 'prev') {
      date = new Date(this.sliderDate);
      date.setMonth(date.getMonth() - 1)

      let month = date.getMonth() + 1;
      startDate = `${date.getFullYear()}-${month < 10 ? '0' + month : month}-01`
      endDate = `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${getTotalDaysInMonth(date)}`
    } else {
      date = new Date()
      let month = date.getMonth() + 1;

      startDate = `${date.getFullYear()}-${month < 10 ? '0' + month : month}-01`
      endDate = `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${getTotalDaysInMonth(date)}`
    }

    this.sliderDate = date;
    this.symptomsFilters = {
      startDate,
      endDate
    }
    this.getSymptoms()

  }

  isSameMonthAndYear(date: string | Date) {
    let currentDate = new Date()
    date = new Date(date);
    return currentDate.getMonth() == date.getMonth() && currentDate.getFullYear() == date.getFullYear()
  }

  getSymptoms() {
    // this.spinner.show()
    this.dashboardService.getSymptoms({ ...this.symptomsFilters }).subscribe(res => {
      // this.spinner.hide()
      let { success, data }: any = res;
      if (success && data) {
        this.symptomsData = data;
        this.updateSymptomsSlider()
      } else {

      }
    }, (err: HttpErrorResponse) => {
      // this.spinner.hide()
      console.log(err);


    })
  }

  updateSymptomsSlider() {
    let days = getTotalDaysInMonth(this.sliderDate)
    if (this.isSameMonthAndYear(this.sliderDate)) {
      days = this.getCurrentDay();
    }
    let date = new Date(this.sliderDate)
    let month = date.getMonth() + 1;
    let monthString = date.toString().slice(4, 7);
    this.symptomsList = new Array(days).fill(null).map((_, index) => {
      let day = index + 1;
      let symptoms = this.symptomsData.filter((el: any) => getFormatedDate(el.createdAt) == `${date.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`)
      return {
        label: `${day < 10 ? '0' + day : day} ${monthString}`,
        day,
        symptoms
      }
    })

  }

  onSwiper(swiper: any) {
    console.log(swiper);
    swiper.activeIndex = this.getCurrentDay() - 1;
  }
  onSlideChange() {
    console.log('slide change');
  }

  getCurrentDay() {
    return new Date().getDate();
  }

  onSelectDay(data: any) {
    this.selectedDay = data;
  }

}
