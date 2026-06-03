interface SizesI {
    size:string, color:string, quantity:number
}
export interface PostBodyI {
    title: string,
    description: string,
    price: number,
    category_id: number,
    quantity: number,
    sizes: SizesI[],
    searchAliace: string 
}

export interface ISiteItemsName {
    title: string
}

export interface IMapItem {
  A: string,
  B: string,
  C: SizesI,
  D: number,
  E: number,
  F: number,
  G: number,
  H: number,
  I: number,
  J: number,
  K: number,
  L: number,
  M: string,
  N: SizesI
}