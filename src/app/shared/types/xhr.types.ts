import { BannersType } from './index.types';

export type GetUserProfileResponse = {
  success: boolean;
  data: UserProfile;
};

export type UserProfile = {
  currentLocation: {
    pincode: string;
    city: string;
  };
  gender: 'male';
  countryCode: '+91';
  profilePhoto: {
    savedName: string;
    _id: string;
  };
  isPhoneVerified: false;
  recommendedProducts: [];
  diseases: [];
  active: true;
  createdBy: null;
  newsLetter: false;
  subscriptionMailSent: false;
  wishlist: [];
  category: 'new';
  orderNo: 0;
  appointmentNo: 10;
  userType: 'Customer';
  signupType: 'Fresh';
  designation: '';
  signupComplete: true;
  description: '';
  experience: 1;
  experienceInMonths: 0;
  language: '';
  fee: 100;
  consultantType: [];
  slotDuration: '30';
  device_id: '';
  device_type: '';
  fcm_token: [null];
  countryShortName: '';
  activate: true;
  weight: 85;
  weightUnit: 'kg';
  bodyType: '';
  speciality: [];
  specialization: [];
  isChangedInitialPassword: true;
  isTopConsultant: false;
  iscorporatePassword: false;
  inHouse: false;
  zoomAccountCreated: true;
  isSlugGenerated: true;
  _id: '60c8888a1700463b75e07d51';
  coupon: [];
  phone: '9803836693';
  verificationCode: null;
  address: [
    {
      type: 'home';
      name: 'Satinderpal Singh';
      houseNumber: 'J11/3128';
      tagName: '';
      country: 'India';
      line1: 'VPO Sultanwind';
      landmark: 'Hundal Dairy';
      city: 'Amritsar';
      state: 'Punjab';
      pinCode: 143001;
      phoneNo: '9803836693';
      countryCode: '+91';
      default: true;
      _id: '62bbee99d88d14759bc94b73';
    }
  ];
  lastLogin: '2021-06-15T11:01:30.159Z';
  createdAt: '2021-06-15T11:01:30.166Z';
  updatedAt: '2024-06-29T06:52:24.769Z';
  email: 'satinderbajwa7@gmail.com';
  DOB: '1995-06-12';
  firstName: 'Satinderpal';
  lastName: 'Singh';
  qualification: [];
  couponCounter: [];
  symptoms: [
    {
      symptomName: ['fever'];
      date: '2022-06-15T04:28:02.289Z';
      _id: '62a95fd2ce92032e38f63241';
      updatedBy: '6299b9a6ed52c06bd47bd21d';
    },
    {
      symptomName: ['fever', 'bp low'];
      date: '2022-06-15T04:28:34.512Z';
      _id: '62a95ff2ce92032e38f63247';
      updatedBy: '6299b9a6ed52c06bd47bd21d';
    },
    {
      symptomName: ['fever', 'bp low'];
      date: '2022-06-23T12:38:57.526Z';
      _id: '62b45ee1c40b1039b086b550';
      updatedBy: '6299b9a6ed52c06bd47bd21d';
    }
  ];
  vitals: ['H2o', 'test', 'test3'];
  slug: 'satinderpal-singh-5c8548';
  currentAddress: {
    type: 'home';
    name: '';
    houseNumber: '';
    tagName: '';
    country: 'India';
    line1: '';
    landmark: '';
    city: '';
    state: '';
    pinCode: null;
    phoneNo: '';
    countryCode: '+91';
    default: false;
    _id: '648c2f1fdec75e2941b8ab76';
  };
  confirmationToken: null;
  healthConcerns: [
    {
      url: 'health-concerns/ear/ear-discharge-ringing';
      logo: '60e67c0b72573cb76bcf825e';
      logoTag: '';
      bannerImage: '60b091329f443a3984a8d027';
      bannerTag: '';
      description: '';
      visibleLogo: false;
      sellers: [];
      active: true;
      edited: false;
      published: false;
      metaTitle: '';
      metaDescription: '';
      metaTags: [];
      isFeatured: false;
      isTop: false;
      visibleAtHome: false;
      visibleAtLifeStyle: false;
      visibleAtConsultUs: false;
      children: [];
      _id: '60e67c0b72573cb76bcf825f';
      name: 'Ear Discharge/Ringing';
      parent: '60bf4bbc336b9e64c56c5f8a';
      slug: 'ear-discharge-ringing';
      address: [];
      createdAt: '2021-07-08T04:16:11.089Z';
      updatedAt: '2021-07-08T04:16:11.111Z';
      path: '60bf4bbc336b9e64c56c5f8a#60e67c0b72573cb76bcf825f';
    }
  ];
};

