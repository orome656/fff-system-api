import { Application } from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import * as fs from "fs";
import { WriteStream } from "fs";
import * as path from "path";
import * as helmet from "helmet";
import * as winston from "winston";

import rateLimiter from "./middlewares/rateLimit";
import { unCoughtErrorHandler } from "./handlers/errorHandler";
import Routes from "./routes";

// app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

export default class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  public config(app: Application): void {
    const accessLogStream: WriteStream = fs.createWriteStream(
      path.join(__dirname, "./logs/access.log"),
      { flags: "a" }
    );
    app.use((req, res, next) => {

      const auth = {
        login: process.env.api_user, password: process.env.api_password
      }

      const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
      const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
      console.log('Received user : ' + login)
      if (login && password && login === auth.login && password === auth.password) {
        return next()
      }

      res.set('WWW-Authenticate', 'Basic realm="401"')
      res.status(401).send('Authentication required.')

      // -----------------------------------------------------------------------

    })

    app.use(morgan("combined", { stream: accessLogStream }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(helmet());
    app.use(rateLimiter()); //  apply to all requests
    app.use(unCoughtErrorHandler);
  }
}

process.on("beforeExit", function (err) {
  winston.error(JSON.stringify(err));
  console.error(err);
});
