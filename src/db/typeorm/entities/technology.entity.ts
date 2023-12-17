import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Job } from './job.entity';
import { User } from './user.entity';

@Entity({ name: 'technologies' })
export class Technology {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Job, (job) => job.technologyStack)
  jobs: Job[];

  @ManyToMany(() => User, (user) => user.technologies)
  users: User[];
}
