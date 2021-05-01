import { response } from 'express';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
import MatchConverter from '../converters/MatchConverter';
import { Match } from '../models/Match';
import FFFBaseRepo from './FFFBaseRepo';
import { writeFileSync } from 'fs'

const TEAM_ID = '177005'
const SENIOR_CATEGORY = "SEM"

class MatchRepo extends FFFBaseRepo {
  constructor() {
    super()
  }

  async getAllMatchs(): Promise<Array<Match>> {
    var token = await this.getToken()
    var teams = await this.callApi('GET', `/clubs/${TEAM_ID}/teams`)
    teams = teams.filter(item => item.category_code == SENIOR_CATEGORY)

    var requestsList = teams.map(element => this.callApi('GET', `/clubs/${TEAM_ID}/teams/${element.code}/matches/results`));
    var requestsListCalendar = teams.map(element => this.callApi('GET', `/clubs/${TEAM_ID}/teams/${element.code}/matches/calendar`));

    var responses: Array<Array<any>> = (await Promise.all([...requestsList, ...requestsListCalendar])).filter(items => items != "")
    writeFileSync('temp_response_fff.json', JSON.stringify(responses))
    var converted = Array.prototype.concat.apply([], responses).map(item => MatchConverter.convert(item))

    return converted;
  }
  async getAllCompetitions(): Promise<Array<Object>> {
    var token = await this.getToken()
    var teams = await this.callApi('GET', `/competitions`, {
      "clubId": TEAM_ID,
      "season": "2020",
      "teamNumber": "1"
    });

    return teams;
  }
}

export default new MatchRepo();
