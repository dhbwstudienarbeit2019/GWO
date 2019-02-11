import { IHuntingPrey } from "./IHuntingPrey.interface";
import { Point } from "./message.interface";
import { Position } from "./Point";
import { Wolf } from "./wolf";

export class HuntingPrey implements IHuntingPrey {
    private r1: Position;
    private r2: Position;

    constructor(private readonly wolfAlpha: Wolf, 
                private readonly wolfBeta: Wolf, 
                private readonly wolfDelta: Wolf, 
                private readonly a: number, 
                private readonly searchDomain: { min: Point, max: Point }) { 
    }

    private setRandomVectors(): void {
        this.r1 = Position.doRandomPosition();
        this.r2 = Position.doRandomPosition();
    }

    private calculateA(): Position {
        return new Position(2.0 * this.a * this.r1.x - this.a, 2.0 * this.a * this.r1.y - this.a);
    }

    private calculateC(): Position {
        return new Position(2.0 * this.r2.x, 2.0 * this.r2.y);
    }

    private calculateD(C: Position, wolfChef: Wolf, wolf: Wolf): Position {
        return new Position(Math.abs(C.x * wolfChef.Position.x - wolf.Position.x), 
                            Math.abs(C.y * wolfChef.Position.y - wolf.Position.y));
    }

    private calculateX(wolfChef: Wolf, A: Position, D: Position): Position {
        return new Position(wolfChef.Position.x - A.x * D.x, wolfChef.Position.y - A.y * D.y);
    }

    private static limitRange(value: number, min: number, max: number) {
        return Math.max(min, Math.min(max, value));
}

    private checkPosition(pos: Position): Position {
        const newPosition = pos;
        const limitx = (x) => HuntingPrey.limitRange(x, this.searchDomain.min.x, this.searchDomain.max.x);
        const limity = (y) => HuntingPrey.limitRange(y, this.searchDomain.min.y, this.searchDomain.max.y);
        return new Position(
            limitx(newPosition.x),
            limity(newPosition.y)
        );
}

    hunt(wolf: Wolf): void {
        this.setRandomVectors();
        let C = this.calculateC();
        let X1 = this.calculateX(this.wolfAlpha, this.calculateA(), this.calculateD(C, this.wolfAlpha, wolf));
        X1 = this.checkPosition(X1);

        this.setRandomVectors();
        C = this.calculateC();
        let X2 = this.calculateX(this.wolfBeta, this.calculateA(), this.calculateD(C, this.wolfBeta, wolf));
        X2 = this.checkPosition(X2);

        this.setRandomVectors();
        C = this.calculateC();
        let X3 = this.calculateX(this.wolfDelta, this.calculateA(), this.calculateD(C, this.wolfDelta, wolf));
        X3 = this.checkPosition(X3);

        let newPosition = new Position((X1.x + X2.x + X3.x)/3.0,(X1.y + X2.y + X3.y)/3.0);
        newPosition = this.checkPosition(newPosition);

        wolf.Position = newPosition;
    }
}