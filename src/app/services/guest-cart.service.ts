import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
declare var localStorage: Storage;

interface GuestCart {
    abondonedMailSend: boolean
    createdAt: string
    gst: number
    guestUser: boolean
    orderPlaced: boolean
    products: any[]
    shippingCharge: number
    status: string
    totalAmount: number
    totalPayableAmt: number
    _id: string
}

const LS_CART_KEY = "cartV1";

@Injectable({
    providedIn: 'root'
})
export class GuestCartService {

    constructor(
        private cryptoService: CryptoService,
    ) { }

    setGuestCart(cart: any) {
        localStorage.setItem(LS_CART_KEY, this.cryptoService.encryptUsingAES256(cart));
    }

    getGuestCart(): GuestCart | null | any {
        if (typeof localStorage == 'undefined') return null;
        let cart = localStorage.getItem(LS_CART_KEY);
        if (cart) {
            return this.cryptoService.decryptUsingAES256(cart);
        }
        return null;
    }

    removeGuestCart() {
        localStorage.removeItem(LS_CART_KEY);
    }
}
