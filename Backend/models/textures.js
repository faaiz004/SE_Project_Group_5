import mongoose from 'mongoose';


// schema for the texture collection
const textureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Texture name (original filename) is required.'],
      trim: true,
      unique: true, 
    },
    category: {
      type: String,
      required: [true, 'Texture category is required.'],
      trim: true,
      enum: [
        'blazer',
        'dress_shirts',
        'jeans',
        'pants',
        'polo_shirts',
        'shorts',
        't_shirts',
        'crop_tops',
        'skirts',
        'misc', 
      ],
    },
    imageUrl: {
      type: String,
      required: [true, 'Texture S3 image URL is required.'],
      trim: true,
      unique: true, 
    },
  },
  {
    timestamps: true,
    collection: 'textures', 
  }
);

textureSchema.index({ category: 1 });


const Texture = mongoose.model('Texture', textureSchema);

export default Texture;