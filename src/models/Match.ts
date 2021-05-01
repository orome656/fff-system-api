import { Field } from './Field';
import { Team } from './Team';

export class Match {
    public id: number;
    public score_domicile: number;
    public domicile: Team;
    public score_exterieur: number;
    public exterieur: Team;
    public lieu: Field;

}