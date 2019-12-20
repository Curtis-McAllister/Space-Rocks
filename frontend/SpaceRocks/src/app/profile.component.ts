import { Component, OnInit } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: []
})
export class ProfileComponent implements OnInit {

  currentUser;

  constructor(public webService: WebService,
              public authService: AuthService) { }

  ngOnInit() {
    this.authService.userProfile$
    .subscribe(response => {
      this.currentUser = response.nickname;
    })
    this.webService.getUserReviews(this.currentUser);
  }

}