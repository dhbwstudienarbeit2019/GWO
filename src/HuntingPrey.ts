import { IHuntingPrey } from "./IHuntingPrey.interface";
import { Position } from "./Point";
import { Wolf } from "./wolf";
import * as MersenneTwister from 'mersenne-twister';

export class HuntingPrey implements IHuntingPrey {
    private wolfAlpha: Wolf;
    private wolfBeta: Wolf;
    private wolfDelta: Wolf;
    private a: number;

    constructor(wolfAlpha, wolfBeta, wolfDelta: Wolf, a: number) {
        this.wolfAlpha = wolfAlpha;
        this.wolfBeta = wolfBeta;
        this.wolfDelta = wolfDelta;
        this.a = a;
    }

    hunt(wolf: Wolf): void {

        

    }
}