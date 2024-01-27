import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Technology } from './technology.entity';
import { City } from './city.entity';

@Entity({ name: 'jobs' })
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  address: string;

  @Column()
  salary: string;

  @Column()
  employeesNumber: string;

  @Column()
  companyType: string;

  @Column()
  experienceLevel: string;

  @Column()
  postType: string;

  @Column()
  language: string;

  @Column('text')
  requirements: string;

  @Column('text')
  responsibilities: string;

  @Column('text')
  description: string;

  @Column('text')
  link: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Technology, (technology) => technology.jobs)
  @JoinTable()
  technologyStack: Technology[];

  @ManyToMany(() => City, (city) => city.jobs)
  @JoinTable()
  cities: City[];
}
