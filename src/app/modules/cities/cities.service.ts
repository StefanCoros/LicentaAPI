import { Injectable } from '@nestjs/common';
import { City } from 'src/db/typeorm/entities/city.entity';
import { DataSource } from 'typeorm';
import { PostCityLinkRequestModel } from './models/post-city-link-request.model';
import { User } from 'src/db/typeorm/entities/user.entity';

@Injectable()
export class CitiesService {
  constructor(private dataSource: DataSource) {}

  getAll(): Promise<City[]> {
    return this.dataSource.getRepository(City).find();
  }

  async getAllForCurrentUser(currentUserEmail: string): Promise<City[]> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: currentUserEmail,
      },
      relations: ['cities'],
    });

    return user?.cities || [];
  }

  async getByIdForCurrentUser(
    id: number,
    currentUserEmail: string,
  ): Promise<City> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: currentUserEmail,
      },
      relations: ['cities'],
    });

    return (
      (user?.cities || []).find(
        (city: City) => city.id === id,
      ) || null
    );
  }

  async createCityLinkForCurrentUser(
    payload: PostCityLinkRequestModel,
    currentUserEmail: string,
  ): Promise<City> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: currentUserEmail,
      },
      relations: ['cities'],
    });

    const city = await this.dataSource
      .getRepository(City)
      .findOneBy({
        id: payload.id,
      });

    if (city) {
      if (user?.cities?.length !== undefined) {
        const userCity = user?.cities?.find(
          (_city: City) => _city.id === city.id,
        );

        if (!userCity) {
          user.cities.push(city);
          await this.dataSource.getRepository(User).save(user);

          return city;
        }
      }
    }

    return null;
  }

  async deleteCityLinkForCurrentUser(
    id: number,
    currentUserEmail: string,
  ): Promise<any> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: currentUserEmail,
      },
      relations: ['cities'],
    });

    if (user?.cities?.length !== undefined) {
      const userCityIndex = user?.cities?.findIndex(
        (_city: City) => _city.id === id,
      );

      if (userCityIndex >= 0) {
        user.cities.splice(userCityIndex, 1);
        return !!(await this.dataSource.getRepository(User).save(user));
      }
    }

    return false;
  }
}
