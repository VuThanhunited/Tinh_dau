import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
      required: [true, 'Article image is required'],
    },
    date: {
      type: String,
      default: '15/03/2026',
    },
    description: {
      type: String,
      required: [true, 'Article summary description is required'],
    },
    content: {
      type: String,
      required: [true, 'Article full content is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
articleSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

const Article = mongoose.model('Article', articleSchema);
export default Article;
