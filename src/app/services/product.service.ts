import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import {
  GlobalSearchResponse,
  ProductDetails,
} from '../shared/types/xhr.types';
import { environment } from '../../environments/environment';
import { ApiService, SimpleObject } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private bottomSheet$ = new BehaviorSubject<any>(null);

  defaultFeaturedProductsParams = {
    source: 'homepage',
    isFeatured: true,
  };

  defaultSexualWellnessProductsParams = {
    source: 'homepage',
    isSexualWellness: true,
  };

  defaultLastMinuteBuyProductsParams = {
    source: 'homepage',
    isLastMinuteBuy: true,
  };

  defaultBestSellersProductsParams = {
    source: 'homepage',
    sort: 'Popularity',
  };

  productsList: any[] = [
    {
      productTitle: 'Triphala churan sital cough syrup',
      productSubtitle: 'Himalaya Ayurvedic company',
      productPrice: 340,
      productOriginalPrice: 400,
      productDiscount: 20,
      buttonTxt: '+ADD',
      productImg: '/assets/images/syrup-product-img.png',
    },
    {
      productTitle: 'Triphala churan sital cough syrup',
      productSubtitle: 'Himalaya Ayurvedic company',
      productPrice: 320,
      productOriginalPrice: 309,
      productDiscount: 18,
      buttonTxt: '+ADD',
      productImg: '/assets/images/syrup-product-img.png',
    },
    {
      productTitle: 'Triphala churan sital cough syrup',
      productSubtitle: 'Himalaya Ayurvedic company',
      productPrice: 320,
      productOriginalPrice: 309,
      productDiscount: 18,
      buttonTxt: '+ADD',
      productImg: '/assets/images/syrup-product-img.png',
    },
    {
      productTitle: 'Triphala churan sital cough syrup',
      productSubtitle: 'Himalaya Ayurvedic company',
      productPrice: 320,
      productOriginalPrice: 309,
      productDiscount: 18,
      buttonTxt: '+ADD',
      productImg: '/assets/images/syrup-product-img.png',
    },
    {
      productTitle: 'Triphala churan sital cough syrup',
      productSubtitle: 'Himalaya Ayurvedic company',
      productPrice: 320,
      productOriginalPrice: 309,
      productDiscount: 18,
      buttonTxt: '+ADD',
      productImg: '/assets/images/syrup-product-img.png',
    },
    {
      productTitle: 'Triphala churan sital cough syrup',
      productSubtitle: 'Himalaya Ayurvedic company',
      productPrice: 320,
      productOriginalPrice: 309,
      productDiscount: 18,
      buttonTxt: '+ADD',
      productImg: '/assets/images/syrup-product-img.png',
    },
    {
      productTitle: 'Triphala churan sital cough syrup',
      productSubtitle: 'Himalaya Ayurvedic company',
      productPrice: 320,
      productOriginalPrice: 309,
      productDiscount: 18,
      buttonTxt: '+ADD',
      productImg: '/assets/images/syrup-product-img.png',
    },
    {
      productTitle: 'Triphala churan sital cough syrup',
      productSubtitle: 'Himalaya Ayurvedic company',
      productPrice: 320,
      productOriginalPrice: 309,
      productDiscount: 18,
      buttonTxt: '+ADD',
      productImg: '/assets/images/syrup-product-img.png',
    },
  ];

  medicalBannerList: any = [
    {
      imgSrc: '/assets/images/doctor-banner.png',
      label: 'Cut Medical Costs with Our Health Package',
    },
    {
      imgSrc: '/assets/images/doctor-banner.png',
      label: 'Cut Medical Costs with Our Health Package',
    },
    {
      imgSrc: '/assets/images/doctor-banner.png',
      label: 'Cut Medical Costs with Our Health Package',
    },
  ];

  sofolaBannerList: any[] = [
    {
      imgSrc: '/assets/images/soffola-background.png',
      label: 'Choose Healthy Oils today',
    },
    {
      imgSrc: '/assets/images/soffola-background.png',
      label: 'Choose Healthy Oils today',
    },
    {
      imgSrc: '/assets/images/soffola-background.png',
      label: 'Choose Healthy Oils today',
    },
  ];

  couponCodes: any[] = [
    { imgSrc: '/assets/images/coupon-code.png', packagename: 'couponcode' },
    { imgSrc: '/assets/images/coupon-code.png', packagename: 'couponcode' },
    { imgSrc: '/assets/images/coupon-code.png', packagename: 'couponcode' },
  ];

  shopByCategoryList: any[] = [
    {
      imgSrc: '/assets/images/Shop-by-Category/Herbs.png',
      name: 'Herbs',
      backgroundcolor: '#F1FFD6',
    },
    {
      imgSrc: '/assets/images/Shop-by-Category/Oils.png',
      name: 'Oils',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/Shop-by-Category/Pooja.png',
      name: 'Pooja',
      backgroundcolor: '#FFF8D6',
    },
    {
      imgSrc: '/assets/images/Shop-by-Category/Foods.png',
      name: 'Foods',
      backgroundcolor: '#FFEAD6',
    },
    {
      imgSrc: '/assets/images/Shop-by-Category/Personal Care.png',
      name: 'Personal Care',
      backgroundcolor: '#F1FFD6',
    },

    {
      imgSrc: '/assets/images/Shop-by-Category/Health concerns.png',
      name: 'Health Concerns',
      backgroundcolor: '#FFDBD6',
    },
  ];

  affordablePackage: any[] = [
    {
      productTitle: 'Obesity Reversal health package',
      productSubtitle: 'Duration',
      productPrice: 199,
      productOriginalPrice: 400,
      productDiscount: 20,
      buttonTxt: 'BOOK',
      productImg: '/assets/images/affordable package.png',
    },
    {
      productTitle: 'Obesity Reversal health package',
      productSubtitle: 'Duration',
      productPrice: 199,
      productOriginalPrice: 400,
      productDiscount: 20,
      buttonTxt: 'BOOK',
      productImg: '/assets/images/affordable package.png',
    },
    {
      productTitle: 'Obesity Reversal health package',
      productSubtitle: 'Duration',
      productPrice: 199,
      productOriginalPrice: 400,
      productDiscount: 20,
      buttonTxt: 'BOOK',
      productImg: '/assets/images/affordable package.png',
    },
    {
      productTitle: 'Obesity Reversal health package',
      productSubtitle: 'Duration',
      productPrice: 199,
      productOriginalPrice: 400,
      productDiscount: 20,
      buttonTxt: 'BOOK',
      productImg: '/assets/images/affordable package.png',
    },
    {
      productTitle: 'Obesity Reversal health package',
      productSubtitle: 'Duration',
      productPrice: 199,
      productOriginalPrice: 400,
      productDiscount: 20,
      buttonTxt: 'BOOK',
      productImg: '/assets/images/affordable package.png',
    },
    {
      productTitle: 'Obesity Reversal health package',
      productSubtitle: 'Duration',
      productPrice: 199,
      productOriginalPrice: 400,
      productDiscount: 20,
      buttonTxt: 'BOOK',
      productImg: '/assets/images/affordable package.png',
    },
    {
      productTitle: 'Obesity Reversal health package',
      productSubtitle: 'Duration',
      productPrice: 199,
      productOriginalPrice: 400,
      productDiscount: 20,
      buttonTxt: 'BOOK',
      productImg: '/assets/images/affordable package.png',
    },
    {
      productTitle: 'Obesity Reversal health package',
      productSubtitle: 'Duration',
      productPrice: 199,
      productOriginalPrice: 400,
      productDiscount: 20,
      buttonTxt: 'BOOK',
      productImg: '/assets/images/affordable package.png',
    },
    {
      productTitle: 'Obesity Reversal health package',
      productSubtitle: 'Duration',
      productPrice: 199,
      productOriginalPrice: 400,
      productDiscount: 20,
      buttonTxt: 'BOOK',
      productImg: '/assets/images/affordable package.png',
    },
  ];

  // top specilist consult
  topSpecialistsConsult: any[] = [
    {
      name: 'Dr John Doe',
      department: 'Mental',
      consultFee: 199,
      consult: 'Consultation',
      buttonTxt: 'BOOK',
      experience: '10 year of Exp.',
      rated: 'Top Rated',
      rating: '4.6',
      img: '/assets/images/top-consult.png',
    },
    {
      name: 'Dr John Doe',
      department: 'Ayurvedic',
      consultFee: 199,
      consult: 'Consultation',
      buttonTxt: 'BOOK',
      experience: '10 year of Exp.',
      rated: 'Top Rated',
      rating: '4.6',
      img: '/assets/images/top-consult.png',
    },
    {
      name: 'Dr John Doe',
      department: 'Ayurvedic',
      consultFee: 199,
      consult: 'Consultation',
      buttonTxt: 'BOOK',
      experience: '10 year of Exp.',
      rated: 'Top Rated',
      rating: '4.6',
      img: '/assets/images/top-consult.png',
    },
    {
      name: 'Dr John Doe',
      department: 'Ayurvedic',
      consultFee: 199,
      consult: 'Consultation',
      buttonTxt: 'BOOK',
      experience: '10 year of Exp.',
      rated: 'Top Rated',
      rating: '4.6',
      img: '/assets/images/top-consult.png',
    },
    {
      name: 'Dr John Doe',
      department: 'Ayurvedic',
      consultFee: 199,
      consult: 'Consultation',
      buttonTxt: 'BOOK',
      experience: '10 year of Exp.',
      rated: 'Top Rated',
      rating: '4.6',
      img: '/assets/images/top-consult.png',
    },
    {
      name: 'Dr John Doe',
      department: 'Ayurvedic',
      consultFee: 199,
      consult: 'Consultation',
      buttonTxt: 'BOOK',
      experience: '10 year of Exp.',
      rated: 'Top Rated',
      rating: '4.6',
      img: '/assets/images/top-consult.png',
    },
    {
      name: 'Dr John Doe',
      department: 'Ayurvedic',
      consultFee: 199,
      consult: 'Consultation',
      buttonTxt: 'BOOK',
      experience: '10 year of Exp.',
      rated: 'Top Rated',
      rating: '4.6',
      img: '/assets/images/top-consult.png',
    },
    {
      name: 'Dr John Doe',
      department: 'Ayurvedic',
      consultFee: 199,
      consult: 'Consultation',
      buttonTxt: 'BOOK',
      experience: '10 year of Exp.',
      rated: 'Top Rated',
      rating: '4.6',
      img: '/assets/images/top-consult.png',
    },
  ];

  // categoryies

  appCategoriesList: any[] = [
    {
      image: '/assets/images/Health-package.png',
      categoryTitle: 'Health Packages',
      fontcolor: '#690065',
    },
    {
      image: '/assets/images/Consult-Us.png',
      categoryTitle: 'Consult Us',
      fontcolor: '#A15005',
    },
    {
      image: '/assets/images/Lifestyle-Tips.png',
      categoryTitle: 'Lifestyle Tips',
      fontcolor: '#8B2E2E',
    },
    {
      image: '/assets/images/Lab-Test.png',
      categoryTitle: 'Lab Test',
      fontcolor: '#005E47',
    },
  ];

  healthconcern: any[] = [
    {
      imgSrc: '/assets/images/Shop-by-Category/Herbs.png',
      name: 'Category name',
      backgroundcolor: '#F1FFD6',
      height: '122px',
      width: '89px',
    },
    {
      imgSrc: '/assets/images/Shop-by-Category/Herbs.png',
      name: 'Category name',
      backgroundcolor: '#F1FFD6',
      height: '122px',
      width: '89px',
    },
    {
      imgSrc: '/assets/images/Shop-by-Category/Herbs.png',
      name: 'Category name',
      backgroundcolor: '#F1FFD6',
      height: '122px',
      width: '89px',
    },
    {
      imgSrc: '/assets/images/Shop-by-Category/Herbs.png',
      name: 'Category name',
      backgroundcolor: '#F1FFD6',
      height: '122px',
      width: '89px',
    },
    {
      imgSrc: '/assets/images/Shop-by-Category/Herbs.png',
      name: 'Category name',
      backgroundcolor: '#F1FFD6',
      height: '122px',
      width: '89px',
    },
    {
      imgSrc: '/assets/images/Shop-by-Category/Herbs.png',
      name: 'Category name',
      backgroundcolor: '#F1FFD6',
      height: '122px',
      width: '89px',
    },
    {
      imgSrc: '/assets/images/Shop-by-Category/Herbs.png',
      name: 'Category name',
      backgroundcolor: '#F1FFD6',
      height: '122px',
      width: '89px',
    },
  ];

  shopByHealthConcernList: any[] = [
    {
      imgSrc: '/assets/images/health-concern-demo.png',
      name: 'Category name',
      backgroundcolor: '#F1FFD6',
    },
    {
      imgSrc: '/assets/images/health-concern-demo.png',
      name: 'Category name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/health-concern-demo.png',
      name: 'Category name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/health-concern-demo.png',
      name: 'Category name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/health-concern-demo.png',
      name: 'Category name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/health-concern-demo.png',
      name: 'Category name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/health-concern-demo.png',
      name: 'Category name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/health-concern-demo.png',
      name: 'Category name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/health-concern-demo.png',
      name: 'Category name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/health-concern-demo.png',
      name: 'Category name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/health-concern-demo.png',
      name: 'Category name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/health-concern-demo.png',
      name: 'Category name',
      backgroundcolor: '#FFF4E4',
    },
  ];

  topBrandList: any[] = [
    {
      imgSrc: '/assets/images/demo.png',
      name: 'Brand Name',
      backgroundcolor: '#F1FFD6',
    },
    {
      imgSrc: '/assets/images/demo.png',
      name: 'Brand Name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/demo.png',
      name: 'Brand Name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/demo.png',
      name: 'Brand Name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/demo.png',
      name: 'Brand Name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/demo.png',
      name: 'Brand Name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/demo.png',
      name: 'Brand Name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/demo.png',
      name: 'Brand Name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/demo.png',
      name: 'Brand Name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/demo.png',
      name: 'Brand Name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/demo.png',
      name: 'Brand Name',
      backgroundcolor: '#FFF4E4',
    },
    {
      imgSrc: '/assets/images/demo.png',
      name: 'Brand Name',
      backgroundcolor: '#FFF4E4',
    },
  ];

  footerImages: any[] = [
    {
      imgSrc: '/assets/images/footer-img-1.png',
      name: 'Brand',
    },
    {
      imgSrc: '/assets/images/footer-img-2.png',
      name: 'Brand',
    },
    {
      imgSrc: '/assets/images/footer-img-3.png',
      name: 'Brand',
    },
  ];

  constructor(private http: HttpClient, private api: ApiService) {}

  // getProductList() {
  //     return this.http.get(`${environment.apiUrl}orders/getUserFavouriteProducts`, {
  //         'headers': new HttpHeaders({
  //             'apikey': environment.apikey,
  //         })
  //     });
  // }

  ///////////////////////////////////////////////////////

  getHeaderMenu() {
    return this.http.get(`${environment.apiUrl}menus`);
  }

  getUserFavouritesProducts() {
    //old user with orders history
    return this.http.get(
      `${environment.apiUrl}orders/getUserFavouriteProducts`
    );
  }

  getCategoryBanner() {
    return this.http.get(
      `${environment.apiUrl}promotionBanner/getPromotionBanner`,
      { params: { type: 'category' } }
    );
  }

  // getOfferCoupon() {
  //     // /api/v2/coupons?source=homepage&active=true
  //     return this.http.get(`${environment.apiUrl}coupons`, {
  //
  //         'params': {
  //             source: "homepage",
  //             active: true
  //         }
  //     });
  // }

  // /api/v2/products?source=homepage&sort=Popularity&limit=10&page=1
  getProductsFilter(params: any) {
    return this.api.get(`products/filter`, { params });
  }

  getFeturedProducts() {
    // /api/v2 / products ? source = homepage & limit=10 & page=1 & isTop=true & isFeatured=true
    //old user with orders history
    return this.http.get(`${environment.apiUrl}products/homepage`, {
      params: {
        ...this.defaultFeaturedProductsParams,
        page: 1,
        limit: 12,
      },
    });
  }

  getSexualWellnessProducts() {
    // /api/v2 / products ? source = homepage & limit=10 & page=1 & isTop=true & isFeatured=true
    //old user with orders history
    return this.http.get(`${environment.apiUrl}products/homepage`, {
      params: {
        ...this.defaultSexualWellnessProductsParams,
        page: 1,
        limit: 12,
      },
    });
  }

  getHomePageData(isLoggedin: boolean = false, userId: string = '') {
    return this.http.get(`${environment.apiUrl}homepage/fetch`, {
      params: {
        user_id: userId,
        isLoggedIn: isLoggedin,
      },
    });
  }

  getLastMinuteBuyProducts() {
    // /api/v2 / products ? source = homepage & limit=10 & page=1 & isTop=true & isFeatured=true
    //old user with orders history
    return this.http.get(`${environment.apiUrl}products/homepage`, {
      params: {
        ...this.defaultLastMinuteBuyProductsParams,
        page: 1,
        limit: 10,
      },
    });
  }

  getOurBestSeller(
    params: { page?: number; limit?: number } & SimpleObject = {}
  ) {
    return this.http.get(`${environment.apiUrl}orders/best-seller-poducts`, {
      params: {
        limit: 12,
        page: 1,
        ...params,
      },
    });
  }

  getRecommendedProducts(params: { page: number; limit: number }) {
    let _params = {
      hbRecommended: true,
      ...params,
    };
    return this.api.get('products/homepage', { params: _params });
  }

  getSeasonSpecial(params: { page: number; limit: number }) {
    let _params = {
      seasonSpecial: true,
      ...params,
    };
    return this.api.get('products/homepage', { params: _params });
  }

  getShopByCategory() {
    // categories?isTop=true&source=homepage
    return this.http.get(`${environment.apiUrl}categories`, {
      params: {
        isTop: true,
        source: 'homepage',
      },
    });
  }

  // healthPackages?source=homepage
  getAffordablePackages() {
    return this.http.get(`${environment.apiUrl}healthPackages`, {
      params: {
        source: 'homepage',
      },
    });
  }

  getMedicalHealthPacakgeBanner() {
    return this.http.get(
      `${environment.apiUrl}promotionBanner/getPromotionBanner`,
      {
        params: {
          type: 'Homepage-Health Package',
        },
      }
    );
  }

  // /api/v2/categories/topSelling?source=homepage
  getTopSellingCategories(params: any = {}) {
    return this.http.get(`${environment.apiUrl}categories/topSelling`, {
      // for activating pooja just uncomment below category and ctegory controller (getTopSellingCategories)
      params: {
        source: 'homepage',
        category: ['herbs', 'personal-care', 'foods', 'pooja'],
        //category: ['herbs', 'personal-care', 'foods'],
        ...params,
      },
    });
  }

  // /api/v2/healthConcerns?source=homepage
  getShopByHealthConcern(params?: any) {
    return this.api.get('healthConcerns', { params });
  }

  getTopBrands() {
    // /api/v2/brands?isTop=true&source=homepage
    return this.http.get(`${environment.apiUrl}brands`, {
      params: {
        isTop: true,
        source: 'homepage',
        limit: 12,
      },
    });
  }

  getTopSpecilistConsult(params: {
    page: number;
    limit: number;
    healthConcernId?: any;
  }) {
    let _params = {
      isTopConsultant: true,
      ...params,
    };
    return this.api.get(`users/getConsultantForCard`, { params: _params });
  }

  //Product Listing page data will load from here
  getTopConsultAndRelatedArticles(payload: any) {
    return this.http.get(
      `${environment.apiUrl}common/topConsultantAndArticles`,
      {
        params: payload,
      }
    );
  }

  getProductsDetailsPage(slug: any) {
    // /api/v2/products/detail?slug=hamdard-sitopladi-churan&active=true
    return this.http.get(`${environment.apiUrl}products/detail`, {
      params: {
        slug: slug,
        //active: true,
      },
    });
  }

  getSearchedResults(search: any, params?: { limit?: number; page?: number }) {
    // /api/v2/algoliasearch/newSearch?limit=8&name=
    return this.api.get<GlobalSearchResponse>(`algoliasearch/newSearch`, {
      params: {
        limit: params?.limit || 5,
        page: params?.page || 1,
        name: search,
      },
    });
  }

  getHerbsSearchResults(
    search: any,
    params?: { limit?: number; page?: number }
  ) {
    return this.api.get<GlobalSearchResponse>(`categories/filterByProduct`, {
      params: {
        limit: params?.limit || 5,
        page: params?.page || 1,
        search: search,
        type: 'herbs',
        slug: 'herbs',
      },
    });
  }

  getSearchProducts(search: any, params?: { limit?: number; page?: number }) {
    return this.api.get<any>(`algoliasearch`, {
      params: {
        limit: params?.limit || 12,
        page: params?.page || 1,
        name: search,
      },
    });
  }

  getPincodeResults(pincode: any) {
    // api/v2/pincode?pin=11
    return this.http.get(`${environment.apiUrl}pincode`, {
      params: {
        pin: pincode,
      },
    });
  }

  getCurrentPosition(): Observable<any> {
    return new Observable((observer) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocation is not available in this browser.');
      }
    });
  }

  getProductReviews(paylaod: any) {
    return this.http.get(`${environment.apiUrl}products/review`, {
      params: paylaod,
    });
  }

  getProductRelatedProducts(categoryId: any) {
    // products?source=homepage&categoryId=
    return this.http.get(`${environment.apiUrl}products`, {
      params: {
        source: 'homepage',
        categoryId: categoryId,
        page: 1,
        limit: 10,
      },
    });
  }

  getCustomersWhoAlsoBoughtProducts(categoryId: any) {
    // products?source=homepage&categoryId=
    return this.http.get(`${environment.apiUrl}products/customerBuyPrefrence`, {
      params: {
        categoryId: categoryId,
      },
    });
  }

  getBrandTypeProducts(id: any, payload: any) {
    return this.http.get(`${environment.apiUrl}products/menu/${id}`, {
      params: payload,
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////

  // getPromotionBanners() {
  //     // /api/v2/promotionBanner/getPromotionBanner?type=Homepage-Category Product
  //     return this.http.get(`${environment.apiUrl}promotionBanner/getPromotionBanner`, {  'params': { type: "Homepage-Category Product" } });
  // }

  getCouponCode() {
    return this.http
      .get(`${environment.apiUrl}coupons`, {
        params: {
          source: 'homepage',
          active: true,
        },
      })
      .pipe(
        map((res: any) => {
          if (res.success && res.data) {
            res.data = res.data.filter((el: any) => el.image);
          }
          return res;
        })
      );
  }

  getAppCategories() {
    return of(this.appCategoriesList);
  }

  getHealthConcern() {
    return of(this.healthconcern);
  }

  getFooterImages() {
    return of(this.footerImages);
  }

  // setting up to api data
  setBottomSheet(data: any) {
    this.bottomSheet$.next(data);
  }

  getBottomSheet(): Observable<any> {
    return this.bottomSheet$.asObservable();
  }

  bulkEnquiry(data: any) {
    return this.api.post('enquiry', data);
  }

  internationalEnquiry(data: any) {
    return this.api.post('int-enquiry', data);
  }
}
