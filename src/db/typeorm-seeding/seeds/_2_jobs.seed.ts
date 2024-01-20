import { Connection, EntityManager } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Job } from '../../typeorm/entities/job.entity';
import { Technology } from '../../typeorm/entities/technology.entity';

export class JobsSeed implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    const jobs = (await import('../db_-_devjob.ro_-_2.json')) as unknown as any[];

    for (const job of jobs) {
      await connection.transaction(async (entityManager: EntityManager) => {
        if (job?.link) {
          let jobEntity = await entityManager.getRepository(Job).findOne({
            where: {
              link: job.link || '',
            },
            relations: ['technologyStack'],
          });

          if (!jobEntity) {
            jobEntity = new Job();

            jobEntity.title = job?.title || '';
            jobEntity.company = job?.company || '';
            jobEntity.address = job?.address || '';
            jobEntity.salary = job?.salary || '';
            jobEntity.employeesNumber = job?.employeesNumber || '';
            jobEntity.companyType = job?.companyType || '';
            jobEntity.experienceLevel = job?.experienceLevel || '';
            jobEntity.postType = job?.postType || '';
            jobEntity.language = job?.language || '';
            jobEntity.requirements = job?.requirements || '';
            jobEntity.responsibilities = job?.responsibilities || '';
            jobEntity.description = job?.description || '';
            jobEntity.link = job?.link || '';

            await entityManager.save(jobEntity);

            const technologyStack: Technology[] = [];

            for (const technology of job?.technologyStack || []) {
              let technologyEntity: Technology | null = await entityManager
                .getRepository(Technology)
                .findOneBy({
                  name: technology || '',
                });

              if (!technologyEntity) {
                technologyEntity = new Technology();

                technologyEntity.name = technology || '';

                await entityManager
                  .getRepository(Technology)
                  .save(technologyEntity);
              }

              technologyStack.push(technologyEntity);
            }

            jobEntity.technologyStack = technologyStack;

            await entityManager.save(jobEntity);
          } else {
            await this.addTechnologiesFromTechnologyStack(jobEntity, job, entityManager);
          }
        }
      });
    }
  }

  private async addTechnologiesFromTechnologyStack(jobEntity: Job, job: any, entityManager: EntityManager) {
    if (jobEntity?.technologyStack?.length !== undefined) {
      const technologyStack: Technology[] = [
        ...jobEntity.technologyStack,
      ];

      // add technology if it is new
      for (const technology of job?.technologyStack || []) {
        if (
          !technologyStack
            .map((technology: Technology) => technology.name)
            .includes(technology)
        ) {
          let technologyEntity = await entityManager
            .getRepository(Technology)
            .findOneBy({
              name: technology || '',
            });

          if (!technologyEntity) {
            technologyEntity = new Technology();

            technologyEntity.name = technology || '';

            await entityManager
              .getRepository(Technology)
              .save(technologyEntity);
          }

          jobEntity.technologyStack.push(technologyEntity);
        }
      }

      // remove technology if it does not exist anymore
      // for (const technology of technologyStack) {
      //   if (!(job?.technologyStack || []).includes(technology)) {
      //     await entityManager.remove(technology);
      //   }
      // }

      await entityManager.save(jobEntity);
    }
  }
}
