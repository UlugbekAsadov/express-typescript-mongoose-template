import Logger from "bunyan";
import cors from "cors";
import { Application, json, NextFunction, Request, Response, urlencoded } from "express";
import HTTPS_STATUS from "http-status-codes";

import { userRoutes } from "./routes";
import { config } from "./utils/config";
import { CustomError } from "./utils/error-handler";
import { IErrorResponse } from "./utils/interfaces/error.interface";

const log: Logger = config.createLogger("server");

export class Server {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }
  public start() {
    this.securityMiddlewares(this.app);
    this.standardMiddleware(this.app);
    this.routedMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddlewares(app: Application): void {
    const allowedOrigins = ["http://localhost:3000"];

    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
      }),
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(
      json({
        limit: "50mb",
      }),
    );
    app.use(
      urlencoded({
        extended: false,
        limit: "50mb",
      }),
    );
  }

  private routedMiddleware(app: Application): void {
    userRoutes(app);
  }

  private globalErrorHandler(app: Application): void {
    app.all("*", (req: Request, res: Response) => {
      res.status(HTTPS_STATUS.NOT_FOUND).json({
        message: `${req.originalUrl} not found`,
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app.use((error: IErrorResponse, _req: Request, res: any, next: NextFunction) => {
      log.error(error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }

      next();
    });
  }

  private startServer(app: Application): void {
    try {
      app.listen(config.port, () => {
        log.info(`Server is running on port ${config.port}`);
      });
    } catch (error) {
      log.error(error);
    }
  }
}
