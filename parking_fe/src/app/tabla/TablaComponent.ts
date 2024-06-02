import { Component, Input, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingSpot } from '../core/models/parking-spot.model';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {
  @Input()  datos: ParkingSpot[] = [];
  @Input()  filas: number[] = [];
  @Input()  columnas: number[] = [];

  

  ngOnInit() {
    

    console.log('Datos:', this.datos); // Verificar que los datos se reciben correctamente
    console.log('Filas:', this.filas); // Verificar las filas únicas
    console.log(this.datos); // Verificar que los datos se reciben correctamente
  }

  getElement(fila: number, columna: number): ParkingSpot | undefined {
    return this.datos.find(element => element.fila === fila && element.columna === columna);
  }
}
