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

    private user_reviews_private;
    private userReviewsSubject = new Subject();
    user_reviews = this.userReviewsSubject.asObservable();

    private locations_private;
    private locationsSubject = new Subject();
    locations = this.locationsSubject.asObservable();



    landingID;

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
                this.landingID = id;
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

    getLocations(){
        return this.http.get(
            'http://localhost:5000/api/1/landings/locations')
            .subscribe(response => {
                this.locations_private = response;
                this.locationsSubject.next(this.locations_private);
            })
    }

    getUserReviews(username){
        return this.http.get(
            'http://localhost:5000/api/1/landings/reviews/' + username)
            .subscribe(response => {
                this.user_reviews_private = response;
                this.userReviewsSubject.next(this.user_reviews_private);
            })
    }

    postReview(review) {
        let postData = new FormData();
        postData.append("user", review.user);
        postData.append("comment", review.comment);
        postData.append("rating", review.rating);

        let today = new Date();
        let todays_Date = today.getFullYear() + "-" +
        today.getMonth() + "-" +
        today.getDate();
        postData.append("date", todays_Date);

        this.http.post(
            'http://localhost:5000/api/1/landings/' + 
            this.landingID + '/reviews', postData)
            .subscribe(response => {
                this.getReviews(this.landingID);
            });
    }
}