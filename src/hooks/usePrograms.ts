
interface Program {
    id: number;
    mfg: string;
    banner: string;
}

const programs = require('@/mock/programs.json')

export default function useProducts() {
    return programs as Program[]
}