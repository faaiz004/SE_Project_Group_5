import Clothes from '../../models/clothes.js';


export async function sampleClothes({ categories, gender, count, upper }) {
  if (typeof categories === 'string') {
    categories = categories.split(',').map(c => c.trim()).filter(Boolean);
  }

  if (!Array.isArray(categories) || !categories.length) {
    console.warn('[sampleClothes] Invalid categories:', categories);
    return [];
  }

  const size = Number(count) || 1;
  const genderFilter = gender || 'unisex';

  const results = [];

  for (const cat of categories) {
    const match = {
      category: cat,
      gender: { $in: [genderFilter, 'unisex'] }
    };
    if (upper !== undefined) match.upper = upper;

    const items = await Clothes.aggregate([
      { $match: match },
      { $sample: { size } }
    ]);

    results.push({ category: cat, items });
  }

  return results;
}
