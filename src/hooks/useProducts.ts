import { Program } from "./usePrograms";

interface Product {
    mbid: number;
    description: string;
    pack: string;
    upc: number;
    cid: string;
}

const kellanova = require('@/mock/kellanova-products.json')
const juul = require("@/mock/products.json")

export default function useProducts(program?: Program) {
    if (!program) {
        return kellanova as Product[]
    }

    switch (program.mfg) {
        case "Juul Labs":
            return juul as Product[]
        case "Kellanova":
            return kellanova as Product[]
        default:
            return kellanova as Product[]
    }
}