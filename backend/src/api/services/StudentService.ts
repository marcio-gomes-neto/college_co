import { Students } from "../../database/entities";

export class StudentService{
    private studentRepository = Students;
    
    async saveStudentData(student){
        await this.studentRepository.save(student);
    }
    
    async findAllStudents() {
        const findStudents = await this.studentRepository.find({
            select: ['cpf', 'name', 'email', 'phone', 'gender', 'active']
        });
        return findStudents;
    }

    async createNewUser(student) {
        const studentCreated = await this.studentRepository.save(student);
        return studentCreated;
    }
    
    async findStudentByCpf(cpf: string){
        const findStudent = await this.studentRepository.findOne({cpf: cpf})
        return findStudent;
    }

    async deactivateStudent(student){
        student.active = false;
        await this.studentRepository.save(student);
    }

    async activateStudent(student){
        student.active = true;
        await this.studentRepository.save(student);
    }
}