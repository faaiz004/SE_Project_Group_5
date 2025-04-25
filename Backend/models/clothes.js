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
      enum: [
          'Modern',
          'Modern/Old_Money',
          'Smart_Casual/Casual_Everyday',
          'Smart_Casual',
          'Casual_Everyday'
        ],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
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
    gender: {
      type : String,
      enum: ['male', 'female', 'unisex'],
    }    
  },
  {
    timestamps: true,
    collection: 'clothes',
  }
);
const Clothes = mongoose.models.Clothes || mongoose.model('Clothes', clothesSchema);
export default Clothes;