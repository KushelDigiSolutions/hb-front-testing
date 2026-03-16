import { CategoryDetails, CategoryProduct } from "../../../shared/types/xhr.types";

export class HealthConcernProduct {
    prodId: string;
    type: string;
    prodName: string;
    prodMRP: number;
    prodMinPrice: number;
    imageURL: string;
    prodMaxQuantity: number;
    brandName: string;
    slug: string;
    discount: number;
    variations: Array<any>;
    mainVariations: Array<any>;
    weight: number;
    availableQuantity: number;


    constructor(data: CategoryProduct) {
        let price: any = data.price
        let _id = data._id
        let slug = data.slug
        let stock = data.stock
        let weight = data.weight

        if (data.type == 'Normal' && data.variations.length) {
            data.variations.sort((a, b) => (a.price.minPrice || a.price.mrp) - (b.price.minPrice || a.price.mrp));
            let variation = data.variations[0];

            price = variation.price;
            slug = variation.slug
            stock = variation.stock
            weight = +variation.weight || data.weight
            _id = variation.productId
        }

        if (!data.price) {
            data.price = { mrp: (data as any).prodMRP, minPrice: (data as any).prodMinPrice } as any;
            price = data.price;
        }

        let { mrp, minPrice } = data.price;
        if (minPrice != null && minPrice != undefined && mrp > minPrice) {
            let discount = Math.round(((mrp - minPrice) / mrp * 100));
            price.discount = discount;
        }

        this.prodId = _id || (data as any).prodId;
        this.type = data.type
        this.prodName = data.name || (data as any).prodName;
        this.prodMRP = price.mrp;
        this.prodMinPrice = price.minPrice;
        this.imageURL = data.thumbnail?.savedName || (data as any).imageURL;
        this.brandName = data.brandId?.name || (data as any).brandName;
        this.slug = slug;
        this.discount = price.discount;
        this.weight = weight;
        this.variations = data.variations || []
        this.mainVariations = data.mainVariations || []
        this.prodMaxQuantity = stock?.quantity || (data as any).quantity;
        this.availableQuantity = stock?.availableQuantity || (data as any).availableQuantity
    }
}