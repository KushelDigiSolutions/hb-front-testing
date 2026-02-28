import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AppService {

    private hideMobFooter$ = new BehaviorSubject<any>(null);

    setMobCartState(state: boolean) {
        this.hideMobFooter$.next(state);
    }

    getMobCartState() {
        return this.hideMobFooter$.asObservable();
    }
}