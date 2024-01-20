import { Connection, EntityManager } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { City } from '../../typeorm/entities/city.entity';
import { DEFAULT_CITIES } from '../models/default-cities.model';

export class CitiesSeed implements Seeder {
  private dataList: { name: string; longitude: number; latitude: number }[] = [];

  constructor() {
    this.dataList = DEFAULT_CITIES;
  }

  async run(factory: Factory, connection: Connection): Promise<void> {
    await connection.transaction(async (entityManager: EntityManager) => {
      for (const data of this.dataList) {
        if (data?.name) {
          const cityExists = await entityManager.getRepository(City).findOneBy({
            name: data.name || '',
          });

          if (!cityExists) {
            await entityManager.save([entityManager.create<City>(City, data)]);
          }
        }
      }
    });
  }
}
