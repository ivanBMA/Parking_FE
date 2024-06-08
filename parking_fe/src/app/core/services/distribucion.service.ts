import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DistribucionService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Parking
  postParkings(parkingData: any): Observable<any> {
    const url = `${this.apiUrl}/Parkings/postAddParkings`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url, parkingData, { headers: headers });
  }

  getParkings(): Observable<any> {
    const url = `${this.apiUrl}/Parkings/getAllParkings`;
    return this.http.get<any>(url);
  }

  getParkingsById(id: any): Observable<any> {
    const url = `${this.apiUrl}/Parkings/getById`;
    let params = new HttpParams().set('id', id);
    return this.http.get<any>(url, { params });
  }

  //DistribucionPlazas
  getAllDistribucionPlazas(): Observable<any> {
    const url = `${this.apiUrl}/DistribucionPlazas/getAllDistribucionPlazas`;
    return this.http.get<any>(url);
  }
  getAllDistribucionPlazasByParking(id: any): Observable<any> {
    const url = `${this.apiUrl}/DistribucionPlazas/getAllDistribucionPlazasByParking`;
    let params = new HttpParams().set('id', id);
    return this.http.get<any>(url, { params });
  }
  postRellenarDistribution(): Observable<any> {
    const url = `${this.apiUrl}/DistribucionPlazas/rellenarDistribucion`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url,  { headers: headers });
  }
  postRellenarDistributionDeFichero(plazasData: any): Observable<any> {
    const url = `${this.apiUrl}/DistribucionPlazas/rellenarDistribucion`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url, plazasData, { headers: headers });
  }

  //Plazas
  postAddPlaza(plazasData: any): Observable<any> {
    const url = `${this.apiUrl}/Plazas/postAddPlaza`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url, plazasData, { headers: headers });
  }
  getAllPlazasByParking(id: any): Observable<any> {
    const url = `${this.apiUrl}/Plazas/getAllPlazasByParking`;
    let params = new HttpParams().set('id', id);
    return this.http.get<any>(url, { params });
  }

  getAllPlazas(): Observable<any> {
    const url = `${this.apiUrl}/Plazas/getAllPlazas`;
    return this.http.get<any>(url);
  }
}
