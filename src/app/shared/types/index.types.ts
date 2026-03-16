import { ConsultantCartData, ShopCartData } from "./xhr.types"

export type CartData = {
  shop: ShopCartData | null,
  consult: ConsultantCartData | null
}

export type CartLoading = {
  shop: boolean,
  consult: boolean
}

export type BannersType = 'home' | 'consultUs' | 'lifestyle'