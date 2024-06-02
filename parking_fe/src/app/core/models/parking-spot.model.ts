export class ParkingSpot {
    constructor(
      public id: number,
      public idParking: number,
      public fila: number,
      public columna: number,
      public esPlaza: boolean,
      public ocupado?: boolean
    ) {}
}
  