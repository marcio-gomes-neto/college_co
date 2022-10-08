import { IServerConfiguration } from './interfaces/configuration/IServerConfiguration';
import { Request, Server } from 'hapi';

import * as Student from './api/controllers/student';
import * as Admin from './api/controllers/admin';

import { SwaggerPlugin } from './configuration/plugins/swagger/swagger-plugins';
import { registerPlugins } from './configuration/plugins/plugins-register';
import { JwtPlugin } from './configuration/plugins/jwt/jwt-plugins';

export class StudentsServer {
    constructor (private configs: IServerConfiguration) {}

    private registerRoutes(server: Server, config: IServerConfiguration){
        Student.startRoute(server, config);
        Admin.startRoute(server, config);
        console.log('Routes registered.');
    }

    private async registerPlugins(server: Server){
        const jwtPlugin = new JwtPlugin(server, {
            privateKey: this.configs.jwt.privateKey,
            publicKey: this.configs.jwt.publicKey,
            expiration: this.configs.jwt.expiration,
            algorithm: this.configs.jwt.algorithm,
        });

        const swaggerPluggins = new SwaggerPlugin(server, {
            name: 'College',
            version: '1.0.0',
            desc: 'College System'

        });

        await registerPlugins([jwtPlugin, swaggerPluggins]);
        console.log('Plugins registered.');
    }

    private registerExtensions(server: Server){
        server.events.on('request', (request: Request) => {
          const remoteAddress = request.info.remoteAddress;
          const method = request.method.toUpperCase();
          const path = request.path;
          
          console.log(`${remoteAddress} // ${method} ${path}`);
        });
    }

    async init(): Promise<Server> {
        const server = new Server({
            debug: { request: ['error'] },
            port: this.configs.server.port,
            routes: {
                cors: {
                    origin: ['*'],
                },
                validate: {
                    failAction: async (request, h , err) => {
                        if (err){
                            if(err['isJoi']) throw err;
                        }
                    }
                }
            }
        });

        server.realm.modifiers.route.prefix = '/api';

        await this.registerPlugins(server);
        this.registerRoutes(server, this.configs);
        this.registerExtensions(server);

        return server;
    }
}