import { Admin } from "../../database/entities";

export class AdminService{
    private adminRepository = Admin;

    async findAdminById(id){
        const findAdmin = await this.adminRepository.findOne({id: id});
        return findAdmin;
    }

    async findAdminByLogin(login){
        const findAdmin = await this.adminRepository.findOne({login: login});
        return findAdmin;
    }

    async createNewAdmin(admin){
        const adminCreated = await this.adminRepository.save(admin);
        return adminCreated;
    }

    async deactivateAdmin(admin){
        admin.active = false;
        await this.adminRepository.save(admin);
    }

    async activateAdmin(admin){
        admin.active = true;
        await this.adminRepository.save(admin);
    }

    async findAdmins(){
        const allAdmins = await this.adminRepository.find({
            select:['id', 'login', 'active']
        })
        return allAdmins;
    }
}