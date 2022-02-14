import { Match } from "../models/Match";
import FieldConverter from "./FieldConverter";
import IConverter from "./IConverter";
import TeamConverter from './TeamConverter';

class MatchConverter implements IConverter<Match> {
    convert(object: any): Match {
        object = this.fixUpFullScoreAndResult(object)
        var match = {
            id: object.id,
            score_domicile: object.home_score,
            domicile: TeamConverter.convert(object.home),
            score_exterieur: object.away_score,
            exterieur: TeamConverter.convert(object.away),
            lieu: FieldConverter.convert(object.field),
            commentaire: this.computeComment(object),
            reporte: this.computeDelayed(object)
        }


        return match
    }

    private computeComment(match) {
        var comment = "";
        if (match.home_is_forfeit && match.away_is_forfeit)
            comment += "Forfait général de " + match.home.short_name + " et de " + match.away.short_name;
        else if (match.home_is_forfeit)
            comment += "Forfait général de " + match.home.short_name;
        else if (match.away_is_forfeit)
            comment += "Forfait général de " + match.away.short_name;
        else if (match.home_result == "FM" && match.away_result == "FM")
            comment += "Forfait de " + match.home.short_name + " et de " + match.away.short_name;
        else if (match.home_result == "FM")
            comment += "Forfait de " + match.home.short_name;
        else if (match.away_result == "FM")
            comment += "Forfait de " + match.away.short_name;

        if (!match.date && match.initial_date) {
            if (comment)
                comment += " . Le match a été reporté.";
            else
                comment += "Le match a été reporté.";
        }
        return comment;
    }

    private computeDelayed(match) {
        return !match.date && match.initial_date
    }
    private fixUpFullScoreAndResult(data) {
        // TODO to improve
        data.home_final_score = data.home_score;
        if (data.home_penalty_score != null)
            data.home_final_score = data.home_penalty_score;

        data.away_final_score = data.away_score;
        if (data.away_penalty_score != null)
            data.away_final_score = data.away_penalty_score;

        data.home_has_win = false;
        data.away_has_win = false;
        if (data.home_final_score > data.away_final_score)
            data.home_has_win = true;
        else if (data.home_final_score < data.away_final_score)
            data.away_has_win = true;
        return data;
    }

}

export default new MatchConverter()