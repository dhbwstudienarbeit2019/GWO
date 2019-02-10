import { Position } from "./Point";

export class Wolf {
    private position: Position;
    private functionToOptimize: (x: number, y: number) => number;

    constructor(position: Position, functionToOptimize: (x: number, y: number) => number) {
        this.position = position;
        this.functionToOptimize = functionToOptimize;
}

    public get FunctionToOptimize(): ((x: number, y: number) => number) {
        return this.functionToOptimize;
    }
    public get Position(): Position {
        return this.position;
    }

    public set Position(posiiton: Position) {
        this.position = posiiton;
    }

    calculateFitness(): number {
        return this.functionToOptimize(this.position.x, this.position.y);
    }
}