import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Parking } from '../models/parking-spot.model';

@Injectable({
  providedIn: 'root'
})
export class SharingService {

  private parking_Id_observable_Private: BehaviorSubject<Parking> =
        new BehaviorSubject<Parking>({   Id: 355, Nombre :"a"   });

    get parking_Id_observable(){
        return this.parking_Id_observable_Private.asObservable();
    }

    set parking_Id_observableData(data: Parking){
        this.parking_Id_observable_Private.next(data);
    }
}
