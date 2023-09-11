import { Injectable } from '@nestjs/common';
import { Technology } from 'src/db/typeorm/entities/technology.entity';
import { DataSource } from 'typeorm';
import { PostTechnologyRequestModel } from './models/post-technology-request.model';
import { PutTechnologyRequestModel } from './models/put-technology-request.model';

@Injectable()
export class TechnologiesService {
  constructor(private dataSource: DataSource) {}

  getAll(): Promise<Technology[]> {
    return this.dataSource.getRepository(Technology).find();
  }

  getById(id: number): Promise<Technology> {
    return this.dataSource.getRepository(Technology).findOneBy({
      id,
    });
  }

  async create(payload: PostTechnologyRequestModel): Promise<Technology> {
    const technology = new Technology();

    technology.name = payload.name;

    return this.dataSource.getRepository(Technology).save(technology);
  }

  async updateById(
    id: number,
    payload: PutTechnologyRequestModel,
  ): Promise<Technology> {
    const technology = await this.dataSource
      .getRepository(Technology)
      .findOneByOrFail({
        id,
      });

    technology.name = payload.name;

    return this.dataSource.getRepository(Technology).save(technology);
  }

  async deleteById(id: number): Promise<any> {
    const technology: Technology = await this.dataSource
      .getRepository(Technology)
      .findOneByOrFail({
        id: id,
      });

    return !!this.dataSource.getRepository(Technology).remove(technology);
  }
}
