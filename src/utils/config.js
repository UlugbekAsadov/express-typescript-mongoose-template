"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const bunyan_1 = __importDefault(require("bunyan"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
class Config {
    constructor() {
        this.basePath = "/api/v1";
        this.port = process.env.PORT || "9000";
        this.mongoUri = process.env.MONGO_URI || "";
        this.jwtSecret = process.env.JWT_SECRET || "JWT_SECRET";
    }
    createLogger(name) {
        return bunyan_1.default.createLogger({ name, level: "debug" });
    }
    databaseConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const log = this.createLogger("Database connection");
            try {
                yield mongoose_1.default.connect(this.mongoUri);
                log.info("Successfully connected to database 🎉");
            }
            catch (err) {
                log.error("Database connection failed\n " + err);
            }
        });
    }
    validateConfig() {
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined) {
                throw new Error(`Configuration ${key} is undefined.`);
            }
        }
    }
}
exports.config = new Config();
