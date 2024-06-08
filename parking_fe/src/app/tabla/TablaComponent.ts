import { Component, ElementRef, Input, OnInit, ViewChild, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Parking, ParkingSpot } from '../core/models/parking-spot.model';
import { DistribucionService } from '../core/services/distribucion.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {
  @Input() datos: ParkingSpot[] = [];
  @Input() filas: number[] = [];
  @Input() columnas: number[] = [];
  @Input() Parkings: Parking[] = [];
  @ViewChild('nombreInput') nombreInput!: ElementRef;
  constructor(private readonly distribucion: DistribucionService) { }
  fileContent: any;



  ngOnInit() {


    console.log('Datos:', this.datos);
    console.log('Filas:', this.filas);
    console.log(this.datos);
  }

  getElement(fila: number, columna: number): ParkingSpot | undefined {
    return this.datos.find(element => element.fila === fila && element.columna === columna);
  }

  async handleClick() {

    const inputElement = this.nombreInput.nativeElement as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.fileContent = JSON.parse(e.target.result);
        console.log(`File ${file.name} Content:`, this.fileContent);

      };
      reader.readAsText(file);

      //1 Creo el parking con el nombre del fichero
      const newParking = { nombre: file.name };
      const parking = await lastValueFrom(this.distribucion.postParkings(newParking));

      //2-_Creo la distribucion mediante el fichero
      await lastValueFrom(this.distribucion.postRellenarDistributionDeFichero(this.fileContent));
      const distribution = await lastValueFrom(this.distribucion.getAllDistribucionPlazasByParking(parking.id));

      //3-_Creo las plazas.
      distribution.forEach(async (element: { id: any; id_Parking: any; fila: number; columna: number; esPlaza: boolean }) => {
        if (element.esPlaza) {
          var plazasData = {
            ocupado: boleanoAleatorio(),
            id_Parking: parking.id,
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
      

    }
  }

  handleChange(event: Event) {
    const elemento = event.target as HTMLSelectElement;
    const parkingId = elemento.value;
    console.log(`Selected option ID: ${parkingId}`);
  }
}
