import * as schema from '../../schema';

export async function seedImagesAlbums(db) {
  const imagesAlbums = [
    // Ensure each album has at least one image
    { albumId: 1, imageId: 1, addedAt: new Date() },
    { albumId: 1, imageId: 2, addedAt: new Date() },
    { albumId: 1, imageId: 3, addedAt: new Date() },
    { albumId: 2, imageId: 4, addedAt: new Date() },
    { albumId: 2, imageId: 5, addedAt: new Date() },
    { albumId: 3, imageId: 6, addedAt: new Date() },
    { albumId: 3, imageId: 7, addedAt: new Date() },
    { albumId: 4, imageId: 8, addedAt: new Date() },
    { albumId: 4, imageId: 9, addedAt: new Date() },
  ];

  try {
    console.log('Seeding images_albums relationships...');
    await db.delete(schema.images_album); // Clear existing relationships, if any.
    for (const imageAlbum of imagesAlbums) {
      await db.insert(schema.images_album).values(imageAlbum);
    }
    console.log('Images_albums relationships have been seeded successfully!');
  } catch (error) {
    console.error('Error seeding images_albums:', error);
    throw error;
  }
}
