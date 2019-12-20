import { Component } from "@angular/core";
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service'; 
import { FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: 'review',
    templateUrl: 'review.component.html',
    styleUrls: ['review.component.css']
})

export class ReviewComponent{
    
    thisReview;
    reviewForm;
    currentUser;
    
    constructor(private webService: WebService,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private authService: AuthService) {}

    ngOnInit(){
        this.authService.userProfile$
        .subscribe(response => {
            this.currentUser = response.nickname;
        })
        this.webService.getReview(this.route.snapshot.params.l_id, this.route.snapshot.params._id);
        this.webService.review
        .subscribe(response => {
            this.thisReview = response;
        })
        this.reviewForm = this.formBuilder.group({
            comment: ['', Validators.required],
            rating: 5
        });
    }

    onSubmit(){
        this.reviewForm.value["user"] = this.thisReview.user;
        this.webService.putReview(this.reviewForm.value);
        this.reviewForm.reset();
    }

    deleteReview(){
        this.webService.deleteReview()
        console.log("Review Deleted")
    }

    isInvalid(control) {
        return this.reviewForm.controls[control].invalid &&
        this.reviewForm.controls[control].touched;
    }

    isUnTouched() {
        this.reviewForm.controls.comment.pristine;
    }
    
    isIncomplete() {
        this.isInvalid('comment')||
        this.isUnTouched();
    }

}