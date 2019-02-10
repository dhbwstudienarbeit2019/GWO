import { IHuntingPrey } from "./IHuntingPrey.interface";
import { Point } from "./message.interface";
import { Position } from "./Point";
import { Wolf } from "./wolf";
import * as MersenneTwister from 'mersenne-twister';

export class HuntingPrey implements IHuntingPrey {
    private r1 = [];
    private r2 = [];
    private static readonly mersenneTwister = new MersenneTwister();

    constructor(private readonly wolfAlpha: Wolf, 
                private readonly wolfBeta: Wolf, 
                private readonly wolfDelta: Wolf, 
                private readonly a: number, 
                private readonly searchDomain: { min: Point, max: Point }) { 
    }

    private setRandomVectors(): void {
        for(let i = 0; i < 2; i++) {
            this.r1[i] = HuntingPrey.mersenneTwister.random();
            this.r2[i] = HuntingPrey.mersenneTwister.random();
        }
    }

    private calculateA(): number[] {
        let A = Number[2];
        A[0] = 2.0 * this.a * this.r1[0] - this.a;
        A[1] = 2.0 * this.a * this.r1[1] - this.a;
        return A;
    }

    private calculateC(): number[] {
        let C = Number[2];
        C[0] = 2.0 * this.r2[0];
        C[1] = 2.0 * this.r2[1];
        return C;
    }

    private calculateD(C: number[], wolfChef: Wolf, wolf: Wolf): number[] {
        let D = Number[2];
        D[0] = Math.abs(C[0] * wolfChef.Position[0] - wolf.Position[0]);
        D[1] = Math.abs(C[1] * wolfChef.Position[1] - wolf.Position[1]);
        return D;
    }

    private calculateX(wolfChef: Wolf, A: number[], D: number[]): number[] {
        let X = Number[2];
        X[0] = wolfChef.Position[0] - A[0] * D[0];
        X[1] = wolfChef.Position[1] - A[1] * D[1];
        return X;
    }

    hunt(wolf: Wolf): void {
        this.setRandomVectors();
        let A = this.calculateA();
        let C = this.calculateC();
        let X1 = this.calculateX(this.wolfAlpha, this.calculateA(), this.calculateD(C, this.wolfAlpha, wolf));
        
        this.setRandomVectors();
        A = this.calculateA();
        C = this.calculateC();
        let X2 = this.calculateX(this.wolfBeta, this.calculateA(), this.calculateD(C, this.wolfBeta, wolf));
        
        this.setRandomVectors();
        A = this.calculateA();
        C = this.calculateC();
        let X3 = this.calculateX(this.wolfDelta, this.calculateA(), this.calculateD(C, this.wolfDelta, wolf));

        //Boundaries prüfen - searchDomain

        let newPosition = new Position((X1[0] + X2[0] + X3[0])/3.0,(X1[1] + X2[1] + X3[1])/3.0);

        //check Boundaries

        wolf.Position = newPosition;
    }
}