export enum GuitarType {
  Acoustic = 'аккустика',
  Electro = 'электро',
  Ukulele = 'укулеле'
}

export enum StringsCount {
  Four = 4,
  Six = 6,
  Seven = 7,
  Twelve = 12
}

export interface Product {
  _id?: string;
  createdAt?: string;
  authorId: string;
  title: string;
  description: string;
  image: string;
  guitarType: GuitarType;
  sku: string;
  stringsCount: StringsCount;
  rating?: number;
  price: number;
  reviewsCount?: number;
}
