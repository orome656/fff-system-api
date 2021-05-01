import { Team } from "../models/Team";
import IConverter from "./IConverter";

class TeamConverter implements IConverter<Team> {
    convert(object: any): Team {
        return {
            nom: object.short_name_district,
            id_club: object.club_id,
            numero: object.number,
            code: object.code,
            logo_url: object.logo
        }
    }

}

export default new TeamConverter()