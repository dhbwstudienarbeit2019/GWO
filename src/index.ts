import { Config } from "./config.interface";
import { Point, ResultMessage, StartMessage } from "./message.interface";
import { Position } from "./Point";
import { Wolf } from "./wolf";
import { HuntingPrey } from "./HuntingPrey";

export declare function addEventListener(event: string, handler: (any) => void): void;
export declare function postMessage(data: any);

function rateWolves(wolves: Wolf[]): Wolf[] {
    const fitnessValues = [];
    const ratedWolves = [];
    const indices = [];
    
    for(let index = 0; index < config.numberOfWolves; index++) {
        fitnessValues[index] = [];
        fitnessValues[index][0] = wolves[index].calculateFitness();
    }

    let chosenWolf: number;
    for(let indexNew = 0; indexNew < config.numberOfWolves; indexNew++) {
        let rated = Number.POSITIVE_INFINITY;
        for(let rate = 0; rate < config.numberOfWolves; rate++) {
            if (fitnessValues[rate][0] < rated) {
                rated = fitnessValues[rate][0];
                chosenWolf = rate;
            }
        }
        fitnessValues[chosenWolf][0] = Number.POSITIVE_INFINITY;
        indices[indexNew] = chosenWolf;
    }

    let searchedIndex: number;
    for(let index = 0; index < config.numberOfWolves; index++) {
        for(let search = 0; search < config.numberOfWolves; search++) {
            if (indices[search] == index) {
                searchedIndex = search;
                break;
            }
        }
        ratedWolves[index] = wolves[searchedIndex];
    }

    return ratedWolves;
}

function runCode(): Point[] {
    console.log('runcode');

    let wolves: Wolf[] = [];
    let wolfAlpha: Wolf;
    let wolfBeta: Wolf;
    let wolfDelta: Wolf;
    let seekOrHuntCoefficient: number;
    let results: Position[] = [];
    let bestPosition: Position;
    let lastResult: Position;
    const minimumEpsilon = 1e-5;

    for (let i = 0; i < config.numberOfWolves; i++) {
        wolves[i] = new Wolf(
            Position.doRandomPosition(
                searchDomain.min.x,
                searchDomain.max.x,
                searchDomain.min.y,
                searchDomain.max.y),
            functionToOptimize);
    }

    wolves = rateWolves(wolves);
    bestPosition = wolves[0].Position;

    wolfAlpha = wolves[0];
    wolfBeta = wolves[1];
    wolfDelta = wolves[2];

    let iterationCounter = 0;

    while (iterationCounter < config.maximumNumberOfIterations) {
        
        seekOrHuntCoefficient = 2.0 - iterationCounter*(2.0/config.maximumNumberOfIterations);

        if (bestPosition !== undefined &&
            (lastResult === undefined ||
                !lastResult.compareToPoint(bestPosition, minimumEpsilon))) {
            lastResult = bestPosition;
            results.push(lastResult);
        }
        else {
            console.log([
                lastResult, bestPosition,
                lastResult && bestPosition && lastResult.subtract(bestPosition.x, bestPosition.y),
                lastResult && bestPosition && !lastResult.compareToPoint(bestPosition, minimumEpsilon)]
            );
        }

        const huntingPrey = new HuntingPrey(wolfAlpha, wolfBeta, wolfDelta, seekOrHuntCoefficient, searchDomain);
        
        wolves.forEach(wolf => huntingPrey.hunt(wolf));

        wolves = rateWolves(wolves);
        bestPosition = wolves[0].Position;

        wolfAlpha = wolves[0];
        wolfBeta = wolves[1];
        wolfDelta = wolves[2];

        iterationCounter++;
    }

    return results;
}

addEventListener('message', (message: { data: any }) => {
    try {
        const data = <StartMessage>message.data;
        config = data.config;
        functionToOptimize = new Function('return ' + data.func.toString())();
        searchDomain = data.searchArea;
        if (data.action === 'abort') {
            isRunning = false;
        }
        postMessage(<ResultMessage>{
            info: '',
            status: "finished",
            result: runCode()
        });
    }
    catch (e) {
        postMessage(<ResultMessage>{ info: e.toString(), result: undefined, status: "error" });
    }
});

let isRunning = false;

let config: Config;
let functionToOptimize: (x: number, y: number) => number;
let searchDomain: { min: Point, max: Point };