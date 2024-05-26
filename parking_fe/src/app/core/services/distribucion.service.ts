import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DistribucionService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDistribution(): Observable<any> {
    const url = `${this.apiUrl}/DistribucionPlazas/getAllDistribucionPlazas`;
    return this.http.get<any>(url);
  }

  getParkings(): Observable<any> {
    const url = `${this.apiUrl}/Parkings/getAllParkings`;
    return this.http.get<any>(url);
  }
}
