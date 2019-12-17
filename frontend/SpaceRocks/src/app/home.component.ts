import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: []
})

export class HomeComponent{
    constructor(private authService: AuthService) {}
 }