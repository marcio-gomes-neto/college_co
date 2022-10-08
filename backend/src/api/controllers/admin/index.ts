// import * as Joi from 'joi;'
import * as Hapi from 'hapi';
import * as AdminValidator from './admin-validator';

import { AdminController } from './admin-controller';

import { IServerConfiguration } from '../../../interfaces/configuration/IServerConfiguration';

const routePrefix = '/admin';

export function startRoute (server: Hapi.Server, configs: IServerConfiguration) {
    const adminController = new AdminController(configs);
    server.bind(adminController);

    server.route({
        method: "POST",
        path: `${routePrefix}/create`,
        options:{
            handler: adminController.createNewAdmin,
            auth: false,
            tags: ['api', 'admin'],
            description: 'Route to create an admin',
            validate: {
                payload: AdminValidator.createAdminValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            description: 'Success.'
                        },
                        '400': {
                            description: 'Invalid Data.'
                        },
                        '401': {
                            description: 'Unauthorized.'
                        },
                    }
                }
            }
        }
    });

    server.route({
        method: "POST",
        path: `${routePrefix}/login`,
        options:{
            handler: adminController.loginAdmin,
            auth: false,
            tags: ['api', 'admin'],
            description: 'Route to login in admin account',
            validate: {
                payload: AdminValidator.loginAdmin
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Success.'
                        },
                        '400': {
                            description: 'Admin inactive.'
                        },
                        '401': {
                            description: 'Unauthorized.'
                        },
                        '404': {
                            description: 'Admin not found.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "GET",
        path: `${routePrefix}/get-admins`,
        options:{
            handler: adminController.getAllAdmins,
            auth: 'jwt',
            tags: ['api', 'admin'],
            description: 'Route to get all admins',
            validate: {
                headers: AdminValidator.jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Success.'
                        },
                        '401': {
                            description: 'Unauthorized.'
                        },
                        '404': {
                            description: 'Admins not found.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "PATCH",
        path: `${routePrefix}/deactivate-admin`,
        options:{
            handler: adminController.deactivateAdmin,
            auth: 'jwt',
            tags: ['api', 'admin'],
            description: 'Route to deactivate an admin',
            validate: {
                headers: AdminValidator.jwtValidator,
                payload: AdminValidator.deactivateAdmin
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Success.'
                        },
                        '202': {
                            description: 'No Changes, admin already inactive.'
                        },
                        '401': {
                            description: 'Unauthorized.'
                        },
                        '404': {
                            description: 'Admin not found.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "PATCH",
        path: `${routePrefix}/reactivate-admin`,
        options:{
            handler: adminController.reactivateAdmin,
            auth: 'jwt',
            tags: ['api', 'admin'],
            description: 'Route to reactivate an admin',
            validate: {
                headers: AdminValidator.jwtValidator,
                payload: AdminValidator.reactivateAdmin
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Success.'
                        },
                        '202': {
                            description: 'No Changes, admin already active.'
                        },
                        '401': {
                            description: 'Unauthorized.'
                        },
                        '404': {
                            description: 'Admin not found.'
                        }
                    }
                }
            }
        }
    });
}