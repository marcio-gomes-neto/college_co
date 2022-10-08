import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IAdmin } from "../../../interfaces/database/entities/IAdmin";

@Entity()
export class Admin extends BaseEntity implements IAdmin{
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    id?: string;

    @Column('varchar', {nullable: false, length: 50, name:'login'})
    login: string;

    @Column('varchar', {nullable: false, length: 512, name:'password'})
    password: string;

    @Column('boolean', {nullable: false, default: true, name:'active'})
    active: boolean;
}