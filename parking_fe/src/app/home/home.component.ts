import { Component, OnInit } from '@angular/core';
import { DistribucionService } from '../core/services/distribucion.service';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TablaComponent } from '../tabla/TablaComponent';
import { Parking, ParkingSpot } from '../core/models/parking-spot.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TablaComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  datos: ParkingSpot[] = [];
  filas: number[] = [];
  columnas: number[] = [];
  Parkings: Parking[] = []

  constructor(private readonly distribucion: DistribucionService) { }

  async ngOnInit() {

    const parkings = await lastValueFrom(this.distribucion.getParkings());
    parkings.forEach((elemento: { id: number; nombre: string; }) => {
      this.Parkings.push(new Parking(elemento.id, elemento.nombre));
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    /*
    type Listener = (newValue: any, oldValue: any) => void;

    class Observable<T> {
      private listeners: Listener[] = [];
      private _value: T;

      constructor(initialValue: T) {
        this._value = initialValue;
      }

      get value(): T {
        return this._value;
      }

      set value(newValue: T) {
        const oldValue = this._value;
        this._value = newValue;
        this.notify(newValue, oldValue);
      }

      subscribe(listener: Listener) {
        this.listeners.push(listener);
      }

      private notify(newValue: T, oldValue: T) {
        for (const listener of this.listeners) {
          listener(newValue, oldValue);
        }
      }
    }

    // Uso del Observable con valor por defecto o variable opcional
    function createObservable<T>(variable?: T, defaultValue: T = null as any): Observable<T> {
      return new Observable<T>(variable !== undefined ? variable : defaultValue);
    }

    // Ejemplo de uso
    const observableVar = createObservable<number>(undefined, 355);
    var parking_id_actual = observableVar;
    */
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    var parking_id_actual = 355;

    const parkingEntero = await lastValueFrom(this.distribucion.getParkingsById(parking_id_actual));
    const parking = parkingEntero.id;
    console.log(this.Parkings);
    console.log(parking);

    const distribution = await lastValueFrom(this.distribucion.getAllDistribucionPlazasByParking(parking));
    console.log("distribucion");
    console.log(distribution);

    const plazas = await lastValueFrom(this.distribucion.getAllPlazasByParking(parking));
    console.log("plazas");
    console.log(plazas);

    distribution.forEach((element: { esPlaza: boolean; id: number; id_Parking: number; fila: number; columna: number; }) => {
      if (element.esPlaza === true) {
        plazas.forEach((element2: { id_Distribucion: number; ocupado: boolean; }) => {
          if (element.id == element2.id_Distribucion) {
            this.datos.push(new ParkingSpot(element.id, element.id_Parking, element.fila, element.columna, element.esPlaza, element2.ocupado));
          }
        });

      } else {
        this.datos.push(new ParkingSpot(element.id, element.id_Parking, element.fila, element.columna, element.esPlaza));
      }
    });
    console.log(this.datos);

    // Obtener el número máximo de filas y columnas
    const maxFilas = Math.max(...distribution.map((d: { fila: any; }) => d.fila)) + 1;
    const maxColumnas = Math.max(...distribution.map((d: { columna: any; }) => d.columna)) + 1;
    this.filas = Array.from({ length: maxFilas }, (_, i) => i);
    this.columnas = Array.from({ length: maxColumnas }, (_, i) => i);

  }
}
