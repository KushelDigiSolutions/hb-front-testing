import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserAddressComponent } from './user-address/user-address.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { UserAppoinmentsComponent } from './user-appoinments/user-appoinments.component';
import { UserHealthStatsComponent } from './user-health-stats/user-health-stats.component';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, UserProfileComponent, UserAddressComponent, UserOrdersComponent, UserAppoinmentsComponent, UserHealthStatsComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  imgUrl = environment.imageUrl;
  activeView: string = '';
  views = ['editprofile', 'orders', 'addresses', 'appointments', 'paymentmethods'];
  dashboardData: any = [
    {
      icon: "dashboard-profile.svg",
      iconLoc: 'assets',
      dashboardValue: 'View Profile',
      url: "/my-account",
    },
    {
      icon: "dashboard-health-stats-green.svg",
      iconLoc: 'server',
      dashboardValue: 'Health Stats',
      url: "/my-account/health-stats",
    },
    {
      icon: "dashboard-my orders.svg",
      iconLoc: 'assets',
      dashboardValue: 'My Orders',
      url: "/my-account/orders",
    },
    {
      icon: "dashboard-address.svg",
      iconLoc: 'assets',
      dashboardValue: 'Manage Address',
      url: "/my-account/manage-address",
    },
    {
      icon: "dashboard-appointment.svg",
      iconLoc: 'assets',
      dashboardValue: 'My Appointments',
      url: "/my-account/appointments",
    },
    // {
    //   icon: "medicine-box-green.svg",
    //   iconLoc: 'assets',
    //   dashboardValue: 'My Subsctiptions',
    //   url: "/my-account/my-subscriptions",
    // },
    // {
    //   icon: "test-tube.svg",
    //   iconLoc: 'assets',
    //   dashboardValue: 'Lab Tests',
    //   url: "/my-account/lab-tests",
    // },
    // {
    //   icon: "dashboard-card.svg",
    //   iconLoc: 'assets',
    //   dashboardValue: this.translateService.instant("dashboard.paymentMethods"),
    //   url: "",
    // },
  ];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private toaster: ToastrService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((res: any) => {
      this.activeView = res.view
    })
  }

  onLogout() {
    this.commonService.removeUser();
    // this.cartCount.cartCount.next(0);
    // this.cartCount.wishListCount.next(0);
    this.toaster.success('Successfully Logout');
    this.router.navigate(['/'], { replaceUrl: true });
  }
}
