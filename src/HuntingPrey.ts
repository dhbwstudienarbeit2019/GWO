import { IHuntingPrey } from "./IHuntingPrey.interface";
import { Point } from "./message.interface";
import { Position } from "./Point";
import { Wolf } from "./wolf";
import * as MersenneTwister from 'mersenne-twister';

export class HuntingPrey implements IHuntingPrey {


    constructor(private readonly wolfAlpha, wolfBeta, wolfDelta: Wolf, 
                private readonly a: number, 
                private readonly searchDomain: { min: Point, max: Point }) { 
    }

    hunt(wolf: Wolf): void {



    }
}