import * as schema from '../../schema';

export async function seedUser(db) {
  try {
    console.log('Seeding users...');
    // Specific user data
    const specificUser = {
      id: 1,
      email: 'lixhen2002@gmail.com',
      password: '$2b$10$D7eOvyaVmc8frI2xxmUd6ewJpAVa/2IOkXVJLdavan6TWt.Ts6GRW',
      firstName: 'Dat',
      lastName: 'Bui',
      aliasName: null,
      phone: null,
      address: null,
      description: null,
      socials: [
        { social_link: 'https://facebook.com', social_name: 'facebook' },
        { social_link: 'https://instagram.com', social_name: 'instagram' },
      ],
      role: null,
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzEzNjQ5NDkxLCJleHAiOjE3MTQyNTQyOTF9.kfwrMdvRsNpg-_cFIk1s5jgwFqnAR2XnWUt1WJEJcwc',
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzEzNjQ5NDkxLCJleHAiOjE3MTM3MzU4OTF9.UeuJsj4ep18XNRUJkegZPNfJbXPKFmKep5wt-qDXlx4',
      createdAt: new Date('2024-04-21 04:44:43'),
      updatedAt: new Date('2024-04-20 21:44:52'),
    };

    // Clearing the users table and inserting the new row
    await db.delete(schema.users);
    await db.insert(schema.users).values(specificUser);
    console.log('Database has been seeded with specific user!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    console.log('Seeding completed, connection closed.');
  }
}
