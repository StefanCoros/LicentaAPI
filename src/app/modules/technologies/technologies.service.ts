import { Injectable } from '@nestjs/common';
import { Technology } from 'src/db/typeorm/entities/technology.entity';
import { DataSource } from 'typeorm';

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

  async create(payload: Partial<Technology>): Promise<Technology> {
    return this.dataSource.getRepository(Technology).save(payload);
  }

  async updateById(
    id: number,
    payload: Partial<Technology>,
  ): Promise<Technology> {
    const technology = await this.dataSource
      .getRepository(Technology)
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
      .getRepository(Technology)
      .save({ ...technology, ...payload });
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
