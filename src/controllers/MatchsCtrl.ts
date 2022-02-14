import { Router, Request, Response, NextFunction } from 'express';
import MatchsRepo from './../repositories/MatchsRepo';
import { apiErrorHandler } from './../handlers/errorHandler';
import FFFClient from '../clients/FFFClient';

export default class MatchsCtrl {
  matchRepo: MatchsRepo
  constructor() {
    this.matchRepo = new MatchsRepo(new FFFClient(
      'https://apidofa.fff.fr/api',
      {
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
        token_password: process.env.token_password,
        username: process.env.username,
        password: process.env.password,
        tokenUrl: 'https://apidofa.fff.fr/oauth/v2/token'
      }
    ))
  }

  async getAllMatchs(req: Request, res: Response, next: NextFunction) {
    var response = await this.matchRepo.getAllMatchs()
    res.json(response)
  }
  async getAllCompetitions(req: Request, res: Response, next: NextFunction) {
    var response = await this.matchRepo.getAllCompetitions()
    res.json(response)
  }
}
