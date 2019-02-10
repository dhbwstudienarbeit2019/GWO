import { Position } from "./Point";

export class Wolf {
    private position: Position;
    private functionToOptimize: (x: number, y: number) => number;


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