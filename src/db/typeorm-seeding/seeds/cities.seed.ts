import { Connection, EntityManager } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { City } from '../../typeorm/entities/city.entity';

export class CitiesSeed implements Seeder {
  private dataList = [];

  constructor() {
    this.dataList = [
      {
        name: 'Iaşi',
        latitude: 47.1562244,
        longitude: 27.5043983,
      },
      {
        name: 'Cluj',
        latitude: 46.7834735,
        longitude: 23.5339404,
      },
      {
        name: 'Bucureşti',
        latitude: 44.440099,
        longitude: 25.9314803,
      },
      {
        name: 'Timişoara',
        latitude: 45.7411546,
        longitude: 21.1340177,
      },
    ];
  }

  async run(factory: Factory, connection: Connection): Promise<void> {
    await connection.transaction(async (entityManager: EntityManager) => {
      for (const data of this.dataList) {
        if (data?.name) {
          const roleExists = await entityManager.getRepository(City).findOneBy({
            name: data.name,
          });

          if (!roleExists) {
            await entityManager.save([entityManager.create<City>(City, data)]);
          }
        }
      }
    });
  }
}
