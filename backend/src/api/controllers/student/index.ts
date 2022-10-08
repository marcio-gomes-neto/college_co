// import * as Joi from 'joi;'
import * as Hapi from 'hapi';
import * as StudentValidator from './student-validator';

import { StudentController } from './student-controller';

import { IServerConfiguration } from '../../../interfaces/configuration/IServerConfiguration';

const routePrefix = '/students';

export function startRoute (server: Hapi.Server, configs: IServerConfiguration) {
    const studentController = new StudentController(configs);
    server.bind(studentController);

    server.route({
        method: "POST",
        path: `${routePrefix}/create`,
        options:{
            handler: studentController.createNewStudent,
            auth: 'jwt',
            tags: ['api', 'student'],
            description: 'Route to create a regular student',
            validate: {
                headers: StudentValidator.jwtValidator,
                payload: StudentValidator.createStudentValidator
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
        method: "GET",
        path: `${routePrefix}/get-all`,
        options:{
            handler: studentController.getAllStudents,
            auth: 'jwt',
            tags: ['api', 'student'],
            description: 'Route to create get all students',
            validate: {
                headers: StudentValidator.jwtValidator,
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
                            description: 'No students found.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "GET",
        path: `${routePrefix}/get-by-cpf/{cpf}`,
        options:{
            handler: studentController.getStudentByCpf,
            auth: 'jwt',
            tags: ['api', 'student'],
            description: 'Route to create get students by cpf',
            validate: {
                headers: StudentValidator.jwtValidator,
                params: StudentValidator.findStudentByCpf
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
                            description: 'Student not found.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "GET",
        path: `${routePrefix}/get-genders-percent`,
        options:{
            handler: studentController.getGendersPercent,
            auth: 'jwt',
            tags: ['api', 'student'],
            description: 'Route to create get students genders percents',
            validate: {
                headers: StudentValidator.jwtValidator,
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
                            description: 'No students found.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "PATCH",
        path: `${routePrefix}/deactivate`,
        options:{
            handler: studentController.deactivateStudent,
            auth: 'jwt',
            tags: ['api', 'student'],
            description: 'Route to deactivate an student',
            validate: {
                headers: StudentValidator.jwtValidator,
                payload: StudentValidator.deactivateStudent
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Success.'
                        },
                        '202': {
                            description: 'No Changes, student already inactive.'
                        },
                        '401': {
                            description: 'Unauthorized.'
                        },
                        '404': {
                            description: 'Student not found.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "PATCH",
        path: `${routePrefix}/reactivate`,
        options:{
            handler: studentController.reactivateStudent,
            auth: 'jwt',
            tags: ['api', 'student'],
            description: 'Route to reactivate an student',
            validate: {
                headers: StudentValidator.jwtValidator,
                payload: StudentValidator.reactivateStudent
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Success.'
                        },
                        '202': {
                            description: 'No Changes, student already active.'
                        },
                        '401': {
                            description: 'Unauthorized.'
                        },
                        '404': {
                            description: 'Student not found.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: "PATCH",
        path: `${routePrefix}/update`,
        options:{
            handler: studentController.updateStudent,
            auth: 'jwt',
            tags: ['api', 'student'],
            description: 'Route to update an student',
            validate: {
                headers: StudentValidator.jwtValidator,
                payload: StudentValidator.updateStudent
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            description: 'Success.'
                        },
                        '202': {
                            description: 'No Changes, student already active.'
                        },
                        '401': {
                            description: 'Unauthorized.'
                        },
                        '404': {
                            description: 'Student not found.'
                        }
                    }
                }
            }
        }
    });
}