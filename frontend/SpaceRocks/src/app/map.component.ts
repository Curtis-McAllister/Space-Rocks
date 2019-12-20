import { Component, ViewChild } from '@angular/core';
import { WebService } from './web.service';
import { AgmCoreModule} from '@agm/core';

@Component({
    selector: 'map',
    templateUrl: 'map.component.html',
    styleUrls: ['map.component.css']
})

export class MapComponent {

    landing_locations;

    constructor(private webService: WebService) {}

    ngOnInit(){
        this.webService.getLocations();
    }
}