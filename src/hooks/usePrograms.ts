
export interface Program {
    id: number;
    mfg: string;
    banner: string;
}

const programs = require('@/mock/programs.json')

export default function useProducts(id: number) {
    const program = programs.find((program: Program) => program.id === id)

    return program
}