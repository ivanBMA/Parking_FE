import { Component, ElementRef, Input, OnInit, ViewChild, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Parking, ParkingSpot } from '../core/models/parking-spot.model';
import { DistribucionService } from '../core/services/distribucion.service';
import { Observable, lastValueFrom } from 'rxjs';
import { SharingService } from '../core/services/sharing.service';
import { Media } from '../core/models/media';


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
  public data$: Observable<Parking>;
  public media$: Observable<Media>;

  constructor(private readonly distribucion: DistribucionService, public sharingService: SharingService) { 
    this.data$ = sharingService.parking_Id_observable;
    this.media$ = sharingService.media_observable;
  }
  fileContent: any;



  ngOnInit() {
    this.startTimeout();

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

    const parkingIdParseado: number = parseInt(parkingId, 10);
    const parking = new Parking(parkingIdParseado, "a");
    this.sharingService.parking_Id_observableData = parking;
  }
  
  startTimeout(){
    var ocupaciones :number = 0;
    var actualizaciones :number = 0;

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

    setInterval(() => {
      this.datos.forEach(element => {
        if (element.esPlaza) {
          element.ocupado = boleanoAleatorio();
          if (element.ocupado) {
            ocupaciones++;
          }
        }
      });
      actualizaciones++;

      const media = new Media(ocupaciones, actualizaciones);
      console.log("media");
      console.log(media);
      this.sharingService.media_observableData = media;
    }, 3000);
  }
}
