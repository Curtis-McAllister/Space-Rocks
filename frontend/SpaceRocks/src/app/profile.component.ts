import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: []
})
export class ProfileComponent implements OnInit {

  username;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authService.userProfile$
    .subscribe(response => {
      this.username = response;
      if (this.username){
      console.log(this.username.nickname);
      }
    })
  }

}