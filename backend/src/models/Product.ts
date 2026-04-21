import mongoose, { Document, Schema, Types } from 'mongoose';
import slugify from 'slugify';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;

  sku: string;

  basePrice: number;
  stock: number;

  images: {
    url: string;
    publicId: string;
  }[];

  category: Types.ObjectId;
  subcategory?: Types.ObjectId;

  brand?: string;
  tags: string[];

  isPublished: boolean;
  visibility: 'public' | 'private' | 'archived';

  averageRating: number;
  ratingCount: number;
  reviewCount: number;

  // flash sale info – optional and computed when needed
  flashSale?: {
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    startsAt: Date;
    endsAt: Date;
    isActive: boolean;
  };

  // flag set by analytics/admin
  isBestSeller: boolean;

  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        isThumbnail: { type: Boolean, default: false },
      },
    ],

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },

    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategory',
      index: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    visibility: {
      type: String,
      enum: ['public', 'private', 'archived'],
      default: 'public',
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    // flash sale sub-document
    flashSale: {
      discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
      },

      discountValue: {
        type: Number,
        min: 0,
      },

      startsAt: Date,
      endsAt: Date,

      isActive: {
        type: Boolean,
        default: false,
        index: true,
      },
    },

    // best seller flag
    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ===========================
   Indexes
=========================== */

productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
});

/* ===========================
   Hooks
=========================== */

// Auto-generate slug from name
productSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
