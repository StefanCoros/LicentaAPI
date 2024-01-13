import { Injectable } from '@nestjs/common';
import { Technology } from 'src/db/typeorm/entities/technology.entity';
import { DataSource } from 'typeorm';
import { PostTechnologyRequestModel } from './models/post-technology-request.model';
import { User } from 'src/db/typeorm/entities/user.entity';

@Injectable()
export class TechnologiesService {
  constructor(private dataSource: DataSource) {}

  getAll(): Promise<Technology[]> {
    return this.dataSource.getRepository(Technology).find();
  }

  async getAllForCurrentUser(currentUserEmail: string): Promise<Technology[]> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: currentUserEmail || '',
      },
      relations: ['technologies'],
    });

    return user?.technologies || [];
  }

  async getByIdForCurrentUser(
    id: number,
    currentUserEmail: string,
  ): Promise<Technology | null> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: currentUserEmail || '',
      },
      relations: ['technologies'],
    });

    return (
      (user?.technologies || []).find(
        (technology: Technology) => technology.id === id,
      ) || null
    );
  }

  async createTechnologyLinkForCurrentUser(
    payload: PostTechnologyRequestModel,
    currentUserEmail: string,
  ): Promise<Technology | null> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: currentUserEmail || '',
      },
      relations: ['technologies'],
    });

    const technology = await this.dataSource
      .getRepository(Technology)
      .findOneBy({
        id: payload.id || 0,
      });

    if (technology) {
      if (user?.technologies?.length !== undefined) {
        const userTechnology = user?.technologies?.find(
          (_technology: Technology) => _technology.id === technology.id,
        );

        if (!userTechnology) {
          user.technologies.push(technology);
          await this.dataSource.getRepository(User).save(user);

          return technology;
        }
      }
    }

    return null;
  }

  async deleteTechnologyLinkForCurrentUser(
    id: number,
    currentUserEmail: string,
  ): Promise<any> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: currentUserEmail || '',
      },
      relations: ['technologies'],
    });

    if (user?.technologies?.length !== undefined) {
      const userTechnologyIndex = user?.technologies?.findIndex(
        (_technology: Technology) => _technology.id === id,
      );

      if (userTechnologyIndex >= 0) {
        user.technologies.splice(userTechnologyIndex, 1);
        return !!(await this.dataSource.getRepository(User).save(user));
      }
    }

    return false;
  }
}
