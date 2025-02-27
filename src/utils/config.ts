import Logger from "bunyan";
import bunyan from "bunyan";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

class Config {
  public basePath: string;
  public port: string;
  public mongoUri: string;
  public jwtSecret: string;

  constructor() {
    this.basePath = "/api/v1";
    this.port = process.env.PORT || "9000";
    this.mongoUri = process.env.MONGO_URI || "";
    this.jwtSecret = process.env.JWT_SECRET || "JWT_SECRET";
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: "debug" });
  }

  public async databaseConnection() {
    const log: Logger = this.createLogger("Database connection");

    try {
      await mongoose.connect(this.mongoUri);
      log.info("Successfully connected to database 🎉");
    } catch (err) {
      log.error("Database connection failed\n " + err);
    }
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined.`);
      }
    }
  }
}

export const config = new Config();
