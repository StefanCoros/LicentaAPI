import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Technology } from './technology.entity';

@Entity({ name: 'jobs' })
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  company: string;

  @Column()
  @ApiProperty()
  address: string;

  @Column()
  @ApiProperty()
  salary: string;

  @Column()
  @ApiProperty()
  employeesNumber: string;

  @Column()
  @ApiProperty()
  companyType: string;

  @Column()
  @ApiProperty()
  experienceLevel: string;

  @Column()
  @ApiProperty()
  postType: string;

  @Column()
  @ApiProperty()
  language: string;

  @Column('text')
  @ApiProperty()
  requirements: string;

  @Column('text')
  @ApiProperty()
  responsibilities: string;

  @Column('text')
  @ApiProperty()
  description: string;

  @Column('text')
  @ApiProperty()
  link: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Technology, (technology) => technology.job)
  technologyStack: Technology[];
}
