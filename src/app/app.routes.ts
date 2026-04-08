import { Routes } from '@angular/router';

import { UserDashboardComponent } from './shared/components/user-dashboard/user-dashboard.component';
import { UserOrdersComponent } from './shared/components/user-dashboard/user-orders/user-orders.component';
import { UserProfileComponent } from './shared/components/user-dashboard/user-profile/user-profile.component';
import { UserHealthStatsComponent } from './shared/components/user-dashboard/user-health-stats/user-health-stats.component';
import { UserAddressComponent } from './shared/components/user-dashboard/user-address/user-address.component';
import { UserAppoinmentsComponent } from './shared/components/user-dashboard/user-appoinments/user-appoinments.component';
import { HealthPackageSubscriptionComponent } from './shared/components/user-dashboard/health-package-subscription/health-package-subscription.component';
import { ConsultationCalendarComponent } from './modules/consultation-calendar/consultation-calendar.component';
import { SelfHealthAssessmentComponent } from './modules/self-health-assessment/self-health-assessment.component';
import { bulkSuccessGuard } from './guards/bulk-success.guard';
import { ProductRedirectGuard } from './guards/product-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../app/modules/shop/pages/shop-home/shop-home.component').then(
        (comp) => comp.ShopHomeComponent,
      ),
  },
  {
    path: 'cart/:type',
    loadComponent: () =>
      import('../app/shared/components/cart/cart.component').then(
        (comp) => comp.CartComponent,
      ),
  },
  // {
  //     path: "product/:product-slug", loadComponent: () =>
  //         import('../app/modules/shop/pages/product-details/product-details.component').then(
  //             (comp) => comp.ProductDetailsComponent
  //         )
  // },
  // REDIRECT URLS MOVED TO SERVER>.js
  /*
    { path: 'product/rana-herbals-lecostop-syrup-200-200-ml', redirectTo: 'product/rana-herbals-lecostop-syrup-200-ml', pathMatch: 'full' },
    { path: 'product/rana-herbals-twenty-20-capsule-10-cap-10-cap', redirectTo: 'product/rana-herbals-twenty-20-capsule-10-cap', pathMatch: 'full' },
    { path: 'product/rana-herbals-turanti-10-cap-10-cap', redirectTo: 'product/rana-herbals-turanti-10-cap', pathMatch: 'full' },    
    { path: 'product/rana-herbals-super-top-10-cap-10-cap', redirectTo: 'product/rana-herbals-super-top-10-cap', pathMatch: 'full' },    
    { path: 'product/rana-herbals-tilla-oil-15-ml-15-ml', redirectTo: 'product/rana-herbals-tilla-oil-15-ml', pathMatch: 'full' },
    { path: 'product/rana-herbals-orthomus-oil-30-ml-30-ml', redirectTo: 'product/rana-herbals-orthomus-oil-30-ml', pathMatch: 'full' },    
    { path: 'product/rana-herbals-liv-rich-200-ml-200-ml', redirectTo: 'product/rana-herbals-liv-rich-200-ml', pathMatch: 'full' },
    { path: 'product/rana-herbals-lecostop-10-cap-10-cap', redirectTo: 'product/rana-herbals-lecostop-10-cap', pathMatch: 'full' },
    { path: 'product/rana-herbals-lecostop-syrup-200-ml-200-ml', redirectTo: 'product/rana-herbals-lecostop-syrup-200-ml', pathMatch: 'full' },
    { path: 'product/rana-herbals-hair-oil-100-ml-100-ml', redirectTo: 'product/rana-herbals-hair-oil-100-ml', pathMatch: 'full' },
    { path: 'product/rana-herbals-jeevan-gold-plus-7-cap-7-cap', redirectTo: 'product/rana-herbals-jeevan-gold-plus-7-cap', pathMatch: 'full' },
    { path: 'product/rana-badshahi-gold-extra-time-10-cap-10-cap', redirectTo: 'product/rana-badshahi-gold-extra-time-10-cap', pathMatch: 'full' },
    { path: 'product/rana-herbals-badshah-gold-10-cap-10-cap', redirectTo: 'product/rana-herbals-badshah-gold-10-cap', pathMatch: 'full' },
    { path: 'product/rana-herbals-badshah-gold-10-cap-2-cap', redirectTo: 'product/rana-herbals-badshah-gold-2-cap', pathMatch: 'full' },
    { path: 'product/chirayu-gynae-nova-malt-400-gm-400-gm', redirectTo: 'product/chirayu-gynae-nova-malt-400-gm', pathMatch: 'full' },
    { path: 'product/chirayu-fitness-malt-400-gm-400-gm', redirectTo: 'product/chirayu-fitness-malt-400-gm', pathMatch: 'full' },
    { path: 'product/chirayu-fitness-malt-400-gm-900-gm', redirectTo: 'product/chirayu-fitness-malt-900-gm', pathMatch: 'full' },
    { path: 'product/chirayu-madhuras---200-gm-200-gm', redirectTo: 'product/chirayu-madhuras-200-gm', pathMatch: 'full' },
    { path: 'product/chirayu-madhuras---200-gm-500-gm', redirectTo: 'product/chirayu-madhuras-500-gm', pathMatch: 'full' },
    { path: 'product/chirayu-madhuras---200-gm-1-kg', redirectTo: 'product/chirayu-madhuras-1-kg', pathMatch: 'full' },
    { path: 'product/chirayu-zymo-capsule-30-cap-30-cap', redirectTo: 'product/chirayu-zymo-capsule-30-cap', pathMatch: 'full' },
    { path: 'product/chirayu-zymo-capsule-30-cap-100-cap', redirectTo: 'product/chirayu-zymo-capsule-100-cap', pathMatch: 'full' },
    { path: 'product/chirayu-shodhak---30-cap-100-cap', redirectTo: 'product/chirayu-shodhak-100-cap', pathMatch: 'full' },
    { path: 'product/chirayu-shodhak---30-cap-30-cap', redirectTo: 'product/chirayu-shodhak-30-cap', pathMatch: 'full' },
    { path: 'product/chirayu-s-v-swasthyavardhak-30-cap-30-cap', redirectTo: 'product/chirayu-s-v-swasthyavardhak-30-cap', pathMatch: 'full' },
    { path: 'product/chirayu-rheumofit-capsules-30-cap-30-cap', redirectTo: 'product/chirayu-rheumofit-capsules-30-cap', pathMatch: 'full' },
    { path: 'product/chirayu-rheumofit-capsules-30-cap-100-cap', redirectTo: 'product/chirayu-rheumofit-capsules-100-cap', pathMatch: 'full' },
    { path: 'product/chirayu-prostoscan-capsules-60-cap-60-cap', redirectTo: 'product/chirayu-prostoscan-capsules-60-cap', pathMatch: 'full' },
    { path: 'product/-chirayu-piles-care-cap-30-cap-30-cap', redirectTo: 'product/chirayu-piles-care-cap-30-cap', pathMatch: 'full' },
    { path: 'product/-chirayu-piles-care-cap-30-cap-100-cap', redirectTo: 'product/chirayu-piles-care-cap-100-cap', pathMatch: 'full' },
    { path: 'product/chirayu-mensonorm-capsules-5-cap-5-cap', redirectTo: 'product/chirayu-mensonorm-capsules-5-cap', pathMatch: 'full' },
    { path: 'product/chirayu-mensonorm-capsules-5-cap-12-cap', redirectTo: 'product/chirayu-mensonorm-capsules-12-cap', pathMatch: 'full' },
    { path: 'product/chirayu-mensonorm-capsules-5-cap-30-cap', redirectTo: 'product/chirayu-mensonorm-capsules-30-cap', pathMatch: 'full' },
    { path: 'product/chirayu-memoreez-30-100-cap', redirectTo: 'product/chirayu-memoreez-100-cap', pathMatch: 'full' },
    { path: 'product/chirayu-memoreez-30-30-cap', redirectTo: 'product/chirayu-memoreez-30-cap', pathMatch: 'full' },
    { path: 'product/chirayu-femiscan-capsules-30-cap-30-cap', redirectTo: 'product/chirayu-femiscan-capsules-30-cap', pathMatch: 'full' },
    { path: 'product/chirayu-femiscan-capsules-30-cap-100-cap', redirectTo: 'product/chirayu-femiscan-capsules-100-cap', pathMatch: 'full' },
    { path: 'product/chirayu-heart-capsule-30-cap-30-cap', redirectTo: 'product/chirayu-heart-capsule-30-cap', pathMatch: 'full' },
    { path: 'product/chirayu-heart-capsule-30-cap-100-cap', redirectTo: 'product/chirayu-heart-capsule-100-cap', pathMatch: 'full' },

    { path: 'health-concern/sitopaladi-churna', redirectTo: 'product/tikaram-naturals-sitopaladi-churan-30-gm', pathMatch: 'full' },
    { path: 'health-concern/vyas-kaunch-beej-churna', redirectTo: 'product/vyas-kaunch-beej-churna-100-gm', pathMatch: 'full' },
    { path: 'health-concern/vyas-gokhru-churan', redirectTo: 'product/vyas-gokhru-churan-100-gm', pathMatch: 'full' },
    { path: 'product/tikaram-naturals-musli-safed-10-gm', redirectTo: 'product/tikaram-naturals-musli-safed-250-gm', pathMatch: 'full' },
    { path: 'herb/pipal-choti', redirectTo: 'product/tikaram-naturals-lakh-pipal-10-gm', pathMatch: 'full' },
    { path: 'product/tikaram-naturals-bel-murabba-500-g', redirectTo: 'product/tikaram-naturals-gulkand-murabba-500-gm', pathMatch: 'full' },
    { path: 'gola-coconut-oil-38247.html', redirectTo: 'product/tikaram-naturals-coconut-oil-100-ml', pathMatch: 'full' },
    { path: 'product/tikaram-naturals-awla-reetha-shikakai-powder-10-gm', redirectTo: 'product/tikaram-naturals-awla-reetha-shikakai-powder-250-gm', pathMatch: 'full' },
    { path: 'health-concern/shatavaryadi-churan', redirectTo: 'product/shatavaryadi-churan-60-gm', pathMatch: 'full' },
    { path: 'health-concern/rex-qurs-jiryan', redirectTo: 'product/rex-qurs-jiryan-50-tab', pathMatch: 'full' },
    { path: 'product/tikaram-kaddu-giri-pumpkin-seeds-for-eating-immunity-booster-and-rich-protein-seeds-healthy-diet-snacks-weight-management-rich-in-fibre',
         redirectTo: 'product/pumpkin-seed-oil-kadu-30-ml', pathMatch: 'full' },
    { path: 'oil/peppermint-oil', redirectTo: 'product/peppermint-oil-10-ml', pathMatch: 'full' },
    { path: 'product/ashvagandharishta-dhootapapeshwar-450-ml', redirectTo: 'product/multani-ashvagandharishta-450-ml', pathMatch: 'full' },
    { path: 'oil/lavender-oil', redirectTo: 'product/lavender-oil-10-ml', pathMatch: 'full' },
    { path: 'health-concern/kankasava', redirectTo: 'product/kankasava-450-ml', pathMatch: 'full' },
    { path: 'product/himalaya-triphala-tablet-1-unit', redirectTo: 'product/herbal-canada-triphala-tablet-100-tab', pathMatch: 'full' },
    { path: 'product/premium-healthy-diwali-gift-pack-900-gm', redirectTo: 'product/diwali-gift-pack-in-velvet-satin-box', pathMatch: 'full' },
    { path: 'health-concern/musli-pak', redirectTo: 'product/dabur-musli-pak-125-gm', pathMatch: 'full' },
    { path: 'health-concern/dabur-ashwagandha-churna-ad', redirectTo: 'product/dabur-ashwagandha-churna-100-gm', pathMatch: 'full' },
    { path: 'health-concern/herbal-canada-ashwagandha-tablets', redirectTo: 'product/dabur-ashwagandha-churna-100-gm', pathMatch: 'full' },
    { path: 'health-concern/vasarishta', redirectTo: 'product/baidyanath-vasarishta-450-ml', pathMatch: 'full' },
    { path: 'product/vyas-amla-churna-100-gm', redirectTo: 'product/amla-powder-awla-powder-amla-churna-amla-powder-100-gm', pathMatch: 'full' },
    { path: 'product/tikaram-naturals-castor-oil-arandi', redirectTo: 'product/abhyanga-naturals-castor-oil-arandi-30-ml', pathMatch: 'full' },
    { path: 'lifestyle-tips/find-out-the-efficacy-of-suryanamaskar-on-fatty-liver-disease-', redirectTo: 'lifestyle-tips', pathMatch: 'full' },
    { path: 'category/health-concern/chest-lungs/asthma', redirectTo: 'health-concerns/chest-and-lungs/asthma', pathMatch: 'full' },
    { path: 'healthybazar.com', redirectTo: '/', pathMatch: 'full' },
    { path: 'health-concern/kanthkaryavalehe', redirectTo: 'product/kanthkaryavalehe-50-gm', pathMatch: 'full' },
    { path: 'health-concern/shwaskuthar-ras', redirectTo: 'product/baidyanath-shwaskuthar-ras-40-tab', pathMatch: 'full' },
    { path: 'health-concern/zandu-chyavanprash', redirectTo: 'product/zandu-zandu-chyavanprash-450-gm', pathMatch: 'full' },
    { path: 'health-packages/body-detox-and-rejuvenation-package-general', redirectTo: '/', pathMatch: 'full' },
    { path: 'health-packages/diabetes-health-packa', redirectTo: 'product/diabetes-herbal-mix-100-gm', pathMatch: 'full' },
    { path: 'health-packages/diabetes-health-package', redirectTo: 'product/diabetes-herbal-mix-100-gm', pathMatch: 'full' },
    { path: 'health-packages/male-infertility-reversal-health-package', redirectTo: 'product/kanthkaryavalehe-50-gm', pathMatch: 'full' },
    { path: 'lifestyle-tips/homeopathy-medicines-during-pregnancy', redirectTo: '/', pathMatch: 'full' },
    { path: 'oil/black-pepper-oil', redirectTo: 'product/black-pepper-oil-10-ml', pathMatch: 'full' },
    { path: 'oil/lemon-oil', redirectTo: 'product/lemon-oil-10-ml', pathMatch: 'full' },
    { path: 'product/amlapitta-mishran-suspension-dhootapapeshwar-100-ml', redirectTo: 'product/baidyanath-amlapittantak-loha-40-tab', pathMatch: 'full' },
    { path: 'product/dabur-kanakasava--450-ml', redirectTo: 'product/kankasava-450-ml', pathMatch: 'full' },
    { path: 'product/sbl-neem-face-wash-100-ml', redirectTo: 'product/neem-patta-powder-neem-powder---neem-leaves-powder---healthy-hair-skin-face-100-gm', pathMatch: 'full' },
    { path: 'product/vyas-arogyaverdhani-vati-100-tab', redirectTo: 'product/baidyanath-arogyavardhini-bati-20-tab', pathMatch: 'full' },
    { path: 'undefined', redirectTo: '/', pathMatch: 'full' },
    { path: 'www.healthybazar.com', redirectTo: '/', pathMatch: 'full' },
    { path: 'WWW.HEALTHYBAZAR.COM', redirectTo: '/', pathMatch: 'full' },
    { path: 'www.healthybazar.com.', redirectTo: '/', pathMatch: 'full' },
    */

  {
    path: 'product/:product-slug',
    loadComponent: () =>
      import('../app/modules/shop/pages/product-details/product-details-desk/product-details-desk.component').then(
        (comp) => comp.ProductDetailsDeskComponent,
      ),
    data: { mobileHeader: true },
  },

  {
    path: 'health-packages',
    loadComponent: () =>
      import('../app/modules/health-packages/components/health-package-home/health-package-home.component').then(
        (comp) => comp.HealthPackagesHomeComponent,
      ),
  },
  {
    path: 'health-package/:packageSlug',
    loadComponent: () =>
      import('../app/modules/health-packages/components/health-package-details/health-package-details.component').then(
        (comp) => comp.HealthPackageDetailsComponent,
      ),
  },
  {
    path: 'consult-us',
    loadComponent: () =>
      import('../app/modules/consult-us/components/consult-us-home/consult-us-home.component').then(
        (comp) => comp.ConsultUsHomeComponent,
      ),
  },
  {
    path: 'consult-us/doctor/:consultantSlug',
    loadComponent: () =>
      import('../app/modules/consult-us/components/consult-us-details/consult-us-details.component').then(
        (comp) => comp.ConsultUsDetailsComponent,
      ),
  },
  {
    path: 'consult-us/search/:slug',
    loadComponent: () =>
      import('../app/modules/consult-us/categories/consult-us-categories/consult-us-categories.component').then(
        (comp) => comp.ConsultUsCategoriesComponent,
      ),
  },
  {
    path: 'consult-us/specializations/:slug',
    loadComponent: () =>
      import('../app/modules/consult-us/categories/consult-us-categories/consult-us-categories.component').then(
        (comp) => comp.ConsultUsCategoriesComponent,
      ),
  },
  {
    path: 'consult-us/health-concerns/:slug',
    loadComponent: () =>
      import('../app/modules/consult-us/categories/consult-us-categories/consult-us-categories.component').then(
        (comp) => comp.ConsultUsCategoriesComponent,
      ),
  },
  {
    path: 'consult-us/health-concerns/:parentSlug/:slug',
    loadComponent: () =>
      import('../app/modules/consult-us/categories/consult-us-categories/consult-us-categories.component').then(
        (comp) => comp.ConsultUsCategoriesComponent,
      ),
  },
  {
    path: 'consult-us/:slug',
    loadComponent: () =>
      import('../app/modules/consult-us/categories/consult-us-categories/consult-us-categories.component').then(
        (comp) => comp.ConsultUsCategoriesComponent,
      ),
  },
  {
    path: 'lifestyle-tips',
    loadComponent: () =>
      import('../app/modules/lifestyle-tips/components/lifestyle-tips-home/lifestyle-tips-home.component').then(
        (comp) => comp.LifeStyleTipsHomeComponent,
      ),
  },
  {
    path: 'lifestyle-tips/:titleName',
    loadComponent: () =>
      import('../app/modules/lifestyle-tips/components/lifestyle-tips-details/lifestyle-tips-details.component').then(
        (comp) => comp.LifestyleTipsDetailsComponent,
      ),
  },
  {
    path: 'lifestyle-tips/category/:slug',
    loadComponent: () =>
      import('../app/modules/lifestyle-tips/categories/lifestyle-categories/lifestyle-categories.component').then(
        (comp) => comp.LifestyleCategoriesComponent,
      ),
  },
  {
    path: 'lifestyle-tips/search/:query',
    loadComponent: () =>
      import('../app/modules/lifestyle-tips/categories/lifestyle-categories/lifestyle-categories.component').then(
        (comp) => comp.LifestyleCategoriesComponent,
      ),
  },
  {
    path: 'search/global/:query',
    loadComponent: () =>
      import('./modules/shop/pages/global-search/global-search.component').then(
        (comp) => comp.GlobalSearchComponent,
      ),
  },
  {
    path: 'search/:slug',
    loadComponent: () =>
      import('./modules/categories/shopNow-category-details/products-listing/products-listing.component').then(
        (comp) => comp.ProductsListingComponent,
      ),
  },
  {
    path: 'brand/:slug',
    loadComponent: () =>
      import('./modules/categories/shopNow-category-details/products-listing/products-listing.component').then(
        (comp) => comp.ProductsListingComponent,
      ),
  },
  {
    path: 'health-concerns/:category/:slug',
    loadComponent: () =>
      import('./modules/categories/shopNow-category-details/products-listing/products-listing.component').then(
        (comp) => comp.ProductsListingComponent,
      ),
  },
  {
    path: 'health-concerns/:slug',
    loadComponent: () =>
      import('./modules/categories/shopNow-category-details/products-listing/products-listing.component').then(
        (comp) => comp.ProductsListingComponent,
      ),
  },
  {
    path: 'category/:slug',
    loadComponent: () =>
      import('./modules/categories/shopNow-category-details/products-listing/products-listing.component').then(
        (comp) => comp.ProductsListingComponent,
      ),
  },
  // {
  //   path: 'herbs',
  //   loadComponent: () =>
  //     import(
  //       './modules/categories/shopNow-category-details/products-listing/products-listing.component'
  //     ).then((comp) => comp.ProductsListingComponent),
  // },
  {
    path: 'herbs',
    loadComponent: () =>
      import('./modules/herbs/herbs.component').then(
        (comp) => comp.HerbsComponent,
      ),
  },
  {
    path: 'bulk-enquiry-success',
    canActivate: [bulkSuccessGuard],
    loadComponent: () =>
      import('./shared/components/bulk-enquiry-success/bulk-enquiry-success.component').then(
        (comp) => comp.BulkEnquirySuccessComponent,
      ),
  },
  {
    path: 'international-enquiry-success',
    canActivate: [bulkSuccessGuard],
    loadComponent: () =>
      import('./shared/components/international-enquiry-success/international-enquiry-success.component').then(
        (comp) => comp.InternationalEnquirySuccessComponent,
      ),
  },
  {
    path: 'category/:slug/:slug',
    loadComponent: () =>
      import('./modules/categories/shopNow-category-details/products-listing/products-listing.component').then(
        (comp) => comp.ProductsListingComponent,
      ),
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('../app/shared/components/payment/payment.component').then(
        (comp) => comp.PaymentComponent,
      ),
  },
  {
    path: 'category/pooja/:id',
    loadComponent: () =>
      import('./modules/categories/shopNow-category-details/brand-category/brand-category-detail.component').then(
        (comp) => comp.CategoryDetailComponent,
      ),
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./shared/components/faq/faq.component').then(
        (comp) => comp.FaqComponent,
      ),
  },
  {
    path: 'policies',
    loadComponent: () =>
      import('./shared/components/policies/policies.component').then(
        (comp) => comp.PoliciesComponent,
      ),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./shared/components/terms/terms.component').then(
        (comp) => comp.TermsComponent,
      ),
  },
  {
    path: 'about-us',
    loadComponent: () =>
      import('./shared/components/about-us/about-us.component').then(
        (comp) => comp.AboutUsComponent,
      ),
  },
  {
    path: 'cart/checkout/thank-you',
    loadComponent: () =>
      import('./shared/components/thank-you/thank-you.component').then(
        (comp) => comp.ThankYouComponent,
      ),
  },
  {
    path: 'brand-type/:slug',
    loadComponent: () =>
      import('./modules/categories/shopNow-category-details/products-listing/products-listing.component').then(
        (comp) => comp.ProductsListingComponent,
      ),
  },
  {
    path: 'pay-status',
    loadComponent: () =>
      import('./shared/components/pay-status/pay-status.component').then(
        (comp) => comp.PayStatusComponent,
      ),
  },
  {
    path: 'my-account',
    component: UserDashboardComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: UserProfileComponent },
      { path: 'orders', component: UserOrdersComponent },
      { path: 'health-stats', component: UserHealthStatsComponent },
      { path: 'manage-address', component: UserAddressComponent },
      { path: 'appointments', component: UserAppoinmentsComponent },
      {
        path: 'my-subscriptions',
        component: HealthPackageSubscriptionComponent,
      },
      { path: 'calender', component: ConsultationCalendarComponent },
    ],
  },
  {
    path: 'my-account/appointments/:id',
    loadComponent: () =>
      import('./shared/components/user-dashboard/appointment-detail/appointment-detail.component').then(
        (comp) => comp.AppointmentDetailComponent,
      ),
  },
  {
    path: 'self-health-assessment',
    loadComponent: () =>
      import('./modules/self-health-assessment/self-health-assessment.component').then(
        (comp) => comp.SelfHealthAssessmentComponent,
      ),
  },
  {
    path: 'self-health-assessment/:id',
    loadComponent: () =>
      import('./modules/self-health-assessment/assessment-form/assessment-form.component').then(
        (comp) => comp.AssessmentFormComponent,
      ),
  },
  {
    path: 'become-consultant',
    loadComponent: () =>
      import('./components/add-consultant/add-consultant.component').then(
        (comp) => comp.AddConsultantComponent,
      ),
  },
  {
    path: 'order-tracker',
    loadComponent: () =>
      import('./modules/shop/pages/order-tracker/order-tracker.component').then(
        (comp) => comp.OrderTrackerComponent,
      ),
  },
  {
    path: '**',
    canActivate: [ProductRedirectGuard],
    loadComponent: () =>
      import('./shared/components/error-404/error-404.component').then(
        (comp) => comp.Error404Component,
      ),
  },
];
