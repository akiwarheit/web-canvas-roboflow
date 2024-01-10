
interface Products {
    mbid: number;
    description: string;
    pack: string;
    upc: number;
    cid: string;
}

const products = require('@/mock/products.json')

export default function useProducts() {
    return products as Products[]
}