import { Injectable } from '@nestjs/common';
import { Job } from 'src/db/typeorm/entities/job.entity';
import { DataSource } from 'typeorm';
import { PostJobRequestModel } from './models/post-job-request.model';
import { PutJobRequestModel } from './models/put-job-request.model';
import { Technology } from 'src/db/typeorm/entities/technology.entity';
import { User } from 'src/db/typeorm/entities/user.entity';
import { GetJobResponseModel } from './models/get-job-response.model';
import { DiacriticsService } from 'src/app/@core/services/diacritics.service';
import { City } from 'src/db/typeorm/entities/city.entity';

@Injectable()
export class JobsService {
  constructor(
    private dataSource: DataSource,
    private diacriticsService: DiacriticsService,
  ) {}

  async getAllForCurrentUser(
    currentUserEmail: string,
  ): Promise<GetJobResponseModel[]> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: currentUserEmail || '',
      },
      relations: [
        'technologies',
        'technologies.jobs',
        'technologies.jobs.technologyStack',
        'technologies.jobs.cities',
        'cities',
      ],
    });

    let jobs = (user?.technologies || []).reduce(
      (jobArray: Job[], technology: Technology) =>
        jobArray.concat(technology.jobs),
      [],
    );

    // remove duplicates
    jobs = jobs.filter(function (item, pos, self) {
      return self.findIndex((_item) => _item.link === item.link) === pos;
    });

    return jobs
      .filter((job) => this.filterByCurrentUserCities(job, user))
      .map((job) => this.extractTechnologyNameFromJob(job))
      .map((job) => this.extractCityCoordinatesFromJob(job))
      .map((job) => {
        job.address = this.diacriticsService.getTextWithoutDiacritics(
          job?.address || '',
        );

        return job;
      })
      .sort(this.sortJobsByAverageSalary);
  }

  getById(id: number): Promise<Job> {
    return this.dataSource
      .getRepository(Job)
      .findOne({
        where: {
          id: id || 0,
        },
        relations: ['technologyStack', 'cities'],
      })
      .then((job: Job) => {
        job = this.extractTechnologyNameFromJob(job);
        job = this.extractCityCoordinatesFromJob(job);

        job.address = this.diacriticsService.getTextWithoutDiacritics(
          job?.address || '',
        );

        return job;
      });
  }

  async create(payload: PostJobRequestModel): Promise<Job> {
    const job = new Job();

    job.title = payload.title;
    job.company = payload.company;
    job.address = payload.address;
    job.salary = payload.salary;
    job.employeesNumber = payload.employeesNumber;
    job.companyType = payload.companyType;
    job.experienceLevel = payload.experienceLevel;
    job.postType = payload.postType;
    job.language = payload.language;
    job.requirements = payload.requirements;
    job.responsibilities = payload.responsibilities;
    job.description = payload.description;
    job.link = payload.link;

    return this.dataSource.getRepository(Job).save(job);
  }

  async updateById(id: number, payload: PutJobRequestModel): Promise<Job> {
    const job = await this.dataSource.getRepository(Job).findOneByOrFail({
      id: id || 0,
    });

    job.title = payload.title;
    job.company = payload.company;
    job.address = payload.address;
    job.salary = payload.salary;
    job.employeesNumber = payload.employeesNumber;
    job.companyType = payload.companyType;
    job.experienceLevel = payload.experienceLevel;
    job.postType = payload.postType;
    job.language = payload.language;
    job.requirements = payload.requirements;
    job.responsibilities = payload.responsibilities;
    job.description = payload.description;
    job.link = payload.link;

    return this.dataSource.getRepository(Job).save(job);
  }

  async deleteById(id: number): Promise<any> {
    const job: Job = await this.dataSource.getRepository(Job).findOneByOrFail({
      id: id || 0,
    });

    return !!(await this.dataSource.getRepository(Job).remove(job));
  }

  private filterByCurrentUserCities(job: Job, user: User | null) {
    if (user) {
      const jobCityIds = job.cities.map((city) => city.id);

      for (const city of user.cities) {
        if (jobCityIds.includes(city.id)) {
          return true;
        }
      }

      return false;
    } else {
      return true;
    }
  }

  private extractTechnologyNameFromJob(job: Job) {
    // @ts-ignore
    job.technologyStack = job.technologyStack.map(
      (technology: Technology) => technology.name,
    );

    return job;
  }

  private extractCityCoordinatesFromJob(job: Job) {
    // @ts-ignore
    job.coordinates = job.cities
      .filter((city: City) => city.name !== 'Remote')
      .reduce(
        (acc: any, value: City) => {
          acc = {
            lat: value.latitude,
            lng: value.longitude,
          };

          return acc;
        },
        {
          lat: null,
          lng: null,
        },
      );

    // @ts-ignore
    delete job.cities;

    return job;
  }

  private sortJobsByAverageSalary(job1: Job, job2: Job) {
    const salary1 = job1.salary;
    const salary1WithoutDots = salary1.replace(/\./g, '');
    const salary1Array = salary1WithoutDots.split('-');
    const salary1AvgRange =
      (parseInt(salary1Array[0]) + parseInt(salary1Array[1])) / 2;

    const salary2 = job2.salary;
    const salary2WithoutDots = salary2.replace(/\./g, '');
    const salary2Array = salary2WithoutDots.split('-');
    const salary2AvgRange =
      (parseInt(salary2Array[0]) + parseInt(salary2Array[1])) / 2;

    return salary2AvgRange > salary1AvgRange
      ? 1
      : salary2AvgRange < salary1AvgRange
      ? -1
      : 0;
  }
}
