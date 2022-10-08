import Boom from 'boom';

import * as Phone from 'phone';
import * as Hapi from 'hapi';
import * as documentValidator from 'cpf-cnpj-validator';

import { IServerConfiguration } from '../../../interfaces/configuration/IServerConfiguration';
import { IStudent } from '../../../interfaces/database/entities/IStudent';

import { StudentService } from '../../services/StudentService';
import { AdminService } from '../../services/AdminService';

import { CreateStudentRequest, DeactivateStudent, GetAllStudents, GetGenderPercent, GetStudentByCpf, ReactivateStudent, UpdateStudent } from "../../../interfaces/api/request";

export class StudentController {
    private studentService = new StudentService();
    private adminService = new AdminService();
    constructor(private config:IServerConfiguration){}

    async createNewStudent(request: CreateStudentRequest, h: Hapi.ResponseToolkit){
        const { adminId } = request.authId
        const { cpf, name, email, gender, phone } = request.payload;
        const studentPayload:IStudent = {
            cpf,
            name,
            email,
            gender,
            phone
        };

        if(!documentValidator.cpf.isValid(cpf)) return Boom.badRequest('Invalid CPF.');
        if(!Phone.phone(phone).isValid) return Boom.badRequest('Invalid Phone.');

        try {
            const findAdmin = await this.adminService.findAdminById(adminId);
            if(!findAdmin) return Boom.unauthorized('Admin level necessary.');
            if(!findAdmin.active) return Boom.unauthorized('Admin inactive.');

            const checkIfStudentExists = await this.studentService.findStudentByCpf(cpf);
            if(checkIfStudentExists) return Boom.badRequest('This User Already Exists.')

            const studentCreated = await this.studentService.createNewUser(studentPayload);
            const response = {
                success: true,
                cpf: studentCreated.cpf,
                name: studentCreated.name,
                email: studentCreated.email
            }

            return h.response(response).code(201);
        } catch (error) {
            console.log(error);
            return Boom.internal('Unexpected Error');   
        }
    }

    async getAllStudents(request: GetAllStudents, h: Hapi.ResponseToolkit){
        const { adminId } = request.authId
        try {
            const findAdmin = await this.adminService.findAdminById(adminId);
            if(!findAdmin) return Boom.unauthorized('Admin level necessary.');
            if(!findAdmin.active) return Boom.unauthorized('Admin inactive.');

            const findStudents = await this.studentService.findAllStudents();
            if(!findStudents) return Boom.notFound('No students found.');

            const responseStudents = [];
            findStudents.forEach(element => {
                element.cpf = documentValidator.cpf.format(element.cpf);
                element.phone = `${element.phone.slice(0, 3)}(${element.phone.slice(3, 5)}) ${element.phone.slice(5,6)} ${ element.phone.slice(6)}`
                element.gender = element.gender.charAt(0).toUpperCase() + element.gender.slice(1)
                responseStudents.push(element)
            });
            const response = {
                success: true,
                students: responseStudents
            }
            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.internal('Unexpected Error');   
        }
    }

    async getGendersPercent(request: GetGenderPercent, h: Hapi.ResponseToolkit){
        const { adminId } = request.authId;
        const genders = {
            masculine: 0,
            feminine: 0,
            other: 0
        }

        try {
            const findAdmin = await this.adminService.findAdminById(adminId);
            if(!findAdmin) return Boom.unauthorized('Admin level necessary.');
            if(!findAdmin.active) return Boom.unauthorized('Admin inactive.');

            const findStudents = await this.studentService.findAllStudents()
            if(!findStudents) return Boom.notFound('No students found.');

            findStudents.forEach(element => {
                genders[element.gender] += 1
            });

            const response = {
                success: true,
                percent: genders
            }
            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.internal('Unexpected Error');   
        }
    }

    async deactivateStudent(request: DeactivateStudent, h: Hapi.ResponseToolkit){
        const { adminId } = request.authId;
        const { cpf } = request.payload;

        try {
            const findAdmin = await this.adminService.findAdminById(adminId);
            if(!findAdmin) return Boom.unauthorized('Admin level necessary.');
            if(!findAdmin.active) return Boom.unauthorized('Admin inactive.');
            
            const deactivateStudent = await this.studentService.findStudentByCpf(cpf);
            if(!deactivateStudent) return Boom.notFound('Student not found.');
            if(!deactivateStudent.active) return h.response({success: true, message:'No Changes.'}).code(202);

            await this.studentService.deactivateStudent(deactivateStudent);

            const response = {
                success: true,
                cpf,
                name: deactivateStudent.name,
                active: false
            }

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.internal('Unexpected Error');   
        }
    }

    async reactivateStudent(request: ReactivateStudent, h: Hapi.ResponseToolkit){
        const { adminId } = request.authId;
        const { cpf } = request.payload;

        try {
            const findAdmin = await this.adminService.findAdminById(adminId);
            if(!findAdmin) return Boom.unauthorized('Admin level necessary.');
            if(!findAdmin.active) return Boom.unauthorized('Admin inactive.');

            const reactivateStudent = await this.studentService.findStudentByCpf(cpf);
            if(!reactivateStudent) return Boom.notFound('Student not found.');
            if(reactivateStudent.active) return h.response({success: true, message:'No Changes.'}).code(202);

            await this.studentService.activateStudent(reactivateStudent);
            
            const response = {
                success: true,
                cpf,
                name: reactivateStudent.name,
                active: true
            }

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.internal('Unexpected Error');   
        }
    }

    async getStudentByCpf(request: GetStudentByCpf, h: Hapi.ResponseToolkit){
        const { adminId } = request.authId;
        const { cpf } = request.params;

        try {
            const findAdmin = await this.adminService.findAdminById(adminId);
            if(!findAdmin) return Boom.unauthorized('Admin level necessary.');
            if(!findAdmin.active) return Boom.unauthorized('Admin inactive.');

            const findStudent = await this.studentService.findStudentByCpf(cpf);
            if(!findStudent) return Boom.notFound('Student not found.');
            
            const response = {
                success: true,
                student: findStudent,
            }

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.internal('Unexpected Error');   
        }
    }

    async updateStudent(request: UpdateStudent, h: Hapi.ResponseToolkit){
        const { adminId } = request.authId;
        const { cpf, name, email, gender, phone } = request.payload;

        if(Object.keys(request.payload).length <= 1) return h.response({success: true, message:'No Changes.'}).code(202); 
        try {
            const findAdmin = await this.adminService.findAdminById(adminId);
            if(!findAdmin) return Boom.unauthorized('Admin level necessary.');
            if(!findAdmin.active) return Boom.unauthorized('Admin inactive.');

            const updateStudent = await this.studentService.findStudentByCpf(cpf);
            if(!updateStudent) return Boom.notFound('Student not found.');

            name ? updateStudent.name = name : undefined;
            email ? updateStudent.email = email : undefined;
            gender ? updateStudent.gender = gender : undefined;
            if(phone) {
                if(!Phone.phone(phone).isValid) return Boom.badRequest('Invalid Phone.');
                updateStudent.phone = phone
            }

            await this.studentService.saveStudentData(updateStudent);
            const response = {
                success: true,
                updateStudent,
            }

            return h.response(response).code(200);
        } catch (error) {
            console.log(error);
            return Boom.internal('Unexpected Error'); 
        }
    }
}