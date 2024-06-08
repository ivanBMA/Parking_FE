import { Component, ElementRef, Input, OnInit, ViewChild, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Parking, ParkingSpot, Plaza } from '../core/models/parking-spot.model';
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
  @Input() plazasA: Plaza[] = [];
  @ViewChild('nombreInput') nombreInput!: ElementRef;
  public parkingOb$: Observable<Parking>;
  public media$: Observable<Media>;
  
  constructor(private readonly distribucion: DistribucionService, public sharingService: SharingService) { 
    this.parkingOb$ = sharingService.parking_Id_observable;
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
            ocupado: false,
            id_Parking: parking.id,
            id_Distribucion: element.id,
          };

          await lastValueFrom(this.distribucion.postAddPlaza(plazasData));
        }
      });
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
    console.log("this.datos[0].idParking");
    

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

    setInterval(async () => {
      console.log(this.datos[0].id);

    console.log("plazass");
    console.log(this.plazasA);
      
      this.plazasA.forEach(async (element: Plaza) => {
        
        element.ocupado = boleanoAleatorio();
        if (element.ocupado) {
          ocupaciones++;
        }console.log("entra");
        console.log(element.id);
        await lastValueFrom(this.distribucion.putPlaza(element.id ,element));
      });


      /*
      this.datos.forEach(element => {
        if (element.esPlaza) {
          //to do Put plaza
          element.ocupado = boleanoAleatorio();
          if (element.ocupado) {
            ocupaciones++;
          }
        }
      });
      */
      actualizaciones++;

      const media = new Media(ocupaciones, actualizaciones);
      console.log("media");
      console.log(media);
      this.sharingService.media_observableData = media;
    }, 3000);
  }

}
