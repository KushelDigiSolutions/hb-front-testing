import { Component, Input } from "@angular/core";
import { CardComponent } from "../../../../components/card/card.component";
import { environment } from "../../../../../environments/environment";
import { RouterModule } from "@angular/router";

@Component({
    selector: "app-top-brands",
    templateUrl: "./top-brands.component.html",
    styleUrls: ['./top-brands.component.scss'],
    imports: [CardComponent, RouterModule],
    standalone: true
})
export class TopBrandsComponent {
    @Input() brands: any;
    cloudeImagePath: any = environment.imageUrl;
}