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
/*
    async ngOnInit(){
        var response = await this.webService.getLanding(this.route.snapshot.params.id);
        this.landing = response;
    }

    landing; */
 } 