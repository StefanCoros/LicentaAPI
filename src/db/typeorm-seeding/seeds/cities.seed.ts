import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { City } from '../../typeorm/entities/city.entity';

export class CitiesSeed implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await Promise.all([
      connection.manager.save([
        connection.manager.create<City>(City, {
          name: 'Iaşi',
          latitude: 47.1562244,
          longitude: 27.5043983,
        }),
        connection.manager.create<City>(City, {
          name: 'Cluj',
          latitude: 46.7834735,
          longitude: 23.5339404,
        }),
        connection.manager.create<City>(City, {
          name: 'Bucureşti',
          latitude: 44.440099,
          longitude: 25.9314803,
        }),
        connection.manager.create<City>(City, {
          name: 'Timişoara',
          latitude: 45.7411546,
          longitude: 21.1340177,
        }),
      ]),
    ]);
  }
}
