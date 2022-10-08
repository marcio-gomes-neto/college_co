import Boom from 'boom';

import * as Hapi from 'hapi';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken';

import { IServerConfiguration } from '../../../interfaces/configuration/IServerConfiguration';
import { IAdmin } from '../../../interfaces/database/entities/IAdmin';
import { AdminService } from '../../services/AdminService';

import { CreateAdminRequest, DeactivateAdmin, GetAllAdmins, LoginAdmin, ReactivateAdmin } from "../../../interfaces/api/request";

export class AdminController {
    private adminService = new AdminService();
    constructor(private config:IServerConfiguration){}

    private async validateAdminPassword(payloadPswrd: string, adminPswrd: string){
        return await bcrypt.compare(payloadPswrd, adminPswrd);
    }

    private generateJwtToken(admin: IAdmin){
        const signInRequest = {id: admin.id};
        const token = jwt.sign(signInRequest, 
            this.config.jwt.privateKey, {
            expiresIn: this.config.jwt.expiration,
            algorithm: this.config.jwt.algorithm
        });
        return token;
    }

    async createNewAdmin(request: CreateAdminRequest, h: Hapi.ResponseToolkit){
        const { login, password } = request.payload;
        const salt = await bcrypt.genSalt(10);
        const adminPayload: IAdmin = {
            login,
            password: await bcrypt.hash(password, salt),
        };
        
        try {
            const checkIfAdminExists = await this.adminService.findAdminByLogin(login);
            if(checkIfAdminExists) return Boom.badRequest('This Username already in use.')

            const adminCreated = await this.adminService.createNewAdmin(adminPayload);
            const response = {
                success: true,
                id: adminCreated.id,
                login: adminCreated.login,
            }

            return h.response(response).code(201);
        } catch (error) {
            console.log(error);
            return Boom.internal('Unexpected Error');   
        }
    }

    async loginAdmin(request: LoginAdmin, h: Hapi.ResponseToolkit){
        const { login, password } = request.payload;
        
        try {
            const findAdmin = await this.adminService.findAdminByLogin(login);
            if(!findAdmin) return Boom.notFound('Admin not found.');
            if(!findAdmin.active) Boom.badRequest('Admin is inactive.');
            
            const checkPassword = await this.validateAdminPassword(password, findAdmin.password);
            if(!checkPassword){
                return Boom.unauthorized(`Invalid password.`);
            }

            const token = await this.generateJwtToken(findAdmin);
            const response = {
                success: true,
                login,
                token
            }
            
            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.internal('Unexpected Error');   
        }
    }

    async getAllAdmins(request: GetAllAdmins, h: Hapi.ResponseToolkit){
        const { adminId } = request.authId;
        try {
            const findAdmin = await this.adminService.findAdminById(adminId);
            if(!findAdmin) return Boom.unauthorized('Admin level necessary.');
            if(!findAdmin.active) return Boom.unauthorized('Admin inactive.');

            const findAllAdmins = await this.adminService.findAdmins();
            if(!findAllAdmins) return Boom.notFound('No Admins Found.');

            const response = {
                success: true,
                admins: findAllAdmins
            }
            
            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.internal('Unexpected Error');   
        }
    }

    async deactivateAdmin(request: DeactivateAdmin, h: Hapi.ResponseToolkit){
        const { adminId } = request.authId;
        const { login } = request.payload;

        try {
            const findAdmin = await this.adminService.findAdminById(adminId);
            if(!findAdmin) return Boom.unauthorized('Admin level necessary.');
            if(!findAdmin.active) return Boom.unauthorized('Admin inactive.');
            
            const deactivateAdmin = await this.adminService.findAdminByLogin(login);
            if(!deactivateAdmin) return Boom.notFound('Admin not found.');
            if(!deactivateAdmin.active) return h.response({success: true, message:'No Changes.'}).code(202);

            await this.adminService.deactivateAdmin(deactivateAdmin);

            const response = {
                success: true,
                login,
                active: false
            }

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.internal('Unexpected Error');   
        }
    }

    async reactivateAdmin(request: ReactivateAdmin, h: Hapi.ResponseToolkit){
        const { adminId } = request.authId;
        const { login } = request.payload;

        try {
            const findAdmin = await this.adminService.findAdminById(adminId);
            if(!findAdmin) return Boom.unauthorized('Admin level necessary.');
            if(!findAdmin.active) return Boom.unauthorized('Admin inactive.');

            const reactivateAdmin = await this.adminService.findAdminByLogin(login);
            if(!reactivateAdmin) return Boom.notFound('Admin not found.');
            if(reactivateAdmin.active) return h.response({success: true, message:'No Changes.'}).code(202);

            await this.adminService.activateAdmin(reactivateAdmin);
            
            const response = {
                success: true,
                login,
                active: true
            }

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.internal('Unexpected Error');   
        }
    }

    
}