import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Parking } from '../models/parking-spot.model';
import { Media } from '../models/media';

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


    private media_observable_Private: BehaviorSubject<Media> =
        new BehaviorSubject<Media>({    ocupaciones: 0 , actualizaciones : 0   });

    get media_observable(){
        return this.media_observable_Private.asObservable();
    }

    set media_observableData(data: Media){
        this.media_observable_Private.next(data);
    }
}
