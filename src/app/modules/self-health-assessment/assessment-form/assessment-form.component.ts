import { CommonModule, SlicePipe, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID, Pipe } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SelfHealthAssessmentService } from '../../../services/self-health-assessment.service';
import { ToastrService } from 'ngx-toastr';
import { ChartType } from '../chart-interface/chartjs.model';
import { donutChart } from '../data-interface/data';
import { BaseChartDirective } from 'ng2-charts';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MetasService } from '../../../services/metas.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-assessment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SlicePipe,
    BaseChartDirective,
    FooterComponent,
    MatProgressBarModule,
  ],
  templateUrl: './assessment-form.component.html',
  styleUrl: './assessment-form.component.scss'
})

export class AssessmentFormComponent implements OnInit {
  productBrandTitle: string;
  basicDetailSelfAssessmentForm: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    phoneNumber: new FormControl(''),
  });

  assessmentId: string;
  instructions: any;
  assessment: any;
  submitted: any = {
    signin: false,
  }
  basicDetailsFrom: boolean = false;
  password_box: boolean = false;
  showQuestionnarie: boolean = false;
  activeTab: number = 0;
  questionForms: boolean = false;
  questions: any[];
  answerData: any = [];
  minCountValue: any = 0;
  maxCountValue: any = 1;
  submit: any;
  currentRunningQuestionNumber: any = 1;
  formSubmitted = false;
  userResult: any[];
  survayResponse: any;
  isBrowser: boolean = false;
  screenWidth: number;
  desktopScreen: boolean;
  isExpanded: boolean = false;
  s3Base: any = environment.imageUrl;
  emailEnds: string = '@gmail.com';

  // color = '#84FFA6';

  overviewChartJs: ChartType = {
    ...JSON.parse(JSON.stringify(donutChart)),
    labels: [],
    datasets: [
      {
        data: [0],
        backgroundColor: [
          '#0000FF', '#FF5349', '#2dd57c'
        ],
        hoverBackgroundColor: ['#0000FF', '#FF5349', '#2dd57c'],
        hoverBorderColor: '#fff',
      }
    ]
  };

  public vataChartJs: ChartType = {
    ...JSON.parse(JSON.stringify(donutChart)),
    labels: [],
    datasets: [
      {
        data: [0],
        backgroundColor: [
          '#0000FF', '#ccf'
        ],
        hoverBackgroundColor: ['#0000FF', '#ececec'],
        hoverBorderColor: '#fff',
      }
    ]
  };

  pittaChartJs: ChartType = {
    ...JSON.parse(JSON.stringify(donutChart)),
    labels: [],
    datasets: [
      {
        data: [0],
        backgroundColor: [
          '#FF5349', '#ffdddb'
        ],
        hoverBackgroundColor: ['#FF5349', '#ececec'],
        hoverBorderColor: '#fff',
      }
    ]
  };

  kaphaChartJs: ChartType = {
    ...JSON.parse(JSON.stringify(donutChart)),
    labels: [],
    datasets: [
      {
        data: [0],
        backgroundColor: [
          '#2dd57c', '#d5f7e5'
        ],
        hoverBackgroundColor: ['#2dd57c', '#ececec'],
        hoverBorderColor: '#fff',
      }
    ]
  };

  mode: any = 'determinate';
  progressBarValue: number = 0;
  bufferValue: number = 75;
  calculateValue: number = 1
  answer: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private selfHealthAssessmentService: SelfHealthAssessmentService,
    private toastr: ToastrService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private metasService: MetasService,
  ) { }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (typeof window !== undefined && isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth <= 768) {
        this.desktopScreen = false;
        this.productBrandTitle = "Self Health Assessment";
      } else {
        this.desktopScreen = true;
      }
    }
    this.assessmentId = this.route.snapshot.params['id'];

    this.basicDetailSelfAssessmentForm = this.formBuilder.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(3),
        Validators.maxLength(20)]],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ]
        ],
        email: ['', [Validators.required, Validators.email, this.gmailValidator]],
        phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
      }
    );


    this.getAssessment();
    this.getInstructions();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.basicDetailSelfAssessmentForm.controls;
  }

  gmailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (email && !email.endsWith('@gmail.com')) {
      return { gmailDomain: true };
    }
    return null;
  }

  getAssessment() {
    // this.spinner.show()
    this.selfHealthAssessmentService.getAssessmentsFromId(this.assessmentId).subscribe(res => {
      // this.spinner.hide()
      let { success, data }: any = res;
      if (success && data) {
        this.assessment = data;
        this.metasService.setMetaTags({
          title: data.name,
          description: data.name,
          image: data.image ? this.s3Base + data.image.savedName : null,
        });
      } else {
        console.log('No Data Found');
        // this.spinner.hide()
        this.router.navigate(['/404'], { replaceUrl: true })
      }
    }, (err: HttpErrorResponse) => {

    })
  }

  showInstructions() {
    this.scrollToTop()
    if (this.basicDetailSelfAssessmentForm.invalid) {
      this.toastr.error('Please fill all basic details to proceed');
    } else {
      this.activeTab = 1;
      this.showQuestionnarieForm();
    }
    // this.activeTab = 1;
    // this.showQuestionnarieForm();
  }

  getInstructions() {
    this.selfHealthAssessmentService.getInstructions(this.assessmentId).subscribe((res: any) => {
      this.instructions = res.data;
    }, (err: HttpErrorResponse) => {
      // this.toastr.errorToastr(err.error.error);
    })
  }

  showSelfHealthQuestions() {
    this.scrollToTop()
    this.activeTab = 2;
  }

  showQuestionnarieForm() {
    if (!this.password_box) {
      if (true) {
        this.showQuestionnarie = true;
        this.questionForms = true;
        if (this.showQuestionnarie) {
          this.selfHealthAssessmentService
            .getQuestions(this.assessmentId).subscribe((res: any) => {

              this.questions = res?.data;

              for (let k in this.questions) {
                let data: any = {
                  question: this.questions[k].question,
                  question_id: this.questions[k]._id,
                  answer: '',
                  valueAnswer: [],
                };
                this.answerData.push(data);
              }
            }, (err: HttpErrorResponse) => {
              console.log(err);
            });
        }
      }
    }
  }

  backToHomePage() {
    this.router.navigate(["/"]);
  }

  getValue(event: any, question: any, option: any) {
    const questionIndex = this.questions.findIndex(q => q._id === question._id);
    if (event.target.checked) {
      if (question.type === 'single') {
        this.answerData[questionIndex].answer = event.target.value;
        this.answerData[questionIndex].valueAnswer = [option.title];
      } else if (question.type === 'multiple') {
        if (!this.answerData[questionIndex].valueAnswer.includes(event.target.value)) {
          this.answerData[questionIndex].valueAnswer.push(event.target.value);
        }
      }
    } else {
      const valueIndex = this.answerData[questionIndex].valueAnswer.indexOf(event.target.value);
      if (valueIndex > -1) {
        this.answerData[questionIndex].valueAnswer.splice(valueIndex, 1);
      }
    }
  }

  countIncrement() {
    if (this.maxCountValue < this.questions.length) {
      this.currentRunningQuestionNumber += 1;
      this.minCountValue += 1;
      this.maxCountValue += 1;
    }
    this.progressBarValue += 1;
    this.calculateValue = this.progressBarValue / this.questions.length * 100;
    this.submit = this.maxCountValue >= this.questions.length;
    this.scrollToTop()
  }

  countDecrement() {
    if (this.minCountValue > 0) {
      this.currentRunningQuestionNumber -= 1;
      this.minCountValue -= 1;
      this.maxCountValue -= 1;
    }
    this.progressBarValue -= 1;
    this.calculateValue = this.progressBarValue / this.questions.length * 100;
    this.submit = this.maxCountValue >= this.questions.length;
  }


  isSelected(question: any, option: any): boolean {
    const questionIndex = this.questions.findIndex(q => q._id === question._id);
    if (question.type === 'single') {
      return this.answerData[questionIndex].answer === (option.category ? option.category : option.title);
    } else if (question.type === 'multiple') {
      return this.answerData[questionIndex].valueAnswer.includes(option.category ? option.category : option.title);
    }
    return false;
  }


  submitForm() {
    const tempData = this.answerData.filter((data: any) => data.answer.length > 0);
    this.userResult = tempData;
    if (this.userResult.length) {
      const data = {
        ...this.basicDetailSelfAssessmentForm.value,
        result: this.userResult,
        assessment_id: this.assessmentId,
        countryCode: '+91'
      };

      if (data.phone) {
        const { dialCode, e164Number } = data.phone;
        data.countryCode = dialCode;
        data.phone = e164Number.substr(dialCode.length);
      }

      this.selfHealthAssessmentService.postSurvey(data).subscribe(res => {
        const { success, data } = res;
        if (success) {
          document.querySelector('app-secondary-header')?.scrollIntoView({ behavior: 'smooth' });
          this.activeTab = 3;
          this.survayResponse = data;
          const { vata, pitta, kapha } = this.survayResponse.analysis;

          this.overviewChartJs.datasets[0].data = [vata, pitta, kapha];
          this.vataChartJs.datasets[0].data = [vata, 100 - vata];
          this.pittaChartJs.datasets[0].data = [pitta, 100 - pitta];
          this.kaphaChartJs.datasets[0].data = [kapha, 100 - kapha];
        }
      }, (err: any) => {
        console.log(err);
      });
    } else {
      this.toastr.error('Please answer at least one question');
    }
  }

  scrollToTop() {
    window.scroll({ top: 0, left: 0, behavior: "smooth" })
  }

}

