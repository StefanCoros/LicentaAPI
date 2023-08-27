import { Injectable } from '@nestjs/common';
import { City } from 'src/db/typeorm/entities/city.entity';
import { DataSource, DeleteResult } from 'typeorm';

@Injectable()
export class CitiesService {
  constructor(private dataSource: DataSource) {}

  getAll(): Promise<City[]> {
    return this.dataSource.getRepository(City).find();
  }

  getById(id: number): Promise<City> {
    return this.dataSource.getRepository(City).findOneBy({
      id,
    });
  }

  async create(payload: Partial<City>): Promise<City> {
    return this.dataSource.getRepository(City).save(payload);
  }

  async updateById(id: number, payload: Partial<City>): Promise<City> {
    const city = await this.dataSource.getRepository(City).findOneByOrFail({
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

    return this.dataSource.getRepository(City).save({ ...city, ...payload });
  }

  async deleteById(id: number): Promise<any> {
    const city: City = await this.dataSource
      .getRepository(City)
      .findOneByOrFail({
        id: id,
      });

    return !!this.dataSource.getRepository(City).remove(city);
  }
}
