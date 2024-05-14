import { GenerationStatus } from '@core/common/enum/GenerationStatus';
import { BaseRepository } from '@core/common/repository/BaseRepository';
import { generations } from '@infrastructure/orm/schema';
import { Generation } from './entity/Generation';
import { eq } from 'drizzle-orm';

export class GenerationRepository extends BaseRepository {
  async create(id: string, status: GenerationStatus, user_id: number): Promise<Generation> {
    await this.database.insert(generations).values({
      id,
      status,
      userId: user_id,
    });

    return this.getById(id);
  }

  async getById(id: string): Promise<Generation> {
    return this.database.query.generations.findFirst({
      where: eq(generations.id, id),
    });
  }

  async updateStatus(
    id: string,
    status: GenerationStatus,
    is_sent_mail: boolean = false,
  ): Promise<Generation> {
    await this.database
      .update(generations)
      .set({
        status,
        isSentMail: is_sent_mail,
      })
      .where(eq(generations.id, id));

    return this.getById(id);
  }

  async updateIsSentMail(id: string, is_sent_mail: boolean): Promise<void> {
    await this.database
      .update(generations)
      .set({
        isSentMail: is_sent_mail,
      })
      .where(eq(generations.id, id));
  }

  async deleteById(id: string): Promise<void> {
    await this.database.delete(generations).where(eq(generations.id, id));
  }

  async getByUserId(user_id: number): Promise<Generation[]> {
    return this.database.query.generations.findMany({
      where: eq(generations.userId, user_id),
    });
  }
}
