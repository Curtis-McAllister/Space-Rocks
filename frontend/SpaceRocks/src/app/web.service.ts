import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class WebService {

    private landings_list_private = [];
    private landingsSubject = new Subject();
    landings_list = this.landingsSubject.asObservable();

    constructor(private http: HttpClient) {}
    
    getLandings(page) {
        return this.http.get(
            'http://localhost:5000/api/1/landings?pn=' + page)
            .subscribe(response => {
                this.landings_list_private = response;
                this.landingsSubject.next(this.landings_list_private);
            });
    }

   /* getLanding(id){
        return this.http.get(
            'http://localhost:5000/api/1/landings/' + id)
            .toPromise();
    } */
}