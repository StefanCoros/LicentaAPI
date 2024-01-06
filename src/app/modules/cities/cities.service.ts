import { Injectable } from '@nestjs/common';
import { City } from 'src/db/typeorm/entities/city.entity';
import { DataSource } from 'typeorm';
import { PostCityLinkRequestModel } from './models/post-city-link-request.model';
import { User } from 'src/db/typeorm/entities/user.entity';
import { DiacriticsService } from 'src/app/@core/services/diacritics.service';

@Injectable()
export class CitiesService {
  constructor(
    private dataSource: DataSource,
    private diacriticsService: DiacriticsService,
  ) {}

  getAll(): Promise<City[]> {
    return this.dataSource
      .getRepository(City)
      .find()
      .then((cities: City[]) =>
        this.replaceDiacriticsWithAnalogLetters(cities),
      );
  }

  async getAllForCurrentUser(currentUserEmail: string): Promise<City[]> {
    let result: City[] = [];

    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: currentUserEmail,
      },
      relations: ['cities'],
    });

    if (user) {
      result = this.replaceDiacriticsWithAnalogLetters(user?.cities || []);
    }

    return result;
  }

  async getByIdForCurrentUser(
    id: number,
    currentUserEmail: string,
  ): Promise<City | null> {
    let result = null;

    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: currentUserEmail,
      },
      relations: ['cities'],
    });

    if (user) {
      const city = (user?.cities || []).find((city: City) => city.id === id);

      if (city) {
        city.name = this.diacriticsService.getTextWithoutDiacritics(
          city?.name || '',
        );

        result = city;
      }
    }

    return result;
  }

  async createCityLinkForCurrentUser(
    payload: PostCityLinkRequestModel,
    currentUserEmail: string,
  ): Promise<City | null> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: currentUserEmail,
      },
      relations: ['cities'],
    });

    const city = await this.dataSource.getRepository(City).findOneBy({
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

          city.name = this.diacriticsService.getTextWithoutDiacritics(
            city?.name || '',
          );

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

  private replaceDiacriticsWithAnalogLetters(cities: City[]) {
    return cities.map((city: City) => {
      city.name = this.diacriticsService.getTextWithoutDiacritics(city.name);

      return city;
    });
  }
}
