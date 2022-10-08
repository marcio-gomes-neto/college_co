import * as dotenv from 'dotenv' 
import { IServerConfiguration } from "../interfaces/configuration/IServerConfiguration";
import { DatabaseConfiguration } from "./database/configuration";
dotenv.config();

export class ServerConfiguration implements IServerConfiguration {
    server = {
        port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
        baseURL: process.env.API_URL
    };

    database = new DatabaseConfiguration();

    jwt = {
        privateKey: process.env.JWT_PRIVATE_KEY,
        publicKey: process.env.JWT_PUBLIC_KEY,
        algorithm: process.env.JWT_ALGORITHM,
        expiration: process.env.JWT_EXPIRATION
    };
}