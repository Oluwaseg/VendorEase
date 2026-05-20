import mongoose, { Document, Schema } from 'mongoose';
import {
  DEFAULT_HERO_TEXT_POSITION,
  HERO_TEXT_POSITIONS,
  type HeroTextPosition,
} from '../constants/hero-position';

export interface ICollectionImage {
  url: string;
  publicId: string;
}

export interface ICollection extends Document {
  name: string;
  slug: string;
  description?: string;
  ctaText?: string;
  position?: HeroTextPosition;
  image?: ICollectionImage;
  productIds: mongoose.Types.ObjectId[];
  isActive: boolean;
  featuredOnHomepage: boolean;
  heroOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    ctaText: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    position: {
      type: String,
      enum: HERO_TEXT_POSITIONS,
      default: DEFAULT_HERO_TEXT_POSITION,
    },
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    productIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    featuredOnHomepage: {
      type: Boolean,
      default: false,
      index: true,
    },
    heroOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Collection = mongoose.model<ICollection>(
  'Collection',
  collectionSchema
);
