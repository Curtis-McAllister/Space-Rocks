import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from '../auth.service'

@Component({
    selector: 'landings',
    templateUrl: './landings.component.html',
    styleUrls: ['./landings.component.css']
})

export class LandingsComponent{

    constructor(private webService: WebService,
                private authService: AuthService) {}

    ngOnInit(){
        if (sessionStorage.page){
            this.page = sessionStorage.page;
        }
        this.webService.getLandings(this.page);
        this.webService.getPageLimit();
        this.webService.page_limit
        .subscribe(pages => {
            this.last_page = pages;
        })
    }

    nextPage(){
        if(this.page < this.last_page){
            this.page= Number(this.page) + 1;
            sessionStorage.page = Number(this.page);
            this.webService.getLandings(this.page);
        }
    }
    
    previousPage(){
        if (this.page> 1) {
            this.page = Number(this.page) -1;
            sessionStorage.page = Number(this.page);
            this.webService.getLandings(this.page);
        }
    }

    navigateTo(selected_page){
        if(selected_page > 1 && selected_page < this.last_page){
            this.page = selected_page;
            sessionStorage.page = Number(this.page);
            this.webService.getLandings(this.page);
        }
    }

    firstPage(){
        this.page = 1;
        sessionStorage.page = Number(this.page);
        this.webService.getLandings(this.page);
    }

    lastPage(){
        this.page = this.last_page;
        sessionStorage.page = Number(this.page);
        this.webService.getLandings(this.page);
    } 

    last_page;
    page = 1;
 }