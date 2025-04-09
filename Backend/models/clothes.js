import mongoose from 'mongoose';

const clothesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      default: 'M',
      required: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'Unknown',
      required: true,
      enum: ['Formal', 'Casual', 'Sportswear', 'Vintage', 'Streetwear', 'Loungewear', 'Athleisure', 'Workwear'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    
    upper: {
      type: Boolean,
      default: false,
    },

    lower: {
      type: Boolean,
      default: false,
    },
    
    imageUrl: {
      type: String,
      trim: true,
      default: '',
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    collection: 'clothes', // optional: specify the exact collection name
  }
);

// Create and export the model
const Clothes = mongoose.model('Clothes', clothesSchema);
export default Clothes;
