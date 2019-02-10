import {Wolf} from './wolf';

export interface IHuntingPrey {
    hunt: (wolf: Wolf) => void;
}