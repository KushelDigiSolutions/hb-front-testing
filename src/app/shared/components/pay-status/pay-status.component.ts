import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pay-status',
  standalone: true,
  imports: [],
  templateUrl: './pay-status.component.html',
  styleUrl: './pay-status.component.scss'
})
export class PayStatusComponent implements OnInit {
  status: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.status = this.route.snapshot.queryParams;

    let { resultStatus, resultMsg, resultCode, orderId, txnId, txnAmount, shortOrderID, paymentFor, consultant } = this.status;

    if (resultStatus == 'TXN_SUCCESS') {
      if (paymentFor == "HealthPackageBuy") {
        this.router.navigate([`/consult-us/doctor/${consultant}/book`], { queryParams: { shortOrderID, resultStatus, healthPackageBuyId: orderId, txnId, txnAmount, paymentFor } })
      } else {
        this.router.navigate(['/cart/checkout/thank-you'], { queryParams: { shortOrderID, resultStatus, orderId, txnId, txnAmount, paymentFor } })
      }
    } else if (resultStatus == 'TXN_FAILURE' || resultStatus == 'PENDING') {
      this.router.navigate(['/payment'], { queryParams: { resultStatus, resultMsg, resultCode, txnId, paymentFor } })
      // if (paymentFor == "order") {
      // } else if (paymentFor == "appointment") {
      //   this.router.navigate(['/consult-us'], { queryParams: { resultStatus, resultMsg, resultCode, txnId } })
      // }
    }
  }
}
