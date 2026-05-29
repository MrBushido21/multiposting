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

