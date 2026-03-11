import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IShippingInfo {
  addressLine: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;

  method: 'standard' | 'express' | 'pickup';
  carrier?: string;
  trackingNumber?: string;

  shippedAt?: Date;
  deliveredAt?: Date;
}

export type PaymentStatus =
  | 'pending'
  | 'payment_pending'
  | 'paid'
  | 'cancelled'
  | 'refunded';

export type ShippingStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;

  items: IOrderItem[];

  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;

  coupon?: mongoose.Types.ObjectId;

  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;

  shipping: IShippingInfo;

  paymentIntentId?: string;

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    shippingFee: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'payment_pending', 'paid', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },

    shippingStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
      index: true,
    },

    shipping: {
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      country: { type: String, required: true },
      postalCode: String,

      method: {
        type: String,
        enum: ['standard', 'express', 'pickup'],
        required: true,
      },

      carrier: String,
      trackingNumber: String,

      shippedAt: Date,
      deliveredAt: Date,
    },

    paymentIntentId: String,
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);
