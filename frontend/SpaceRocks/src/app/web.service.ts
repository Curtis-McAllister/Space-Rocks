import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class WebService {

    private landings_list_private;
    private landingsSubject = new Subject();
    landings_list = this.landingsSubject.asObservable();

    private page_limit_private;
    private pageSubject = new Subject();
    page_limit = this.pageSubject.asObservable();

    private landing_private;
    private landingSubject = new Subject();
    landing = this.landingSubject.asObservable();

    private reviews_list_private;
    private reviewsSubject = new Subject();
    reviews_list = this.reviewsSubject.asObservable();

    constructor(private http: HttpClient) {}
    
    getLandings(page) {
        return this.http.get(
            'http://localhost:5000/api/1/landings?pn=' + page)
            .subscribe(response => {
                this.landings_list_private = response;
                this.landingsSubject.next(this.landings_list_private);
            });
    }

    getPageLimit(){
        return this.http.get(
            'http://localhost:5000/api/1/page-limit')
            .subscribe(response => {
                this.page_limit_private = response;
                this.pageSubject.next(this.page_limit_private);
            });
    }

   getLanding(id){
        return this.http.get(
            'http://localhost:5000/api/1/landings/' + id)
            .subscribe(response => {
                this.landing_private = response;
                this.landingSubject.next(this.landing_private);
            });
    }

    getReviews(id){
        return this.http.get(
            'http://localhost:5000/api/1/landings/' + id + '/reviews')
            .subscribe(response => {
                this.reviews_list_private = response;
                this.reviewsSubject.next(this.reviews_list_private);
            })
    }
}