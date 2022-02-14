import { response } from 'express';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
import MatchConverter from '../converters/MatchConverter';
import { Match } from '../models/Match';
import { writeFileSync } from 'fs'
import Client from '../clients/Client';
import HttpResponse from '../models/HttpResponse';

const TEAM_ID = '177005'
const SENIOR_CATEGORY = "SEM"

class MatchRepo {

  private apiClient: Client

  constructor(apiClient: Client) {
    this.apiClient = apiClient
  }

  async getAllMatchs(): Promise<Array<Match>> {
    var response = await this.apiClient.get(`/clubs/${TEAM_ID}/teams`, null)
    var teams = response.body
    teams = teams.filter(item => item.category_code == SENIOR_CATEGORY)

    var requestsList: Array<HttpResponse> = teams.map(element => this.apiClient.get(`/clubs/${TEAM_ID}/teams/${element.code}/matches/results`, null));
    var requestsListCalendar: Array<HttpResponse> = teams.map(element => this.apiClient.get(`/clubs/${TEAM_ID}/teams/${element.code}/matches/calendar`, null));

    var responses: Array<HttpResponse> = (await Promise.all([...requestsList, ...requestsListCalendar])).filter(items => items.statusCode == 200 && items.body != "").map(item => item.body)
    var converted = Array.prototype.concat.apply([], responses).map(item => MatchConverter.convert(item))

    return converted;
  }
  async getAllCompetitions(): Promise<Array<Object>> {
    var teams = await this.apiClient.get(`/competitions`, {
      "clubId": TEAM_ID,
      "season": "2021",
      "teamNumber": "1"
    });

    return teams.body;
  }
}

export default MatchRepo;
