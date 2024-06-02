import { Component, OnInit } from '@angular/core';
import { DistribucionService } from '../core/services/distribucion.service';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TablaComponent } from '../tabla/TablaComponent';
import { ParkingSpot } from '../core/models/parking-spot.model';

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

  constructor(private readonly distribucion: DistribucionService) {}
  
  async ngOnInit() {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*
    //Tabla Parking___________________________________________________________________________________________
    // 1. Generar un nuevo parking mediante petición a la API.
    const newParking = { nombre: 'Parking' };
    await lastValueFrom(this.distribucion.postParkings(newParking));

    // 2. Recoger el id del parking.
    

    //Tabla DistribucionPlazas________________________________________________________________________________
    // 1. Generar una nueva distribución a partir del id del Parking nuevo.
    await lastValueFrom(this.distribucion.postRellenarDistribution());
    */
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    const parkings = await lastValueFrom(this.distribucion.getParkings());
    const parking = parkings[parkings.length - 1].id;
    console.log(parking);

    const distribution = await lastValueFrom(this.distribucion.getAllDistribucionPlazasByParking(parking));
    console.log("distribucion");
    console.log(distribution);


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*
    distribution.forEach(async (element: { id: any; id_Parking: any; fila: number; columna: number; esPlaza: boolean }) => {
      if (element.esPlaza) {
        var plazasData = {
          ocupado: boleanoAleatorio(),
          id_Parking: parking,
          id_Distribucion: element.id,
        };

        await lastValueFrom(this.distribucion.postAddPlaza(plazasData));
      }
    });

    function boleanoAleatorio() {
      const ran = Math.random();
      console.log(ran);
      var numero =  ran >= 0.5 ? 2 : 1;
      console.log(numero);
      if(numero == 1) {
        return true;
      }else{
        return false
      }
    }
    */
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

      }else{
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
