import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
      required: [true, 'Product image path is required'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
      default: 0,
    },
    salePrice: {
      type: Number,
      required: [true, 'Sale price is required'],
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      required: true,
      default: 50,
    },
    description: {
      type: String,
      default: 'Tinh dầu thiên nhiên nguyên chất 100% giúp thanh lọc tinh thần, cân bằng cảm xúc và nâng niu sức khỏe.',
    },
    rating: {
      type: Number,
      default: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from name before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove Vietnamese diacritics
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  
  // Calculate discount percentage automatically if valid
  if (this.originalPrice > this.salePrice && this.originalPrice > 0) {
    this.discountPercentage = Math.round(((this.originalPrice - this.salePrice) / this.originalPrice) * 100);
  } else {
    this.discountPercentage = 0;
  }
  
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
