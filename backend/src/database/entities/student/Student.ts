import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IStudent } from "../../../interfaces/database/entities/IStudent";
@Entity()
export class Students extends BaseEntity implements IStudent{
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    id?: string;

    @Column('varchar', {nullable: false, length: 11, name:'cpf'})
    cpf: string;

    @Column('varchar', {nullable: false, length: 255, name:'name'})
    name: string;

    @Column('varchar', {nullable: false, length: 255, name:'email'})
    email: string;

    @Column('varchar', {nullable: false, length: 25, name: 'gender'})
    gender: string

    @Column('varchar', {nullable: false, length: 25, name: 'phone'})
    phone: string;

    @Column('boolean', {nullable: false, default: true, name:'active'})
    active: boolean;
}