import { RolesEnum } from '../../../app/@core/models/enums/roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Technology } from './technology.entity';
import { City } from './city.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: RolesEnum })
  role: RolesEnum;

  @Column('text', {nullable: true, default: null})
  jwt: string;

  @Column('text', {nullable: true, default: null})
  resetPasswordToken: string;

  @Column({nullable: true, default: null})
  resetPasswordTokenExpiredAt: Date;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToMany(() => Technology, (technology) => technology.users)
  @JoinTable()
  technologies: Technology[];

  @ManyToMany(() => City, (city) => city.users)
  @JoinTable()
  cities: City[];
}
