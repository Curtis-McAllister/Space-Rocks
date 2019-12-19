import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    selector: 'landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})

export class LandingComponent{

    reviewForm;
    landing;
    currentUser;

    constructor(private webService: WebService,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private authService: AuthService) {}

    ngOnInit(){
        this.authService.userProfile$
        .subscribe(response => {
            this.currentUser = response.nickname;
            console.log(this.currentUser);
        })
        this.reviewForm = this.formBuilder.group({
            comment: ['', Validators.required],
            rating: 5
        });

        this.webService.getLanding(this.route.snapshot.params.id);
        this.webService.landing
        .subscribe(response => {
            this.landing = response;
        })

        this.webService.getReviews(this.route.snapshot.params.id);
    }

    onSubmit(){
        this.reviewForm.value["user"] = this.currentUser;
        this.webService.postReview(this.reviewForm.value);
        this.reviewForm.reset();
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