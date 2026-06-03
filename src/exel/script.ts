import { readFileSync, readdirSync } from 'fs'
import XLSX from 'xlsx'
import axios from 'axios';
import { IMapItem, ISiteItemsName } from '../types';
import { postMySite } from '../services/postMySite.service';

const mainItems = XLSX.read(readFileSync('./src/exel/Товары.xlsx'))
const mainSheet = mainItems.Sheets[mainItems.SheetNames[0]]

let siteItemsName: ISiteItemsName[] = []
const diff = new Map()

const mainRange = XLSX.utils.decode_range(mainSheet['!ref']!)

async function main() {
  try {
    const response = await axios.get('http://localhost:3000/products/names')
    siteItemsName = response.data
  } catch (error) {
    console.error('Error fetching data:', error);
  }

 const items = getItesmName(mainRange)
  if (!items) return

  const last:IMapItem = [...items.values()].at(-1)
//   {
//   A: 'Футболки Maison Margiela', title
//   B: 'Футболка',
//   C: null,
//   D: 746.71, Ціна закупки (грн)
//   E: 4, К-сть у партії quantityс
//   F: 0,
//   G: 0,
//   H: 186.6775, price + 200
//   I: 0,
//   J: 0,
//   K: 0,
//   L: -746.71,
//   M: 'D:\\projects\\Товары\\гетры',
//   N: '[{"size":"M","color":"white","quantity":1},{"size":"L","color":"white","quantity":1},{"size":"M","color":"black","quantity":1},{"size":"L","color":"black","quantity":1}]'
// }
 

 
}

function getItesmName(mainRange: XLSX.Range) {
    if (mainRange.e.r + 1 === siteItemsName.length) {
        console.log('Списки равны')
        return
    }

    for (let i = 2; i <= mainRange.e.r + 1; i++) {
        const cell = mainSheet['A' + i]
        if (!siteItemsName.some(item => item.title === cell.v)) {
            let row: Record<string, any> = {}
            for (let c = mainRange.s.c; c <= mainRange.e.c; c++) {
                const col = XLSX.utils.encode_col(c)
                const cell = mainSheet[col + i]
                row[col] = cell ? cell.v : null
            }
            diff.set(cell.v, row)
        }
    }

    return diff;
}

main()
