import * as schema from '../../schema';

export async function seedImages(db) {
  const images = [
    {
      id: 1,
      userId: 1,
      url: 'https://res.cloudinary.com/dw8lzl4fm/image/upload/v1713650493/ay9sp3pyafjegsotv3g6.png',
      type: 'Text To Image',
      prompt:
        'Imagine a serene Japanese garden at dawn. The garden features a small, tranquil pond in the center, surrounded by delicate cherry blossom trees in full bloom. The early morning light casts a soft, warm glow over the scene, highlighting the vibrant pinks of the blossoms and the deep greens of the moss-covered stones. A small, elegantly arched wooden bridge crosses the pond. In the background, a traditional tea house with sliding doors and a thatched roof peeks through the foliage. The air is calm, and the surface of the pond reflects the surrounding beauty in perfect symmetry.',
      aiName: 'comfyUI',
      modelName: 'anythingV3_fp16.ckpt',
      visibility: true,
      createdAt: new Date('2024-04-21 05:01:33'),
      storageId: 'ay9sp3pyafjegsotv3g6',
      generateId: 1,
    },
    {
      id: 2,
      userId: 1,
      url: 'https://res.cloudinary.com/dw8lzl4fm/image/upload/v1713650635/l5qjddnezsepnzxu0hck.png',
      type: 'Text To Image',
      prompt:
        'Picture a quaint seaside village on the Italian coast during sunset. The sky is a blend of fiery oranges and soft pinks, reflecting on the calm sea. Small boats bob gently in the harbor. Narrow cobblestone streets wind through colorful houses with terracotta roofs. In the foreground, a small café with outdoor tables offers a picturesque view, inviting visitors to enjoy the serene evening. The air is filled with the scent of salt and fresh seafood.',
      aiName: 'comfyUI',
      modelName: 'anythingV3_fp16.ckpt',
      additionInfo: null,
      visibility: true,
      createdAt: new Date('2024-04-21 05:03:56'),
      storageId: 'l5qjddnezsepnzxu0hck',
      generateId: 2,
      removeBackgroundUrl: null,
      upscaleUrl: null,
    },
    {
      id: 3,
      userId: 1,
      url: 'https://res.cloudinary.com/dw8lzl4fm/image/upload/v1713650711/ka8uox05go8auyhwzacj.png',
      type: 'Text To Image',
      prompt:
        'Envision a charming town in New England during fall. The scene is set on a crisp, clear autumn day with trees dressed in vibrant reds, oranges, and yellows. A winding river cuts through the town, lined with quaint, historic homes and small local shops decorated with pumpkins and fall wreaths. Residents walk along leaf-strewn paths, some carrying hot beverages. In the distance, gentle hills rise, partially covered by the colorful forest.',
      aiName: 'comfyUI',
      modelName: 'anythingV3_fp16.ckpt',
      additionInfo: null,
      visibility: true,
      createdAt: new Date('2024-04-21 05:05:12'),
      storageId: 'ka8uox05go8auyhwzacj',
      generateId: 3,
      removeBackgroundUrl: null,
      upscaleUrl: null,
    },
    {
      id: 4,
      userId: 1,
      url: 'https://res.cloudinary.com/dw8lzl4fm/image/upload/v1713650918/ags3ocgzud9n8iumyjaj.png',
      type: 'Text To Image',
      prompt:
        'Imagine a peaceful morning at a high-altitude mountain lake. The sun rises slowly behind snow-capped peaks, casting a golden glow across the still, mirror-like water. Wisps of fog linger over the lake, creating a dreamlike atmosphere. Pine trees border the shores, their dark silhouettes contrasting with the brightening sky. A lone canoe rests on the edge of the water, inviting a quiet morning paddle.',
      aiName: 'comfyUI',
      modelName: 'anythingV3_fp16.ckpt',
      additionInfo: null,
      visibility: true,
      createdAt: new Date('2024-04-21 05:08:39'),
      storageId: 'ags3ocgzud9n8iumyjaj',
      generateId: 4,
      removeBackgroundUrl: null,
      upscaleUrl: null,
    },
    {
      id: 5,
      userId: 1,
      url: 'https://res.cloudinary.com/dw8lzl4fm/image/upload/v1713651207/ocf3r07ohba0fze2iz6f.png',
      type: 'Text To Image',
      prompt:
        "Picture a lush Victorian garden in the peak of spring. The garden is filled with a variety of blooming flowers: roses, tulips, and lilacs, each adding a splash of color. Ornate fountains and statues enhance the refined elegance of the setting. A winding gravel path leads to a vintage glass greenhouse filled with exotic plants. In the background, a grand Victorian mansion looms, its architecture adding to the garden's charm.",
      aiName: 'comfyUI',
      modelName: 'anythingV3_fp16.ckpt',
      additionInfo: null,
      visibility: true,
      createdAt: new Date('2024-04-21 05:13:27'),
      storageId: 'ocf3r07ohba0fze2iz6f',
      generateId: 5,
      removeBackgroundUrl: null,
      upscaleUrl: null,
    },
    {
      id: 6,
      userId: 1,
      url: 'https://res.cloudinary.com/dw8lzl4fm/image/upload/v1713651273/o5twj2b3xrmcfsixlah1.png',
      type: 'Text To Image',
      prompt:
        'Envision a small village enveloped in snow during twilight. The houses are decorated with twinkling lights and wreaths, and a gentle snowfall adds a fresh layer of powder to the scene. Children play in the distance, building a snowman under the soft glow of street lamps. The sky is a deep blue, transitioning from day to night, and the air is crisp and filled with the promise of more snow.',
      aiName: 'comfyUI',
      modelName: 'anythingV3_fp16.ckpt',
      additionInfo: null,
      visibility: true,
      createdAt: new Date('2024-04-21 05:14:34'),
      storageId: 'o5twj2b3xrmcfsixlah1',
      generateId: 6,
      removeBackgroundUrl: null,
      upscaleUrl: null,
    },
    {
      id: 7,
      userId: 1,
      url: 'https://res.cloudinary.com/dw8lzl4fm/image/upload/v1713651532/zorykomsbe9qaps6v8eb.png',
      type: 'Text To Image',
      prompt:
        'Imagine a secluded tropical beach at sunset. The sky is a stunning canvas of purples, oranges, and pinks. Palm trees sway gently in the warm breeze, framing the view of the ocean, where the setting sun reflects on the tranquil water. A hammock hangs between two palms, facing the sea, perfect for watching the day end. The sound of gentle waves and distant seabirds completes the peaceful setting.',
      aiName: 'comfyUI',
      modelName: 'anythingV3_fp16.ckpt',
      additionInfo: null,
      visibility: true,
      createdAt: new Date('2024-04-21 05:18:52'),
      storageId: 'zorykomsbe9qaps6v8eb',
      generateId: 7,
      removeBackgroundUrl: null,
      upscaleUrl: null,
    },
    {
      id: 8,
      userId: 1,
      url: 'https://res.cloudinary.com/dw8lzl4fm/image/upload/v1713651587/dht9vshd7eyixygzmwui.png',
      type: 'Text To Image',
      prompt:
        'Imagine an old, majestic library with towering bookshelves filled to the brim with dusty, leather-bound books. The afternoon sunlight streams through stained glass windows, casting colorful patterns on the dark wooden floors. Tall ladders lean against the shelves, allowing access to the highest volumes. A large, globe stands in one corner, and several antique armchairs are scattered throughout, inviting readers to settle in. The air is filled with the scent of old paper and wood polish, evoking a sense of timeless knowledge and tranquility.',
      aiName: 'comfyUI',
      modelName: 'anythingV3_fp16.ckpt',
      additionInfo: null,
      visibility: true,
      createdAt: new Date('2024-04-21 05:19:47'),
      storageId: 'dht9vshd7eyixygzmwui',
      generateId: 8,
      removeBackgroundUrl: null,
      upscaleUrl: null,
    },
    {
      id: 9,
      userId: 1,
      url: 'https://res.cloudinary.com/dw8lzl4fm/image/upload/v1713651862/ywcyndnfvyhqoacdotwg.png',
      type: 'Text To Image',
      prompt:
        'Visualize a frosty morning in a birch forest. The white and black trunks of the birch trees stand stark against a background of soft, morning fog. The ground is covered with a thin layer of fresh snow, and small, ice crystals glitter on the branches and leaves. The air is crisp and invigorating, and the only sounds are the occasional chirping of birds and the soft crunch of snow underfoot. The pale, winter sunlight filters through the mist, creating a serene and almost ethereal landscape.',
      aiName: 'comfyUI',
      modelName: 'anythingV3_fp16.ckpt',
      additionInfo: null,
      visibility: true,
      createdAt: new Date('2024-04-21 05:24:23'),
      storageId: 'ywcyndnfvyhqoacdotwg',
      generateId: 9,
      removeBackgroundUrl: null,
      upscaleUrl: null,
    },
  ];

  try {
    console.log('Seeding images...');
    await db.delete(schema.images); // Clearing the images table if any
    for (const image of images) {
      await db.insert(schema.images).values(image);
    }
    console.log('Images have been seeded successfully!');
  } catch (error) {
    console.error('Error seeding images:', error);
    throw error;
  }
}
