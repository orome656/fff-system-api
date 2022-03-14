import { Application } from 'express';
import MatchsCtrl from './controllers/MatchsCtrl';
import * as cors from "cors";

export default class Routes {
  matchsCtrl = new MatchsCtrl();

  constructor(app: Application) {
    app.use(cors())
    app.options('*', cors())
    app.route('/api/matchs/').get(this.matchsCtrl.getAllMatchs.bind(this.matchsCtrl));
    app.route('/api/competitions/').get(this.matchsCtrl.getAllCompetitions.bind(this.matchsCtrl));
    app.route('/api/teams/').get(this.matchsCtrl.getAllTeams.bind(this.matchsCtrl));
  }
}