export interface ProductDetails {
  productTitle: string;
  productSubtitle: string;
  productPrice: number;
  productOriginalPrice: number;
  productDiscount: number;
  // test: APIResponse<string>
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
}

export interface ProductList {}

export interface ProductsResponse {
  count: number;
  products: Product[];
}

export interface Product {
  type: string;
  parentProductId?: string;
  warehouse: string;
  tileDescription: string;
  hindiName: string;
  highlights: string;
  state: string;
  healthConcernId: any[];
  categories: any[];
  diseases: any[];
  weight: number;
  stockManage: boolean;
  images: {
    savedName: string;
    _id: string;
  }[];
  thumbnail: {
    savedName: 'uploads/healthybazar_16225514671.png';
    _id: '60b62bab2a67543ae4ed8266';
  };
  imageTags: [];
  manufacturer: '';
  sellers: [];
  edited: boolean;
  published: boolean;
  active: boolean;
  metaDescription: string;
  metaTags: [''];
  metaTitle: string;
  maxSaleQty: null;
  noOfProductSold: number;
  seasons: [];
  inactivePayment: [];
  averageRating: number;
  totalReviews: number;
  blogs: [];
  _id: string;
  name: string;
  brandId: {
    _id: string;
    name: string;
  };
  primaryCategory: {
    _id: string;
    name: string;
  };
  slug: string;
  taxClass: null;
  description: {
    short: string;
    long: string;
    dosage: string;
    activeIngredients: [];
    usage: string;
  };
  price: {
    bulk: {
      discount: number;
      quantity: number;
      price: number;
    };
    mrp: number;
    minPrice: number;
    margin: number;
    searchingPrice: number;
    discount: number;
    maxDiscount: number;
    sellingPrice: number;
  };
  is: {
    new: {
      isNew: boolean;
      from: null;
      to: null;
    };
    seasonSpecial: {
      isSeasonSpecial: boolean;
      season: [];
    };
    hbRecommended: boolean;
    featured: boolean;
    returnable: boolean;
    exchangable: boolean;
    fragile: boolean;
    prescriptionRequired: boolean;
    codAvailable: boolean;
    giftable: boolean;
    approve: boolean;
    limitedQty: boolean;
    top: boolean;
    taxInclusive: boolean;
  };
  stock: {
    quantity: number;
    availableQuantity: null;
    warehouse: [];
  };
  attributes: [];
  mainVariations: [
    {
      values: ['1KG', '2KG'];
      _id: string;
      variationId: {
        title: string;
        _id: string;
      };
    }
  ];
  variations: [
    {
      name: string;
      label: ['1KG', 'Chocolate'];
      slug: string;
      url: string;
      noOfProductSold: boolean;
      isActive: boolean;
      _id: '63a29ec1bee6cf6c05f40524';
      weight: '1000';
      stock: {
        quantity: number;
        availableQuantity: number;
        warehouse: [];
      };
      price: {
        bulk: {
          discount: number;
          quantity: number;
          price: number;
        };
        mrp: number;
        minPrice: number;
        margin: number;
        searchingPrice: number;
        discount: number;
        maxDiscount: number;
        sellingPrice: number;
      };
      productId: string;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

export interface Filter {
  detail: { _id: string; name: string }[];
  filterName: string;
  name: string;
  showSubCat: boolean;
  type: string;
}

export interface CategoryDetails {
  url: string;
  logo: Logo;
  logoTag: string;
  bannerImage: Logo;
  bannerTag: string;
  description: string;
  visibleLogo: boolean;
  sellers: any[];
  active: boolean;
  edited: boolean;
  published: boolean;
  metaTitle: string;
  metaDescription: string;
  metaTags: any[];
  isFeatured: boolean;
  isTop: boolean;
  visibleAtHome: boolean;
  visibleAtLifeStyle: boolean;
  visibleAtConsultUs: boolean;
  children: any[];
  _id: string;
  name: string;
  parent: string;
  slug: string;
  address: any[];
  createdAt: string;
  updatedAt: string;
  path: string;
  products: CategoryProduct[];
  count: number;
}

export interface CategoryProduct {
  type: string;
  warehouse: string;
  tileDescription: string;
  hindiName: string;
  highlights: string;
  state: string;
  healthConcernId: HealthConcernId[];
  categories: Category[];
  diseases: any[];
  weight: number;
  stockManage: boolean;
  images: Logo[];
  thumbnail: Logo;
  imageTags: any[];
  manufacturer: string;
  sellers: any[];
  edited: boolean;
  published: boolean;
  active: boolean;
  metaDescription: string;
  metaTags: string[];
  metaTitle: string;
  maxSaleQty: number;
  noOfProductSold: number;
  seasons: any[];
  inactivePayment: any[];
  averageRating: number;
  totalReviews: number;
  blogs: any[];
  _id: string;
  name: string;
  brandId: Category;
  primaryCategory: string;
  slug: string;
  taxClass: string;
  description: Description;
  price: Price;
  is: Is;
  stock: Stock;
  attributes: Attribute[];
  mainVariations: MainVariation[];
  variations: Variation[];
  createdAt: string;
  updatedAt: string;
}

interface Variation {
  name: string;
  label: string[];
  slug: string;
  url: string;
  noOfProductSold: number;
  isActive: boolean;
  _id: string;
  weight: string;
  stock: Stock;
  price: Price2;
  productId: string;
}

interface Price2 {
  bulk: Bulk;
  mrp: number;
  minPrice: number;
  margin: number;
  searchingPrice: number;
  discount: number;
  maxDiscount: number;
  sellingPrice: number;
}

interface MainVariation {
  values: string[];
  _id: string;
  variationId: string;
}

interface Attribute {
  value: string;
  order: number;
  isActive: boolean;
  attributeId: Category;
}

interface Stock {
  quantity: number;
  availableQuantity: number;
  warehouse: any[];
}

interface Is {
  new: New;
  seasonSpecial: SeasonSpecial;
  hbRecommended: boolean;
  featured: boolean;
  returnable: boolean;
  exchangable: boolean;
  fragile: boolean;
  prescriptionRequired: boolean;
  codAvailable: boolean;
  giftable: boolean;
  approve: boolean;
  limitedQty: boolean;
  top: boolean;
  taxInclusive: boolean;
}

interface SeasonSpecial {
  isSeasonSpecial: boolean;
  season: string[];
}

interface New {
  isNew: boolean;
  from?: any;
  to?: any;
}

interface Price {
  bulk: Bulk;
  mrp: number;
  minPrice: number;
  margin?: number;
  searchingPrice: number;
  discount: number;
  maxDiscount: number;
  sellingPrice: number;
}

interface Bulk {
  discount: number;
  quantity: number;
  price: number;
}

interface Description {
  short: string;
  long: string;
  dosage: string;
  activeIngredients: any[];
  usage: string;
}

interface Category {
  _id: string;
  name: string;
}

interface HealthConcernId {
  _id: string;
  name: string;
  parent?: string;
}

interface Logo {
  savedName: string;
  _id: string;
}

export interface HealthConcernFilter {
  page: number;
  limit: number;
  categoryId: any[];
  healthConcernId: any[];
  brandId: any[];
  minPrice: string;
  maxPrice: string;
  sort: string;
  keyword: string;
}

export type ShopCartData = {
  orderPlaced: boolean;
  totalAmount: number;
  shippingCharge: number;
  totalPayableAmt: number;
  gst: number;
  guestUser: boolean;
  status: 'Active';
  abondonedMailSend: boolean;
  _id: string;
  userId: string;
  products: any[];
  createdAt: string;
  updatedAt: string;
  discount: number;
  note: string;
};

export type ShopCartResponse = {
  success: boolean;
  data: ShopCartData;
};

export type ConsultantCartData = {
  _id: string;
  fee: number;
  slot: string;
  orderPlaced: boolean;
  totalAmount: number;
  totalPayableAmt: number;
  discount: number;
  gst: number;
  guestUser: boolean;
  status: 'Active';
  userId: string;
  consultant: any;
  createdAt: string;
  updatedAt: string;
};

export type ConsultantCartResponse = {
  success: true;
  message: string;
  data: {
    cart: ConsultantCartData;
  };
};

export type Banner = {
  visibleIn: {
    home: true;
    lifestyle: false;
  };
  description: string;
  title: string;
  active: true;
  link: string;
  tag: string;
  buttonText: string;
  _id: string;
  image: {
    savedName: string;
    _id: string;
  };
  mobImage: {
    savedName: string;
    _id: string;
  };
  type: BannersType;
  createdAt: string;
  updatedAt: string;
};

export type GetBannersResponse = {
  success: true;
  data: {
    banners: Banner[];
  };
};

export type TopSellingCategory = {
  image: {
    savedName: string;
    _id: string;
  };
  bannerImage: {
    savedName: string;
    _id: string;
  };
  _id: string;
  name: string;
  products: Product[];
  url: string;
  slug: string;
};

export type TopSellingCategories = TopSellingCategory[];

export type GetTopSellingCategoriesResponse = {
  success: true;
  data: {
    categories: TopSellingCategories;
  };
};

export type GlobalSearchResponse = {
  success: boolean;
  data: Array<{
    name: 'Product' | 'User' | 'Blog' | 'HealthPackage';
    data: any[];
  }>;
};

export type CreatePaymentSessionIdResponse = {
  success: true;
  message: 'Payment Initiated';
  data: {
    cf_order_id: number;
    created_at: string;
    customer_details: {
      customer_id: string;
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      customer_uid: null;
    };
    entity: 'order';
    order_amount: number;
    order_currency: 'INR';
    order_expiry_time: string;
    order_id: string;
    order_meta: {
      return_url: null;
      notify_url: null;
      payment_methods: null;
    };
    order_note: null;
    order_splits: [];
    order_status: 'ACTIVE';
    order_tags: null;
    payment_session_id: 'session_N9J84flQPc3wN8htmdtgEW8omXGxYkRbTSRdujF0jzSIR0IoKIustws3LzhpFu4ahZuFFuvRuM8Laxnl40WVkh-ouPlwhIok7lvfd6v3Thbf';
    payments: {
      url: string;
    };
    refunds: {
      url: string;
    };
    settlements: {
      url: string;
    };
    terminal_data: null;
  };
};

export type CashfreeVerifyPaymentResponse = {
  success: true;
  message: 'Payment Detail fetched!';
  data: {
    paymentStatus: 'SUCCESS';
    paymentDetail: {
      auth_id: null;
      authorization: null;
      bank_reference: null;
      cf_payment_id: '5114915004958';
      entity: 'payment';
      error_details: null;
      is_captured: true;
      order_amount: 385;
      order_id: 'order_103351642opz3BK3hJ8fnodsmMa452QXxgN';
      payment_amount: 385;
      payment_completion_time: '2024-11-14T16:15:25+05:30';
      payment_currency: 'INR';
      payment_gateway_details: {
        gateway_name: 'CASHFREE';
        gateway_order_id: '2188053097';
        gateway_payment_id: '5114915004958';
        gateway_order_reference_id: '';
        gateway_status_code: '';
        gateway_settlement: 'cashfree';
      };
      payment_group: 'net_banking';
      payment_message: null;
      payment_method: {
        netbanking: {
          channel: 'link';
          netbanking_bank_code: 3044;
          netbanking_bank_name: 'State Bank Of India';
          netbanking_ifsc: '';
          netbanking_account_number: '';
        };
      };
      payment_offers: [];
      payment_status: 'SUCCESS';
      payment_time: '2024-11-14T16:15:13+05:30';
    };
    orderId: '673447d959401b6ead86f62f';
  };
};

export type selectedFilterType = {
  id: number;
  minPrice: number | string;
  maxPrice: number | string;
};
