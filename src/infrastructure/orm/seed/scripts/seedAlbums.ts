import * as schema from '../../schema';

export async function seedAlbums(db) {
  const albums = [
    { id: 1, userId: 1, name: 'Album 1', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, userId: 1, name: 'Album 2', createdAt: new Date(), updatedAt: new Date() },
    { id: 3, userId: 1, name: 'Album 3', createdAt: new Date(), updatedAt: new Date() },
    { id: 4, userId: 1, name: 'Album 4', createdAt: new Date(), updatedAt: new Date() },
  ];

  try {
    console.log('Seeding albums...');
    await db.delete(schema.albums); // Clear existing albums, if any.
    for (const album of albums) {
      await db.insert(schema.albums).values(album);
    }
    console.log('Albums have been seeded successfully!');
  } catch (error) {
    console.error('Error seeding albums:', error);
    throw error;
  }
}
