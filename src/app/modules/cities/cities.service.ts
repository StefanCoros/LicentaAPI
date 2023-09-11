import { Injectable } from '@nestjs/common';
import { City } from 'src/db/typeorm/entities/city.entity';
import { DataSource } from 'typeorm';
import { PostCityRequestModel } from './models/post-city-request.model';
import { PutCityRequestModel } from './models/put-city-request.model';

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

  async create(payload: PostCityRequestModel): Promise<City> {
    const city = new City();

    city.name = payload.name;
    city.latitude = payload.latitude;
    city.longitude = payload.longitude;

    return this.dataSource.getRepository(City).save(city);
  }

  async updateById(id: number, payload: PutCityRequestModel): Promise<City> {
    const city = await this.dataSource.getRepository(City).findOneByOrFail({
      id,
    });

    city.name = payload.name;
    city.latitude = payload.latitude;
    city.longitude = payload.longitude;

    return this.dataSource.getRepository(City).save(city);
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
