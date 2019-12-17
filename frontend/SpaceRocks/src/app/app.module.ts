import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WebService } from './web.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { LandingsComponent } from './landings.component';
import { LandingComponent } from './landing.component';

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
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LandingsComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [WebService],
  bootstrap: [AppComponent]
})
export class AppModule { }