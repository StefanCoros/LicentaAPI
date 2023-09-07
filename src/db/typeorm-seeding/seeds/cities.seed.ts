import { Connection, EntityManager } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { City } from '../../typeorm/entities/city.entity';

export class CitiesSeed implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await connection.transaction((entityManager: EntityManager) => {
      return entityManager.save([
        entityManager.create<City>(City, {
          name: 'Iaşi',
          latitude: 47.1562244,
          longitude: 27.5043983,
        }),
        entityManager.create<City>(City, {
          name: 'Cluj',
          latitude: 46.7834735,
          longitude: 23.5339404,
        }),
        entityManager.create<City>(City, {
          name: 'Bucureşti',
          latitude: 44.440099,
          longitude: 25.9314803,
        }),
        entityManager.create<City>(City, {
          name: 'Timişoara',
          latitude: 45.7411546,
          longitude: 21.1340177,
        }),
      ]);
    });
  }
}
