import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Technology } from '../../typeorm/entities/technology.entity';

export class TechnologiesSeed implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await Promise.all([
      connection.manager.save([
        connection.manager.create<Technology>(Technology, {
          name: 'JavaScript',
        }),
        connection.manager.create<Technology>(Technology, {
          name: 'Java',
        }),
        connection.manager.create<Technology>(Technology, {
          name: 'MySQL',
        }),
        connection.manager.create<Technology>(Technology, {
          name: 'ReactJS',
        }),
      ]),
    ]);
  }
}
