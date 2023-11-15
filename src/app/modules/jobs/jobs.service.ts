import { Injectable } from '@nestjs/common';
import { Job } from 'src/db/typeorm/entities/job.entity';
import { DataSource } from 'typeorm';
import { PostJobRequestModel } from './models/post-job-request.model';
import { PutJobRequestModel } from './models/put-job-request.model';
import { Technology } from 'src/db/typeorm/entities/technology.entity';

@Injectable()
export class JobsService {
  constructor(private dataSource: DataSource) {}

  getAll(): Promise<Job[]> {
    return this.dataSource
      .getRepository(Job)
      .find({
        relations: ['technologyStack'],
      })
      .then((jobs: Job[]) => {
        return jobs.map((job: Job) => {
          // @ts-ignore
          job.technologyStack = job.technologyStack.map(
            (technology: Technology) => technology.name,
          );
          return job;
        });
      });
  }

  getById(id: number): Promise<Job> {
    return this.dataSource
      .getRepository(Job)
      .findOne({
        where: {
          id,
        },
        relations: ['technologyStack'],
      })
      .then((job: Job) => {
        // @ts-ignore
        job.technologyStack = job.technologyStack.map(
          (technology: Technology) => technology.name,
        );
        return job;
      });
  }

  async create(payload: PostJobRequestModel): Promise<Job> {
    const job = new Job();

    job.title = payload.title;
    job.company = payload.company;
    job.address = payload.address;
    job.salary = payload.salary;
    job.employeesNumber = payload.employeesNumber;
    job.companyType = payload.companyType;
    job.experienceLevel = payload.experienceLevel;
    job.postType = payload.postType;
    job.language = payload.language;
    job.requirements = payload.requirements;
    job.responsibilities = payload.responsibilities;
    job.description = payload.description;
    job.link = payload.link;

    return this.dataSource.getRepository(Job).save(job);
  }

  async updateById(id: number, payload: PutJobRequestModel): Promise<Job> {
    const job = await this.dataSource.getRepository(Job).findOneByOrFail({
      id,
    });

    job.title = payload.title;
    job.company = payload.company;
    job.address = payload.address;
    job.salary = payload.salary;
    job.employeesNumber = payload.employeesNumber;
    job.companyType = payload.companyType;
    job.experienceLevel = payload.experienceLevel;
    job.postType = payload.postType;
    job.language = payload.language;
    job.requirements = payload.requirements;
    job.responsibilities = payload.responsibilities;
    job.description = payload.description;
    job.link = payload.link;

    return this.dataSource.getRepository(Job).save(job);
  }

  async deleteById(id: number): Promise<any> {
    const job: Job = await this.dataSource.getRepository(Job).findOneByOrFail({
      id: id,
    });

    return !!this.dataSource.getRepository(Job).remove(job);
  }
}
