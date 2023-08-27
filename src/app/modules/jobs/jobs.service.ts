import { Injectable } from '@nestjs/common';
import { Job } from 'src/db/typeorm/entities/job.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class JobsService {
  constructor(private dataSource: DataSource) {}

  getAll(): Promise<Job[]> {
    return this.dataSource.getRepository(Job).find();
  }

  getById(id: number): Promise<Job> {
    return this.dataSource.getRepository(Job).findOneBy({
      id,
    });
  }

  async create(payload: Partial<Job>): Promise<Job> {
    return this.dataSource.getRepository(Job).save(payload);
  }

  async updateById(
    id: number,
    payload: Partial<Job>,
  ): Promise<Job> {
    const job = await this.dataSource
      .getRepository(Job)
      .findOneByOrFail({
        id,
      });

    if (payload.id) {
      delete payload.id;
    }

    if (payload.createdAt) {
      delete payload.createdAt;
    }

    if (payload.updatedAt) {
      delete payload.updatedAt;
    }

    return this.dataSource
      .getRepository(Job)
      .save({ ...job, ...payload });
  }

  async deleteById(id: number): Promise<any> {
    const job: Job = await this.dataSource
      .getRepository(Job)
      .findOneByOrFail({
        id: id,
      });

    return !!this.dataSource.getRepository(Job).remove(job);
  }
}
