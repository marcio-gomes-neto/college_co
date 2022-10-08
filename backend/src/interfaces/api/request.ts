export interface CreateAdminRequest extends Request {
    payload: {
        login: string;
        password: string;
    }
}

export interface LoginAdmin extends Request {
    payload: {
        login: string;
        password: string;
    }
}

export interface GetAllAdmins extends Request {
    authId?: {
        adminId: string;
    }
}

export interface DeactivateAdmin extends Request {
    authId?: {
        adminId: string;
    }

    payload: {
        login: string;
    }
}

export interface ReactivateAdmin extends Request {
    authId?: {
        adminId: string;
    }

    payload: {
        login: string;
    }
}

export interface CreateStudentRequest extends Request {
    authId?: {
        adminId: string;
    }

    payload: {
        cpf: string;
        name: string;
        email: string;
        gender: string;
        phone: string;
    }
} 

export interface GetAllStudents extends Request {
    authId?: {
        adminId: string;
    }
} 

export interface GetStudentByCpf extends Request {
    authId?: {
        adminId: string;
    }

    params: {
        cpf: string;
    }
} 

export interface GetGenderPercent extends Request {
    authId?: {
        adminId: string;
    }
}

export interface DeactivateStudent extends Request {
    authId?: {
        adminId: string;
    }

    payload: {
        cpf: string;
    }
}

export interface ReactivateStudent extends Request {
    authId?: {
        adminId: string;
    }

    payload: {
        cpf: string;
    }
}

export interface UpdateStudent extends Request {
    authId?: {
        adminId: string;
    }

    payload: {
        cpf: string;
        name?: string;
        email?: string;
        gender?: string;
        phone?: string;
    }
}