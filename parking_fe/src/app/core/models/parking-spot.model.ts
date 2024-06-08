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

export class Parking {
  constructor(
    public Id: number ,
    public Nombre :string 
  ) {}
}

export class Plaza {
  constructor(
    public  id :number,
    //La base de datos es 0 o 1 no true o false por que no existe boolean
    public  ocupado : boolean,
    public  id_Parking :number,
    public  id_Distribucion :number
  ) {}
}
  