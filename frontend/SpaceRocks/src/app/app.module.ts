import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';


import { WebService } from './web.service';
import { AuthService } from '../auth.service';

import { AppComponent } from './app.component';
import { NavComponent } from './nav.component';
import { HomeComponent } from './home.component';
import { LandingsComponent } from './landings.component';
import { LandingComponent } from './landing.component';
import { ProfileComponent } from './profile.component'
import { MapComponent } from './map.component';
import { ReviewComponent } from './review.component';

var routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'landings',
    component: LandingsComponent
  },
  {
    path: 'landings/:id',
    component: LandingComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'reviews/:l_id/:_id',
    component: ReviewComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    LandingsComponent,
    LandingComponent,
    ProfileComponent,
    MapComponent,
    ReviewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: //API KEY 
    })
  ],
  providers: [WebService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
