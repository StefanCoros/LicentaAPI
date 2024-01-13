import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Technology } from './technology.entity';
import { City } from './city.entity';
import { Role } from './role.entity';

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

  @Column('text', { nullable: true, default: null })
  jwt: string | null;

  @Column('text', { nullable: true, default: null })
  resetPasswordToken: string | null;

  @Column('datetime', { nullable: true, default: null })
  resetPasswordTokenExpiredAt: Date | null;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToOne(
    () => Role,
    (role) => role.users,
    { onDelete: 'RESTRICT' },
  )
  @JoinTable()
  role: Role;

  @ManyToMany(() => Technology, (technology) => technology.users)
  @JoinTable()
  technologies: Technology[];

  @ManyToMany(() => City, (city) => city.users)
  @JoinTable()
  cities: City[];
}
