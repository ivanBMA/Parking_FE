import { Component, OnInit } from '@angular/core';
import { DistribucionService } from '../core/services/distribucion.service';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TablaComponent } from '../tabla/TablaComponent';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TablaComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  datos: boolean[][] = []; // Define 'datos' como un array bidimensional

  constructor(private readonly distribucion: DistribucionService) {}

  async ngOnInit() {
    const parkings = await lastValueFrom(this.distribucion.getParkings());
    const parking = parkings[parkings.length - 1].id;
    console.log(parking);

    const distributions = await lastValueFrom(this.distribucion.getDistribution());
    let distribucion: { id_Parking: any; fila: number; columna: number; esPlaza: boolean }[] = [];

    distributions.forEach((element: { id_Parking: any; fila: number; columna: number; esPlaza: boolean }) => {
      if (element.id_Parking == parking) {
        distribucion.push(element);
      }
    });
    console.log(distribucion);

    // Obtener el número máximo de filas y columnas
    const numRows = Math.max(...distribucion.map(d => d.fila)) + 1;
    const numCols = Math.max(...distribucion.map(d => d.columna)) + 1;

    // Inicializar la matriz con valores false
    this.datos = Array.from({ length: numRows }, () => Array(numCols).fill(false));

    // Asignar valores esPlaza a la matriz
    distribucion.forEach(element => {
      this.datos[element.fila][element.columna] = element.esPlaza;
    });
  }
}
