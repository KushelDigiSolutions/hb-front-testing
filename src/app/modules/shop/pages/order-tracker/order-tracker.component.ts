import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { MetasService } from '../../../../services/metas.service';
import { Error404Component } from '../../../../shared/components/error-404/error-404.component';

interface Tracker {
  showAllProducts?: boolean,
  products: Array<{
    name: string
    quantity: number
    brand: string
  }>,
  status: {
    loading: boolean
    loadingError: boolean
    status?: string
    activeStep: number
    dateTime?: string
  },
  expectedDeliveryDate: null | string,
  carrier: null | "Delhivery" | "Other"
  trackingDetails?: {
    trackingId: string,
    trackingUrl?: string
  }
}

@Component({
  standalone: true,
  imports: [CommonModule, Error404Component],
  selector: 'app-order-tracker',
  templateUrl: './order-tracker.component.html',
  styleUrls: ['./order-tracker.component.scss']
})
export class OrderTrackerComponent implements OnInit {

  breadcrumb = [
    {
      type: "orders",
      name: "My orders",
    },
    {
      type: "product",
      name: "Track your order",
    },
  ];
  notFound = false;
  progress: { h: { [key: number]: string },v: { [key: number]: string } } = {
    h: {
      1: '1',
      2: '35',
      3: '65',
      4: '100'
    },
    v: {
      1: '2',
      2: '40',
      3: '71',
      4: '100'
    },
  }
  integratedCarriers = ['Delhivery', 'Other'];
  order: any;
  trackers: Array<Tracker> = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private meta: MetasService,
  ) { }

  ngOnInit(): void {
    this.meta.setMetaTags({ title: 'Track your order' });
    this.fetchOrder();

  }

  fetchOrder() {
    let { _id } = this.route.snapshot.queryParams;
    if (!_id) return;

    this.api.get('orders/detail', { params: { _id } }).subscribe((res: any) => {
      const { status, data } = res;
      if (status && data) {

        const { shippingDetails, products, createdAt } = data;
        if (shippingDetails.length) {
          shippingDetails.forEach((shipment: any, index: number) => {
            const tracker: Tracker = {
              products: shipment.products.map((el: any) => {
                return {
                  name: el.name,
                  quantity: el.quantityToShip,
                  brand: el.seller
                };
              }),
              status: {
                activeStep: 1,
                loading: true,
                loadingError: false,
              },
              expectedDeliveryDate: null,
              carrier: shipment.carrier,
              trackingDetails: {
                trackingId: shipment.trackingCode,
                trackingUrl: shipment.trackUrl
              }
            }
            this.trackers.push(tracker);
            this.fetchShipmentDetails(shipment.carrier, shipment.trackingCode, shipment, tracker)
          })

        } else {
          this.trackers.push({
            products: products.map((el: any) => {
              return {
                name: el.productId.name,
                quantity: el.quantity,
                brand: el.seller
              };
            }),
            status: {
              loading: false,
              loadingError: false,
              status: 'Order placed',
              activeStep: 1,
              dateTime: createdAt
            },
            expectedDeliveryDate: null,
            carrier: null,
          })
        }
        data.shippingInfo.fullAddress = ['houseNumber', 'line1', 'line2', 'city', 'state'].map(key => data.shippingInfo.address[key]).filter(el => Boolean(el)).join(', ');
        this.order = data;
      } else {
        this.notFound = true
      }
    }, (err: HttpErrorResponse) => {
      this.notFound = true
    });
  }

  fetchShipmentDetails(carrier: string, trackingCode: string, orderShipment: any, tracker: Tracker) {
    switch (carrier) {
      case 'Delhivery': {
        this.fetchDelhiveryShipment(trackingCode, tracker)
        break;
      } case 'Other': {
        const { statusDetails, updatedAt } = orderShipment;
        let activeStep = 1;
        let index = ['processing', 'dispatched', 'outForDelivery', 'delivered'].indexOf(statusDetails);
        if (index != -1) {
          activeStep = index + 1;
        }
        tracker.status = {
          loading: false,
          loadingError: false,
          status: statusDetails,
          activeStep,
          dateTime: updatedAt
        }
        break;
      }
    }
  }

  fetchDelhiveryShipment(waybill: string, tracker: Tracker) {
    this.api.get('shipments/trackorder', { params: { waybill } }).subscribe((res: any) => {
      const { success, data } = res;
      if (success && !data.Error) {
        const { Status } = data.ShipmentData[0].Shipment;
        const status = Status.Status;
        let activeStep = 1;

        if (status == "In Transit") {
          activeStep = 2;
        } else if (status == "Dispatched") {
          activeStep = 3;
        } else if (status == "Delivered") {
          activeStep = 4;
        }

        tracker.status = {
          loading: false,
          loadingError: false,
          status,
          activeStep,
          dateTime: Status.StatusDateTime
        };
      } else {
        tracker.status.loading = false;
        tracker.status.loadingError = true;
      }
    }, err => {
      tracker.status.loading = false;
      tracker.status.loadingError = true;
    });

  }
}
