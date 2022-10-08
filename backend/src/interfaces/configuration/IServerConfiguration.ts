import { IDatabaseConfiguration } from "./database/IDatabaseConfiguration";
import { IJwt } from "./plugins/Jwt/IJwt";

export interface IServerConfiguration{
    server: {
        port: number | undefined;
        baseURL: string | undefined;
    }

    database: IDatabaseConfiguration;

    jwt: IJwt;
}