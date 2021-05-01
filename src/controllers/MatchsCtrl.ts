import { Router, Request, Response, NextFunction } from 'express';
import MatchsRepo from './../repositories/MatchsRepo';
import { apiErrorHandler } from './../handlers/errorHandler';

export default class MatchsRoutes {
  constructor() {}

  async getAllMatchs(req: Request, res: Response, next: NextFunction) {
    var response = await MatchsRepo.getAllMatchs()
    res.json(response)
  }
  async getAllCompetitions(req: Request, res: Response, next: NextFunction) {
    var response = await MatchsRepo.getAllCompetitions()
    res.json(response)
  }
}
