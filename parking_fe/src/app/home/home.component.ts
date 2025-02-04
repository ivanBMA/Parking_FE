import { Component, OnInit, OnDestroy } from '@angular/core';
import { DistribucionService } from '../core/services/distribucion.service';
import { Observable, Subscription, interval, lastValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TablaComponent } from '../tabla/TablaComponent';
import { Parking, ParkingSpot, Plaza } from '../core/models/parking-spot.model';
import { SharingService } from '../core/services/sharing.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TablaComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  datos: ParkingSpot[] = [];
  filas: number[] = [];
  columnas: number[] = [];
  Parkings: Parking[] = [];
  plazasA: Plaza[] = [];

  public data$: Observable<Parking>;
  private subscription: Subscription | undefined;
  private intervalSubscription: Subscription | undefined;
  
  constructor(private readonly distribucion: DistribucionService, public sharingService: SharingService) { 
    this.data$ = sharingService.parking_Id_observable;
  }

  ngOnInit() {
    this.loadInitialData();

    this.intervalSubscription = interval(4000).pipe(
      switchMap(() => this.data$)
    ).subscribe(async (parking: Parking) => {
      await this.loadParkingData(parking.Id);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  async loadInitialData() {
    const parkings = await lastValueFrom(this.distribucion.getParkings());
    parkings.forEach((elemento: { id: number; nombre: string; }) => {
      this.Parkings.push(new Parking(elemento.id, elemento.nombre));
    });
    console.log(this.Parkings);

    // Cargar datos iniciales si es necesario
    const initialParkingId = (await lastValueFrom(this.data$)).Id;
    await this.loadParkingData(initialParkingId);
  }

  async loadParkingData(parkingId: number) {
    const parkingEntero = await lastValueFrom(this.distribucion.getParkingsById(parkingId));
    const parking = parkingEntero.id;
    console.log('Parking:', parking);

    const distribution = await lastValueFrom(this.distribucion.getAllDistribucionPlazasByParking(parking));
    console.log('Distribución:', distribution);

    const plazas = await lastValueFrom(this.distribucion.getAllPlazasByParking(parking));
    this.plazasA = plazas;
    console.log('Plazas:', plazas);

    const nuevosDatos: ParkingSpot[] = [];
    distribution.forEach((element: { esPlaza: boolean; id: number; id_Parking: number; fila: number; columna: number; }) => {
      if (element.esPlaza === true) {
        plazas.forEach((element2: { id_Distribucion: number; ocupado: boolean; }) => {
          if (element.id === element2.id_Distribucion) {
            nuevosDatos.push(new ParkingSpot(element.id, element.id_Parking, element.fila, element.columna, element.esPlaza, element2.ocupado));
          }
        });
      } else {
        nuevosDatos.push(new ParkingSpot(element.id, element.id_Parking, element.fila, element.columna, element.esPlaza));
      }
    });
    this.datos = nuevosDatos;
    console.log('Datos:', this.datos);

    // Obtener el número máximo de filas y columnas
    const maxFilas = Math.max(...distribution.map((d: { fila: any; }) => d.fila)) + 1;
    const maxColumnas = Math.max(...distribution.map((d: { columna: any; }) => d.columna)) + 1;
    this.filas = Array.from({ length: maxFilas }, (_, i) => i);
    this.columnas = Array.from({ length: maxColumnas }, (_, i) => i);
  }
}
