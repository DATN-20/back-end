import { InteractionType } from '@core/common/enum/InteractionType';
import { BaseRepository } from '@core/common/repository/BaseRepository';
import { images_interaction } from '@infrastructure/orm/schema';
import { ImageInteraction } from './entity/ImageInteraction';
import { and, eq } from 'drizzle-orm';

export class ImageInteractionRepository extends BaseRepository {
  async create(data: {
    userId: number;
    imageId: number;
    type: InteractionType;
  }): Promise<ImageInteraction> {
    await this.database.insert(images_interaction).values(data);

    return this.getPrimaryKey({
      userId: data.userId,
      imageId: data.imageId,
      type: data.type,
    });
  }

  async delete(data: { userId: number; imageId: number; type: InteractionType }): Promise<void> {
    await this.database
      .delete(images_interaction)
      .where(
        and(
          eq(images_interaction.userId, data.userId),
          eq(images_interaction.imageId, data.imageId),
          eq(images_interaction.type, data.type),
        ),
      );
  }

  async getPrimaryKey(data: {
    userId: number;
    imageId: number;
    type: InteractionType;
  }): Promise<ImageInteraction> {
    return this.database.query.images_interaction.findFirst({
      where: and(
        eq(images_interaction.userId, data.userId),
        eq(images_interaction.imageId, data.imageId),
        eq(images_interaction.type, data.type),
      ),
    });
  }
}
