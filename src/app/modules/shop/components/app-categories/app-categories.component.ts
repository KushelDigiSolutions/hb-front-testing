import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { CardComponent } from "../../../../components/card/card.component";

@Component({
    selector: "app-categories",
    templateUrl: "./app-categories.component.html",
    styleUrls: ["./app-categories.component.scss"],
    standalone: true,
    imports: [CommonModule, CardComponent]
})
export class AppCategoriesComponent {
    @Input() appcategories: { image: string };
}