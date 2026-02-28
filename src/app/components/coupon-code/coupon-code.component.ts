import { Component, Input } from "@angular/core";
import { CardComponent } from "../card/card.component";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-coupon-code",
    templateUrl: "./coupon-code.component.html",
    styleUrls: ["./coupon-code.component.scss"],
    imports: [CardComponent, CommonModule],
    standalone: true
})
export class CouponCardComponent {
    @Input() couponcode: any;

}