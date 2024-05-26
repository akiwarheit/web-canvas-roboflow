import { Program } from "./usePrograms";

interface Product {
    mbid: number;
    description: string;
    pack: string;
    upc: number;
    cid: string;
}

const products = require('@/mock/kellanova-products.json')

export default function useProducts(program?: Program) {
    return products as Product[]
}