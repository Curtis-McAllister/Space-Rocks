import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})

export class LandingComponent{

    constructor(private webService: WebService,
                private route: ActivatedRoute) {}

    ngOnInit(){
        this.webService.getLanding(this.route.snapshot.params.id);
        this.webService.landing
        .subscribe(response => {
            this.landing = response;
        })
        this.webService.getReviews(this.route.snapshot.params.id);
        /*this.webService.reviews_list
        .subscribe(reviews => {
            this.reviews_list = reviews;
        })*/
    }
 } 